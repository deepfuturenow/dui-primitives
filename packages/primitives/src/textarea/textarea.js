/** Ported from original DUI: deep-future-app/app/client/components/dui/textarea */
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
import { live } from "lit/directives/live.js";
import { styleMap } from "lit/directives/style-map.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
export const textareaChangeEvent = customEvent("textarea-change", { bubbles: true, composed: true });
const styles = css `
  :host {
    display: block;
  }

  [part="textarea"] {
    display: block;
    box-sizing: border-box;
    width: 100%;
    font-family: inherit;
    outline: none;
    resize: vertical;
  }

  [part="textarea"][data-resize="none"] {
    resize: none;
  }

  [part="textarea"][data-resize="vertical"] {
    resize: vertical;
  }

  [part="textarea"][data-resize="horizontal"] {
    resize: horizontal;
  }

  [part="textarea"][data-resize="both"] {
    resize: both;
  }

  [part="textarea"][data-resize="auto"] {
    resize: none;
    field-sizing: content;
  }

  [part="textarea"]:disabled {
    cursor: not-allowed;
  }
`;
/**
 * A multi-line text input with resize modes including auto-grow.
 */
let DuiTextareaPrimitive = (() => {
    let _classSuper = LitElement;
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
    let _rows_decorators;
    let _rows_initializers = [];
    let _rows_extraInitializers = [];
    let _minLength_decorators;
    let _minLength_initializers = [];
    let _minLength_extraInitializers = [];
    let _maxLength_decorators;
    let _maxLength_initializers = [];
    let _maxLength_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _resize_decorators;
    let _resize_initializers = [];
    let _resize_extraInitializers = [];
    let _maxHeight_decorators;
    let _maxHeight_initializers = [];
    let _maxHeight_extraInitializers = [];
    return class DuiTextareaPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property()];
            _placeholder_decorators = [property()];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _required_decorators = [property({ type: Boolean })];
            _readonly_decorators = [property({ type: Boolean })];
            _rows_decorators = [property({ type: Number })];
            _minLength_decorators = [property({ type: Number, attribute: "minlength" })];
            _maxLength_decorators = [property({ type: Number, attribute: "maxlength" })];
            _name_decorators = [property()];
            _resize_decorators = [property()];
            _maxHeight_decorators = [property({ attribute: "max-height" })];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } }, metadata: _metadata }, _placeholder_initializers, _placeholder_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _required_decorators, { kind: "accessor", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
            __esDecorate(this, null, _readonly_decorators, { kind: "accessor", name: "readonly", static: false, private: false, access: { has: obj => "readonly" in obj, get: obj => obj.readonly, set: (obj, value) => { obj.readonly = value; } }, metadata: _metadata }, _readonly_initializers, _readonly_extraInitializers);
            __esDecorate(this, null, _rows_decorators, { kind: "accessor", name: "rows", static: false, private: false, access: { has: obj => "rows" in obj, get: obj => obj.rows, set: (obj, value) => { obj.rows = value; } }, metadata: _metadata }, _rows_initializers, _rows_extraInitializers);
            __esDecorate(this, null, _minLength_decorators, { kind: "accessor", name: "minLength", static: false, private: false, access: { has: obj => "minLength" in obj, get: obj => obj.minLength, set: (obj, value) => { obj.minLength = value; } }, metadata: _metadata }, _minLength_initializers, _minLength_extraInitializers);
            __esDecorate(this, null, _maxLength_decorators, { kind: "accessor", name: "maxLength", static: false, private: false, access: { has: obj => "maxLength" in obj, get: obj => obj.maxLength, set: (obj, value) => { obj.maxLength = value; } }, metadata: _metadata }, _maxLength_initializers, _maxLength_extraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(this, null, _resize_decorators, { kind: "accessor", name: "resize", static: false, private: false, access: { has: obj => "resize" in obj, get: obj => obj.resize, set: (obj, value) => { obj.resize = value; } }, metadata: _metadata }, _resize_initializers, _resize_extraInitializers);
            __esDecorate(this, null, _maxHeight_decorators, { kind: "accessor", name: "maxHeight", static: false, private: false, access: { has: obj => "maxHeight" in obj, get: obj => obj.maxHeight, set: (obj, value) => { obj.maxHeight = value; } }, metadata: _metadata }, _maxHeight_initializers, _maxHeight_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-textarea";
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
        #value_accessor_storage = __runInitializers(this, _value_initializers, "");
        /** Current textarea value. */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #placeholder_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _placeholder_initializers, ""));
        /** Placeholder text. */
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _placeholder_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #required_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _required_initializers, false));
        get required() { return this.#required_accessor_storage; }
        set required(value) { this.#required_accessor_storage = value; }
        #readonly_accessor_storage = (__runInitializers(this, _required_extraInitializers), __runInitializers(this, _readonly_initializers, false));
        get readonly() { return this.#readonly_accessor_storage; }
        set readonly(value) { this.#readonly_accessor_storage = value; }
        #rows_accessor_storage = (__runInitializers(this, _readonly_extraInitializers), __runInitializers(this, _rows_initializers, undefined));
        /** Number of visible text rows. */
        get rows() { return this.#rows_accessor_storage; }
        set rows(value) { this.#rows_accessor_storage = value; }
        #minLength_accessor_storage = (__runInitializers(this, _rows_extraInitializers), __runInitializers(this, _minLength_initializers, undefined));
        get minLength() { return this.#minLength_accessor_storage; }
        set minLength(value) { this.#minLength_accessor_storage = value; }
        #maxLength_accessor_storage = (__runInitializers(this, _minLength_extraInitializers), __runInitializers(this, _maxLength_initializers, undefined));
        get maxLength() { return this.#maxLength_accessor_storage; }
        set maxLength(value) { this.#maxLength_accessor_storage = value; }
        #name_accessor_storage = (__runInitializers(this, _maxLength_extraInitializers), __runInitializers(this, _name_initializers, ""));
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #resize_accessor_storage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _resize_initializers, "vertical"));
        /** Resize behavior: "none" | "vertical" | "horizontal" | "both" | "auto". */
        get resize() { return this.#resize_accessor_storage; }
        set resize(value) { this.#resize_accessor_storage = value; }
        #maxHeight_accessor_storage = (__runInitializers(this, _resize_extraInitializers), __runInitializers(this, _maxHeight_initializers, undefined));
        /** Maximum height (CSS value). Textarea scrolls when content exceeds this. */
        get maxHeight() { return this.#maxHeight_accessor_storage; }
        set maxHeight(value) { this.#maxHeight_accessor_storage = value; }
        willUpdate() {
            this.#internals.setFormValue(this.value);
        }
        #syncValidity() {
            const textarea = this.shadowRoot?.querySelector("textarea");
            if (textarea) {
                this.#internals.setValidity(textarea.validity, textarea.validationMessage, textarea);
            }
        }
        updated() {
            this.#syncValidity();
        }
        #onInput = (__runInitializers(this, _maxHeight_extraInitializers), (event) => {
            const target = event.target;
            this.value = target.value;
            this.#internals.setFormValue(this.value);
            this.dispatchEvent(textareaChangeEvent({ value: this.value }));
        });
        render() {
            const textAreaStyles = styleMap({
                overflowY: this.maxHeight === undefined ? "auto" : "initial",
                maxHeight: this.maxHeight ?? "initial",
            });
            return html `
      <textarea
        part="textarea"
        style=${textAreaStyles}
        .value=${live(this.value)}
        placeholder=${this.placeholder}
        rows=${this.rows ?? ""}
        ?disabled=${this.disabled}
        ?required=${this.required}
        ?readonly=${this.readonly}
        minlength=${this.minLength ?? ""}
        maxlength=${this.maxLength ?? ""}
        name=${this.name}
        data-resize=${this.resize}
        @input=${this.#onInput}
      ></textarea>
    `;
        }
    };
})();
export { DuiTextareaPrimitive };
