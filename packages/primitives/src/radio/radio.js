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
import { css, html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { radioGroupContext } from "./radio-group-context.ts";
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
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
    outline: 0;
    padding: 0;
    margin: 0;
    border: none;
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
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  [part="indicator"][data-unchecked] {
    display: none;
  }

`;
/**
 * `<dui-radio>` — A radio button input.
 *
 * Must be used within a `<dui-radio-group>`. Only one radio can be
 * selected at a time within a group.
 *
 * @slot - Label content.
 * @csspart root - The radio container.
 * @csspart indicator - The selected state indicator.
 * @cssprop --radio-size - Size of the radio button.
 */
let DuiRadioPrimitive = (() => {
    let _classSuper = LitElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _readOnly_decorators;
    let _readOnly_initializers = [];
    let _readOnly_extraInitializers = [];
    return class DuiRadioPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property()];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _readOnly_decorators = [property({ type: Boolean, reflect: true, attribute: "read-only" })];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _readOnly_decorators, { kind: "accessor", name: "readOnly", static: false, private: false, access: { has: obj => "readOnly" in obj, get: obj => obj.readOnly, set: (obj, value) => { obj.readOnly = value; } }, metadata: _metadata }, _readOnly_initializers, _readOnly_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-radio";
        static formAssociated = true;
        static styles = [base, styles];
        #internals;
        constructor() {
            super();
            this.#internals = this.attachInternals();
        }
        #value_accessor_storage = __runInitializers(this, _value_initializers, "");
        /** The value attribute for this radio option. */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Whether the radio is disabled. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #readOnly_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _readOnly_initializers, false));
        /** Whether the radio is read-only. */
        get readOnly() { return this.#readOnly_accessor_storage; }
        set readOnly(value) { this.#readOnly_accessor_storage = value; }
        #groupCtx = (__runInitializers(this, _readOnly_extraInitializers), new ContextConsumer(this, {
            context: radioGroupContext,
            subscribe: true,
        }));
        get #isChecked() {
            return this.#groupCtx.value?.value === this.value;
        }
        get #isDisabled() {
            return (this.disabled ||
                (this.#groupCtx.value?.disabled ?? false));
        }
        get #isReadOnly() {
            return this.readOnly || (this.#groupCtx.value?.readOnly ?? false);
        }
        get #isRequired() {
            return this.#groupCtx.value?.required ?? false;
        }
        connectedCallback() {
            super.connectedCallback();
            this.addEventListener("click", this.#handleHostClick);
        }
        willUpdate() {
            this.#syncFormValue();
        }
        #syncFormValue() {
            if (this.#isChecked) {
                this.#internals.setFormValue(this.value);
            }
            else {
                this.#internals.setFormValue(null);
            }
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.removeEventListener("click", this.#handleHostClick);
        }
        #handleHostClick = (e) => {
            if (e.target.closest("[part='root']"))
                return;
            this.#handleClick(e);
        };
        #handleClick = (_e) => {
            if (this.#isDisabled || this.#isReadOnly)
                return;
            const ctx = this.#groupCtx.value;
            if (ctx) {
                ctx.select(this.value);
            }
        };
        #handleKeyDown = (e) => {
            if (e.key === " ") {
                e.preventDefault();
                this.#handleClick(e);
            }
        };
        render() {
            const isChecked = this.#isChecked;
            const isDisabled = this.#isDisabled;
            const isReadOnly = this.#isReadOnly;
            const isRequired = this.#isRequired;
            return html `
      <span
        part="root"
        role="radio"
        aria-checked="${String(isChecked)}"
        aria-disabled="${isDisabled ? "true" : nothing}"
        aria-readonly="${isReadOnly ? "true" : nothing}"
        aria-required="${isRequired ? "true" : nothing}"
        tabindex="${isDisabled ? nothing : "0"}"
        ?data-checked="${isChecked}"
        ?data-unchecked="${!isChecked}"
        ?data-disabled="${isDisabled}"
        ?data-readonly="${isReadOnly}"
        ?data-required="${isRequired}"
        @click="${this.#handleClick}"
        @keydown="${this.#handleKeyDown}"
      >
        <span
          part="indicator"
          ?data-checked="${isChecked}"
          ?data-unchecked="${!isChecked}"
        >
          ${isChecked ? html `<span part="dot"></span>` : nothing}
        </span>
      </span>
      <slot></slot>
    `;
        }
    };
})();
export { DuiRadioPrimitive };
