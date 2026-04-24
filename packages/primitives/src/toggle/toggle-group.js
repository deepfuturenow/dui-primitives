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
import { toggleGroupContext, } from "./toggle-group-context.ts";
export const valueChangeEvent = customEvent("value-change", { bubbles: true, composed: true });
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: inline-flex;
  }

  [part="root"] {
    display: inline-flex;
  }

  :host([orientation="vertical"]) [part="root"] {
    flex-direction: column;
  }
`;
/**
 * `<dui-toggle-group>` — Groups toggle buttons with shared single/multi selection.
 *
 * @slot - `dui-toggle` children.
 * @csspart root - The group container.
 * @fires value-change - Fired when selection changes. Detail: { value: string[] }
 */
let DuiToggleGroupPrimitive = (() => {
    let _classSuper = LitElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _defaultValue_decorators;
    let _defaultValue_initializers = [];
    let _defaultValue_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _orientation_decorators;
    let _orientation_initializers = [];
    let _orientation_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _loop_decorators;
    let _loop_initializers = [];
    let _loop_extraInitializers = [];
    let _private_internalValue_decorators;
    let _private_internalValue_initializers = [];
    let _private_internalValue_extraInitializers = [];
    let _private_internalValue_descriptor;
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiToggleGroupPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property({ type: Array })];
            _defaultValue_decorators = [property({ type: Array, attribute: "default-value" })];
            _type_decorators = [property({ reflect: true })];
            _orientation_decorators = [property({ reflect: true })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _loop_decorators = [property({ type: Boolean })];
            _private_internalValue_decorators = [state()];
            __ctx_decorators = [provide({ context: toggleGroupContext }), state()];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _defaultValue_decorators, { kind: "accessor", name: "defaultValue", static: false, private: false, access: { has: obj => "defaultValue" in obj, get: obj => obj.defaultValue, set: (obj, value) => { obj.defaultValue = value; } }, metadata: _metadata }, _defaultValue_initializers, _defaultValue_extraInitializers);
            __esDecorate(this, null, _type_decorators, { kind: "accessor", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(this, null, _orientation_decorators, { kind: "accessor", name: "orientation", static: false, private: false, access: { has: obj => "orientation" in obj, get: obj => obj.orientation, set: (obj, value) => { obj.orientation = value; } }, metadata: _metadata }, _orientation_initializers, _orientation_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _loop_decorators, { kind: "accessor", name: "loop", static: false, private: false, access: { has: obj => "loop" in obj, get: obj => obj.loop, set: (obj, value) => { obj.loop = value; } }, metadata: _metadata }, _loop_initializers, _loop_extraInitializers);
            __esDecorate(this, _private_internalValue_descriptor = { get: __setFunctionName(function () { return this.#internalValue_accessor_storage; }, "#internalValue", "get"), set: __setFunctionName(function (value) { this.#internalValue_accessor_storage = value; }, "#internalValue", "set") }, _private_internalValue_decorators, { kind: "accessor", name: "#internalValue", static: false, private: true, access: { has: obj => #internalValue in obj, get: obj => obj.#internalValue, set: (obj, value) => { obj.#internalValue = value; } }, metadata: _metadata }, _private_internalValue_initializers, _private_internalValue_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-toggle-group";
        static styles = [base, styles];
        #value_accessor_storage = __runInitializers(this, _value_initializers, undefined);
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #defaultValue_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _defaultValue_initializers, []));
        get defaultValue() { return this.#defaultValue_accessor_storage; }
        set defaultValue(value) { this.#defaultValue_accessor_storage = value; }
        #type_accessor_storage = (__runInitializers(this, _defaultValue_extraInitializers), __runInitializers(this, _type_initializers, "single"));
        get type() { return this.#type_accessor_storage; }
        set type(value) { this.#type_accessor_storage = value; }
        #orientation_accessor_storage = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _orientation_initializers, "horizontal"));
        get orientation() { return this.#orientation_accessor_storage; }
        set orientation(value) { this.#orientation_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _orientation_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #loop_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _loop_initializers, true));
        get loop() { return this.#loop_accessor_storage; }
        set loop(value) { this.#loop_accessor_storage = value; }
        #internalValue_accessor_storage = (__runInitializers(this, _loop_extraInitializers), __runInitializers(this, _private_internalValue_initializers, []));
        get #internalValue() { return _private_internalValue_descriptor.get.call(this); }
        set #internalValue(value) { return _private_internalValue_descriptor.set.call(this, value); }
        get #currentValue() {
            return this.value ?? this.#internalValue;
        }
        #toggle = (__runInitializers(this, _private_internalValue_extraInitializers), (itemValue) => {
            if (this.disabled)
                return;
            const current = this.#currentValue;
            let next;
            if (this.type === "single") {
                next = current.includes(itemValue) ? [] : [itemValue];
            }
            else {
                next = current.includes(itemValue)
                    ? current.filter((v) => v !== itemValue)
                    : [...current, itemValue];
            }
            if (this.value === undefined) {
                this.#internalValue = next;
            }
            this.dispatchEvent(valueChangeEvent({ value: next }));
        });
        #_ctx_accessor_storage = __runInitializers(this, __ctx_initializers, this.#buildContext());
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #buildContext() {
            return {
                value: this.#currentValue,
                disabled: this.disabled,
                type: this.type,
                toggle: this.#toggle,
            };
        }
        connectedCallback() {
            super.connectedCallback();
            if (this.value === undefined && this.defaultValue.length > 0) {
                this.#internalValue = [...this.defaultValue];
            }
            this._ctx = this.#buildContext();
        }
        willUpdate() {
            this._ctx = this.#buildContext();
        }
        #onKeyDown = (__runInitializers(this, __ctx_extraInitializers), (e) => {
            const isHorizontal = this.orientation === "horizontal";
            const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
            const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
            if (e.key !== nextKey && e.key !== prevKey)
                return;
            e.preventDefault();
            const toggles = [
                ...this.querySelectorAll("dui-toggle"),
            ];
            const focusable = toggles.filter((t) => !t.hasAttribute("disabled"));
            if (focusable.length === 0)
                return;
            const active = this.shadowRoot?.activeElement ??
                document.activeElement;
            const currentToggle = toggles.find((t) => t === active || t.shadowRoot?.activeElement === active || t.contains(active));
            const currentIndex = currentToggle
                ? focusable.indexOf(currentToggle)
                : -1;
            let nextIndex;
            if (e.key === nextKey) {
                nextIndex = currentIndex + 1;
                if (nextIndex >= focusable.length) {
                    nextIndex = this.loop ? 0 : focusable.length - 1;
                }
            }
            else {
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) {
                    nextIndex = this.loop ? focusable.length - 1 : 0;
                }
            }
            focusable[nextIndex]?.focus();
        });
        render() {
            return html `
      <div
        part="root"
        role="group"
        aria-orientation="${this.orientation}"
        @keydown="${this.#onKeyDown}"
      >
        <slot></slot>
      </div>
    `;
        }
    };
})();
export { DuiToggleGroupPrimitive };
