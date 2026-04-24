/** Ported from original DUI: deep-future-app/app/client/components/dui/input */
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
import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
export const inputChangeEvent = customEvent("input-change", {
    bubbles: true,
    composed: true,
});
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: block;
  }

  [part="input"] {
    box-sizing: border-box;
    width: 100%;
    outline: none;
  }

  [part="input"]:disabled {
    cursor: not-allowed;
  }
`;
/**
 * `<dui-input>` — A native input element that integrates with dui-field.
 *
 * Automatically works with Field for accessible labeling and validation.
 *
 * @csspart input - The native input element.
 * @fires input-change - Fired when value changes. Detail: { value: string }
 */
let DuiInputPrimitive = (() => {
    let _classSuper = LitElement;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _placeholder_decorators;
    let _placeholder_initializers = [];
    let _placeholder_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _required_decorators;
    let _required_initializers = [];
    let _required_extraInitializers = [];
    let _readonly_decorators;
    let _readonly_initializers = [];
    let _readonly_extraInitializers = [];
    let _minLength_decorators;
    let _minLength_initializers = [];
    let _minLength_extraInitializers = [];
    let _maxLength_decorators;
    let _maxLength_initializers = [];
    let _maxLength_extraInitializers = [];
    let _pattern_decorators;
    let _pattern_initializers = [];
    let _pattern_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _autocomplete_decorators;
    let _autocomplete_initializers = [];
    let _autocomplete_extraInitializers = [];
    let _autofocus_decorators;
    let _autofocus_initializers = [];
    let _autofocus_extraInitializers = [];
    return class DuiInputPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _type_decorators = [property({ type: String })];
            _value_decorators = [property({ type: String })];
            _placeholder_decorators = [property({ type: String })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _required_decorators = [property({ type: Boolean })];
            _readonly_decorators = [property({ type: Boolean })];
            _minLength_decorators = [property({ type: Number, attribute: "minlength" })];
            _maxLength_decorators = [property({ type: Number, attribute: "maxlength" })];
            _pattern_decorators = [property({ type: String })];
            _name_decorators = [property({ type: String })];
            _autocomplete_decorators = [property({ type: String })];
            _autofocus_decorators = [property({ type: Boolean })];
            __esDecorate(this, null, _type_decorators, { kind: "accessor", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } }, metadata: _metadata }, _placeholder_initializers, _placeholder_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _required_decorators, { kind: "accessor", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
            __esDecorate(this, null, _readonly_decorators, { kind: "accessor", name: "readonly", static: false, private: false, access: { has: obj => "readonly" in obj, get: obj => obj.readonly, set: (obj, value) => { obj.readonly = value; } }, metadata: _metadata }, _readonly_initializers, _readonly_extraInitializers);
            __esDecorate(this, null, _minLength_decorators, { kind: "accessor", name: "minLength", static: false, private: false, access: { has: obj => "minLength" in obj, get: obj => obj.minLength, set: (obj, value) => { obj.minLength = value; } }, metadata: _metadata }, _minLength_initializers, _minLength_extraInitializers);
            __esDecorate(this, null, _maxLength_decorators, { kind: "accessor", name: "maxLength", static: false, private: false, access: { has: obj => "maxLength" in obj, get: obj => obj.maxLength, set: (obj, value) => { obj.maxLength = value; } }, metadata: _metadata }, _maxLength_initializers, _maxLength_extraInitializers);
            __esDecorate(this, null, _pattern_decorators, { kind: "accessor", name: "pattern", static: false, private: false, access: { has: obj => "pattern" in obj, get: obj => obj.pattern, set: (obj, value) => { obj.pattern = value; } }, metadata: _metadata }, _pattern_initializers, _pattern_extraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(this, null, _autocomplete_decorators, { kind: "accessor", name: "autocomplete", static: false, private: false, access: { has: obj => "autocomplete" in obj, get: obj => obj.autocomplete, set: (obj, value) => { obj.autocomplete = value; } }, metadata: _metadata }, _autocomplete_initializers, _autocomplete_extraInitializers);
            __esDecorate(this, null, _autofocus_decorators, { kind: "accessor", name: "autofocus", static: false, private: false, access: { has: obj => "autofocus" in obj, get: obj => obj.autofocus, set: (obj, value) => { obj.autofocus = value; } }, metadata: _metadata }, _autofocus_initializers, _autofocus_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-input";
        static formAssociated = true;
        static shadowRootOptions = {
            ...LitElement.shadowRootOptions,
            delegatesFocus: true,
        };
        static styles = [base, styles];
        #internals;
        constructor() {
            super();
            this.#internals = this.attachInternals();
        }
        #type_accessor_storage = __runInitializers(this, _type_initializers, "text");
        /** Input type (text, email, password, etc.) */
        get type() { return this.#type_accessor_storage; }
        set type(value) { this.#type_accessor_storage = value; }
        #value_accessor_storage = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _value_initializers, ""));
        /** Current input value. */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #placeholder_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _placeholder_initializers, ""));
        /** Placeholder text. */
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _placeholder_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Whether the input is disabled. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #required_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _required_initializers, false));
        /** Whether the input is required. */
        get required() { return this.#required_accessor_storage; }
        set required(value) { this.#required_accessor_storage = value; }
        #readonly_accessor_storage = (__runInitializers(this, _required_extraInitializers), __runInitializers(this, _readonly_initializers, false));
        /** Whether the input is read-only. */
        get readonly() { return this.#readonly_accessor_storage; }
        set readonly(value) { this.#readonly_accessor_storage = value; }
        #minLength_accessor_storage = (__runInitializers(this, _readonly_extraInitializers), __runInitializers(this, _minLength_initializers, undefined));
        /** Minimum length for text inputs. */
        get minLength() { return this.#minLength_accessor_storage; }
        set minLength(value) { this.#minLength_accessor_storage = value; }
        #maxLength_accessor_storage = (__runInitializers(this, _minLength_extraInitializers), __runInitializers(this, _maxLength_initializers, undefined));
        /** Maximum length for text inputs. */
        get maxLength() { return this.#maxLength_accessor_storage; }
        set maxLength(value) { this.#maxLength_accessor_storage = value; }
        #pattern_accessor_storage = (__runInitializers(this, _maxLength_extraInitializers), __runInitializers(this, _pattern_initializers, undefined));
        /** Pattern for validation. */
        get pattern() { return this.#pattern_accessor_storage; }
        set pattern(value) { this.#pattern_accessor_storage = value; }
        #name_accessor_storage = (__runInitializers(this, _pattern_extraInitializers), __runInitializers(this, _name_initializers, ""));
        /** Name attribute for form submission. */
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #autocomplete_accessor_storage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _autocomplete_initializers, undefined));
        /** Autocomplete hint for the browser. */
        get autocomplete() { return this.#autocomplete_accessor_storage; }
        set autocomplete(value) { this.#autocomplete_accessor_storage = value; }
        #autofocus_accessor_storage = (__runInitializers(this, _autocomplete_extraInitializers), __runInitializers(this, _autofocus_initializers, false));
        /** Whether the input should receive focus on mount. */
        get autofocus() { return this.#autofocus_accessor_storage; }
        set autofocus(value) { this.#autofocus_accessor_storage = value; }
        firstUpdated() {
            this.#syncValidity();
            if (this.autofocus) {
                this.focus();
            }
        }
        updated() {
            this.#syncValidity();
        }
        #onInput = (__runInitializers(this, _autofocus_extraInitializers), (event) => {
            const target = event.target;
            this.value = target.value;
            this.#syncFormValue();
            this.#syncValidity();
            this.dispatchEvent(inputChangeEvent({ value: this.value }));
        });
        willUpdate() {
            this.#syncFormValue();
        }
        #syncFormValue() {
            this.#internals.setFormValue(this.value);
        }
        #syncValidity() {
            const input = this.shadowRoot?.querySelector("input");
            if (input) {
                this.#internals.setValidity(input.validity, input.validationMessage, input);
            }
        }
        render() {
            return html `
      <input
        part="input"
        type="${this.type}"
        .value="${live(this.value)}"
        placeholder="${this.placeholder}"
        ?disabled="${this.disabled}"
        ?required="${this.required}"
        ?readonly="${this.readonly}"
        minlength="${ifDefined(this.minLength)}"
        maxlength="${ifDefined(this.maxLength)}"
        pattern="${ifDefined(this.pattern)}"
        name="${this.name}"
        autocomplete="${ifDefined(this.autocomplete)}"
        @input="${this.#onInput}"
      />
    `;
        }
    };
})();
export { DuiInputPrimitive };
