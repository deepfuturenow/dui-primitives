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
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    box-sizing: border-box;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition-property: background, box-shadow, border-color, color, opacity;
  }

  [part="root"][data-scrub] {
    cursor: ew-resize;
  }

  [part="root"][data-disabled] {
    pointer-events: none;
  }

  [part="label"] {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  [part="label"][data-scrub] {
    cursor: ew-resize;
  }

  [part="icon"] {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  [part="input"] {
    box-sizing: border-box;
    outline: none;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    min-width: 0;
    flex: 1;
  }

  [part="input"][data-scrub] {
    cursor: ew-resize;
  }

  [part="input"]:disabled {
    cursor: not-allowed;
  }

  [part="unit"] {
    flex-shrink: 0;
    pointer-events: none;
  }

`;
/** Drag threshold in px before scrub starts. */
const DRAG_THRESHOLD = 3;
/**
 * `<dui-number-field>` — A numeric input with optional label, icon,
 * unit suffix, drag-to-scrub behavior, and precision formatting.
 *
 * For simple step-up/step-down with buttons, use `<dui-stepper>` instead.
 *
 * @csspart root - The outer container.
 * @csspart label - Label text element.
 * @csspart icon - Icon slot wrapper.
 * @csspart input - The text input element.
 * @csspart unit - Unit suffix element.
 * @fires value-change - Fired when value changes. Detail: { value: number }
 * @fires value-committed - Fired on pointerup (end of drag), blur, or Enter. Detail: { value: number }
 */
let DuiNumberFieldPrimitive = (() => {
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
    let _label_decorators;
    let _label_initializers = [];
    let _label_extraInitializers = [];
    let _labelPosition_decorators;
    let _labelPosition_initializers = [];
    let _labelPosition_extraInitializers = [];
    let _iconPosition_decorators;
    let _iconPosition_initializers = [];
    let _iconPosition_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _precision_decorators;
    let _precision_initializers = [];
    let _precision_extraInitializers = [];
    let _scrubLabel_decorators;
    let _scrubLabel_initializers = [];
    let _scrubLabel_extraInitializers = [];
    let _scrubValue_decorators;
    let _scrubValue_initializers = [];
    let _scrubValue_extraInitializers = [];
    let _scrubField_decorators;
    let _scrubField_initializers = [];
    let _scrubField_extraInitializers = [];
    let _clickLabel_decorators;
    let _clickLabel_initializers = [];
    let _clickLabel_extraInitializers = [];
    let _clickValue_decorators;
    let _clickValue_initializers = [];
    let _clickValue_extraInitializers = [];
    let _clickField_decorators;
    let _clickField_initializers = [];
    let _clickField_extraInitializers = [];
    let _private_internalValue_decorators;
    let _private_internalValue_initializers = [];
    let _private_internalValue_extraInitializers = [];
    let _private_internalValue_descriptor;
    let _private_inputText_decorators;
    let _private_inputText_initializers = [];
    let _private_inputText_extraInitializers = [];
    let _private_inputText_descriptor;
    let _private_dragging_decorators;
    let _private_dragging_initializers = [];
    let _private_dragging_extraInitializers = [];
    let _private_dragging_descriptor;
    let _private_editing_decorators;
    let _private_editing_initializers = [];
    let _private_editing_extraInitializers = [];
    let _private_editing_descriptor;
    return class DuiNumberFieldPrimitive extends _classSuper {
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
            _label_decorators = [property({ reflect: true })];
            _labelPosition_decorators = [property({ reflect: true, attribute: "label-position" })];
            _iconPosition_decorators = [property({ reflect: true, attribute: "icon-position" })];
            _unit_decorators = [property({ reflect: true })];
            _precision_decorators = [property({ type: Number })];
            _scrubLabel_decorators = [property({ type: Boolean, reflect: true, attribute: "scrub-label" })];
            _scrubValue_decorators = [property({ type: Boolean, reflect: true, attribute: "scrub-value" })];
            _scrubField_decorators = [property({ type: Boolean, reflect: true, attribute: "scrub-field" })];
            _clickLabel_decorators = [property({ type: Boolean, reflect: true, attribute: "click-label" })];
            _clickValue_decorators = [property({ type: Boolean, reflect: true, attribute: "click-value" })];
            _clickField_decorators = [property({ type: Boolean, reflect: true, attribute: "click-field" })];
            _private_internalValue_decorators = [state()];
            _private_inputText_decorators = [state()];
            _private_dragging_decorators = [state()];
            _private_editing_decorators = [state()];
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
            __esDecorate(this, null, _label_decorators, { kind: "accessor", name: "label", static: false, private: false, access: { has: obj => "label" in obj, get: obj => obj.label, set: (obj, value) => { obj.label = value; } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
            __esDecorate(this, null, _labelPosition_decorators, { kind: "accessor", name: "labelPosition", static: false, private: false, access: { has: obj => "labelPosition" in obj, get: obj => obj.labelPosition, set: (obj, value) => { obj.labelPosition = value; } }, metadata: _metadata }, _labelPosition_initializers, _labelPosition_extraInitializers);
            __esDecorate(this, null, _iconPosition_decorators, { kind: "accessor", name: "iconPosition", static: false, private: false, access: { has: obj => "iconPosition" in obj, get: obj => obj.iconPosition, set: (obj, value) => { obj.iconPosition = value; } }, metadata: _metadata }, _iconPosition_initializers, _iconPosition_extraInitializers);
            __esDecorate(this, null, _unit_decorators, { kind: "accessor", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(this, null, _precision_decorators, { kind: "accessor", name: "precision", static: false, private: false, access: { has: obj => "precision" in obj, get: obj => obj.precision, set: (obj, value) => { obj.precision = value; } }, metadata: _metadata }, _precision_initializers, _precision_extraInitializers);
            __esDecorate(this, null, _scrubLabel_decorators, { kind: "accessor", name: "scrubLabel", static: false, private: false, access: { has: obj => "scrubLabel" in obj, get: obj => obj.scrubLabel, set: (obj, value) => { obj.scrubLabel = value; } }, metadata: _metadata }, _scrubLabel_initializers, _scrubLabel_extraInitializers);
            __esDecorate(this, null, _scrubValue_decorators, { kind: "accessor", name: "scrubValue", static: false, private: false, access: { has: obj => "scrubValue" in obj, get: obj => obj.scrubValue, set: (obj, value) => { obj.scrubValue = value; } }, metadata: _metadata }, _scrubValue_initializers, _scrubValue_extraInitializers);
            __esDecorate(this, null, _scrubField_decorators, { kind: "accessor", name: "scrubField", static: false, private: false, access: { has: obj => "scrubField" in obj, get: obj => obj.scrubField, set: (obj, value) => { obj.scrubField = value; } }, metadata: _metadata }, _scrubField_initializers, _scrubField_extraInitializers);
            __esDecorate(this, null, _clickLabel_decorators, { kind: "accessor", name: "clickLabel", static: false, private: false, access: { has: obj => "clickLabel" in obj, get: obj => obj.clickLabel, set: (obj, value) => { obj.clickLabel = value; } }, metadata: _metadata }, _clickLabel_initializers, _clickLabel_extraInitializers);
            __esDecorate(this, null, _clickValue_decorators, { kind: "accessor", name: "clickValue", static: false, private: false, access: { has: obj => "clickValue" in obj, get: obj => obj.clickValue, set: (obj, value) => { obj.clickValue = value; } }, metadata: _metadata }, _clickValue_initializers, _clickValue_extraInitializers);
            __esDecorate(this, null, _clickField_decorators, { kind: "accessor", name: "clickField", static: false, private: false, access: { has: obj => "clickField" in obj, get: obj => obj.clickField, set: (obj, value) => { obj.clickField = value; } }, metadata: _metadata }, _clickField_initializers, _clickField_extraInitializers);
            __esDecorate(this, _private_internalValue_descriptor = { get: __setFunctionName(function () { return this.#internalValue_accessor_storage; }, "#internalValue", "get"), set: __setFunctionName(function (value) { this.#internalValue_accessor_storage = value; }, "#internalValue", "set") }, _private_internalValue_decorators, { kind: "accessor", name: "#internalValue", static: false, private: true, access: { has: obj => #internalValue in obj, get: obj => obj.#internalValue, set: (obj, value) => { obj.#internalValue = value; } }, metadata: _metadata }, _private_internalValue_initializers, _private_internalValue_extraInitializers);
            __esDecorate(this, _private_inputText_descriptor = { get: __setFunctionName(function () { return this.#inputText_accessor_storage; }, "#inputText", "get"), set: __setFunctionName(function (value) { this.#inputText_accessor_storage = value; }, "#inputText", "set") }, _private_inputText_decorators, { kind: "accessor", name: "#inputText", static: false, private: true, access: { has: obj => #inputText in obj, get: obj => obj.#inputText, set: (obj, value) => { obj.#inputText = value; } }, metadata: _metadata }, _private_inputText_initializers, _private_inputText_extraInitializers);
            __esDecorate(this, _private_dragging_descriptor = { get: __setFunctionName(function () { return this.#dragging_accessor_storage; }, "#dragging", "get"), set: __setFunctionName(function (value) { this.#dragging_accessor_storage = value; }, "#dragging", "set") }, _private_dragging_decorators, { kind: "accessor", name: "#dragging", static: false, private: true, access: { has: obj => #dragging in obj, get: obj => obj.#dragging, set: (obj, value) => { obj.#dragging = value; } }, metadata: _metadata }, _private_dragging_initializers, _private_dragging_extraInitializers);
            __esDecorate(this, _private_editing_descriptor = { get: __setFunctionName(function () { return this.#editing_accessor_storage; }, "#editing", "get"), set: __setFunctionName(function (value) { this.#editing_accessor_storage = value; }, "#editing", "set") }, _private_editing_decorators, { kind: "accessor", name: "#editing", static: false, private: true, access: { has: obj => #editing in obj, get: obj => obj.#editing, set: (obj, value) => { obj.#editing = value; } }, metadata: _metadata }, _private_editing_initializers, _private_editing_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-number-field";
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
        #value_accessor_storage = __runInitializers(this, _value_initializers, undefined);
        // ── Core properties ────────────────────────────────────────────────
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
        #label_accessor_storage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _label_initializers, ""));
        // ── Display properties ─────────────────────────────────────────────
        get label() { return this.#label_accessor_storage; }
        set label(value) { this.#label_accessor_storage = value; }
        #labelPosition_accessor_storage = (__runInitializers(this, _label_extraInitializers), __runInitializers(this, _labelPosition_initializers, ""));
        get labelPosition() { return this.#labelPosition_accessor_storage; }
        set labelPosition(value) { this.#labelPosition_accessor_storage = value; }
        #iconPosition_accessor_storage = (__runInitializers(this, _labelPosition_extraInitializers), __runInitializers(this, _iconPosition_initializers, ""));
        get iconPosition() { return this.#iconPosition_accessor_storage; }
        set iconPosition(value) { this.#iconPosition_accessor_storage = value; }
        #unit_accessor_storage = (__runInitializers(this, _iconPosition_extraInitializers), __runInitializers(this, _unit_initializers, ""));
        get unit() { return this.#unit_accessor_storage; }
        set unit(value) { this.#unit_accessor_storage = value; }
        #precision_accessor_storage = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _precision_initializers, undefined));
        get precision() { return this.#precision_accessor_storage; }
        set precision(value) { this.#precision_accessor_storage = value; }
        #scrubLabel_accessor_storage = (__runInitializers(this, _precision_extraInitializers), __runInitializers(this, _scrubLabel_initializers, false));
        // ── Interaction zone booleans ──────────────────────────────────────
        get scrubLabel() { return this.#scrubLabel_accessor_storage; }
        set scrubLabel(value) { this.#scrubLabel_accessor_storage = value; }
        #scrubValue_accessor_storage = (__runInitializers(this, _scrubLabel_extraInitializers), __runInitializers(this, _scrubValue_initializers, false));
        get scrubValue() { return this.#scrubValue_accessor_storage; }
        set scrubValue(value) { this.#scrubValue_accessor_storage = value; }
        #scrubField_accessor_storage = (__runInitializers(this, _scrubValue_extraInitializers), __runInitializers(this, _scrubField_initializers, false));
        get scrubField() { return this.#scrubField_accessor_storage; }
        set scrubField(value) { this.#scrubField_accessor_storage = value; }
        #clickLabel_accessor_storage = (__runInitializers(this, _scrubField_extraInitializers), __runInitializers(this, _clickLabel_initializers, false));
        get clickLabel() { return this.#clickLabel_accessor_storage; }
        set clickLabel(value) { this.#clickLabel_accessor_storage = value; }
        #clickValue_accessor_storage = (__runInitializers(this, _clickLabel_extraInitializers), __runInitializers(this, _clickValue_initializers, false));
        get clickValue() { return this.#clickValue_accessor_storage; }
        set clickValue(value) { this.#clickValue_accessor_storage = value; }
        #clickField_accessor_storage = (__runInitializers(this, _clickValue_extraInitializers), __runInitializers(this, _clickField_initializers, false));
        get clickField() { return this.#clickField_accessor_storage; }
        set clickField(value) { this.#clickField_accessor_storage = value; }
        #internalValue_accessor_storage = (__runInitializers(this, _clickField_extraInitializers), __runInitializers(this, _private_internalValue_initializers, undefined));
        // ── Internal state ─────────────────────────────────────────────────
        get #internalValue() { return _private_internalValue_descriptor.get.call(this); }
        set #internalValue(value) { return _private_internalValue_descriptor.set.call(this, value); }
        #inputText_accessor_storage = (__runInitializers(this, _private_internalValue_extraInitializers), __runInitializers(this, _private_inputText_initializers, ""));
        get #inputText() { return _private_inputText_descriptor.get.call(this); }
        set #inputText(value) { return _private_inputText_descriptor.set.call(this, value); }
        #dragging_accessor_storage = (__runInitializers(this, _private_inputText_extraInitializers), __runInitializers(this, _private_dragging_initializers, false));
        get #dragging() { return _private_dragging_descriptor.get.call(this); }
        set #dragging(value) { return _private_dragging_descriptor.set.call(this, value); }
        #editing_accessor_storage = (__runInitializers(this, _private_dragging_extraInitializers), __runInitializers(this, _private_editing_initializers, false));
        get #editing() { return _private_editing_descriptor.get.call(this); }
        set #editing(value) { return _private_editing_descriptor.set.call(this, value); }
        // ── Drag state (not reactive) ──────────────────────────────────────
        #dragStartX = (__runInitializers(this, _private_editing_extraInitializers), 0);
        #dragStartValue = 0;
        #dragStarted = false;
        #dragPointerId = null;
        #dragZoneAllowsClick = false;
        // ── Computed getters ───────────────────────────────────────────────
        get #currentValue() {
            return this.value ?? this.#internalValue;
        }
        get #inferredPrecision() {
            const stepStr = String(this.step);
            const dotIndex = stepStr.indexOf(".");
            if (dotIndex === -1)
                return 0;
            return stepStr.length - dotIndex - 1;
        }
        get #displayValue() {
            const v = this.#currentValue;
            if (v === undefined)
                return "";
            const p = this.precision ?? this.#inferredPrecision;
            return v.toFixed(p);
        }
        /** Whether any interaction boolean is explicitly set by the consumer. */
        get #hasExplicitInteraction() {
            return (this.scrubLabel ||
                this.scrubValue ||
                this.scrubField ||
                this.clickLabel ||
                this.clickValue ||
                this.clickField);
        }
        /** Effective scrub-label: explicit or default. */
        get #effectiveScrubLabel() {
            if (this.#hasExplicitInteraction)
                return this.scrubLabel;
            // Default: scrub on label when a label is present
            return this.label !== "";
        }
        /** Effective scrub-value: explicit or default. */
        get #effectiveScrubValue() {
            if (this.#hasExplicitInteraction)
                return this.scrubValue;
            return false;
        }
        /** Effective scrub-field: explicit or default. */
        get #effectiveScrubField() {
            if (this.#hasExplicitInteraction)
                return this.scrubField;
            // Default: scrub on field when no label
            return this.label === "";
        }
        /** Effective click-label: explicit or default. */
        get #effectiveClickLabel() {
            if (this.#hasExplicitInteraction)
                return this.clickLabel;
            return false;
        }
        /** Effective click-value: explicit or default. */
        get #effectiveClickValue() {
            if (this.#hasExplicitInteraction)
                return this.clickValue;
            return true;
        }
        /** Effective click-field: explicit or default. */
        get #effectiveClickField() {
            if (this.#hasExplicitInteraction)
                return this.clickField;
            return false;
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
            if (!this.#editing) {
                this.#syncInputText();
            }
            this.#internals.setFormValue(this.#currentValue !== undefined ? String(this.#currentValue) : null);
        }
        // ── Value helpers ──────────────────────────────────────────────────
        #syncInputText() {
            this.#inputText = this.#displayValue;
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
        #increment = (amount) => {
            if (this.disabled || this.readOnly)
                return;
            const current = this.#currentValue ?? this.min ?? 0;
            this.#setValue(current + amount);
        };
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
            this.#editing = false;
            const v = this.#currentValue;
            if (v !== undefined) {
                this.dispatchEvent(valueCommittedEvent({ value: v }));
            }
        }
        #focusInputAndSelectAll() {
            const input = this.shadowRoot?.querySelector('[part="input"]');
            if (input) {
                this.#editing = true;
                input.focus();
                input.select();
            }
        }
        // ── Drag-to-scrub ─────────────────────────────────────────────────
        #startDrag(e, allowsClick) {
            if (this.disabled || this.readOnly)
                return;
            this.#dragPointerId = e.pointerId;
            this.#dragStartX = e.clientX;
            this.#dragStartValue = this.#currentValue ?? 0;
            this.#dragStarted = false;
            this.#dragZoneAllowsClick = allowsClick;
            this.setPointerCapture(e.pointerId);
            this.addEventListener("pointermove", this.#onPointerMove);
            this.addEventListener("pointerup", this.#onPointerUp);
            this.addEventListener("pointercancel", this.#onPointerUp);
        }
        #onPointerMove = (e) => {
            if (e.pointerId !== this.#dragPointerId)
                return;
            const deltaX = e.clientX - this.#dragStartX;
            if (!this.#dragStarted) {
                if (Math.abs(deltaX) < DRAG_THRESHOLD)
                    return;
                this.#dragStarted = true;
                this.#dragging = true;
            }
            let sensitivity = this.step;
            if (e.shiftKey) {
                sensitivity = this.step * 0.1;
            }
            else if (e.ctrlKey || e.metaKey) {
                sensitivity = this.largeStep;
            }
            const newValue = this.#dragStartValue + deltaX * sensitivity;
            this.#setValue(newValue);
        };
        #onPointerUp = (e) => {
            if (e.pointerId !== this.#dragPointerId)
                return;
            this.releasePointerCapture(e.pointerId);
            this.removeEventListener("pointermove", this.#onPointerMove);
            this.removeEventListener("pointerup", this.#onPointerUp);
            this.removeEventListener("pointercancel", this.#onPointerUp);
            if (this.#dragStarted) {
                this.#dragging = false;
                const v = this.#currentValue;
                if (v !== undefined) {
                    this.dispatchEvent(valueCommittedEvent({ value: v }));
                }
            }
            else if (this.#dragZoneAllowsClick) {
                this.#focusInputAndSelectAll();
            }
            this.#dragPointerId = null;
        };
        // ── Zone pointer handlers ──────────────────────────────────────────
        #onLabelPointerDown = (e) => {
            if (e.button !== 0)
                return;
            // Field-wide flags apply to all zones
            const allowsScrub = this.#effectiveScrubLabel || this.#effectiveScrubField;
            const allowsClick = this.#effectiveClickLabel || this.#effectiveClickField;
            if (allowsScrub && allowsClick) {
                e.preventDefault();
                this.#startDrag(e, true);
            }
            else if (allowsScrub) {
                e.preventDefault();
                this.#startDrag(e, false);
            }
            else if (allowsClick) {
                e.preventDefault();
                this.#focusInputAndSelectAll();
            }
        };
        #onInputPointerDown = (e) => {
            if (e.button !== 0)
                return;
            // Field-wide flags apply to all zones
            const allowsScrub = this.#effectiveScrubValue || this.#effectiveScrubField;
            const allowsClick = this.#effectiveClickValue || this.#effectiveClickField;
            if (allowsScrub && allowsClick) {
                e.preventDefault();
                this.#startDrag(e, true);
            }
            else if (allowsScrub) {
                e.preventDefault();
                this.#startDrag(e, false);
            }
            else if (allowsClick) {
                this.#editing = true;
            }
        };
        #onRootPointerDown = (e) => {
            if (e.button !== 0)
                return;
            // Root handler only fires for clicks on the root background itself
            const rootEl = this.shadowRoot?.querySelector('[part="root"]');
            if (e.target !== rootEl)
                return;
            const allowsScrub = this.#effectiveScrubField;
            const allowsClick = this.#effectiveClickField;
            if (allowsScrub && allowsClick) {
                e.preventDefault();
                this.#startDrag(e, true);
            }
            else if (allowsScrub) {
                e.preventDefault();
                this.#startDrag(e, false);
            }
            else if (allowsClick) {
                e.preventDefault();
                this.#focusInputAndSelectAll();
            }
        };
        // ── Input event handlers ───────────────────────────────────────────
        #onInput = (e) => {
            this.#inputText = e.target.value;
        };
        #onBlur = () => {
            if (this.#editing) {
                this.#commitInput();
            }
        };
        #onFocus = () => {
            this.#editing = true;
            const input = this.shadowRoot?.querySelector('[part="input"]');
            if (input) {
                requestAnimationFrame(() => input.select());
            }
        };
        #onKeyDown = (e) => {
            switch (e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.#increment(this.step * 0.1);
                    }
                    else if (e.ctrlKey || e.metaKey) {
                        this.#increment(this.largeStep);
                    }
                    else {
                        this.#increment(this.step);
                    }
                    this.#syncInputText();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.#decrement(this.step * 0.1);
                    }
                    else if (e.ctrlKey || e.metaKey) {
                        this.#decrement(this.largeStep);
                    }
                    else {
                        this.#decrement(this.step);
                    }
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
                case "Escape": {
                    this.#editing = false;
                    this.#syncInputText();
                    const input = this.shadowRoot?.querySelector('[part="input"]');
                    if (input)
                        input.blur();
                    break;
                }
            }
        };
        // ── Render ─────────────────────────────────────────────────────────
        render() {
            const currentValue = this.#currentValue;
            // Compute which zones are scrubbable for cursor styling
            const labelScrub = this.#effectiveScrubLabel || this.#effectiveScrubField;
            const inputScrub = this.#effectiveScrubValue || this.#effectiveScrubField;
            const rootScrub = this.#effectiveScrubField;
            return html `
      <span
        part="label"
        ?data-scrub="${labelScrub}"
        @pointerdown="${this.#onLabelPointerDown}"
      >${this.label}</span>

      <div
        part="root"
        ?data-scrub="${rootScrub}"
        ?data-dragging="${this.#dragging}"
        ?data-disabled="${this.disabled}"
        ?data-readonly="${this.readOnly}"
        @pointerdown="${this.#onRootPointerDown}"
      >
        <span part="icon">
          <slot name="icon"></slot>
        </span>

        <input
          part="input"
          type="text"
          inputmode="decimal"
          ?data-scrub="${inputScrub}"
          .value="${live(this.#inputText)}"
          ?disabled="${this.disabled}"
          ?readonly="${this.readOnly}"
          ?required="${this.required}"
          aria-label="${this.label || nothing}"
          aria-valuenow="${currentValue ?? nothing}"
          aria-valuemin="${this.min ?? nothing}"
          aria-valuemax="${this.max ?? nothing}"
          @pointerdown="${this.#onInputPointerDown}"
          @input="${this.#onInput}"
          @keydown="${this.#onKeyDown}"
          @focus="${this.#onFocus}"
          @blur="${this.#onBlur}"
        />

        <span part="unit">${this.unit}</span>

      </div>
    `;
        }
    };
})();
export { DuiNumberFieldPrimitive };
