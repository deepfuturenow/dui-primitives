/**
 * A reactive controller that combines portal teleportation with Floating UI
 * positioning. Creates a positioner element in the document body (or a
 * provided overlay root) so that popups escape `container-type` ancestors.
 */

import {
  adoptStyles,
  render,
  type CSSResultOrNative,
  type ReactiveController,
  type ReactiveControllerHost,
  type TemplateResult,
} from "lit";
import type { LitElement } from "lit";
import type { Placement } from "@floating-ui/dom";
import { notifyPopupClosing, notifyPopupOpening } from "./popup-coordinator.ts";
import {
  type AlignInnerOptions,
  onTransitionEnd,
  startFixedAutoUpdate,
  waitForAnimationFrame,
} from "./floating-popup-utils.ts";

type PortalHost = ReactiveControllerHost & HTMLElement;

export type FloatingPortalControllerOptions = {
  /** Returns the anchor element used for positioning. */
  getAnchor: () => HTMLElement | null | undefined;
  /** Whether the popup width should match the anchor width. Default: true. */
  matchWidth?: boolean;
  /** Set popup min-width to anchor width instead of fixing width. Default: false. */
  minMatchWidth?: boolean;
  /** Floating UI placement. Default: "bottom-start". */
  placement?: Placement;
  /** Offset in px between anchor and popup. Default: 4. */
  offset?: number;
  /** Styles to apply inside the positioner's shadow root via `adoptStyles()`. */
  styles?: CSSResultOrNative[];
  /**
   * CSS selector for a container element inside the rendered popup. When set,
   * the controller automatically moves the host's `childNodes` into this
   * container when the popup opens, and moves them back on teardown.
   */
  contentContainer?: string;
  /**
   * CSS selector to filter which host children get moved. When set, only
   * matching direct children (via `:scope > selector`) are moved. When unset,
   * all `childNodes` are moved. Only used when `contentContainer` is set.
   */
  contentSelector?: string;
  /** Called after the popup opens (animation started). */
  onOpen?: () => void;
  /** Called after the popup finishes closing (animation done). */
  onClose?: () => void;
  /**
   * Called after each Floating UI reposition so the consumer can react
   * to placement changes (e.g. update data-side attributes).
   */
  onPosition?: (result: { x: number; y: number; placement: Placement }) => void;
  /**
   * Optional render callback invoked after each host update while the popup
   * is open (or closing).
   */
  renderPopup?: (portal: FloatingPortalController) => TemplateResult;
  /**
   * CSS custom property names to forward from the host's computed style
   * to the portal positioner. Portal elements live under `<body>` and
   * don't inherit properties from the original DOM tree, so any theme
   * tokens that consumers can override must be listed here.
   */
  forwardProperties?: string[];
  /**
   * Returns the overlay root element where the positioner is appended.
   * Defaults to `document.body`.
   */
  getOverlayRoot?: () => HTMLElement;
  /**
   * When set, positions the popup so the returned inner element aligns
   * with the anchor (macOS-style select). Falls back to normal
   * positioning when the callback returns null.
   */
  alignToInner?: () => HTMLElement | null;
  /**
   * Returns a sub-element inside the anchor to align against (e.g. the
   * text span). When set, inner alignment targets this element's vertical
   * center instead of the full anchor rect.
   */
  alignToInnerReference?: () => HTMLElement | null;
};

