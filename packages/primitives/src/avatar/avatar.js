/** Ported from original DUI: deep-future-app/app/client/components/dui/avatar */
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
import { customEvent } from "@dui/core/event";
export const loadingStatusChangeEvent = customEvent("loading-status-change", { bubbles: true, composed: true });
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    --avatar-size: var(--space-12);
    display: inline-block;
  }

  [part="root"] {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    user-select: none;
    overflow: hidden;
    height: var(--avatar-size);
    width: var(--avatar-size);
  }

  [part="image"] {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }

  [part="fallback"] {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
`;
/**
 * `<dui-avatar>` — Avatar component with image and fallback support.
 *
 * Renders an image when `src` is provided and loads successfully.
 * Falls back to slotted content (e.g. initials) after an optional delay.
 *
 * @slot - Fallback content shown when the image is unavailable.
 * @csspart root - The avatar container.
 * @csspart image - The avatar image element.
 * @csspart fallback - The fallback content container.
 * @cssprop --avatar-size - Avatar dimensions (width and height). Default: var(--space-12).
 * @fires loading-status-change - Fired when the image loading status changes. Detail: { status }
 */
let DuiAvatarPrimitive = (() => {
    let _classSuper = LitElement;
    let _src_decorators;
    let _src_initializers = [];
    let _src_extraInitializers = [];
    let _alt_decorators;
    let _alt_initializers = [];
    let _alt_extraInitializers = [];
    let _fallbackDelay_decorators;
    let _fallbackDelay_initializers = [];
    let _fallbackDelay_extraInitializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _size_extraInitializers = [];
    let _private_imageStatus_decorators;
    let _private_imageStatus_initializers = [];
    let _private_imageStatus_extraInitializers = [];
    let _private_imageStatus_descriptor;
    let _private_delayPassed_decorators;
    let _private_delayPassed_initializers = [];
    let _private_delayPassed_extraInitializers = [];
    let _private_delayPassed_descriptor;
    return class DuiAvatarPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _src_decorators = [property()];
            _alt_decorators = [property()];
            _fallbackDelay_decorators = [property({ type: Number, attribute: "fallback-delay" })];
            _size_decorators = [property({ reflect: true })];
            _private_imageStatus_decorators = [state()];
            _private_delayPassed_decorators = [state()];
            __esDecorate(this, null, _src_decorators, { kind: "accessor", name: "src", static: false, private: false, access: { has: obj => "src" in obj, get: obj => obj.src, set: (obj, value) => { obj.src = value; } }, metadata: _metadata }, _src_initializers, _src_extraInitializers);
            __esDecorate(this, null, _alt_decorators, { kind: "accessor", name: "alt", static: false, private: false, access: { has: obj => "alt" in obj, get: obj => obj.alt, set: (obj, value) => { obj.alt = value; } }, metadata: _metadata }, _alt_initializers, _alt_extraInitializers);
            __esDecorate(this, null, _fallbackDelay_decorators, { kind: "accessor", name: "fallbackDelay", static: false, private: false, access: { has: obj => "fallbackDelay" in obj, get: obj => obj.fallbackDelay, set: (obj, value) => { obj.fallbackDelay = value; } }, metadata: _metadata }, _fallbackDelay_initializers, _fallbackDelay_extraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
            __esDecorate(this, _private_imageStatus_descriptor = { get: __setFunctionName(function () { return this.#imageStatus_accessor_storage; }, "#imageStatus", "get"), set: __setFunctionName(function (value) { this.#imageStatus_accessor_storage = value; }, "#imageStatus", "set") }, _private_imageStatus_decorators, { kind: "accessor", name: "#imageStatus", static: false, private: true, access: { has: obj => #imageStatus in obj, get: obj => obj.#imageStatus, set: (obj, value) => { obj.#imageStatus = value; } }, metadata: _metadata }, _private_imageStatus_initializers, _private_imageStatus_extraInitializers);
            __esDecorate(this, _private_delayPassed_descriptor = { get: __setFunctionName(function () { return this.#delayPassed_accessor_storage; }, "#delayPassed", "get"), set: __setFunctionName(function (value) { this.#delayPassed_accessor_storage = value; }, "#delayPassed", "set") }, _private_delayPassed_decorators, { kind: "accessor", name: "#delayPassed", static: false, private: true, access: { has: obj => #delayPassed in obj, get: obj => obj.#delayPassed, set: (obj, value) => { obj.#delayPassed = value; } }, metadata: _metadata }, _private_delayPassed_initializers, _private_delayPassed_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-avatar";
        static styles = [base, styles];
        #src_accessor_storage = __runInitializers(this, _src_initializers, undefined);
        /** Image URL for the avatar. */
        get src() { return this.#src_accessor_storage; }
        set src(value) { this.#src_accessor_storage = value; }
        #alt_accessor_storage = (__runInitializers(this, _src_extraInitializers), __runInitializers(this, _alt_initializers, ""));
        /** Alt text for the avatar image. */
        get alt() { return this.#alt_accessor_storage; }
        set alt(value) { this.#alt_accessor_storage = value; }
        #fallbackDelay_accessor_storage = (__runInitializers(this, _alt_extraInitializers), __runInitializers(this, _fallbackDelay_initializers, undefined));
        /** Milliseconds to wait before showing fallback content. */
        get fallbackDelay() { return this.#fallbackDelay_accessor_storage; }
        set fallbackDelay(value) { this.#fallbackDelay_accessor_storage = value; }
        #size_accessor_storage = (__runInitializers(this, _fallbackDelay_extraInitializers), __runInitializers(this, _size_initializers, undefined));
        /**
         * Avatar size as a CSS length value (e.g. `"var(--space-8)"`, `"2rem"`).
         * When set, overrides `--avatar-size` on the host.
         */
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #imageStatus_accessor_storage = (__runInitializers(this, _size_extraInitializers), __runInitializers(this, _private_imageStatus_initializers, "idle"));
        get #imageStatus() { return _private_imageStatus_descriptor.get.call(this); }
        set #imageStatus(value) { return _private_imageStatus_descriptor.set.call(this, value); }
        #delayPassed_accessor_storage = (__runInitializers(this, _private_imageStatus_extraInitializers), __runInitializers(this, _private_delayPassed_initializers, false));
        get #delayPassed() { return _private_delayPassed_descriptor.get.call(this); }
        set #delayPassed(value) { return _private_delayPassed_descriptor.set.call(this, value); }
        #probeImage = __runInitializers(this, _private_delayPassed_extraInitializers);
        #delayTimer;
        #setImageStatus(status) {
            this.#imageStatus = status;
            this.dispatchEvent(loadingStatusChangeEvent({ status }));
        }
        #startProbe() {
            this.#cleanupProbe();
            if (!this.src) {
                this.#setImageStatus("error");
                return;
            }
            this.#setImageStatus("loading");
            const img = new Image();
            img.onload = () => this.#setImageStatus("loaded");
            img.onerror = () => this.#setImageStatus("error");
            img.src = this.src;
            this.#probeImage = img;
        }
        #cleanupProbe() {
            if (this.#probeImage) {
                this.#probeImage.onload = null;
                this.#probeImage.onerror = null;
                this.#probeImage = undefined;
            }
        }
        #startDelay() {
            this.#clearDelay();
            if (this.fallbackDelay === undefined || this.fallbackDelay <= 0) {
                this.#delayPassed = true;
                return;
            }
            this.#delayPassed = false;
            this.#delayTimer = setTimeout(() => {
                this.#delayPassed = true;
            }, this.fallbackDelay);
        }
        #clearDelay() {
            if (this.#delayTimer !== undefined) {
                clearTimeout(this.#delayTimer);
                this.#delayTimer = undefined;
            }
        }
        connectedCallback() {
            super.connectedCallback();
            this.#startDelay();
            this.#startProbe();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.#cleanupProbe();
            this.#clearDelay();
        }
        willUpdate(changed) {
            if (changed.has("size")) {
                if (this.size) {
                    this.style.setProperty("--avatar-size", this.size);
                }
                else {
                    this.style.removeProperty("--avatar-size");
                }
            }
            if (changed.has("src")) {
                this.#startProbe();
            }
            if (changed.has("fallbackDelay")) {
                this.#startDelay();
            }
        }
        render() {
            const showImage = this.src && this.#imageStatus === "loaded";
            const showFallback = !showImage && this.#delayPassed;
            return html `
      <span part="root">
        ${showImage
                ? html `
              <img
                part="image"
                src="${this.src}"
                alt="${this.alt}"
              />
            `
                : showFallback
                    ? html `
                <span part="fallback"><slot></slot></span>
              `
                    : nothing}
      </span>
    `;
        }
    };
})();
export { DuiAvatarPrimitive };
