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
import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
export const checkedChangeEvent = customEvent("checked-change", { bubbles: true, composed: true });
/** Structural styles only — layout and behavioral CSS. */
const styles = css `
  :host {
    display: inline-flex;
    align-items: start;
    cursor: pointer;
    text-align: start;
  }

  :host([disabled]) {
    cursor: not-allowed;
  }

  [part="root"] {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    padding: 0;
    margin-block-end: 0;
    margin-inline: 0;
    border: none;
    cursor: pointer;
    user-select: none;
  }

  [part="thumb"] {
    position: absolute;
    left: var(--switch-thumb-offset, 0.125rem);
  }

  [part="root"][data-checked] [part="thumb"] {
    transform: translateX(var(--switch-checked-offset, 0));
  }

`;
/**
 * `<dui-switch>` — A toggle switch for binary on/off settings.
 *
 * @csspart root - The switch track container.
 * @csspart thumb - The movable thumb indicator.
 * @fires checked-change - Fired when toggled. Detail: { checked: boolean }
 */
let DuiSwitchPrimitive = (() => {
    let _classSuper = LitElement;
    let _checked_decorators;
    let _checked_initializers = [];
    let _checked_extraInitializers = [];
    let _defaultChecked_decorators;
    let _defaultChecked_initializers = [];
    let _defaultChecked_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _readOnly_decorators;
    let _readOnly_initializers = [];
    let _readOnly_extraInitializers = [];
    let _required_decorators;
    let _required_initializers = [];
    let _required_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _uncheckedValue_decorators;
    let _uncheckedValue_initializers = [];
    let _uncheckedValue_extraInitializers = [];
    let _private_internalChecked_decorators;
    let _private_internalChecked_initializers = [];
    let _private_internalChecked_extraInitializers = [];
    let _private_internalChecked_descriptor;
    return class DuiSwitchPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _checked_decorators = [property({ type: Boolean, reflect: true })];
            _defaultChecked_decorators = [property({ type: Boolean, attribute: "default-checked" })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _readOnly_decorators = [property({ type: Boolean, reflect: true, attribute: "read-only" })];
            _required_decorators = [property({ type: Boolean, reflect: true })];
            _name_decorators = [property()];
            _value_decorators = [property()];
            _uncheckedValue_decorators = [property({ attribute: "unchecked-value" })];
            _private_internalChecked_decorators = [state()];
            __esDecorate(this, null, _checked_decorators, { kind: "accessor", name: "checked", static: false, private: false, access: { has: obj => "checked" in obj, get: obj => obj.checked, set: (obj, value) => { obj.checked = value; } }, metadata: _metadata }, _checked_initializers, _checked_extraInitializers);
            __esDecorate(this, null, _defaultChecked_decorators, { kind: "accessor", name: "defaultChecked", static: false, private: false, access: { has: obj => "defaultChecked" in obj, get: obj => obj.defaultChecked, set: (obj, value) => { obj.defaultChecked = value; } }, metadata: _metadata }, _defaultChecked_initializers, _defaultChecked_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _readOnly_decorators, { kind: "accessor", name: "readOnly", static: false, private: false, access: { has: obj => "readOnly" in obj, get: obj => obj.readOnly, set: (obj, value) => { obj.readOnly = value; } }, metadata: _metadata }, _readOnly_initializers, _readOnly_extraInitializers);
            __esDecorate(this, null, _required_decorators, { kind: "accessor", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _uncheckedValue_decorators, { kind: "accessor", name: "uncheckedValue", static: false, private: false, access: { has: obj => "uncheckedValue" in obj, get: obj => obj.uncheckedValue, set: (obj, value) => { obj.uncheckedValue = value; } }, metadata: _metadata }, _uncheckedValue_initializers, _uncheckedValue_extraInitializers);
            __esDecorate(this, _private_internalChecked_descriptor = { get: __setFunctionName(function () { return this.#internalChecked_accessor_storage; }, "#internalChecked", "get"), set: __setFunctionName(function (value) { this.#internalChecked_accessor_storage = value; }, "#internalChecked", "set") }, _private_internalChecked_decorators, { kind: "accessor", name: "#internalChecked", static: false, private: true, access: { has: obj => #internalChecked in obj, get: obj => obj.#internalChecked, set: (obj, value) => { obj.#internalChecked = value; } }, metadata: _metadata }, _private_internalChecked_initializers, _private_internalChecked_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-switch";
        static formAssociated = true;
        static styles = [base, styles];
        #internals;
        constructor() {
            super();
            this.#internals = this.attachInternals();
        }
        #checked_accessor_storage = __runInitializers(this, _checked_initializers, undefined);
        get checked() { return this.#checked_accessor_storage; }
        set checked(value) { this.#checked_accessor_storage = value; }
        #defaultChecked_accessor_storage = (__runInitializers(this, _checked_extraInitializers), __runInitializers(this, _defaultChecked_initializers, false));
        get defaultChecked() { return this.#defaultChecked_accessor_storage; }
        set defaultChecked(value) { this.#defaultChecked_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _defaultChecked_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #readOnly_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _readOnly_initializers, false));
        get readOnly() { return this.#readOnly_accessor_storage; }
        set readOnly(value) { this.#readOnly_accessor_storage = value; }
        #required_accessor_storage = (__runInitializers(this, _readOnly_extraInitializers), __runInitializers(this, _required_initializers, false));
        get required() { return this.#required_accessor_storage; }
        set required(value) { this.#required_accessor_storage = value; }
        #name_accessor_storage = (__runInitializers(this, _required_extraInitializers), __runInitializers(this, _name_initializers, undefined));
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #value_accessor_storage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _value_initializers, "on"));
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #uncheckedValue_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _uncheckedValue_initializers, ""));
        get uncheckedValue() { return this.#uncheckedValue_accessor_storage; }
        set uncheckedValue(value) { this.#uncheckedValue_accessor_storage = value; }
        #internalChecked_accessor_storage = (__runInitializers(this, _uncheckedValue_extraInitializers), __runInitializers(this, _private_internalChecked_initializers, false));
        get #internalChecked() { return _private_internalChecked_descriptor.get.call(this); }
        set #internalChecked(value) { return _private_internalChecked_descriptor.set.call(this, value); }
        get #isChecked() {
            return this.checked ?? this.#internalChecked;
        }
        get #isDisabled() {
            return this.disabled;
        }
        connectedCallback() {
            super.connectedCallback();
            if (this.checked === undefined && this.defaultChecked) {
                this.#internalChecked = true;
            }
            this.addEventListener("click", this.#handleHostClick);
        }
        willUpdate() {
            this.#syncFormValue();
        }
        #syncFormValue() {
            const formValue = this.#isChecked ? this.value : this.uncheckedValue;
            this.#internals.setFormValue(formValue || null);
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.removeEventListener("click", this.#handleHostClick);
        }
        #handleHostClick = (__runInitializers(this, _private_internalChecked_extraInitializers), (_e) => {
            this.#handleClick();
        });
        #handleClick = () => {
            if (this.#isDisabled || this.readOnly)
                return;
            const newChecked = !this.#isChecked;
            if (this.checked === undefined) {
                this.#internalChecked = newChecked;
            }
            this.dispatchEvent(checkedChangeEvent({ checked: newChecked }));
        };
        #handleKeyDown = (e) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                this.#handleClick();
            }
        };
        render() {
            const isChecked = this.#isChecked;
            const isDisabled = this.#isDisabled;
            return html `
      <span
        part="root"
        role="switch"
        aria-checked="${String(isChecked)}"
        aria-disabled="${isDisabled ? "true" : nothing}"
        aria-readonly="${this.readOnly ? "true" : nothing}"
        aria-required="${this.required ? "true" : nothing}"
        tabindex="${isDisabled ? nothing : "0"}"
        ?data-checked="${isChecked}"
        ?data-unchecked="${!isChecked}"
        ?data-disabled="${isDisabled}"
        ?data-readonly="${this.readOnly}"
        ?data-required="${this.required}"
        @keydown="${this.#handleKeyDown}"
      >
        <span part="thumb"></span>
      </span>
      <slot></slot>
    `;
        }
    };
})();
export { DuiSwitchPrimitive };
