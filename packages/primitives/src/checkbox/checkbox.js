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
import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { checkboxGroupContext } from "./checkbox-group-context.ts";
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
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-block-end: 0;
    margin-inline: 0;
    border: none;
    outline: 0;
    cursor: pointer;
    user-select: none;
  }

  [part="root"][data-disabled] {
    cursor: not-allowed;
  }

  [part="root"][data-readonly] {
    cursor: default;
  }

  [part="indicator"] {
    display: flex;
  }

  [part="indicator"][data-unchecked] {
    display: none;
  }

`;
const checkIcon = html `
  <svg
    class="Icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
`;
const indeterminateIcon = html `
  <svg
    class="Icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
`;
/**
 * `<dui-checkbox>` — A checkbox input with optional indeterminate state.
 *
 * Supports controlled and uncontrolled usage, group context integration,
 * and field context for form validation states.
 *
 * @csspart root - The checkbox box element.
 * @csspart indicator - The check/indeterminate indicator.
 *
 * @fires checked-change - Fired when checked state changes. Detail: { checked, indeterminate }
 */
let DuiCheckboxPrimitive = (() => {
    let _classSuper = LitElement;
    let _checked_decorators;
    let _checked_initializers = [];
    let _checked_extraInitializers = [];
    let _defaultChecked_decorators;
    let _defaultChecked_initializers = [];
    let _defaultChecked_extraInitializers = [];
    let _indeterminate_decorators;
    let _indeterminate_initializers = [];
    let _indeterminate_extraInitializers = [];
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
    let _parent_decorators;
    let _parent_initializers = [];
    let _parent_extraInitializers = [];
    let _private_internalChecked_decorators;
    let _private_internalChecked_initializers = [];
    let _private_internalChecked_extraInitializers = [];
    let _private_internalChecked_descriptor;
    return class DuiCheckboxPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _checked_decorators = [property({ type: Boolean, reflect: true })];
            _defaultChecked_decorators = [property({ type: Boolean, attribute: "default-checked" })];
            _indeterminate_decorators = [property({ type: Boolean, reflect: true })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _readOnly_decorators = [property({ type: Boolean, reflect: true, attribute: "read-only" })];
            _required_decorators = [property({ type: Boolean, reflect: true })];
            _name_decorators = [property()];
            _value_decorators = [property()];
            _parent_decorators = [property({ type: Boolean })];
            _private_internalChecked_decorators = [state()];
            __esDecorate(this, null, _checked_decorators, { kind: "accessor", name: "checked", static: false, private: false, access: { has: obj => "checked" in obj, get: obj => obj.checked, set: (obj, value) => { obj.checked = value; } }, metadata: _metadata }, _checked_initializers, _checked_extraInitializers);
            __esDecorate(this, null, _defaultChecked_decorators, { kind: "accessor", name: "defaultChecked", static: false, private: false, access: { has: obj => "defaultChecked" in obj, get: obj => obj.defaultChecked, set: (obj, value) => { obj.defaultChecked = value; } }, metadata: _metadata }, _defaultChecked_initializers, _defaultChecked_extraInitializers);
            __esDecorate(this, null, _indeterminate_decorators, { kind: "accessor", name: "indeterminate", static: false, private: false, access: { has: obj => "indeterminate" in obj, get: obj => obj.indeterminate, set: (obj, value) => { obj.indeterminate = value; } }, metadata: _metadata }, _indeterminate_initializers, _indeterminate_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _readOnly_decorators, { kind: "accessor", name: "readOnly", static: false, private: false, access: { has: obj => "readOnly" in obj, get: obj => obj.readOnly, set: (obj, value) => { obj.readOnly = value; } }, metadata: _metadata }, _readOnly_initializers, _readOnly_extraInitializers);
            __esDecorate(this, null, _required_decorators, { kind: "accessor", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _parent_decorators, { kind: "accessor", name: "parent", static: false, private: false, access: { has: obj => "parent" in obj, get: obj => obj.parent, set: (obj, value) => { obj.parent = value; } }, metadata: _metadata }, _parent_initializers, _parent_extraInitializers);
            __esDecorate(this, _private_internalChecked_descriptor = { get: __setFunctionName(function () { return this.#internalChecked_accessor_storage; }, "#internalChecked", "get"), set: __setFunctionName(function (value) { this.#internalChecked_accessor_storage = value; }, "#internalChecked", "set") }, _private_internalChecked_decorators, { kind: "accessor", name: "#internalChecked", static: false, private: true, access: { has: obj => #internalChecked in obj, get: obj => obj.#internalChecked, set: (obj, value) => { obj.#internalChecked = value; } }, metadata: _metadata }, _private_internalChecked_initializers, _private_internalChecked_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-checkbox";
        static formAssociated = true;
        static styles = [base, styles];
        #internals;
        constructor() {
            super();
            this.#internals = this.attachInternals();
        }
        #checked_accessor_storage = __runInitializers(this, _checked_initializers, undefined);
        /** Whether the checkbox is checked (controlled). */
        get checked() { return this.#checked_accessor_storage; }
        set checked(value) { this.#checked_accessor_storage = value; }
        #defaultChecked_accessor_storage = (__runInitializers(this, _checked_extraInitializers), __runInitializers(this, _defaultChecked_initializers, false));
        /** Initial checked state for uncontrolled usage. */
        get defaultChecked() { return this.#defaultChecked_accessor_storage; }
        set defaultChecked(value) { this.#defaultChecked_accessor_storage = value; }
        #indeterminate_accessor_storage = (__runInitializers(this, _defaultChecked_extraInitializers), __runInitializers(this, _indeterminate_initializers, false));
        /** Whether the checkbox is in an indeterminate (mixed) state. */
        get indeterminate() { return this.#indeterminate_accessor_storage; }
        set indeterminate(value) { this.#indeterminate_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _indeterminate_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Whether the checkbox is disabled. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #readOnly_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _readOnly_initializers, false));
        /** Whether the checkbox is read-only. */
        get readOnly() { return this.#readOnly_accessor_storage; }
        set readOnly(value) { this.#readOnly_accessor_storage = value; }
        #required_accessor_storage = (__runInitializers(this, _readOnly_extraInitializers), __runInitializers(this, _required_initializers, false));
        /** Whether the checkbox is required for form submission. */
        get required() { return this.#required_accessor_storage; }
        set required(value) { this.#required_accessor_storage = value; }
        #name_accessor_storage = (__runInitializers(this, _required_extraInitializers), __runInitializers(this, _name_initializers, undefined));
        /** The name attribute for form submission. */
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #value_accessor_storage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _value_initializers, undefined));
        /** The value attribute for form submission. */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #parent_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _parent_initializers, false));
        /** When true, acts as a parent (select-all) checkbox within a group. */
        get parent() { return this.#parent_accessor_storage; }
        set parent(value) { this.#parent_accessor_storage = value; }
        #internalChecked_accessor_storage = (__runInitializers(this, _parent_extraInitializers), __runInitializers(this, _private_internalChecked_initializers, false));
        get #internalChecked() { return _private_internalChecked_descriptor.get.call(this); }
        set #internalChecked(value) { return _private_internalChecked_descriptor.set.call(this, value); }
        #groupCtx = (__runInitializers(this, _private_internalChecked_extraInitializers), new ContextConsumer(this, {
            context: checkboxGroupContext,
            subscribe: true,
        }));
        get #isChecked() {
            const ctx = this.#groupCtx.value;
            if (ctx && this.value !== undefined) {
                if (this.parent) {
                    return (ctx.allValues.length > 0 &&
                        ctx.allValues.every((v) => ctx.checkedValues.includes(v)));
                }
                return ctx.checkedValues.includes(this.value);
            }
            return this.checked ?? this.#internalChecked;
        }
        get #isIndeterminate() {
            const ctx = this.#groupCtx.value;
            if (ctx && this.parent && this.value !== undefined) {
                const count = ctx.allValues.filter((v) => ctx.checkedValues.includes(v)).length;
                return count > 0 && count < ctx.allValues.length;
            }
            return this.indeterminate;
        }
        get #isDisabled() {
            return (this.disabled ||
                (this.#groupCtx.value?.disabled ?? false));
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
            if (this.#isChecked) {
                this.#internals.setFormValue(this.value ?? "on");
            }
            else {
                this.#internals.setFormValue(null);
            }
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.removeEventListener("click", this.#handleHostClick);
        }
        #handleHostClick = (_e) => {
            this.#handleClick();
        };
        #handleClick = () => {
            if (this.#isDisabled || this.readOnly)
                return;
            const ctx = this.#groupCtx.value;
            // Within a group: delegate to context
            if (ctx && this.value !== undefined) {
                if (this.parent) {
                    ctx.toggleAll(!this.#isChecked);
                }
                else {
                    ctx.toggle(this.value);
                }
                return;
            }
            // Standalone behavior
            const newChecked = !this.#isChecked;
            if (this.checked === undefined) {
                this.#internalChecked = newChecked;
                this.indeterminate = false;
            }
            this.dispatchEvent(checkedChangeEvent({
                checked: newChecked,
                indeterminate: false,
            }));
        };
        #handleKeyDown = (e) => {
            if (e.key === " ") {
                e.preventDefault();
                this.#handleClick();
            }
        };
        render() {
            const isChecked = this.#isChecked;
            const isIndeterminate = this.#isIndeterminate;
            const isDisabled = this.#isDisabled;
            const showIndicator = isChecked || isIndeterminate;
            return html `
      <span
        part="root"
        role="checkbox"
        aria-checked="${isIndeterminate ? "mixed" : String(isChecked)}"
        aria-disabled="${isDisabled ? "true" : nothing}"
        aria-readonly="${this.readOnly ? "true" : nothing}"
        aria-required="${this.required ? "true" : nothing}"
        tabindex="${isDisabled ? nothing : "0"}"
        ?data-checked="${isChecked && !isIndeterminate}"
        ?data-unchecked="${!isChecked && !isIndeterminate}"
        ?data-indeterminate="${isIndeterminate}"
        ?data-disabled="${isDisabled}"
        ?data-readonly="${this.readOnly}"
        ?data-required="${this.required}"
        @keydown="${this.#handleKeyDown}"
      >
        <span
          part="indicator"
          ?data-checked="${isChecked && !isIndeterminate}"
          ?data-unchecked="${!isChecked && !isIndeterminate}"
          ?data-indeterminate="${isIndeterminate}"
        >
          ${showIndicator
                ? isIndeterminate
                    ? indeterminateIcon
                    : checkIcon
                : nothing}
        </span>
      </span>
      <slot></slot>
    `;
        }
    };
})();
export { DuiCheckboxPrimitive };
