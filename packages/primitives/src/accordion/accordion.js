/** Ported from original DUI: deep-future-app/app/client/components/dui/accordion */
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
import { accordionContext, } from "./accordion-context.ts";
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
`;
let DuiAccordionPrimitive = (() => {
    let _classSuper = LitElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _defaultValue_decorators;
    let _defaultValue_initializers = [];
    let _defaultValue_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _multiple_decorators;
    let _multiple_initializers = [];
    let _multiple_extraInitializers = [];
    let _loopFocus_decorators;
    let _loopFocus_initializers = [];
    let _loopFocus_extraInitializers = [];
    let _orientation_decorators;
    let _orientation_initializers = [];
    let _orientation_extraInitializers = [];
    let _keepMounted_decorators;
    let _keepMounted_initializers = [];
    let _keepMounted_extraInitializers = [];
    let _private_internalOpenValues_decorators;
    let _private_internalOpenValues_initializers = [];
    let _private_internalOpenValues_extraInitializers = [];
    let _private_internalOpenValues_descriptor;
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiAccordionPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property({ type: Array })];
            _defaultValue_decorators = [property({ type: Array, attribute: "default-value" })];
            _disabled_decorators = [property({ type: Boolean })];
            _multiple_decorators = [property({ type: Boolean })];
            _loopFocus_decorators = [property({ type: Boolean, attribute: "loop-focus" })];
            _orientation_decorators = [property({ type: String })];
            _keepMounted_decorators = [property({ type: Boolean, attribute: "keep-mounted" })];
            _private_internalOpenValues_decorators = [state()];
            __ctx_decorators = [provide({ context: accordionContext }), state()];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _defaultValue_decorators, { kind: "accessor", name: "defaultValue", static: false, private: false, access: { has: obj => "defaultValue" in obj, get: obj => obj.defaultValue, set: (obj, value) => { obj.defaultValue = value; } }, metadata: _metadata }, _defaultValue_initializers, _defaultValue_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _multiple_decorators, { kind: "accessor", name: "multiple", static: false, private: false, access: { has: obj => "multiple" in obj, get: obj => obj.multiple, set: (obj, value) => { obj.multiple = value; } }, metadata: _metadata }, _multiple_initializers, _multiple_extraInitializers);
            __esDecorate(this, null, _loopFocus_decorators, { kind: "accessor", name: "loopFocus", static: false, private: false, access: { has: obj => "loopFocus" in obj, get: obj => obj.loopFocus, set: (obj, value) => { obj.loopFocus = value; } }, metadata: _metadata }, _loopFocus_initializers, _loopFocus_extraInitializers);
            __esDecorate(this, null, _orientation_decorators, { kind: "accessor", name: "orientation", static: false, private: false, access: { has: obj => "orientation" in obj, get: obj => obj.orientation, set: (obj, value) => { obj.orientation = value; } }, metadata: _metadata }, _orientation_initializers, _orientation_extraInitializers);
            __esDecorate(this, null, _keepMounted_decorators, { kind: "accessor", name: "keepMounted", static: false, private: false, access: { has: obj => "keepMounted" in obj, get: obj => obj.keepMounted, set: (obj, value) => { obj.keepMounted = value; } }, metadata: _metadata }, _keepMounted_initializers, _keepMounted_extraInitializers);
            __esDecorate(this, _private_internalOpenValues_descriptor = { get: __setFunctionName(function () { return this.#internalOpenValues_accessor_storage; }, "#internalOpenValues", "get"), set: __setFunctionName(function (value) { this.#internalOpenValues_accessor_storage = value; }, "#internalOpenValues", "set") }, _private_internalOpenValues_decorators, { kind: "accessor", name: "#internalOpenValues", static: false, private: true, access: { has: obj => #internalOpenValues in obj, get: obj => obj.#internalOpenValues, set: (obj, value) => { obj.#internalOpenValues = value; } }, metadata: _metadata }, _private_internalOpenValues_initializers, _private_internalOpenValues_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-accordion";
        static styles = [base, styles];
        #value_accessor_storage = __runInitializers(this, _value_initializers, undefined);
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #defaultValue_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _defaultValue_initializers, []));
        get defaultValue() { return this.#defaultValue_accessor_storage; }
        set defaultValue(value) { this.#defaultValue_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _defaultValue_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #multiple_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _multiple_initializers, false));
        get multiple() { return this.#multiple_accessor_storage; }
        set multiple(value) { this.#multiple_accessor_storage = value; }
        #loopFocus_accessor_storage = (__runInitializers(this, _multiple_extraInitializers), __runInitializers(this, _loopFocus_initializers, true));
        get loopFocus() { return this.#loopFocus_accessor_storage; }
        set loopFocus(value) { this.#loopFocus_accessor_storage = value; }
        #orientation_accessor_storage = (__runInitializers(this, _loopFocus_extraInitializers), __runInitializers(this, _orientation_initializers, "vertical"));
        get orientation() { return this.#orientation_accessor_storage; }
        set orientation(value) { this.#orientation_accessor_storage = value; }
        #keepMounted_accessor_storage = (__runInitializers(this, _orientation_extraInitializers), __runInitializers(this, _keepMounted_initializers, false));
        get keepMounted() { return this.#keepMounted_accessor_storage; }
        set keepMounted(value) { this.#keepMounted_accessor_storage = value; }
        #internalOpenValues_accessor_storage = (__runInitializers(this, _keepMounted_extraInitializers), __runInitializers(this, _private_internalOpenValues_initializers, []));
        get #internalOpenValues() { return _private_internalOpenValues_descriptor.get.call(this); }
        set #internalOpenValues(value) { return _private_internalOpenValues_descriptor.set.call(this, value); }
        #itemRegistry = (__runInitializers(this, _private_internalOpenValues_extraInitializers), new Map());
        #itemOrder = [];
        #getOpenValues = () => this.value ?? this.#internalOpenValues;
        #toggle = (value) => {
            const current = [...this.#getOpenValues()];
            const index = current.indexOf(value);
            let next;
            if (index >= 0) {
                next = current.filter((v) => v !== value);
            }
            else if (this.multiple) {
                next = [...current, value];
            }
            else {
                next = [value];
            }
            if (this.value === undefined) {
                this.#internalOpenValues = next;
            }
            this.dispatchEvent(valueChangeEvent(next));
        };
        #registerItem = (value, el) => {
            this.#itemRegistry.set(value, el);
            if (!this.#itemOrder.includes(value)) {
                this.#itemOrder.push(value);
            }
        };
        #unregisterItem = (value) => {
            this.#itemRegistry.delete(value);
            this.#itemOrder = this.#itemOrder.filter((v) => v !== value);
        };
        #focusItem = (value, direction) => {
            const currentIndex = this.#itemOrder.indexOf(value);
            if (currentIndex === -1)
                return;
            const len = this.#itemOrder.length;
            let targetIndex;
            switch (direction) {
                case "next":
                    if (currentIndex < len - 1) {
                        targetIndex = currentIndex + 1;
                    }
                    else if (this.loopFocus) {
                        targetIndex = 0;
                    }
                    break;
                case "prev":
                    if (currentIndex > 0) {
                        targetIndex = currentIndex - 1;
                    }
                    else if (this.loopFocus) {
                        targetIndex = len - 1;
                    }
                    break;
                case "first":
                    targetIndex = 0;
                    break;
                case "last":
                    targetIndex = len - 1;
                    break;
            }
            if (targetIndex !== undefined) {
                const targetValue = this.#itemOrder[targetIndex];
                const targetEl = this.#itemRegistry.get(targetValue);
                const trigger = targetEl?.shadowRoot?.querySelector("[part='trigger']");
                trigger?.focus();
            }
        };
        #_ctx_accessor_storage = __runInitializers(this, __ctx_initializers, this.#buildContext());
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #buildContext() {
            return {
                openValues: this.#getOpenValues(),
                disabled: this.disabled,
                orientation: this.orientation,
                loopFocus: this.loopFocus,
                keepMounted: this.keepMounted,
                toggle: this.#toggle,
                registerItem: this.#registerItem,
                unregisterItem: this.#unregisterItem,
                focusItem: this.#focusItem,
            };
        }
        connectedCallback() {
            super.connectedCallback();
            if (this.value === undefined && this.defaultValue.length > 0) {
                this.#internalOpenValues = [...this.defaultValue];
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
        data-orientation=${this.orientation}
        ?data-disabled=${this.disabled}
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
export { DuiAccordionPrimitive };
