/** Ported from original DUI: deep-future-app/app/client/components/dui/radio */
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
import { provide } from "@lit/context";
import { base } from "@dui/core/base";
import { radioGroupContext, } from "./radio-group-context.ts";
import { customEvent } from "@dui/core/event";
export const valueChangeEvent = customEvent("value-change", {
    bubbles: true,
    composed: true,
});
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  [part="root"][data-disabled] {
    opacity: 0.5;
  }
`;
/**
 * `<dui-radio-group>` — Groups multiple radio buttons with shared state.
 *
 * Only one radio can be selected at a time within a group. Supports
 * controlled and uncontrolled usage.
 *
 * @slot - Default slot for `<dui-radio>` children.
 * @csspart root - The group container element.
 * @fires value-change - Fired when the selected value changes. Detail: { value: string }
 */
let DuiRadioGroupPrimitive = (() => {
    let _classSuper = LitElement;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _defaultValue_decorators;
    let _defaultValue_initializers = [];
    let _defaultValue_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _readOnly_decorators;
    let _readOnly_initializers = [];
    let _readOnly_extraInitializers = [];
    let _required_decorators;
    let _required_initializers = [];
    let _required_extraInitializers = [];
    let _private_internalValue_decorators;
    let _private_internalValue_initializers = [];
    let _private_internalValue_extraInitializers = [];
    let _private_internalValue_descriptor;
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiRadioGroupPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _name_decorators = [property()];
            _value_decorators = [property()];
            _defaultValue_decorators = [property({ attribute: "default-value" })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _readOnly_decorators = [property({ type: Boolean, reflect: true, attribute: "read-only" })];
            _required_decorators = [property({ type: Boolean, reflect: true })];
            _private_internalValue_decorators = [state()];
            __ctx_decorators = [provide({ context: radioGroupContext }), state()];
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _defaultValue_decorators, { kind: "accessor", name: "defaultValue", static: false, private: false, access: { has: obj => "defaultValue" in obj, get: obj => obj.defaultValue, set: (obj, value) => { obj.defaultValue = value; } }, metadata: _metadata }, _defaultValue_initializers, _defaultValue_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _readOnly_decorators, { kind: "accessor", name: "readOnly", static: false, private: false, access: { has: obj => "readOnly" in obj, get: obj => obj.readOnly, set: (obj, value) => { obj.readOnly = value; } }, metadata: _metadata }, _readOnly_initializers, _readOnly_extraInitializers);
            __esDecorate(this, null, _required_decorators, { kind: "accessor", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
            __esDecorate(this, _private_internalValue_descriptor = { get: __setFunctionName(function () { return this.#internalValue_accessor_storage; }, "#internalValue", "get"), set: __setFunctionName(function (value) { this.#internalValue_accessor_storage = value; }, "#internalValue", "set") }, _private_internalValue_decorators, { kind: "accessor", name: "#internalValue", static: false, private: true, access: { has: obj => #internalValue in obj, get: obj => obj.#internalValue, set: (obj, value) => { obj.#internalValue = value; } }, metadata: _metadata }, _private_internalValue_initializers, _private_internalValue_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-radio-group";
        static styles = [base, styles];
        #name_accessor_storage = __runInitializers(this, _name_initializers, undefined);
        /** The name attribute for form submission. */
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #value_accessor_storage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _value_initializers, undefined));
        /** Selected value (controlled). */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #defaultValue_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _defaultValue_initializers, undefined));
        /** Initial selected value for uncontrolled usage. */
        get defaultValue() { return this.#defaultValue_accessor_storage; }
        set defaultValue(value) { this.#defaultValue_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _defaultValue_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Whether all radios in the group are disabled. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #readOnly_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _readOnly_initializers, false));
        /** Whether all radios in the group are read-only. */
        get readOnly() { return this.#readOnly_accessor_storage; }
        set readOnly(value) { this.#readOnly_accessor_storage = value; }
        #required_accessor_storage = (__runInitializers(this, _readOnly_extraInitializers), __runInitializers(this, _required_initializers, false));
        /** Whether a selection is required. */
        get required() { return this.#required_accessor_storage; }
        set required(value) { this.#required_accessor_storage = value; }
        #internalValue_accessor_storage = (__runInitializers(this, _required_extraInitializers), __runInitializers(this, _private_internalValue_initializers, undefined));
        get #internalValue() { return _private_internalValue_descriptor.get.call(this); }
        set #internalValue(value) { return _private_internalValue_descriptor.set.call(this, value); }
        #getSelectedValue = (__runInitializers(this, _private_internalValue_extraInitializers), () => this.value ?? this.#internalValue);
        #select = (val) => {
            if (this.disabled || this.readOnly)
                return;
            if (this.value === undefined) {
                this.#internalValue = val;
            }
            this.dispatchEvent(valueChangeEvent({ value: val }));
        };
        #_ctx_accessor_storage = __runInitializers(this, __ctx_initializers, this.#buildContext());
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #buildContext() {
            return {
                name: this.name,
                value: this.#getSelectedValue(),
                disabled: this.disabled,
                readOnly: this.readOnly,
                required: this.required,
                select: this.#select,
            };
        }
        connectedCallback() {
            super.connectedCallback();
            if (this.value === undefined && this.defaultValue !== undefined) {
                this.#internalValue = this.defaultValue;
            }
            this._ctx = this.#buildContext();
        }
        willUpdate() {
            this._ctx = this.#buildContext();
        }
        render() {
            return html `
      <div
        part="root"
        role="radiogroup"
        ?data-disabled="${this.disabled}"
        ?data-readonly="${this.readOnly}"
        ?data-required="${this.required}"
      >
        <slot></slot>
      </div>
    `;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, __ctx_extraInitializers);
        }
    };
})();
export { DuiRadioGroupPrimitive };
