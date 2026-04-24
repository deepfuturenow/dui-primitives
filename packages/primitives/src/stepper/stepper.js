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
import { live } from "lit/directives/live.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
export const valueChangeEvent = customEvent("value-change", { bubbles: true, composed: true });
export const valueCommittedEvent = customEvent("value-committed", { bubbles: true, composed: true });
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: block;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
  }

  [part="input"] {
    box-sizing: border-box;
    outline: none;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    text-align: center;
    min-width: 0;
  }

  [part="input"]:disabled {
    cursor: not-allowed;
  }

  [part="decrement"],
  [part="increment"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    flex-shrink: 0;
  }

  [part="decrement"]:disabled,
  [part="increment"]:disabled {
    cursor: not-allowed;
  }

  .HiddenInput {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    margin: 0;
    width: 0;
    height: 0;
  }
`;
/**
 * `<dui-stepper>` — A numeric input with increment/decrement buttons.
 *
 * Simple component for stepping values up and down via buttons, keyboard,
 * or manual text entry. No labels, icons, scrubbing, or other extras.
 *
 * @csspart root - The outer container.
 * @csspart input - The text input element.
 * @csspart decrement - The decrement button.
 * @csspart increment - The increment button.
 * @fires value-change - Fired when value changes. Detail: { value: number }
 * @fires value-committed - Fired on blur or Enter. Detail: { value: number }
 */
let DuiStepperPrimitive = (() => {
    let _classSuper = LitElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _defaultValue_decorators;
    let _defaultValue_initializers = [];
    let _defaultValue_extraInitializers = [];
    let _min_decorators;
    let _min_initializers = [];
    let _min_extraInitializers = [];
    let _max_decorators;
    let _max_initializers = [];
    let _max_extraInitializers = [];
    let _step_decorators;
    let _step_initializers = [];
    let _step_extraInitializers = [];
    let _largeStep_decorators;
    let _largeStep_initializers = [];
    let _largeStep_extraInitializers = [];
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
    let _private_internalValue_decorators;
    let _private_internalValue_initializers = [];
    let _private_internalValue_extraInitializers = [];
    let _private_internalValue_descriptor;
    let _private_inputText_decorators;
    let _private_inputText_initializers = [];
    let _private_inputText_extraInitializers = [];
    let _private_inputText_descriptor;
    return class DuiStepperPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property({ type: Number })];
            _defaultValue_decorators = [property({ type: Number, attribute: "default-value" })];
            _min_decorators = [property({ type: Number })];
            _max_decorators = [property({ type: Number })];
            _step_decorators = [property({ type: Number })];
            _largeStep_decorators = [property({ type: Number, attribute: "large-step" })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _readOnly_decorators = [property({ type: Boolean, reflect: true, attribute: "read-only" })];
            _required_decorators = [property({ type: Boolean })];
            _name_decorators = [property()];
            _private_internalValue_decorators = [state()];
            _private_inputText_decorators = [state()];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _defaultValue_decorators, { kind: "accessor", name: "defaultValue", static: false, private: false, access: { has: obj => "defaultValue" in obj, get: obj => obj.defaultValue, set: (obj, value) => { obj.defaultValue = value; } }, metadata: _metadata }, _defaultValue_initializers, _defaultValue_extraInitializers);
            __esDecorate(this, null, _min_decorators, { kind: "accessor", name: "min", static: false, private: false, access: { has: obj => "min" in obj, get: obj => obj.min, set: (obj, value) => { obj.min = value; } }, metadata: _metadata }, _min_initializers, _min_extraInitializers);
            __esDecorate(this, null, _max_decorators, { kind: "accessor", name: "max", static: false, private: false, access: { has: obj => "max" in obj, get: obj => obj.max, set: (obj, value) => { obj.max = value; } }, metadata: _metadata }, _max_initializers, _max_extraInitializers);
            __esDecorate(this, null, _step_decorators, { kind: "accessor", name: "step", static: false, private: false, access: { has: obj => "step" in obj, get: obj => obj.step, set: (obj, value) => { obj.step = value; } }, metadata: _metadata }, _step_initializers, _step_extraInitializers);
            __esDecorate(this, null, _largeStep_decorators, { kind: "accessor", name: "largeStep", static: false, private: false, access: { has: obj => "largeStep" in obj, get: obj => obj.largeStep, set: (obj, value) => { obj.largeStep = value; } }, metadata: _metadata }, _largeStep_initializers, _largeStep_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _readOnly_decorators, { kind: "accessor", name: "readOnly", static: false, private: false, access: { has: obj => "readOnly" in obj, get: obj => obj.readOnly, set: (obj, value) => { obj.readOnly = value; } }, metadata: _metadata }, _readOnly_initializers, _readOnly_extraInitializers);
            __esDecorate(this, null, _required_decorators, { kind: "accessor", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(this, _private_internalValue_descriptor = { get: __setFunctionName(function () { return this.#internalValue_accessor_storage; }, "#internalValue", "get"), set: __setFunctionName(function (value) { this.#internalValue_accessor_storage = value; }, "#internalValue", "set") }, _private_internalValue_decorators, { kind: "accessor", name: "#internalValue", static: false, private: true, access: { has: obj => #internalValue in obj, get: obj => obj.#internalValue, set: (obj, value) => { obj.#internalValue = value; } }, metadata: _metadata }, _private_internalValue_initializers, _private_internalValue_extraInitializers);
            __esDecorate(this, _private_inputText_descriptor = { get: __setFunctionName(function () { return this.#inputText_accessor_storage; }, "#inputText", "get"), set: __setFunctionName(function (value) { this.#inputText_accessor_storage = value; }, "#inputText", "set") }, _private_inputText_decorators, { kind: "accessor", name: "#inputText", static: false, private: true, access: { has: obj => #inputText in obj, get: obj => obj.#inputText, set: (obj, value) => { obj.#inputText = value; } }, metadata: _metadata }, _private_inputText_initializers, _private_inputText_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-stepper";
        static shadowRootOptions = {
            ...LitElement.shadowRootOptions,
            delegatesFocus: true,
        };
        static styles = [base, styles];
        #value_accessor_storage = __runInitializers(this, _value_initializers, undefined);
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #defaultValue_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _defaultValue_initializers, undefined));
        get defaultValue() { return this.#defaultValue_accessor_storage; }
        set defaultValue(value) { this.#defaultValue_accessor_storage = value; }
        #min_accessor_storage = (__runInitializers(this, _defaultValue_extraInitializers), __runInitializers(this, _min_initializers, undefined));
        get min() { return this.#min_accessor_storage; }
        set min(value) { this.#min_accessor_storage = value; }
        #max_accessor_storage = (__runInitializers(this, _min_extraInitializers), __runInitializers(this, _max_initializers, undefined));
        get max() { return this.#max_accessor_storage; }
        set max(value) { this.#max_accessor_storage = value; }
        #step_accessor_storage = (__runInitializers(this, _max_extraInitializers), __runInitializers(this, _step_initializers, 1));
        get step() { return this.#step_accessor_storage; }
        set step(value) { this.#step_accessor_storage = value; }
        #largeStep_accessor_storage = (__runInitializers(this, _step_extraInitializers), __runInitializers(this, _largeStep_initializers, 10));
        get largeStep() { return this.#largeStep_accessor_storage; }
        set largeStep(value) { this.#largeStep_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _largeStep_extraInitializers), __runInitializers(this, _disabled_initializers, false));
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
        #internalValue_accessor_storage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _private_internalValue_initializers, undefined));
        // ── Internal state ─────────────────────────────────────────────────
        get #internalValue() { return _private_internalValue_descriptor.get.call(this); }
        set #internalValue(value) { return _private_internalValue_descriptor.set.call(this, value); }
        #inputText_accessor_storage = (__runInitializers(this, _private_internalValue_extraInitializers), __runInitializers(this, _private_inputText_initializers, ""));
        get #inputText() { return _private_inputText_descriptor.get.call(this); }
        set #inputText(value) { return _private_inputText_descriptor.set.call(this, value); }
        // ── Computed getters ───────────────────────────────────────────────
        get #currentValue() {
            return this.value ?? this.#internalValue;
        }
        get #canDecrement() {
            const v = this.#currentValue;
            if (v === undefined)
                return true;
            return this.min === undefined || v > this.min;
        }
        get #canIncrement() {
            const v = this.#currentValue;
            if (v === undefined)
                return true;
            return this.max === undefined || v < this.max;
        }
        // ── Lifecycle ──────────────────────────────────────────────────────
        connectedCallback() {
            super.connectedCallback();
            if (this.value === undefined && this.defaultValue !== undefined) {
                this.#internalValue = this.#clamp(this.defaultValue);
            }
            this.#syncInputText();
        }
        willUpdate() {
            this.#syncInputText();
        }
        // ── Value helpers ──────────────────────────────────────────────────
        #syncInputText() {
            const v = this.#currentValue;
            this.#inputText = v !== undefined ? String(v) : "";
        }
        #clamp(val) {
            if (this.min !== undefined)
                val = Math.max(this.min, val);
            if (this.max !== undefined)
                val = Math.min(this.max, val);
            return val;
        }
        #setValue(val) {
            const clamped = this.#clamp(val);
            if (this.value === undefined) {
                this.#internalValue = clamped;
            }
            this.dispatchEvent(valueChangeEvent({ value: clamped }));
        }
        #increment = (__runInitializers(this, _private_inputText_extraInitializers), (amount) => {
            if (this.disabled || this.readOnly)
                return;
            const current = this.#currentValue ?? this.min ?? 0;
            this.#setValue(current + amount);
        });
        #decrement = (amount) => {
            if (this.disabled || this.readOnly)
                return;
            const current = this.#currentValue ?? this.max ?? 0;
            this.#setValue(current - amount);
        };
        #commitInput() {
            const parsed = parseFloat(this.#inputText);
            if (Number.isNaN(parsed)) {
                this.#syncInputText();
            }
            else {
                this.#setValue(parsed);
            }
            const v = this.#currentValue;
            if (v !== undefined) {
                this.dispatchEvent(valueCommittedEvent({ value: v }));
            }
        }
        // ── Event handlers ─────────────────────────────────────────────────
        #onInput = (e) => {
            this.#inputText = e.target.value;
        };
        #onBlur = () => {
            this.#commitInput();
        };
        #onKeyDown = (e) => {
            switch (e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    this.#increment(e.shiftKey ? this.largeStep : this.step);
                    this.#syncInputText();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    this.#decrement(e.shiftKey ? this.largeStep : this.step);
                    this.#syncInputText();
                    break;
                case "Home":
                    if (this.min !== undefined) {
                        e.preventDefault();
                        this.#setValue(this.min);
                    }
                    break;
                case "End":
                    if (this.max !== undefined) {
                        e.preventDefault();
                        this.#setValue(this.max);
                    }
                    break;
                case "Enter":
                    this.#commitInput();
                    break;
            }
        };
        #onDecrementClick = () => {
            this.#decrement(this.step);
            const v = this.#currentValue;
            if (v !== undefined) {
                this.dispatchEvent(valueCommittedEvent({ value: v }));
            }
        };
        #onIncrementClick = () => {
            this.#increment(this.step);
            const v = this.#currentValue;
            if (v !== undefined) {
                this.dispatchEvent(valueCommittedEvent({ value: v }));
            }
        };
        // ── Render ─────────────────────────────────────────────────────────
        render() {
            const currentValue = this.#currentValue;
            return html `
      <div
        part="root"
        ?data-disabled="${this.disabled}"
      >
        <button
          part="decrement"
          type="button"
          tabindex="-1"
          aria-label="Decrease"
          ?disabled="${this.disabled || this.readOnly || !this.#canDecrement}"
          @click="${this.#onDecrementClick}"
        >
          <slot name="decrement">&minus;</slot>
        </button>
        <input
          part="input"
          type="text"
          inputmode="decimal"
          .value="${live(this.#inputText)}"
          ?disabled="${this.disabled}"
          ?readonly="${this.readOnly}"
          ?required="${this.required}"
          @input="${this.#onInput}"
          @keydown="${this.#onKeyDown}"
          @blur="${this.#onBlur}"
        />
        <button
          part="increment"
          type="button"
          tabindex="-1"
          aria-label="Increase"
          ?disabled="${this.disabled || this.readOnly || !this.#canIncrement}"
          @click="${this.#onIncrementClick}"
        >
          <slot name="increment">+</slot>
        </button>
        ${this.name
                ? html `<input
              type="hidden"
              name="${this.name}"
              .value="${String(currentValue ?? "")}"
            />`
                : nothing}
      </div>
    `;
        }
    };
})();
export { DuiStepperPrimitive };
