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
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { toggleGroupContext, } from "./toggle-group-context.ts";
export const pressedChangeEvent = customEvent("pressed-change", { bubbles: true, composed: true });
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: inline-block;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--toggle-gap, 0);
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
  }

  [part="root"]:disabled {
    cursor: not-allowed;
  }
`;
/**
 * `<dui-toggle>` — A two-state toggle button. Works standalone or inside a toggle group.
 *
 * @slot - Toggle content (text and/or icons).
 * @slot icon - Optional leading icon.
 * @csspart root - The button element.
 * @fires pressed-change - Fired when toggled. Detail: { pressed: boolean }
 */
let DuiTogglePrimitive = (() => {
    let _classSuper = LitElement;
    let _pressed_decorators;
    let _pressed_initializers = [];
    let _pressed_extraInitializers = [];
    let _defaultPressed_decorators;
    let _defaultPressed_initializers = [];
    let _defaultPressed_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _private_internalPressed_decorators;
    let _private_internalPressed_initializers = [];
    let _private_internalPressed_extraInitializers = [];
    let _private_internalPressed_descriptor;
    let __groupCtx_decorators;
    let __groupCtx_initializers = [];
    let __groupCtx_extraInitializers = [];
    return class DuiTogglePrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _pressed_decorators = [property({ type: Boolean })];
            _defaultPressed_decorators = [property({ type: Boolean, attribute: "default-pressed" })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _value_decorators = [property()];
            _private_internalPressed_decorators = [state()];
            __groupCtx_decorators = [consume({ context: toggleGroupContext, subscribe: true }), state()];
            __esDecorate(this, null, _pressed_decorators, { kind: "accessor", name: "pressed", static: false, private: false, access: { has: obj => "pressed" in obj, get: obj => obj.pressed, set: (obj, value) => { obj.pressed = value; } }, metadata: _metadata }, _pressed_initializers, _pressed_extraInitializers);
            __esDecorate(this, null, _defaultPressed_decorators, { kind: "accessor", name: "defaultPressed", static: false, private: false, access: { has: obj => "defaultPressed" in obj, get: obj => obj.defaultPressed, set: (obj, value) => { obj.defaultPressed = value; } }, metadata: _metadata }, _defaultPressed_initializers, _defaultPressed_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, _private_internalPressed_descriptor = { get: __setFunctionName(function () { return this.#internalPressed_accessor_storage; }, "#internalPressed", "get"), set: __setFunctionName(function (value) { this.#internalPressed_accessor_storage = value; }, "#internalPressed", "set") }, _private_internalPressed_decorators, { kind: "accessor", name: "#internalPressed", static: false, private: true, access: { has: obj => #internalPressed in obj, get: obj => obj.#internalPressed, set: (obj, value) => { obj.#internalPressed = value; } }, metadata: _metadata }, _private_internalPressed_initializers, _private_internalPressed_extraInitializers);
            __esDecorate(this, null, __groupCtx_decorators, { kind: "accessor", name: "_groupCtx", static: false, private: false, access: { has: obj => "_groupCtx" in obj, get: obj => obj._groupCtx, set: (obj, value) => { obj._groupCtx = value; } }, metadata: _metadata }, __groupCtx_initializers, __groupCtx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-toggle";
        static shadowRootOptions = {
            ...LitElement.shadowRootOptions,
            delegatesFocus: true,
        };
        static styles = [base, styles];
        #pressed_accessor_storage = __runInitializers(this, _pressed_initializers, undefined);
        get pressed() { return this.#pressed_accessor_storage; }
        set pressed(value) { this.#pressed_accessor_storage = value; }
        #defaultPressed_accessor_storage = (__runInitializers(this, _pressed_extraInitializers), __runInitializers(this, _defaultPressed_initializers, false));
        get defaultPressed() { return this.#defaultPressed_accessor_storage; }
        set defaultPressed(value) { this.#defaultPressed_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _defaultPressed_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #value_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _value_initializers, undefined));
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #internalPressed_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _private_internalPressed_initializers, false));
        get #internalPressed() { return _private_internalPressed_descriptor.get.call(this); }
        set #internalPressed(value) { return _private_internalPressed_descriptor.set.call(this, value); }
        #_groupCtx_accessor_storage = (__runInitializers(this, _private_internalPressed_extraInitializers), __runInitializers(this, __groupCtx_initializers, void 0));
        get _groupCtx() { return this.#_groupCtx_accessor_storage; }
        set _groupCtx(value) { this.#_groupCtx_accessor_storage = value; }
        get #isPressed() {
            if (this._groupCtx && this.value !== undefined) {
                return this._groupCtx.value.includes(this.value);
            }
            return this.pressed ?? this.#internalPressed;
        }
        get #isDisabled() {
            return this.disabled || (this._groupCtx?.disabled ?? false);
        }
        connectedCallback() {
            super.connectedCallback();
            if (this.pressed === undefined && this.defaultPressed) {
                this.#internalPressed = true;
            }
        }
        #handleClick = (__runInitializers(this, __groupCtx_extraInitializers), () => {
            if (this.#isDisabled)
                return;
            if (this._groupCtx && this.value !== undefined) {
                this._groupCtx.toggle(this.value);
                return;
            }
            const newPressed = !this.#isPressed;
            if (this.pressed === undefined) {
                this.#internalPressed = newPressed;
            }
            this.dispatchEvent(pressedChangeEvent({ pressed: newPressed }));
        });
        render() {
            const isPressed = this.#isPressed;
            const isDisabled = this.#isDisabled;
            return html `
      <button
        part="root"
        type="button"
        aria-pressed="${String(isPressed)}"
        ?disabled="${isDisabled}"
        ?data-pressed="${isPressed}"
        ?data-disabled="${isDisabled}"
        @click="${this.#handleClick}"
      >
        <slot name="icon"></slot>
        <slot></slot>
      </button>
    `;
        }
    };
})();
export { DuiTogglePrimitive };
