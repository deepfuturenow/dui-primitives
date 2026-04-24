/** Ported from original DUI: deep-future-app/app/client/components/dui/tabs */
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
import { tabsContext } from "./tabs-context.ts";
export const valueChangeEvent = customEvent("value-change", {
    bubbles: true,
    composed: true,
});
const styles = css `
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
  }

  [part="root"][data-orientation="vertical"] {
    flex-direction: row;
  }

  :host([controls="footer"]) [part="root"] {
    flex-direction: column-reverse;
  }
`;
/**
 * A tabbed interface component with animated indicator and keyboard navigation.
 */
let DuiTabsPrimitive = (() => {
    let _classSuper = LitElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _defaultValue_decorators;
    let _defaultValue_initializers = [];
    let _defaultValue_extraInitializers = [];
    let _orientation_decorators;
    let _orientation_initializers = [];
    let _orientation_extraInitializers = [];
    let _controls_decorators;
    let _controls_initializers = [];
    let _controls_extraInitializers = [];
    let _private_internalValue_decorators;
    let _private_internalValue_initializers = [];
    let _private_internalValue_extraInitializers = [];
    let _private_internalValue_descriptor;
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiTabsPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property()];
            _defaultValue_decorators = [property({ attribute: "default-value" })];
            _orientation_decorators = [property({ reflect: true })];
            _controls_decorators = [property({ reflect: true })];
            _private_internalValue_decorators = [state()];
            __ctx_decorators = [provide({ context: tabsContext }), state()];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _defaultValue_decorators, { kind: "accessor", name: "defaultValue", static: false, private: false, access: { has: obj => "defaultValue" in obj, get: obj => obj.defaultValue, set: (obj, value) => { obj.defaultValue = value; } }, metadata: _metadata }, _defaultValue_initializers, _defaultValue_extraInitializers);
            __esDecorate(this, null, _orientation_decorators, { kind: "accessor", name: "orientation", static: false, private: false, access: { has: obj => "orientation" in obj, get: obj => obj.orientation, set: (obj, value) => { obj.orientation = value; } }, metadata: _metadata }, _orientation_initializers, _orientation_extraInitializers);
            __esDecorate(this, null, _controls_decorators, { kind: "accessor", name: "controls", static: false, private: false, access: { has: obj => "controls" in obj, get: obj => obj.controls, set: (obj, value) => { obj.controls = value; } }, metadata: _metadata }, _controls_initializers, _controls_extraInitializers);
            __esDecorate(this, _private_internalValue_descriptor = { get: __setFunctionName(function () { return this.#internalValue_accessor_storage; }, "#internalValue", "get"), set: __setFunctionName(function (value) { this.#internalValue_accessor_storage = value; }, "#internalValue", "set") }, _private_internalValue_decorators, { kind: "accessor", name: "#internalValue", static: false, private: true, access: { has: obj => #internalValue in obj, get: obj => obj.#internalValue, set: (obj, value) => { obj.#internalValue = value; } }, metadata: _metadata }, _private_internalValue_initializers, _private_internalValue_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-tabs";
        static styles = [base, styles];
        #value_accessor_storage = __runInitializers(this, _value_initializers, undefined);
        /** Controlled active tab value. */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #defaultValue_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _defaultValue_initializers, undefined));
        /** Initial active tab value (uncontrolled mode). */
        get defaultValue() { return this.#defaultValue_accessor_storage; }
        set defaultValue(value) { this.#defaultValue_accessor_storage = value; }
        #orientation_accessor_storage = (__runInitializers(this, _defaultValue_extraInitializers), __runInitializers(this, _orientation_initializers, "horizontal"));
        /** Layout orientation. */
        get orientation() { return this.#orientation_accessor_storage; }
        set orientation(value) { this.#orientation_accessor_storage = value; }
        #controls_accessor_storage = (__runInitializers(this, _orientation_extraInitializers), __runInitializers(this, _controls_initializers, "header"));
        /** Whether tab list appears above or below content. */
        get controls() { return this.#controls_accessor_storage; }
        set controls(value) { this.#controls_accessor_storage = value; }
        #internalValue_accessor_storage = (__runInitializers(this, _controls_extraInitializers), __runInitializers(this, _private_internalValue_initializers, undefined));
        get #internalValue() { return _private_internalValue_descriptor.get.call(this); }
        set #internalValue(value) { return _private_internalValue_descriptor.set.call(this, value); }
        #getValue = (__runInitializers(this, _private_internalValue_extraInitializers), () => this.value ?? this.#internalValue);
        #select = (tabValue) => {
            if (this.value === undefined) {
                this.#internalValue = tabValue;
            }
            this.dispatchEvent(valueChangeEvent(tabValue));
        };
        #_ctx_accessor_storage = __runInitializers(this, __ctx_initializers, this.#buildContext());
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #buildContext() {
            return {
                value: this.#getValue(),
                orientation: this.orientation,
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
      <div part="root" data-orientation=${this.orientation}>
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
export { DuiTabsPrimitive };
