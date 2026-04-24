/**
 * A reactive controller that combines portal teleportation with Floating UI
 * positioning. Creates a positioner element in the document body (or a
 * provided overlay root) so that popups escape `container-type` ancestors.
 */
import { adoptStyles, render, } from "lit";
import { notifyPopupClosing, notifyPopupOpening } from "./popup-coordinator.ts";
import { onTransitionEnd, startFixedAutoUpdate, waitForAnimationFrame, } from "./floating-popup-utils.ts";
export class FloatingPortalController {
    #host;
    #getAnchor;
    #matchWidth;
    #minMatchWidth;
    #placement;
    #offset;
    #styles;
    #onOpen;
    #onClose;
    #onPosition;
    #renderPopup;
    #contentContainer;
    #contentSelector;
    #forwardProperties;
    #getOverlayRoot;
    #alignToInner;
    #alignToInnerReference;
    #movedNodes = [];
    #positioner = null;
    #cleanupAutoUpdate = null;
    #isOpen = false;
    #isAnimating = false;
    #generation = 0;
    get isOpen() {
        return this.#isOpen;
    }
    get isAnimating() {
        return this.#isAnimating;
    }
    get isStarting() {
        return this.#isOpen && this.#isAnimating;
    }
    get isEnding() {
        return !this.#isOpen && this.#isAnimating;
    }
    get positionerElement() {
        return this.#positioner;
    }
    get renderRoot() {
        return this.#positioner?.shadowRoot ?? this.#positioner;
    }
    set placement(value) {
        this.#placement = value;
    }
    set offset(value) {
        this.#offset = value;
    }
    constructor(host, options) {
        this.#host = host;
        this.#getAnchor = options.getAnchor;
        this.#matchWidth = options.matchWidth ?? true;
        this.#minMatchWidth = options.minMatchWidth ?? false;
        this.#placement = options.placement ?? "bottom-start";
        this.#offset = options.offset ?? 4;
        this.#styles = options.styles;
        this.#onOpen = options.onOpen;
        this.#onClose = options.onClose;
        this.#onPosition = options.onPosition;
        this.#renderPopup = options.renderPopup;
        this.#contentContainer = options.contentContainer;
        this.#contentSelector = options.contentSelector;
        this.#forwardProperties = options.forwardProperties ?? [];
        this.#getOverlayRoot = options.getOverlayRoot ?? (() => document.body);
        this.#alignToInner = options.alignToInner;
        this.#alignToInnerReference = options.alignToInnerReference;
        host.addController(this);
    }
    hostConnected() {
        document.addEventListener("click", this.#onDocumentClick);
    }
    hostDisconnected() {
        document.removeEventListener("click", this.#onDocumentClick);
        this.#teardown();
        notifyPopupClosing(this.#host);
    }
    hostUpdated() {
        if (this.#isOpen) {
            this.#host.setAttribute("open", "");
        }
        else {
            this.#host.removeAttribute("open");
        }
        if (this.#renderPopup && (this.#isOpen || this.isEnding)) {
            const root = this.renderRoot;
            if (root)
                render(this.#renderPopup(this), root);
        }
        if (this.#contentContainer &&
            this.#isOpen &&
            this.#movedNodes.length === 0) {
            this.#moveContentToPortal();
        }
    }
    open() {
        if (this.#isOpen)
            return;
        this.#generation++;
        const gen = this.#generation;
        notifyPopupOpening(this.#host, () => this.close());
        this.#isOpen = true;
        this.#isAnimating = true;
        this.#createPositioner();
        this.#startAutoUpdate();
        this.#onOpen?.();
        this.#host.requestUpdate();
        waitForAnimationFrame().then(() => {
            if (gen !== this.#generation)
                return;
            this.#isAnimating = false;
            this.#host.requestUpdate();
        });
    }
    close() {
        if (!this.#isOpen)
            return;
        this.#generation++;
        this.#isAnimating = true;
        this.#host.requestUpdate();
        const popup = this.renderRoot?.querySelector(".Popup");
        if (!popup) {
            this.#finishClose();
            return;
        }
        onTransitionEnd(popup, () => this.#finishClose());
    }
    // ---- Private ----
    #finishClose() {
        if (!this.#isOpen)
            return;
        this.#isOpen = false;
        this.#isAnimating = false;
        this.#stopAutoUpdate();
        notifyPopupClosing(this.#host);
        this.#onClose?.();
        this.#hidePositioner();
        this.#host.requestUpdate();
    }
    #onDocumentClick = (event) => {
        if (!this.#isOpen)
            return;
        const path = event.composedPath();
        if (!path.includes(this.#host) && !this.#positionerInPath(path)) {
            this.close();
        }
    };
    #positionerInPath(path) {
        if (!this.#positioner)
            return false;
        return path.includes(this.#positioner);
    }
    #createPositioner() {
        if (this.#positioner) {
            this.#positioner.style.display = "";
            this.#applyForwardedProperties(this.#positioner);
            return;
        }
        const overlayRoot = this.#getOverlayRoot();
        const positioner = document.createElement("div");
        positioner.style.position = "fixed";
        positioner.style.zIndex = "1000";
        positioner.style.pointerEvents = "none";
        positioner.setAttribute("data-floating-portal", "");
        positioner.setAttribute("data-dui-portal-for", this.#host.tagName.toLowerCase());
        // Read styles directly from the host component's class hierarchy.
        // The host already has the complete styles (base + aesthetic) composed via inheritance.
        const hostClass = this.#host.constructor;
        const flattenStyles = (s) => {
            if (!s)
                return [];
            if (Array.isArray(s))
                return s.flatMap(flattenStyles);
            return [s];
        };
        const allStyles = [
            ...flattenStyles(hostClass.styles),
            ...(this.#styles ?? []),
        ];
        if (allStyles.length > 0) {
            const shadow = positioner.attachShadow({ mode: "open" });
            adoptStyles(shadow, allStyles);
        }
        this.#applyForwardedProperties(positioner);
        overlayRoot.appendChild(positioner);
        this.#positioner = positioner;
    }
    /** Read forwarded CSS custom properties from the host and set them on the positioner. */
    #applyForwardedProperties(positioner) {
        if (this.#forwardProperties.length === 0)
            return;
        const computed = getComputedStyle(this.#host);
        for (const prop of this.#forwardProperties) {
            const value = computed.getPropertyValue(prop).trim();
            if (value) {
                positioner.style.setProperty(prop, value);
            }
        }
    }
    #hidePositioner() {
        if (this.#positioner) {
            this.#positioner.style.display = "none";
        }
    }
    #removePositioner() {
        this.#positioner?.remove();
        this.#positioner = null;
    }
    #startAutoUpdate() {
        if (this.#cleanupAutoUpdate)
            return;
        const anchor = this.#getAnchor();
        const positioner = this.#positioner;
        if (!anchor || !positioner)
            return;
        this.#cleanupAutoUpdate = startFixedAutoUpdate(anchor, positioner, {
            placement: this.#placement,
            offsetPx: this.#offset,
            matchWidth: this.#matchWidth,
            minMatchWidth: this.#minMatchWidth,
            onPosition: this.#onPosition,
            alignToInner: this.#alignToInner
                ? {
                    getElement: this.#alignToInner,
                    getReferenceInner: this.#alignToInnerReference,
                }
                : undefined,
        });
    }
    #stopAutoUpdate() {
        this.#cleanupAutoUpdate?.();
        this.#cleanupAutoUpdate = null;
    }
    #moveContentToPortal() {
        const container = this.renderRoot?.querySelector(this.#contentContainer);
        if (!container)
            return;
        const nodes = this.#contentSelector
            ? Array.from(this.#host.querySelectorAll(`:scope > ${this.#contentSelector}`))
            : Array.from(this.#host.childNodes);
        for (const node of nodes) {
            container.appendChild(node);
            this.#movedNodes.push(node);
        }
    }
    #moveContentBack() {
        for (const node of this.#movedNodes) {
            this.#host.appendChild(node);
        }
        this.#movedNodes = [];
    }
    #teardown() {
        this.#stopAutoUpdate();
        this.#moveContentBack();
        this.#removePositioner();
    }
}