export class FloatingPortalController implements ReactiveController {
  #host: PortalHost;
  #getAnchor: () => HTMLElement | null | undefined;
  #matchWidth: boolean;
  #minMatchWidth: boolean;
  #placement: Placement;
  #offset: number;
  #styles?: CSSResultOrNative[];
  #onOpen?: () => void;
  #onClose?: () => void;
  #onPosition?: (result: {
    x: number;
    y: number;
    placement: Placement;
  }) => void;
  #renderPopup?: (portal: FloatingPortalController) => TemplateResult;
  #contentContainer?: string;
  #contentSelector?: string;
  #forwardProperties: string[];
  #getOverlayRoot: () => HTMLElement;
  #alignToInner?: () => HTMLElement | null;
  #alignToInnerReference?: () => HTMLElement | null;
  #movedNodes: Node[] = [];

  #positioner: HTMLDivElement | null = null;
  #cleanupAutoUpdate: (() => void) | null = null;

  #isOpen = false;
  #isAnimating = false;
  #generation = 0;

  get isOpen(): boolean {
    return this.#isOpen;
  }

  get isAnimating(): boolean {
    return this.#isAnimating;
  }

  get isStarting(): boolean {
    return this.#isOpen && this.#isAnimating;
  }

  get isEnding(): boolean {
    return !this.#isOpen && this.#isAnimating;
  }

  get positionerElement(): HTMLDivElement | null {
    return this.#positioner;
  }

  get renderRoot(): ShadowRoot | HTMLDivElement | null {
    return this.#positioner?.shadowRoot ?? this.#positioner;
  }

  set placement(value: Placement) {
    this.#placement = value;
  }

  set offset(value: number) {
    this.#offset = value;
  }

  constructor(host: PortalHost, options: FloatingPortalControllerOptions) {
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

  hostConnected(): void {
    document.addEventListener("click", this.#onDocumentClick);
  }

  hostDisconnected(): void {
    document.removeEventListener("click", this.#onDocumentClick);
    this.#teardown();
    notifyPopupClosing(this.#host);
  }

  hostUpdated(): void {
    if (this.#isOpen) {
      this.#host.setAttribute("open", "");
    } else {
      this.#host.removeAttribute("open");
    }

    if (this.#renderPopup && (this.#isOpen || this.isEnding)) {
      const root = this.renderRoot;
      if (root) render(this.#renderPopup(this), root);
    }

    if (
      this.#contentContainer &&
      this.#isOpen &&
      this.#movedNodes.length === 0
    ) {
      this.#moveContentToPortal();
    }
  }

  open(): void {
    if (this.#isOpen) return;

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
      if (gen !== this.#generation) return;
      this.#isAnimating = false;
      this.#host.requestUpdate();
    });
  }

  close(): void {
    if (!this.#isOpen) return;

    this.#generation++;

    this.#isAnimating = true;
    this.#host.requestUpdate();

    const popup = this.renderRoot?.querySelector<HTMLElement>(".Popup");
    if (!popup) {
      this.#finishClose();
      return;
    }

    onTransitionEnd(popup, () => this.#finishClose());
  }

  // ---- Private ----

  #finishClose(): void {
    if (!this.#isOpen) return;
    this.#isOpen = false;
    this.#isAnimating = false;
    this.#stopAutoUpdate();
    notifyPopupClosing(this.#host);
    this.#onClose?.();
    this.#hidePositioner();
    this.#host.requestUpdate();
  }

  #onDocumentClick = (event: MouseEvent): void => {
    if (!this.#isOpen) return;
    const path = event.composedPath();
    if (!path.includes(this.#host) && !this.#positionerInPath(path)) {
      this.close();
    }
  };

  #positionerInPath(path: EventTarget[]): boolean {
    if (!this.#positioner) return false;
    return path.includes(this.#positioner);
  }

  #createPositioner(): void {
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
    const hostClass = this.#host.constructor as typeof LitElement;
    const flattenStyles = (s: unknown): CSSResultOrNative[] => {
      if (!s) return [];
      if (Array.isArray(s)) return s.flatMap(flattenStyles);
      return [s as CSSResultOrNative];
    };
    const allStyles: CSSResultOrNative[] = [
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
  #applyForwardedProperties(positioner: HTMLElement): void {
    if (this.#forwardProperties.length === 0) return;
    const computed = getComputedStyle(this.#host);
    for (const prop of this.#forwardProperties) {
      const value = computed.getPropertyValue(prop).trim();
      if (value) {
        positioner.style.setProperty(prop, value);
      }
    }
  }

  #hidePositioner(): void {
    if (this.#positioner) {
      this.#positioner.style.display = "none";
    }
  }

  #removePositioner(): void {
    this.#positioner?.remove();
    this.#positioner = null;
  }

  #startAutoUpdate(): void {
    if (this.#cleanupAutoUpdate) return;

    const anchor = this.#getAnchor();
    const positioner = this.#positioner;
    if (!anchor || !positioner) return;

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

  #stopAutoUpdate(): void {
    this.#cleanupAutoUpdate?.();
    this.#cleanupAutoUpdate = null;
  }

  #moveContentToPortal(): void {
    const container = this.renderRoot?.querySelector(this.#contentContainer!);
    if (!container) return;

    const nodes: Node[] = this.#contentSelector
      ? Array.from(
          this.#host.querySelectorAll(`:scope > ${this.#contentSelector}`),
        )
      : Array.from(this.#host.childNodes);
    for (const node of nodes) {
      container.appendChild(node);
      this.#movedNodes.push(node);
    }
  }

  #moveContentBack(): void {
    for (const node of this.#movedNodes) {
      this.#host.appendChild(node);
    }
    this.#movedNodes = [];
  }

  #teardown(): void {
    this.#stopAutoUpdate();
    this.#moveContentBack();
    this.#removePositioner();
  }
}
