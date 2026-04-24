/** Ported from original DUI: deep-future-app/app/client/components/dui/checkbox */
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
import { customEvent } from "@dui/core/event";
import { checkboxGroupContext, } from "./checkbox-group-context.ts";
export const valueChangeEvent = customEvent("value-change", {
    bubbles: true,
    composed: true,
});
/** Structural styles only — layout and behavioral CSS. */
const styles = css `
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
`;
/**
 * `<dui-checkbox-group>` — Groups multiple checkboxes with shared state.
 *
 * Manages a shared array of checked values. Supports controlled and
 * uncontrolled usage, and an `allValues` prop for parent checkbox
 * (select-all) patterns.
 *
 * @slot - Default slot for `<dui-checkbox>` children.
 * @csspart root - The group container element.
 *
 * @fires value-change - Fired when the set of checked values changes. Detail: string[]
 */
let DuiCheckboxGroupPrimitive = (() => {
    let _classSuper = LitElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _defaultValue_decorators;
    let _defaultValue_initializers = [];
    let _defaultValue_extraInitializers = [];
    let _allValues_decorators;
    let _allValues_initializers = [];
    let _allValues_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _private_internalValues_decorators;
    let _private_internalValues_initializers = [];
    let _private_internalValues_extraInitializers = [];
    let _private_internalValues_descriptor;
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiCheckboxGroupPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property({ attribute: false })];
            _defaultValue_decorators = [property({ attribute: false })];
            _allValues_decorators = [property({ attribute: false })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _private_internalValues_decorators = [state()];
            __ctx_decorators = [provide({ context: checkboxGroupContext }), state()];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _defaultValue_decorators, { kind: "accessor", name: "defaultValue", static: false, private: false, access: { has: obj => "defaultValue" in obj, get: obj => obj.defaultValue, set: (obj, value) => { obj.defaultValue = value; } }, metadata: _metadata }, _defaultValue_initializers, _defaultValue_extraInitializers);
            __esDecorate(this, null, _allValues_decorators, { kind: "accessor", name: "allValues", static: false, private: false, access: { has: obj => "allValues" in obj, get: obj => obj.allValues, set: (obj, value) => { obj.allValues = value; } }, metadata: _metadata }, _allValues_initializers, _allValues_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, _private_internalValues_descriptor = { get: __setFunctionName(function () { return this.#internalValues_accessor_storage; }, "#internalValues", "get"), set: __setFunctionName(function (value) { this.#internalValues_accessor_storage = value; }, "#internalValues", "set") }, _private_internalValues_decorators, { kind: "accessor", name: "#internalValues", static: false, private: true, access: { has: obj => #internalValues in obj, get: obj => obj.#internalValues, set: (obj, value) => { obj.#internalValues = value; } }, metadata: _metadata }, _private_internalValues_initializers, _private_internalValues_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-checkbox-group";
        static styles = [base, styles];
        #value_accessor_storage = __runInitializers(this, _value_initializers, undefined);
        /** Checked values (controlled). */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #defaultValue_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _defaultValue_initializers, []));
        /** Initial checked values for uncontrolled usage. */
        get defaultValue() { return this.#defaultValue_accessor_storage; }
        set defaultValue(value) { this.#defaultValue_accessor_storage = value; }
        #allValues_accessor_storage = (__runInitializers(this, _defaultValue_extraInitializers), __runInitializers(this, _allValues_initializers, []));
        /**
         * All possible checkbox values in the group.
         * Required when using a parent (select-all) checkbox.
         */
        get allValues() { return this.#allValues_accessor_storage; }
        set allValues(value) { this.#allValues_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _allValues_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Whether all checkboxes in the group are disabled. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #internalValues_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _private_internalValues_initializers, []));
        get #internalValues() { return _private_internalValues_descriptor.get.call(this); }
        set #internalValues(value) { return _private_internalValues_descriptor.set.call(this, value); }
        #getCheckedValues = (__runInitializers(this, _private_internalValues_extraInitializers), () => this.value ?? this.#internalValues);
        #toggle = (val) => {
            const current = this.#getCheckedValues();
            const next = current.includes(val)
                ? current.filter((v) => v !== val)
                : [...current, val];
            if (this.value === undefined) {
                this.#internalValues = next;
            }
            this.dispatchEvent(valueChangeEvent(next));
        };
        #toggleAll = (checked) => {
            const next = checked ? [...this.allValues] : [];
            if (this.value === undefined) {
                this.#internalValues = next;
            }
            this.dispatchEvent(valueChangeEvent(next));
        };
        #_ctx_accessor_storage = __runInitializers(this, __ctx_initializers, this.#buildContext());
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #buildContext() {
            return {
                checkedValues: this.#getCheckedValues(),
                allValues: this.allValues,
                disabled: this.disabled,
                toggle: this.#toggle,
                toggleAll: this.#toggleAll,
            };
        }
        connectedCallback() {
            super.connectedCallback();
            if (this.value === undefined && this.defaultValue.length > 0) {
                this.#internalValues = [...this.defaultValue];
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
        role="group"
        ?data-disabled="${this.disabled}"
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
export { DuiCheckboxGroupPrimitive };
