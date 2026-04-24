/** Ported from original DUI: deep-future-app/app/client/components/dui/scroll-area */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { css, html, LitElement, nothing, } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "@dui/core/base";
const styles = css `
  :host {
    display: block;
    position: relative;
    overflow: hidden;
    height: 100%;
    max-height: var(--scroll-area-max-height, none);
  }

  .ScrollArea {
    position: relative;
    width: 100%;
    height: 100%;
    max-height: inherit;
  }

  .Viewport {
    width: 100%;
    height: 100%;
    max-height: inherit;
    overflow: auto;
    overscroll-behavior: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  :host([fade]) .Viewport[data-scrolled] {
    -webkit-mask-image: linear-gradient(to bottom, transparent, black var(--scroll-fade-size, 1.5rem));
    mask-image: linear-gradient(to bottom, transparent, black var(--scroll-fade-size, 1.5rem));
  }

  .Scrollbar {
    position: absolute;
    display: flex;
    justify-content: center;
    opacity: 0;
    pointer-events: none;

    &[data-hovering],
    &[data-scrolling] {
      opacity: 1;
      pointer-events: auto;
    }

    &[data-scrolling] {
      transition-duration: 0ms;
    }
  }

  .Scrollbar::before {
    content: "";
    position: absolute;
  }

  .Scrollbar[data-orientation="vertical"] {
    top: 0;
    right: 0;
    bottom: 0;

    &::before {
      width: 1.25rem;
      height: 100%;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .Scrollbar[data-orientation="horizontal"] {
    left: 0;
    right: 0;
    bottom: 0;

    &::before {
      width: 100%;
      height: 1.25rem;
      bottom: -0.25rem;
    }
  }

  .Thumb[data-orientation="vertical"] {
    width: 100%;
    min-height: 1.25rem;
  }

  .Thumb[data-orientation="horizontal"] {
    height: 100%;
    min-width: 1.25rem;
  }
`;
/**
 * `<dui-scroll-area>` — A scroll container with custom styled scrollbar.
 *
 * Hides the native scrollbar and renders a custom track + thumb with
 * auto-hide behavior. Supports vertical, horizontal, or both orientations.
 *
 * @slot - Default slot for scrollable content.
 *
 * @cssprop [--scroll-area-max-height] - Max-height constraint.
 * @cssprop [--scroll-area-thumb-color] - Scrollbar thumb color.
 * @cssprop [--scroll-fade-size] - Distance over which the top fade goes from transparent to opaque (default: 1.5rem).
 */
