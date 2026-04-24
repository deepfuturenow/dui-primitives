/** Ported from original DUI: deep-future-app/app/client/components/dui/slider */
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
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
export const valueChangeEvent = customEvent("value-change", { bubbles: true, composed: true });
export const valueCommittedEvent = customEvent("value-committed", { bubbles: true, composed: true });
const styles = css `
  :host {
    display: block;
  }

  [part="root"] {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    touch-action: none;
    user-select: none;
  }

  [part="root"][data-disabled] {
    pointer-events: none;
  }

  [part="label"] {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .slider-row {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  [part="track"] {
    position: relative;
    flex-grow: 1;
    overflow: hidden;
  }

  [part="indicator"] {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: var(--slider-progress, 0%);
  }

  [part="readout"] {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    font: inherit;
    color: inherit;
    pointer-events: none;
    z-index: 2;
  }

  [part="unit"] {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 2;
  }

  [part="thumb"] {
    position: absolute;
    left: var(--slider-progress, 0%);
    transform: translateX(-50%);
    cursor: grab;
    outline: none;
  }

  [part="root"][data-dragging] [part="thumb"] {
    cursor: grabbing;
  }

  /* Hidden native input for accessibility */
  .native-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
/**
 * A slider for selecting numeric values within a range.
 *
 * Supports pointer drag, keyboard navigation (arrows, Page Up/Down, Home/End),
 * a hidden native range input for accessibility, and an optional click-to-type
 * value readout (enabled via the `field` variant).
 */
let DuiSliderPrimitive = (() => {
    let _classSuper = LitElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _min_decorators;
    let _min_initializers = [];
    let _min_extraInitializers = [];
    let _max_decorators;
    let _max_initializers = [];
    let _max_extraInitializers = [];
    let _step_decorators;
    let _step_initializers = [];
    let _step_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _label_decorators;
    let _label_initializers = [];
    let _label_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _precision_decorators;
    let _precision_initializers = [];
    let _precision_extraInitializers = [];
    let _private_dragging_decorators;
    let _private_dragging_initializers = [];
    let _private_dragging_extraInitializers = [];
    let _private_dragging_descriptor;
    return class DuiSliderPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property({ type: Number })];
            _min_decorators = [property({ type: Number })];
            _max_decorators = [property({ type: Number })];
            _step_decorators = [property({ type: Number })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _name_decorators = [property()];
            _label_decorators = [property({ reflect: true })];
            _unit_decorators = [property({ reflect: true })];
            _precision_decorators = [property({ type: Number })];
            _private_dragging_decorators = [state()];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _min_decorators, { kind: "accessor", name: "min", static: false, private: false, access: { has: obj => "min" in obj, get: obj => obj.min, set: (obj, value) => { obj.min = value; } }, metadata: _metadata }, _min_initializers, _min_extraInitializers);
            __esDecorate(this, null, _max_decorators, { kind: "accessor", name: "max", static: false, private: false, access: { has: obj => "max" in obj, get: obj => obj.max, set: (obj, value) => { obj.max = value; } }, metadata: _metadata }, _max_initializers, _max_extraInitializers);
            __esDecorate(this, null, _step_decorators, { kind: "accessor", name: "step", static: false, private: false, access: { has: obj => "step" in obj, get: obj => obj.step, set: (obj, value) => { obj.step = value; } }, metadata: _metadata }, _step_initializers, _step_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(this, null, _label_decorators, { kind: "accessor", name: "label", static: false, private: false, access: { has: obj => "label" in obj, get: obj => obj.label, set: (obj, value) => { obj.label = value; } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
            __esDecorate(this, null, _unit_decorators, { kind: "accessor", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(this, null, _precision_decorators, { kind: "accessor", name: "precision", static: false, private: false, access: { has: obj => "precision" in obj, get: obj => obj.precision, set: (obj, value) => { obj.precision = value; } }, metadata: _metadata }, _precision_initializers, _precision_extraInitializers);
            __esDecorate(this, _private_dragging_descriptor = { get: __setFunctionName(function () { return this.#dragging_accessor_storage; }, "#dragging", "get"), set: __setFunctionName(function (value) { this.#dragging_accessor_storage = value; }, "#dragging", "set") }, _private_dragging_decorators, { kind: "accessor", name: "#dragging", static: false, private: true, access: { has: obj => #dragging in obj, get: obj => obj.#dragging, set: (obj, value) => { obj.#dragging = value; } }, metadata: _metadata }, _private_dragging_initializers, _private_dragging_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-slider";
        static formAssociated = true;
        static styles = [base, styles];
        #internals;
        constructor() {
            super();
            this.#internals = this.attachInternals();
        }
        #value_accessor_storage = __runInitializers(this, _value_initializers, 0);
        /** Current value. */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #min_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _min_initializers, 0));
        /** Minimum value. */
        get min() { return this.#min_accessor_storage; }
        set min(value) { this.#min_accessor_storage = value; }
        #max_accessor_storage = (__runInitializers(this, _min_extraInitializers), __runInitializers(this, _max_initializers, 100));
        /** Maximum value. */
        get max() { return this.#max_accessor_storage; }
        set max(value) { this.#max_accessor_storage = value; }
        #step_accessor_storage = (__runInitializers(this, _max_extraInitializers), __runInitializers(this, _step_initializers, 1));
        /** Step increment. */
        get step() { return this.#step_accessor_storage; }
        set step(value) { this.#step_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _step_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Whether the slider is disabled. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #name_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _name_initializers, ""));
        /** Name for form submission. */
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #label_accessor_storage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _label_initializers, ""));
        /** Label text displayed by the slider. */
        get label() { return this.#label_accessor_storage; }
        set label(value) { this.#label_accessor_storage = value; }
        #unit_accessor_storage = (__runInitializers(this, _label_extraInitializers), __runInitializers(this, _unit_initializers, ""));
        /** Unit suffix on the value readout (e.g. `m`, `°`, `%`). */
        get unit() { return this.#unit_accessor_storage; }
        set unit(value) { this.#unit_accessor_storage = value; }
        #precision_accessor_storage = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _precision_initializers, undefined));
        /** Decimal places for value readout. Auto-inferred from `step` if not set. */
        get precision() { return this.#precision_accessor_storage; }
        set precision(value) { this.#precision_accessor_storage = value; }
        willUpdate() {
            this.#internals.setFormValue(String(this.value));
        }
        #dragging_accessor_storage = (__runInitializers(this, _precision_extraInitializers), __runInitializers(this, _private_dragging_initializers, false));
        get #dragging() { return _private_dragging_descriptor.get.call(this); }
        set #dragging(value) { return _private_dragging_descriptor.set.call(this, value); }
        get #progress() {
            const range = this.max - this.min;
            if (range === 0)
                return 0;
            return ((this.value - this.min) / range) * 100;
        }
        get #inferredPrecision() {
            const stepStr = String(this.step);
            const dotIndex = stepStr.indexOf(".");
            if (dotIndex === -1)
                return 0;
            return stepStr.length - dotIndex - 1;
        }
        get #displayValue() {
            const p = this.precision ?? this.#inferredPrecision;
            return this.value.toFixed(p);
        }
        #clampValue(value) {
            const stepped = Math.round(value / this.step) * this.step;
            return Math.max(this.min, Math.min(this.max, stepped));
        }
        #getValueFromPosition(clientX) {
            const track = this.shadowRoot?.querySelector("[part='track']");
            if (!track)
                return this.value;
            const rect = track.getBoundingClientRect();
            const percentage = (clientX - rect.left) / rect.width;
            const rawValue = this.min + percentage * (this.max - this.min);
            return this.#clampValue(rawValue);
        }
        #onPointerDown = (__runInitializers(this, _private_dragging_extraInitializers), (event) => {
            if (this.disabled)
                return;
            event.preventDefault();
            const newValue = this.#getValueFromPosition(event.clientX);
            if (newValue !== this.value) {
                this.value = newValue;
                this.dispatchEvent(valueChangeEvent({ value: newValue }));
            }
            document.addEventListener("pointermove", this.#onPointerMove);
            document.addEventListener("pointerup", this.#onPointerUp);
        });
        #onPointerMove = (event) => {
            if (!this.#dragging)
                this.#dragging = true;
            const newValue = this.#getValueFromPosition(event.clientX);
            if (newValue !== this.value) {
                this.value = newValue;
                this.dispatchEvent(valueChangeEvent({ value: newValue }));
            }
        };
        #onPointerUp = () => {
            const wasDragging = this.#dragging;
            this.#dragging = false;
            document.removeEventListener("pointermove", this.#onPointerMove);
            document.removeEventListener("pointerup", this.#onPointerUp);
            this.dispatchEvent(valueCommittedEvent({ value: this.value }));
        };
        #onKeyDown = (event) => {
            if (this.disabled)
                return;
            let newValue = this.value;
            const largeStep = this.step * 10;
            switch (event.key) {
                case "ArrowRight":
                case "ArrowUp":
                    event.preventDefault();
                    newValue = this.#clampValue(this.value + this.step);
                    break;
                case "ArrowLeft":
                case "ArrowDown":
                    event.preventDefault();
                    newValue = this.#clampValue(this.value - this.step);
                    break;
                case "PageUp":
                    event.preventDefault();
                    newValue = this.#clampValue(this.value + largeStep);
                    break;
                case "PageDown":
                    event.preventDefault();
                    newValue = this.#clampValue(this.value - largeStep);
                    break;
                case "Home":
                    event.preventDefault();
                    newValue = this.min;
                    break;
                case "End":
                    event.preventDefault();
                    newValue = this.max;
                    break;
                default:
                    return;
            }
            if (newValue !== this.value) {
                this.value = newValue;
                this.dispatchEvent(valueChangeEvent({ value: newValue }));
                this.dispatchEvent(valueCommittedEvent({ value: newValue }));
            }
        };
        #onNativeInput = (event) => {
            const target = event.target;
            const newValue = parseFloat(target.value);
            if (!isNaN(newValue) && newValue !== this.value) {
                this.value = newValue;
                this.dispatchEvent(valueChangeEvent({ value: newValue }));
            }
        };
        #onNativeChange = () => {
            this.dispatchEvent(valueCommittedEvent({ value: this.value }));
        };
        disconnectedCallback() {
            super.disconnectedCallback();
            document.removeEventListener("pointermove", this.#onPointerMove);
            document.removeEventListener("pointerup", this.#onPointerUp);
        }
        render() {
            return html `
      <div
        part="root"
        role="group"
        ?data-disabled=${this.disabled}
        ?data-dragging=${this.#dragging}
        style="--slider-progress: ${this.#progress}%"
        @pointerdown=${this.#onPointerDown}
      >
        <span part="label">${this.label}</span>

        <div class="slider-row">
          <div part="track">
            <div part="indicator"></div>
            <span part="readout">${this.#displayValue}</span>
            <span part="unit">${this.unit}</span>
          </div>
          <div
            part="thumb"
            tabindex=${this.disabled ? -1 : 0}
            @keydown=${this.#onKeyDown}
          ></div>
        </div>

        <input
          class="native-input"
          type="range"
          name=${this.name}
          .value=${String(this.value)}
          min=${this.min}
          max=${this.max}
          step=${this.step}
          ?disabled=${this.disabled}
          aria-valuenow=${this.value}
          aria-valuemin=${this.min}
          aria-valuemax=${this.max}
          aria-label=${this.label || "Slider"}
          @input=${this.#onNativeInput}
          @change=${this.#onNativeChange}
        />
      </div>
    `;
        }
    };
})();
export { DuiSliderPrimitive };
