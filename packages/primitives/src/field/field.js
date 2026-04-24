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
/** Selector matching all DUI form controls that can be wired by a field. */
const CONTROL_SELECTOR = [
    "dui-input",
    "dui-textarea",
    "dui-select",
    "dui-checkbox",
    "dui-checkbox-group",
    "dui-radio",
    "dui-radio-group",
    "dui-switch",
    "dui-number-field",
    "dui-stepper",
    "dui-slider",
    "dui-combobox",
    "dui-dropzone",
].join(", ");
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
  }

  [part="root"][data-orientation="horizontal"] {
    flex-direction: row;
    align-items: start;
  }

  /* Hide wrapper parts when no content is slotted */
  [part="label"]:not([data-slotted]) { display: none; }
  [part="label"] { cursor: default; }
  [part="label"][data-disabled] { cursor: not-allowed; }

  [part="description"]:not([data-slotted]) { display: none; }

  [part="error"] { display: none; }
  [part="error"][data-invalid] { display: block; }
`;
/**
 * `<dui-field>` — Slot-based form field wrapper.
 *
 * Provides label, description, and error slots around a default-slotted
 * form control. Manages ARIA wiring, field state (dirty, touched, focused,
 * filled), disabled propagation, and label click-to-focus.
 *
 * @slot label - Label text (e.g. `<span slot="label">Email</span>`).
 * @slot - Default slot for the form control.
 * @slot description - Help text (e.g. `<span slot="description">…</span>`).
 * @slot error - Error message (e.g. `<span slot="error">Required</span>`).
 * @csspart root - The field container element.
 * @csspart label - The label wrapper.
 * @csspart description - The description wrapper.
 * @csspart error - The error wrapper (hidden unless invalid).
 */
let DuiFieldPrimitive = (() => {
    let _classSuper = LitElement;
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _invalid_decorators;
    let _invalid_initializers = [];
    let _invalid_extraInitializers = [];
    let _orientation_decorators;
    let _orientation_initializers = [];
    let _orientation_extraInitializers = [];
    let _private_dirty_decorators;
    let _private_dirty_initializers = [];
    let _private_dirty_extraInitializers = [];
    let _private_dirty_descriptor;
    let _private_touched_decorators;
    let _private_touched_initializers = [];
    let _private_touched_extraInitializers = [];
    let _private_touched_descriptor;
    let _private_focused_decorators;
    let _private_focused_initializers = [];
    let _private_focused_extraInitializers = [];
    let _private_focused_descriptor;
    let _private_filled_decorators;
    let _private_filled_initializers = [];
    let _private_filled_extraInitializers = [];
    let _private_filled_descriptor;
    let _private_hasLabel_decorators;
    let _private_hasLabel_initializers = [];
    let _private_hasLabel_extraInitializers = [];
    let _private_hasLabel_descriptor;
    let _private_hasDescription_decorators;
    let _private_hasDescription_initializers = [];
    let _private_hasDescription_extraInitializers = [];
    let _private_hasDescription_descriptor;
    let _private_hasError_decorators;
    let _private_hasError_initializers = [];
    let _private_hasError_extraInitializers = [];
    let _private_hasError_descriptor;
    return class DuiFieldPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _invalid_decorators = [property({ type: Boolean, reflect: true })];
            _orientation_decorators = [property()];
            _private_dirty_decorators = [state()];
            _private_touched_decorators = [state()];
            _private_focused_decorators = [state()];
            _private_filled_decorators = [state()];
            _private_hasLabel_decorators = [state()];
            _private_hasDescription_decorators = [state()];
            _private_hasError_decorators = [state()];
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _invalid_decorators, { kind: "accessor", name: "invalid", static: false, private: false, access: { has: obj => "invalid" in obj, get: obj => obj.invalid, set: (obj, value) => { obj.invalid = value; } }, metadata: _metadata }, _invalid_initializers, _invalid_extraInitializers);
            __esDecorate(this, null, _orientation_decorators, { kind: "accessor", name: "orientation", static: false, private: false, access: { has: obj => "orientation" in obj, get: obj => obj.orientation, set: (obj, value) => { obj.orientation = value; } }, metadata: _metadata }, _orientation_initializers, _orientation_extraInitializers);
            __esDecorate(this, _private_dirty_descriptor = { get: __setFunctionName(function () { return this.#dirty_accessor_storage; }, "#dirty", "get"), set: __setFunctionName(function (value) { this.#dirty_accessor_storage = value; }, "#dirty", "set") }, _private_dirty_decorators, { kind: "accessor", name: "#dirty", static: false, private: true, access: { has: obj => #dirty in obj, get: obj => obj.#dirty, set: (obj, value) => { obj.#dirty = value; } }, metadata: _metadata }, _private_dirty_initializers, _private_dirty_extraInitializers);
            __esDecorate(this, _private_touched_descriptor = { get: __setFunctionName(function () { return this.#touched_accessor_storage; }, "#touched", "get"), set: __setFunctionName(function (value) { this.#touched_accessor_storage = value; }, "#touched", "set") }, _private_touched_decorators, { kind: "accessor", name: "#touched", static: false, private: true, access: { has: obj => #touched in obj, get: obj => obj.#touched, set: (obj, value) => { obj.#touched = value; } }, metadata: _metadata }, _private_touched_initializers, _private_touched_extraInitializers);
            __esDecorate(this, _private_focused_descriptor = { get: __setFunctionName(function () { return this.#focused_accessor_storage; }, "#focused", "get"), set: __setFunctionName(function (value) { this.#focused_accessor_storage = value; }, "#focused", "set") }, _private_focused_decorators, { kind: "accessor", name: "#focused", static: false, private: true, access: { has: obj => #focused in obj, get: obj => obj.#focused, set: (obj, value) => { obj.#focused = value; } }, metadata: _metadata }, _private_focused_initializers, _private_focused_extraInitializers);
            __esDecorate(this, _private_filled_descriptor = { get: __setFunctionName(function () { return this.#filled_accessor_storage; }, "#filled", "get"), set: __setFunctionName(function (value) { this.#filled_accessor_storage = value; }, "#filled", "set") }, _private_filled_decorators, { kind: "accessor", name: "#filled", static: false, private: true, access: { has: obj => #filled in obj, get: obj => obj.#filled, set: (obj, value) => { obj.#filled = value; } }, metadata: _metadata }, _private_filled_initializers, _private_filled_extraInitializers);
            __esDecorate(this, _private_hasLabel_descriptor = { get: __setFunctionName(function () { return this.#hasLabel_accessor_storage; }, "#hasLabel", "get"), set: __setFunctionName(function (value) { this.#hasLabel_accessor_storage = value; }, "#hasLabel", "set") }, _private_hasLabel_decorators, { kind: "accessor", name: "#hasLabel", static: false, private: true, access: { has: obj => #hasLabel in obj, get: obj => obj.#hasLabel, set: (obj, value) => { obj.#hasLabel = value; } }, metadata: _metadata }, _private_hasLabel_initializers, _private_hasLabel_extraInitializers);
            __esDecorate(this, _private_hasDescription_descriptor = { get: __setFunctionName(function () { return this.#hasDescription_accessor_storage; }, "#hasDescription", "get"), set: __setFunctionName(function (value) { this.#hasDescription_accessor_storage = value; }, "#hasDescription", "set") }, _private_hasDescription_decorators, { kind: "accessor", name: "#hasDescription", static: false, private: true, access: { has: obj => #hasDescription in obj, get: obj => obj.#hasDescription, set: (obj, value) => { obj.#hasDescription = value; } }, metadata: _metadata }, _private_hasDescription_initializers, _private_hasDescription_extraInitializers);
            __esDecorate(this, _private_hasError_descriptor = { get: __setFunctionName(function () { return this.#hasError_accessor_storage; }, "#hasError", "get"), set: __setFunctionName(function (value) { this.#hasError_accessor_storage = value; }, "#hasError", "set") }, _private_hasError_decorators, { kind: "accessor", name: "#hasError", static: false, private: true, access: { has: obj => #hasError in obj, get: obj => obj.#hasError, set: (obj, value) => { obj.#hasError = value; } }, metadata: _metadata }, _private_hasError_initializers, _private_hasError_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-field";
        static styles = [base, styles];
        #disabled_accessor_storage = __runInitializers(this, _disabled_initializers, false);
        /** Whether the child control is disabled. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #invalid_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _invalid_initializers, false));
        /** Whether the field is in an invalid state. */
        get invalid() { return this.#invalid_accessor_storage; }
        set invalid(value) { this.#invalid_accessor_storage = value; }
        #orientation_accessor_storage = (__runInitializers(this, _invalid_extraInitializers), __runInitializers(this, _orientation_initializers, "vertical"));
        /** Layout direction: vertical (column) or horizontal (row). */
        get orientation() { return this.#orientation_accessor_storage; }
        set orientation(value) { this.#orientation_accessor_storage = value; }
        #dirty_accessor_storage = (__runInitializers(this, _orientation_extraInitializers), __runInitializers(this, _private_dirty_initializers, false));
        // --- Internal state ---
        get #dirty() { return _private_dirty_descriptor.get.call(this); }
        set #dirty(value) { return _private_dirty_descriptor.set.call(this, value); }
        #touched_accessor_storage = (__runInitializers(this, _private_dirty_extraInitializers), __runInitializers(this, _private_touched_initializers, false));
        get #touched() { return _private_touched_descriptor.get.call(this); }
        set #touched(value) { return _private_touched_descriptor.set.call(this, value); }
        #focused_accessor_storage = (__runInitializers(this, _private_touched_extraInitializers), __runInitializers(this, _private_focused_initializers, false));
        get #focused() { return _private_focused_descriptor.get.call(this); }
        set #focused(value) { return _private_focused_descriptor.set.call(this, value); }
        #filled_accessor_storage = (__runInitializers(this, _private_focused_extraInitializers), __runInitializers(this, _private_filled_initializers, false));
        get #filled() { return _private_filled_descriptor.get.call(this); }
        set #filled(value) { return _private_filled_descriptor.set.call(this, value); }
        #hasLabel_accessor_storage = (__runInitializers(this, _private_filled_extraInitializers), __runInitializers(this, _private_hasLabel_initializers, false));
        get #hasLabel() { return _private_hasLabel_descriptor.get.call(this); }
        set #hasLabel(value) { return _private_hasLabel_descriptor.set.call(this, value); }
        #hasDescription_accessor_storage = (__runInitializers(this, _private_hasLabel_extraInitializers), __runInitializers(this, _private_hasDescription_initializers, false));
        get #hasDescription() { return _private_hasDescription_descriptor.get.call(this); }
        set #hasDescription(value) { return _private_hasDescription_descriptor.set.call(this, value); }
        #hasError_accessor_storage = (__runInitializers(this, _private_hasDescription_extraInitializers), __runInitializers(this, _private_hasError_initializers, false));
        get #hasError() { return _private_hasError_descriptor.get.call(this); }
        set #hasError(value) { return _private_hasError_descriptor.set.call(this, value); }
        // --- Stable IDs ---
        #fieldId = (__runInitializers(this, _private_hasError_extraInitializers), crypto.randomUUID().slice(0, 8));
        get #labelId() {
            return `field-${this.#fieldId}-label`;
        }
        get #descriptionId() {
            return `field-${this.#fieldId}-desc`;
        }
        get #errorId() {
            return `field-${this.#fieldId}-error`;
        }
        // --- Control reference ---
        #control;
        #controlWasDisabled = false;
        // --- Lifecycle ---
        connectedCallback() {
            super.connectedCallback();
            this.addEventListener("focusin", this.#onFocusIn);
            this.addEventListener("focusout", this.#onFocusOut);
            this.addEventListener("input", this.#onInput);
            this.addEventListener("change", this.#onChange);
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.removeEventListener("focusin", this.#onFocusIn);
            this.removeEventListener("focusout", this.#onFocusOut);
            this.removeEventListener("input", this.#onInput);
            this.removeEventListener("change", this.#onChange);
        }
        willUpdate(changed) {
            if (changed.has("invalid") && this.#control) {
                this.#wireControl();
            }
            if (changed.has("disabled") && this.#control) {
                if (this.disabled) {
                    this.#controlWasDisabled = this.#control.hasAttribute("disabled");
                    this.#control.setAttribute("disabled", "");
                }
                else if (!this.#controlWasDisabled) {
                    this.#control.removeAttribute("disabled");
                }
            }
        }
        // --- Field state from DOM events ---
        #onFocusIn = () => {
            this.#focused = true;
        };
        #onFocusOut = () => {
            this.#focused = false;
            this.#touched = true;
        };
        #onInput = () => {
            this.#dirty = true;
            this.#filled = true;
        };
        #onChange = () => {
            this.#dirty = true;
        };
        // --- Slot change handlers ---
        #onControlSlotChange = () => {
            const slot = this.shadowRoot?.querySelector("slot:not([name])");
            const nodes = slot?.assignedElements({ flatten: true }) ?? [];
            this.#control = nodes.find((el) => el.matches(CONTROL_SELECTOR));
            if (this.#control) {
                this.#wireControl();
                if (this.disabled) {
                    this.#controlWasDisabled = this.#control.hasAttribute("disabled");
                    this.#control.setAttribute("disabled", "");
                }
            }
        };
        #onLabelSlotChange = (e) => {
            const slot = e.target;
            this.#hasLabel = slot.assignedNodes({ flatten: true }).length > 0;
        };
        #onDescriptionSlotChange = (e) => {
            const slot = e.target;
            this.#hasDescription = slot.assignedNodes({ flatten: true }).length > 0;
            this.#wireControl();
        };
        #onErrorSlotChange = (e) => {
            const slot = e.target;
            this.#hasError = slot.assignedNodes({ flatten: true }).length > 0;
            this.#wireControl();
        };
        // --- ARIA wiring ---
        #wireControl() {
            const ctrl = this.#control;
            if (!ctrl)
                return;
            // Build aria-describedby from present slots
            const parts = [];
            if (this.#hasDescription)
                parts.push(this.#descriptionId);
            if (this.invalid && this.#hasError)
                parts.push(this.#errorId);
            const describedBy = parts.join(" ") || null;
            if (describedBy)
                ctrl.setAttribute("aria-describedby", describedBy);
            else
                ctrl.removeAttribute("aria-describedby");
            ctrl.setAttribute("aria-invalid", String(this.invalid));
        }
        // --- Label click-to-focus ---
        #onLabelClick = () => {
            if (!this.disabled) {
                this.#control?.focus();
            }
        };
        // --- Render ---
        render() {
            return html `
      <div
        part="root"
        role="group"
        ?data-disabled="${this.disabled}"
        ?data-invalid="${this.invalid}"
        ?data-valid="${!this.invalid}"
        ?data-dirty="${this.#dirty}"
        ?data-touched="${this.#touched}"
        ?data-filled="${this.#filled}"
        ?data-focused="${this.#focused}"
        data-orientation="${this.orientation}"
      >
        <div
          part="label"
          id="${this.#labelId}"
          ?data-slotted="${this.#hasLabel}"
          ?data-disabled="${this.disabled}"
          @click="${this.#onLabelClick}"
        >
          <slot
            name="label"
            @slotchange="${this.#onLabelSlotChange}"
          ></slot>
        </div>
        <slot @slotchange="${this.#onControlSlotChange}"></slot>
        <div
          part="description"
          id="${this.#descriptionId}"
          ?data-slotted="${this.#hasDescription}"
        >
          <slot
            name="description"
            @slotchange="${this.#onDescriptionSlotChange}"
          ></slot>
        </div>
        <div
          part="error"
          id="${this.#errorId}"
          role="alert"
          ?data-invalid="${this.invalid}"
        >
          <slot
            name="error"
            @slotchange="${this.#onErrorSlotChange}"
          ></slot>
        </div>
      </div>
    `;
        }
    };
})();
export { DuiFieldPrimitive };