let DuiScrollAreaPrimitive = (() => {
    var _a;
    let _classSuper = LitElement;
    let _orientation_decorators;
    let _orientation_initializers = [];
    let _orientation_extraInitializers = [];
    let _fade_decorators;
    let _fade_initializers = [];
    let _fade_extraInitializers = [];
    let _maxHeight_decorators;
    let _maxHeight_initializers = [];
    let _maxHeight_extraInitializers = [];
    let _private_hasOverflowX_decorators;
    let _private_hasOverflowX_initializers = [];
    let _private_hasOverflowX_extraInitializers = [];
    let _private_hasOverflowX_descriptor;
    let _private_hasOverflowY_decorators;
    let _private_hasOverflowY_initializers = [];
    let _private_hasOverflowY_extraInitializers = [];
    let _private_hasOverflowY_descriptor;
    let _private_hovering_decorators;
    let _private_hovering_initializers = [];
    let _private_hovering_extraInitializers = [];
    let _private_hovering_descriptor;
    let _private_scrolling_decorators;
    let _private_scrolling_initializers = [];
    let _private_scrolling_extraInitializers = [];
    let _private_scrolling_descriptor;
    let _private_thumbHeightPercent_decorators;
    let _private_thumbHeightPercent_initializers = [];
    let _private_thumbHeightPercent_extraInitializers = [];
    let _private_thumbHeightPercent_descriptor;
    let _private_thumbWidthPercent_decorators;
    let _private_thumbWidthPercent_initializers = [];
    let _private_thumbWidthPercent_extraInitializers = [];
    let _private_thumbWidthPercent_descriptor;
    let _private_thumbTopPercent_decorators;
    let _private_thumbTopPercent_initializers = [];
    let _private_thumbTopPercent_extraInitializers = [];
    let _private_thumbTopPercent_descriptor;
    let _private_thumbLeftPercent_decorators;
    let _private_thumbLeftPercent_initializers = [];
    let _private_thumbLeftPercent_extraInitializers = [];
    let _private_thumbLeftPercent_descriptor;
    let _private_isAtTop_decorators;
    let _private_isAtTop_initializers = [];
    let _private_isAtTop_extraInitializers = [];
    let _private_isAtTop_descriptor;
    return class DuiScrollAreaPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _orientation_decorators = [property({ reflect: true })];
            _fade_decorators = [property({ type: Boolean, reflect: true })];
            _maxHeight_decorators = [property({ attribute: "max-height" })];
            _private_hasOverflowX_decorators = [state()];
            _private_hasOverflowY_decorators = [state()];
            _private_hovering_decorators = [state()];
            _private_scrolling_decorators = [state()];
            _private_thumbHeightPercent_decorators = [state()];
            _private_thumbWidthPercent_decorators = [state()];
            _private_thumbTopPercent_decorators = [state()];
            _private_thumbLeftPercent_decorators = [state()];
            _private_isAtTop_decorators = [state()];
            __esDecorate(this, null, _orientation_decorators, { kind: "accessor", name: "orientation", static: false, private: false, access: { has: obj => "orientation" in obj, get: obj => obj.orientation, set: (obj, value) => { obj.orientation = value; } }, metadata: _metadata }, _orientation_initializers, _orientation_extraInitializers);
            __esDecorate(this, null, _fade_decorators, { kind: "accessor", name: "fade", static: false, private: false, access: { has: obj => "fade" in obj, get: obj => obj.fade, set: (obj, value) => { obj.fade = value; } }, metadata: _metadata }, _fade_initializers, _fade_extraInitializers);
            __esDecorate(this, null, _maxHeight_decorators, { kind: "accessor", name: "maxHeight", static: false, private: false, access: { has: obj => "maxHeight" in obj, get: obj => obj.maxHeight, set: (obj, value) => { obj.maxHeight = value; } }, metadata: _metadata }, _maxHeight_initializers, _maxHeight_extraInitializers);
            __esDecorate(this, _private_hasOverflowX_descriptor = { get: __setFunctionName(function () { return this.#hasOverflowX_accessor_storage; }, "#hasOverflowX", "get"), set: __setFunctionName(function (value) { this.#hasOverflowX_accessor_storage = value; }, "#hasOverflowX", "set") }, _private_hasOverflowX_decorators, { kind: "accessor", name: "#hasOverflowX", static: false, private: true, access: { has: obj => #hasOverflowX in obj, get: obj => obj.#hasOverflowX, set: (obj, value) => { obj.#hasOverflowX = value; } }, metadata: _metadata }, _private_hasOverflowX_initializers, _private_hasOverflowX_extraInitializers);
            __esDecorate(this, _private_hasOverflowY_descriptor = { get: __setFunctionName(function () { return this.#hasOverflowY_accessor_storage; }, "#hasOverflowY", "get"), set: __setFunctionName(function (value) { this.#hasOverflowY_accessor_storage = value; }, "#hasOverflowY", "set") }, _private_hasOverflowY_decorators, { kind: "accessor", name: "#hasOverflowY", static: false, private: true, access: { has: obj => #hasOverflowY in obj, get: obj => obj.#hasOverflowY, set: (obj, value) => { obj.#hasOverflowY = value; } }, metadata: _metadata }, _private_hasOverflowY_initializers, _private_hasOverflowY_extraInitializers);
            __esDecorate(this, _private_hovering_descriptor = { get: __setFunctionName(function () { return this.#hovering_accessor_storage; }, "#hovering", "get"), set: __setFunctionName(function (value) { this.#hovering_accessor_storage = value; }, "#hovering", "set") }, _private_hovering_decorators, { kind: "accessor", name: "#hovering", static: false, private: true, access: { has: obj => #hovering in obj, get: obj => obj.#hovering, set: (obj, value) => { obj.#hovering = value; } }, metadata: _metadata }, _private_hovering_initializers, _private_hovering_extraInitializers);
            __esDecorate(this, _private_scrolling_descriptor = { get: __setFunctionName(function () { return this.#scrolling_accessor_storage; }, "#scrolling", "get"), set: __setFunctionName(function (value) { this.#scrolling_accessor_storage = value; }, "#scrolling", "set") }, _private_scrolling_decorators, { kind: "accessor", name: "#scrolling", static: false, private: true, access: { has: obj => #scrolling in obj, get: obj => obj.#scrolling, set: (obj, value) => { obj.#scrolling = value; } }, metadata: _metadata }, _private_scrolling_initializers, _private_scrolling_extraInitializers);
            __esDecorate(this, _private_thumbHeightPercent_descriptor = { get: __setFunctionName(function () { return this.#thumbHeightPercent_accessor_storage; }, "#thumbHeightPercent", "get"), set: __setFunctionName(function (value) { this.#thumbHeightPercent_accessor_storage = value; }, "#thumbHeightPercent", "set") }, _private_thumbHeightPercent_decorators, { kind: "accessor", name: "#thumbHeightPercent", static: false, private: true, access: { has: obj => #thumbHeightPercent in obj, get: obj => obj.#thumbHeightPercent, set: (obj, value) => { obj.#thumbHeightPercent = value; } }, metadata: _metadata }, _private_thumbHeightPercent_initializers, _private_thumbHeightPercent_extraInitializers);
            __esDecorate(this, _private_thumbWidthPercent_descriptor = { get: __setFunctionName(function () { return this.#thumbWidthPercent_accessor_storage; }, "#thumbWidthPercent", "get"), set: __setFunctionName(function (value) { this.#thumbWidthPercent_accessor_storage = value; }, "#thumbWidthPercent", "set") }, _private_thumbWidthPercent_decorators, { kind: "accessor", name: "#thumbWidthPercent", static: false, private: true, access: { has: obj => #thumbWidthPercent in obj, get: obj => obj.#thumbWidthPercent, set: (obj, value) => { obj.#thumbWidthPercent = value; } }, metadata: _metadata }, _private_thumbWidthPercent_initializers, _private_thumbWidthPercent_extraInitializers);
            __esDecorate(this, _private_thumbTopPercent_descriptor = { get: __setFunctionName(function () { return this.#thumbTopPercent_accessor_storage; }, "#thumbTopPercent", "get"), set: __setFunctionName(function (value) { this.#thumbTopPercent_accessor_storage = value; }, "#thumbTopPercent", "set") }, _private_thumbTopPercent_decorators, { kind: "accessor", name: "#thumbTopPercent", static: false, private: true, access: { has: obj => #thumbTopPercent in obj, get: obj => obj.#thumbTopPercent, set: (obj, value) => { obj.#thumbTopPercent = value; } }, metadata: _metadata }, _private_thumbTopPercent_initializers, _private_thumbTopPercent_extraInitializers);
            __esDecorate(this, _private_thumbLeftPercent_descriptor = { get: __setFunctionName(function () { return this.#thumbLeftPercent_accessor_storage; }, "#thumbLeftPercent", "get"), set: __setFunctionName(function (value) { this.#thumbLeftPercent_accessor_storage = value; }, "#thumbLeftPercent", "set") }, _private_thumbLeftPercent_decorators, { kind: "accessor", name: "#thumbLeftPercent", static: false, private: true, access: { has: obj => #thumbLeftPercent in obj, get: obj => obj.#thumbLeftPercent, set: (obj, value) => { obj.#thumbLeftPercent = value; } }, metadata: _metadata }, _private_thumbLeftPercent_initializers, _private_thumbLeftPercent_extraInitializers);
            __esDecorate(this, _private_isAtTop_descriptor = { get: __setFunctionName(function () { return this.#isAtTop_accessor_storage; }, "#isAtTop", "get"), set: __setFunctionName(function (value) { this.#isAtTop_accessor_storage = value; }, "#isAtTop", "set") }, _private_isAtTop_decorators, { kind: "accessor", name: "#isAtTop", static: false, private: true, access: { has: obj => #isAtTop in obj, get: obj => obj.#isAtTop, set: (obj, value) => { obj.#isAtTop = value; } }, metadata: _metadata }, _private_isAtTop_initializers, _private_isAtTop_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-scroll-area";
        static styles = [base, styles];
        #orientation_accessor_storage = __runInitializers(this, _orientation_initializers, "vertical");
        /** Scroll direction(s). */
        get orientation() { return this.#orientation_accessor_storage; }
        set orientation(value) { this.#orientation_accessor_storage = value; }
        #fade_accessor_storage = (__runInitializers(this, _orientation_extraInitializers), __runInitializers(this, _fade_initializers, false));
        /** Show a fade overlay at the top when scrolled. */
        get fade() { return this.#fade_accessor_storage; }
        set fade(value) { this.#fade_accessor_storage = value; }
        #maxHeight_accessor_storage = (__runInitializers(this, _fade_extraInitializers), __runInitializers(this, _maxHeight_initializers, undefined));
        /** Optional max-height constraint (CSS value). */
        get maxHeight() { return this.#maxHeight_accessor_storage; }
        set maxHeight(value) { this.#maxHeight_accessor_storage = value; }
        willUpdate(changed) {
            if (changed.has("maxHeight")) {
                if (this.maxHeight)
                    this.style.setProperty("--scroll-area-max-height", this.maxHeight);
                else
                    this.style.removeProperty("--scroll-area-max-height");
            }
        }
        #hasOverflowX_accessor_storage = (__runInitializers(this, _maxHeight_extraInitializers), __runInitializers(this, _private_hasOverflowX_initializers, false));
        // --- Internal state ---
        get #hasOverflowX() { return _private_hasOverflowX_descriptor.get.call(this); }
        set #hasOverflowX(value) { return _private_hasOverflowX_descriptor.set.call(this, value); }
        #hasOverflowY_accessor_storage = (__runInitializers(this, _private_hasOverflowX_extraInitializers), __runInitializers(this, _private_hasOverflowY_initializers, false));
        get #hasOverflowY() { return _private_hasOverflowY_descriptor.get.call(this); }
        set #hasOverflowY(value) { return _private_hasOverflowY_descriptor.set.call(this, value); }
        #hovering_accessor_storage = (__runInitializers(this, _private_hasOverflowY_extraInitializers), __runInitializers(this, _private_hovering_initializers, false));
        get #hovering() { return _private_hovering_descriptor.get.call(this); }
        set #hovering(value) { return _private_hovering_descriptor.set.call(this, value); }
        #scrolling_accessor_storage = (__runInitializers(this, _private_hovering_extraInitializers), __runInitializers(this, _private_scrolling_initializers, false));
        get #scrolling() { return _private_scrolling_descriptor.get.call(this); }
        set #scrolling(value) { return _private_scrolling_descriptor.set.call(this, value); }
        #thumbHeightPercent_accessor_storage = (__runInitializers(this, _private_scrolling_extraInitializers), __runInitializers(this, _private_thumbHeightPercent_initializers, 0));
        get #thumbHeightPercent() { return _private_thumbHeightPercent_descriptor.get.call(this); }
        set #thumbHeightPercent(value) { return _private_thumbHeightPercent_descriptor.set.call(this, value); }
        #thumbWidthPercent_accessor_storage = (__runInitializers(this, _private_thumbHeightPercent_extraInitializers), __runInitializers(this, _private_thumbWidthPercent_initializers, 0));
        get #thumbWidthPercent() { return _private_thumbWidthPercent_descriptor.get.call(this); }
        set #thumbWidthPercent(value) { return _private_thumbWidthPercent_descriptor.set.call(this, value); }
        #thumbTopPercent_accessor_storage = (__runInitializers(this, _private_thumbWidthPercent_extraInitializers), __runInitializers(this, _private_thumbTopPercent_initializers, 0));
        get #thumbTopPercent() { return _private_thumbTopPercent_descriptor.get.call(this); }
        set #thumbTopPercent(value) { return _private_thumbTopPercent_descriptor.set.call(this, value); }
        #thumbLeftPercent_accessor_storage = (__runInitializers(this, _private_thumbTopPercent_extraInitializers), __runInitializers(this, _private_thumbLeftPercent_initializers, 0));
        get #thumbLeftPercent() { return _private_thumbLeftPercent_descriptor.get.call(this); }
        set #thumbLeftPercent(value) { return _private_thumbLeftPercent_descriptor.set.call(this, value); }
        #isAtTop_accessor_storage = (__runInitializers(this, _private_thumbLeftPercent_extraInitializers), __runInitializers(this, _private_isAtTop_initializers, true));
        get #isAtTop() { return _private_isAtTop_descriptor.get.call(this); }
        set #isAtTop(value) { return _private_isAtTop_descriptor.set.call(this, value); }
        static #SCROLL_BOTTOM_TOLERANCE = 1;
        #isAtBottom = (__runInitializers(this, _private_isAtTop_extraInitializers), true);
        #prevScrollTop = 0;
        #scrollEndTimer;
        #resizeObserver;
        #dragging;
        #dragStartPointer = 0;
        #dragStartScroll = 0;
        // --- Lifecycle ---
        connectedCallback() {
            super.connectedCallback();
            this.addEventListener("pointerenter", this.#onPointerEnter);
            this.addEventListener("pointerleave", this.#onPointerLeave);
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.removeEventListener("pointerenter", this.#onPointerEnter);
            this.removeEventListener("pointerleave", this.#onPointerLeave);
            this.#resizeObserver?.disconnect();
            clearTimeout(this.#scrollEndTimer);
        }
        firstUpdated() {
            const viewport = this.#viewport;
            if (!viewport)
                return;
            this.#resizeObserver = new ResizeObserver(() => this.#measure());
            this.#resizeObserver.observe(viewport);
            const slot = viewport.querySelector("slot");
            if (slot) {
                const observe = () => {
                    for (const node of slot.assignedElements()) {
                        this.#resizeObserver.observe(node);
                    }
                };
                slot.addEventListener("slotchange", () => {
                    observe();
                    requestAnimationFrame(() => this.#measure());
                });
                observe();
            }
            this.#measure();
        }
        // --- Public methods ---
        /** Scroll the viewport to the bottom. */
        async scrollToBottom() {
            await this.updateComplete;
            const viewport = this.#viewport;
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
                this.#isAtBottom = true;
                this.#prevScrollTop = viewport.scrollTop;
            }
        }
        /** Whether the viewport is scrolled to the top. */
        get isAtTop() {
            return this.#isAtTop;
        }
        /** Whether the viewport is scrolled to the bottom. */
        get isAtBottom() {
            return this.#isAtBottom;
        }
        // --- Getters ---
        get #viewport() {
            return this.shadowRoot?.querySelector(".Viewport") ?? null;
        }
        get #showVertical() {
            return this.orientation === "vertical" || this.orientation === "both";
        }
        get #showHorizontal() {
            return this.orientation === "horizontal" || this.orientation === "both";
        }
        // --- Measurement ---
        #measure = () => {
            const vp = this.#viewport;
            if (!vp)
                return;
            const hasOverflowY = vp.scrollHeight > vp.clientHeight;
            const hasOverflowX = vp.scrollWidth > vp.clientWidth;
            this.#hasOverflowY = hasOverflowY;
            this.#hasOverflowX = hasOverflowX;
            if (hasOverflowY) {
                this.#thumbHeightPercent = (vp.clientHeight / vp.scrollHeight) * 100;
            }
            if (hasOverflowX) {
                this.#thumbWidthPercent = (vp.clientWidth / vp.scrollWidth) * 100;
            }
            this.#updateThumbPosition(vp);
        };
        #updateThumbPosition = (vp) => {
            if (this.#hasOverflowY) {
                const maxScrollTop = vp.scrollHeight - vp.clientHeight;
                this.#thumbTopPercent =
                    maxScrollTop > 0
                        ? (vp.scrollTop / maxScrollTop) * (100 - this.#thumbHeightPercent)
                        : 0;
            }
            if (this.#hasOverflowX) {
                const maxScrollLeft = vp.scrollWidth - vp.clientWidth;
                this.#thumbLeftPercent =
                    maxScrollLeft > 0
                        ? (vp.scrollLeft / maxScrollLeft) * (100 - this.#thumbWidthPercent)
                        : 0;
            }
        };
        // --- Event handlers ---
        #onScroll = () => {
            const vp = this.#viewport;
            if (!vp)
                return;
            this.#scrolling = true;
            this.#updateThumbPosition(vp);
            const wasAtBottom = this.#isAtBottom;
            const scrolledUp = vp.scrollTop < this.#prevScrollTop;
            this.#isAtTop = vp.scrollTop <= 0;
            this.#isAtBottom =
                vp.scrollTop + vp.clientHeight >=
                    vp.scrollHeight - DuiScrollAreaPrimitive.#SCROLL_BOTTOM_TOLERANCE;
            if (scrolledUp && wasAtBottom && !this.#isAtBottom) {
                this.dispatchEvent(new Event("scrolled-from-bottom", { bubbles: true, composed: true }));
            }
            else if (!wasAtBottom && this.#isAtBottom) {
                this.dispatchEvent(new Event("scrolled-to-bottom", { bubbles: true, composed: true }));
            }
            this.#prevScrollTop = vp.scrollTop;
            clearTimeout(this.#scrollEndTimer);
            this.#scrollEndTimer = setTimeout(() => {
                this.#scrolling = false;
            }, 1000);
        };
        #onPointerEnter = () => {
            this.#hovering = true;
            this.#measure();
        };
        #onPointerLeave = () => {
            this.#hovering = false;
        };
        // --- Track click (jump to position) ---
        #onTrackPointerDown = (orientation, event) => {
            event.preventDefault();
            event.stopPropagation();
            const vp = this.#viewport;
            if (!vp)
                return;
            if (orientation === "vertical") {
                const track = this.shadowRoot?.querySelector('.Scrollbar[data-orientation="vertical"]');
                if (!track)
                    return;
                const rect = track.getBoundingClientRect();
                const fraction = (event.clientY - rect.top) / rect.height;
                vp.scrollTop = fraction * (vp.scrollHeight - vp.clientHeight);
            }
            else {
                const track = this.shadowRoot?.querySelector('.Scrollbar[data-orientation="horizontal"]');
                if (!track)
                    return;
                const rect = track.getBoundingClientRect();
                const fraction = (event.clientX - rect.left) / rect.width;
                vp.scrollLeft = fraction * (vp.scrollWidth - vp.clientWidth);
            }
        };
        // --- Thumb drag ---
        #onThumbPointerDown = (orientation, event) => {
            event.preventDefault();
            event.stopPropagation();
            const vp = this.#viewport;
            if (!vp)
                return;
            this.#dragging = orientation;
            if (orientation === "vertical") {
                this.#dragStartPointer = event.clientY;
                this.#dragStartScroll = vp.scrollTop;
            }
            else {
                this.#dragStartPointer = event.clientX;
                this.#dragStartScroll = vp.scrollLeft;
            }
            document.addEventListener("pointermove", this.#onDragMove);
            document.addEventListener("pointerup", this.#onDragEnd);
        };
        #onDragMove = (event) => {
            const vp = this.#viewport;
            if (!vp || !this.#dragging)
                return;
            if (this.#dragging === "vertical") {
                const track = this.shadowRoot?.querySelector('.Scrollbar[data-orientation="vertical"]');
                if (!track)
                    return;
                const delta = event.clientY - this.#dragStartPointer;
                const trackHeight = track.clientHeight;
                const scrollRange = vp.scrollHeight - vp.clientHeight;
                vp.scrollTop =
                    this.#dragStartScroll + (delta / trackHeight) * scrollRange;
            }
            else {
                const track = this.shadowRoot?.querySelector('.Scrollbar[data-orientation="horizontal"]');
                if (!track)
                    return;
                const delta = event.clientX - this.#dragStartPointer;
                const trackWidth = track.clientWidth;
                const scrollRange = vp.scrollWidth - vp.clientWidth;
                vp.scrollLeft =
                    this.#dragStartScroll + (delta / trackWidth) * scrollRange;
            }
        };
        #onDragEnd = () => {
            this.#dragging = undefined;
            document.removeEventListener("pointermove", this.#onDragMove);
            document.removeEventListener("pointerup", this.#onDragEnd);
        };
        // --- Render ---
        #renderVerticalScrollbar() {
            if (!this.#showVertical || !this.#hasOverflowY)
                return nothing;
            return html `
      <div
        class="Scrollbar"
        part="scrollbar-vertical"
        data-orientation="vertical"
        ?data-hovering="${this.#hovering}"
        ?data-scrolling="${this.#scrolling}"
        @pointerdown="${(e) => this.#onTrackPointerDown("vertical", e)}"
      >
        <div
          class="Thumb"
          part="thumb-vertical"
          data-orientation="vertical"
          style="height: ${this.#thumbHeightPercent}%; top: ${this
                .#thumbTopPercent}%; position: absolute;"
          @pointerdown="${(e) => this.#onThumbPointerDown("vertical", e)}"
        ></div>
      </div>
    `;
        }
        #renderHorizontalScrollbar() {
            if (!this.#showHorizontal || !this.#hasOverflowX)
                return nothing;
            return html `
      <div
        class="Scrollbar"
        part="scrollbar-horizontal"
        data-orientation="horizontal"
        ?data-hovering="${this.#hovering}"
        ?data-scrolling="${this.#scrolling}"
        @pointerdown="${(e) => this.#onTrackPointerDown("horizontal", e)}"
      >
        <div
          class="Thumb"
          part="thumb-horizontal"
          data-orientation="horizontal"
          style="width: ${this.#thumbWidthPercent}%; left: ${this
                .#thumbLeftPercent}%; position: absolute;"
          @pointerdown="${(e) => this.#onThumbPointerDown("horizontal", e)}"
        ></div>
      </div>
    `;
        }
        render() {
            return html `
      <div
        class="ScrollArea"
        part="root"
        ?data-has-overflow-x="${this.#hasOverflowX}"
        ?data-has-overflow-y="${this.#hasOverflowY}"
        ?data-scrolling="${this.#scrolling}"
      >
        <div class="Viewport" part="viewport" ?data-scrolled="${!this.#isAtTop}" @scroll="${this.#onScroll}">
          <slot></slot>
        </div>
        ${this.#renderVerticalScrollbar()} ${this.#renderHorizontalScrollbar()}
      </div>
    `;
        }
    };
})();
export { DuiScrollAreaPrimitive };
