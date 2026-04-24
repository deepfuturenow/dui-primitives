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
import { css, html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
/** Fired when a button with `href` is clicked via normal (non-modifier) click. */
export const navigateEvent = customEvent("dui-navigate", { bubbles: true, composed: true });
/** Structural styles only — layout and behavioral CSS. */
const styles = css `
  :host {
    display: inline-block;
  }

  button, a {
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    text-decoration: none;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
`;
/**
 * `<dui-button>` — A button component.
 *
 * Renders as a native `<button>` by default. When `href` is set, renders as a
 * native `<a>` tag instead. Normal clicks fire a `dui-navigate` event that
 * consumers handle for SPA routing.
 *
 * @slot - Button label / content.
 * @csspart root - The button or anchor element.
 * @fires dui-navigate - Fired on normal link clicks. Detail: { href: string }
 */
let DuiButtonPrimitive = (() => {
    let _classSuper = LitElement;
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _focusableWhenDisabled_decorators;
    let _focusableWhenDisabled_initializers = [];
    let _focusableWhenDisabled_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _href_decorators;
    let _href_initializers = [];
    let _href_extraInitializers = [];
    return class DuiButtonPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _focusableWhenDisabled_decorators = [property({ type: Boolean, attribute: "focusable-when-disabled" })];
            _type_decorators = [property()];
            _href_decorators = [property()];
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _focusableWhenDisabled_decorators, { kind: "accessor", name: "focusableWhenDisabled", static: false, private: false, access: { has: obj => "focusableWhenDisabled" in obj, get: obj => obj.focusableWhenDisabled, set: (obj, value) => { obj.focusableWhenDisabled = value; } }, metadata: _metadata }, _focusableWhenDisabled_initializers, _focusableWhenDisabled_extraInitializers);
            __esDecorate(this, null, _type_decorators, { kind: "accessor", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(this, null, _href_decorators, { kind: "accessor", name: "href", static: false, private: false, access: { has: obj => "href" in obj, get: obj => obj.href, set: (obj, value) => { obj.href = value; } }, metadata: _metadata }, _href_initializers, _href_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-button";
        static shadowRootOptions = {
            ...LitElement.shadowRootOptions,
            delegatesFocus: true,
        };
        static styles = [base, styles];
        #disabled_accessor_storage = __runInitializers(this, _disabled_initializers, false);
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #focusableWhenDisabled_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _focusableWhenDisabled_initializers, false));
        get focusableWhenDisabled() { return this.#focusableWhenDisabled_accessor_storage; }
        set focusableWhenDisabled(value) { this.#focusableWhenDisabled_accessor_storage = value; }
        #type_accessor_storage = (__runInitializers(this, _focusableWhenDisabled_extraInitializers), __runInitializers(this, _type_initializers, "button"));
        get type() { return this.#type_accessor_storage; }
        set type(value) { this.#type_accessor_storage = value; }
        #href_accessor_storage = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _href_initializers, undefined));
        get href() { return this.#href_accessor_storage; }
        set href(value) { this.#href_accessor_storage = value; }
        #handleClick = (__runInitializers(this, _href_extraInitializers), (e) => {
            if (this.disabled) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
        #onLinkClick = (event) => {
            if (this.disabled) {
                event.preventDefault();
                return;
            }
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }
            if (this.href) {
                event.preventDefault();
                this.dispatchEvent(navigateEvent({ href: this.href }));
            }
        };
        #renderButton() {
            const ariaDisabled = this.disabled && this.focusableWhenDisabled;
            return html `
      <button
        part="root"
        type="${this.type}"
        ?disabled="${this.disabled && !this.focusableWhenDisabled}"
        aria-disabled="${ariaDisabled || nothing}"
        @click="${this.#handleClick}"
      >
        <slot></slot>
      </button>
    `;
        }
        #renderLink() {
            return html `
      <a
        part="root"
        href="${this.href ?? nothing}"
        aria-disabled="${this.disabled || nothing}"
        @click="${this.#onLinkClick}"
      >
        <slot></slot>
      </a>
    `;
        }
        render() {
            return this.href !== undefined ? this.#renderLink() : this.#renderButton();
        }
    };
})();
export { DuiButtonPrimitive };
