/** Ported from original DUI: deep-future-app/app/client/components/dui/combobox */
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
import { repeat } from "lit/directives/repeat.js";
import { live } from "lit/directives/live.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { FloatingPortalController } from "@dui/core/floating-portal-controller";
export const valueChangeEvent = customEvent("value-change", { bubbles: true, composed: true });
export const valuesChangeEvent = customEvent("values-change", { bubbles: true, composed: true });
const hostStyles = css `
  :host {
    display: block;
  }
`;
const componentStyles = css `
  /* ---- Input area (structural) ---- */

  .Chips {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    cursor: text;
  }

  .Chips[data-disabled] {
    cursor: not-allowed;
  }

  .InputWrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .Input {
    box-sizing: border-box;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    min-width: 4rem;
    flex: 1;
  }

  .Input:disabled {
    cursor: not-allowed;
  }

  .Arrow {
    position: absolute;
    pointer-events: none;
    flex-shrink: 0;
  }

  .Chip {
    display: inline-flex;
    align-items: center;
    cursor: default;
    max-width: 100%;
    overflow: hidden;
  }

  .ChipLabel {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ChipRemove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    flex-shrink: 0;
  }
`;
/** Structural styles injected into the portal positioner. */
const portalPopupStyles = [
    css `
    .Popup {
      opacity: 1;
      transform: translateY(0);
      transition-property: opacity, transform;
      pointer-events: auto;
    }

    .Popup[data-starting-style],
    .Popup[data-ending-style] {
      opacity: 0;
    }

    dui-scroll-area {
      max-height: 240px;
      height: auto;
    }

    .Item {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .ItemIndicator {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ItemText {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
];
/**
 * `<dui-combobox>` — A searchable dropdown for selecting from a list of options.
 * Supports single-select and multi-select (chip) modes.
 *
 * @fires value-change - Single-select: fired when selection changes.
 *   Detail: { value: string, option: SelectOption }
 * @fires values-change - Multi-select: fired when a value is toggled.
 *   Detail: { value: string, selected: boolean, values: Set<string> }
 */
let DuiComboboxPrimitive = (() => {
    let _classSuper = LitElement;
    let _options_decorators;
    let _options_initializers = [];
    let _options_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _values_decorators;
    let _values_initializers = [];
    let _values_extraInitializers = [];
    let _multiple_decorators;
    let _multiple_initializers = [];
    let _multiple_extraInitializers = [];
    let _placeholder_decorators;
    let _placeholder_initializers = [];
    let _placeholder_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _private_highlightedIndex_decorators;
    let _private_highlightedIndex_initializers = [];
    let _private_highlightedIndex_extraInitializers = [];
    let _private_highlightedIndex_descriptor;
    let _private_inputValue_decorators;
    let _private_inputValue_initializers = [];
    let _private_inputValue_extraInitializers = [];
    let _private_inputValue_descriptor;
    return class DuiComboboxPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _options_decorators = [property({ attribute: false })];
            _value_decorators = [property({ type: String })];
            _values_decorators = [property({ attribute: false })];
            _multiple_decorators = [property({ type: Boolean, reflect: true })];
            _placeholder_decorators = [property({ type: String })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _name_decorators = [property({ type: String })];
            _private_highlightedIndex_decorators = [state()];
            _private_inputValue_decorators = [state()];
            __esDecorate(this, null, _options_decorators, { kind: "accessor", name: "options", static: false, private: false, access: { has: obj => "options" in obj, get: obj => obj.options, set: (obj, value) => { obj.options = value; } }, metadata: _metadata }, _options_initializers, _options_extraInitializers);
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _values_decorators, { kind: "accessor", name: "values", static: false, private: false, access: { has: obj => "values" in obj, get: obj => obj.values, set: (obj, value) => { obj.values = value; } }, metadata: _metadata }, _values_initializers, _values_extraInitializers);
            __esDecorate(this, null, _multiple_decorators, { kind: "accessor", name: "multiple", static: false, private: false, access: { has: obj => "multiple" in obj, get: obj => obj.multiple, set: (obj, value) => { obj.multiple = value; } }, metadata: _metadata }, _multiple_initializers, _multiple_extraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } }, metadata: _metadata }, _placeholder_initializers, _placeholder_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(this, _private_highlightedIndex_descriptor = { get: __setFunctionName(function () { return this.#highlightedIndex_accessor_storage; }, "#highlightedIndex", "get"), set: __setFunctionName(function (value) { this.#highlightedIndex_accessor_storage = value; }, "#highlightedIndex", "set") }, _private_highlightedIndex_decorators, { kind: "accessor", name: "#highlightedIndex", static: false, private: true, access: { has: obj => #highlightedIndex in obj, get: obj => obj.#highlightedIndex, set: (obj, value) => { obj.#highlightedIndex = value; } }, metadata: _metadata }, _private_highlightedIndex_initializers, _private_highlightedIndex_extraInitializers);
            __esDecorate(this, _private_inputValue_descriptor = { get: __setFunctionName(function () { return this.#inputValue_accessor_storage; }, "#inputValue", "get"), set: __setFunctionName(function (value) { this.#inputValue_accessor_storage = value; }, "#inputValue", "set") }, _private_inputValue_decorators, { kind: "accessor", name: "#inputValue", static: false, private: true, access: { has: obj => #inputValue in obj, get: obj => obj.#inputValue, set: (obj, value) => { obj.#inputValue = value; } }, metadata: _metadata }, _private_inputValue_initializers, _private_inputValue_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-combobox";
        static formAssociated = true;
        static styles = [base, hostStyles, componentStyles];
        #internals;
        constructor() {
            super();
            this.#internals = this.attachInternals();
        }
        #options_accessor_storage = __runInitializers(this, _options_initializers, []);
        /** The available options. */
        get options() { return this.#options_accessor_storage; }
        set options(value) { this.#options_accessor_storage = value; }
        #value_accessor_storage = (__runInitializers(this, _options_extraInitializers), __runInitializers(this, _value_initializers, ""));
        /** Currently selected value (single-select mode). */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #values_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _values_initializers, new Set()));
        /** Currently selected values (multi-select mode). */
        get values() { return this.#values_accessor_storage; }
        set values(value) { this.#values_accessor_storage = value; }
        #multiple_accessor_storage = (__runInitializers(this, _values_extraInitializers), __runInitializers(this, _multiple_initializers, false));
        /** Enable multi-select mode with chips. */
        get multiple() { return this.#multiple_accessor_storage; }
        set multiple(value) { this.#multiple_accessor_storage = value; }
        #placeholder_accessor_storage = (__runInitializers(this, _multiple_extraInitializers), __runInitializers(this, _placeholder_initializers, "Search..."));
        /** Placeholder text for the input. */
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _placeholder_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Whether the combobox is disabled. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #name_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _name_initializers, ""));
        /** Name for form submission. */
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        willUpdate() {
            this.#syncFormValue();
        }
        #syncFormValue() {
            if (this.multiple) {
                const formData = new FormData();
                for (const v of this.values) {
                    formData.append(this.name || "values", v);
                }
                this.#internals.setFormValue(formData);
            }
            else {
                this.#internals.setFormValue(this.value || null);
            }
        }
        #highlightedIndex_accessor_storage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _private_highlightedIndex_initializers, -1));
        get #highlightedIndex() { return _private_highlightedIndex_descriptor.get.call(this); }
        set #highlightedIndex(value) { return _private_highlightedIndex_descriptor.set.call(this, value); }
        #inputValue_accessor_storage = (__runInitializers(this, _private_highlightedIndex_extraInitializers), __runInitializers(this, _private_inputValue_initializers, ""));
        get #inputValue() { return _private_inputValue_descriptor.get.call(this); }
        set #inputValue(value) { return _private_inputValue_descriptor.set.call(this, value); }
        #popup = (__runInitializers(this, _private_inputValue_extraInitializers), new FloatingPortalController(this, {
            getAnchor: () => this.multiple
                ? this.shadowRoot?.querySelector(".Chips")
                : this.shadowRoot?.querySelector(".InputWrapper"),
            styles: portalPopupStyles,
            onOpen: () => {
                this.#highlightedIndex = -1;
                if (!this.multiple) {
                    this.#inputValue = "";
                    const input = this.shadowRoot?.querySelector(".Input");
                    if (input)
                        input.value = "";
                }
            },
            onClose: () => {
                this.#highlightedIndex = -1;
                if (!this.multiple) {
                    const selected = this.options.find((o) => o.value === this.value);
                    this.#inputValue = selected?.label ?? "";
                }
            },
            renderPopup: (portal) => {
                const filtered = this.#filteredOptions;
                const isEmpty = filtered.length === 0;
                return html `
        <div
          class="Popup"
          ?data-starting-style="${portal.isStarting}"
          ?data-ending-style="${portal.isEnding}"
        >
          <dui-scroll-area>
            <div
              class="List"
              id="${this.#listId}"
              role="listbox"
              aria-labelledby="${this.#inputId}"
              ?data-empty="${isEmpty}"
              @mousedown="${this.#onListMouseDown}"
              @mousemove="${this.#onListMouseMove}"
            >
              ${repeat(filtered, (option) => option.value, this.#renderItem)}
              ${isEmpty ? html ` <div class="Empty">No results</div> ` : nothing}
            </div>
          </dui-scroll-area>
        </div>
      `;
            },
        }));
        #inputId = `combobox-input-${crypto.randomUUID().slice(0, 8)}`;
        #listId = `combobox-list-${crypto.randomUUID().slice(0, 8)}`;
        /** Filtered options based on current input text. */
        get #filteredOptions() {
            const query = this.#inputValue.toLowerCase();
            const opts = this.options;
            if (!query)
                return opts;
            return opts.filter((opt) => opt.label.toLowerCase().includes(query));
        }
        // ---- Input handling ----
        #onInput = (event) => {
            const target = event.target;
            this.#inputValue = target.value;
            if (!this.#popup.isOpen) {
                if (!this.disabled)
                    this.#popup.open();
            }
            this.#highlightedIndex = -1;
        };
        #onInputFocus = () => {
            if (!this.#popup.isOpen && !this.disabled) {
                this.#popup.open();
            }
        };
        #onInputKeyDown = (event) => {
            const filtered = this.#filteredOptions;
            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault();
                    if (!this.#popup.isOpen) {
                        if (!this.disabled)
                            this.#popup.open();
                    }
                    else {
                        this.#highlightedIndex = Math.min(this.#highlightedIndex + 1, filtered.length - 1);
                    }
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    if (!this.#popup.isOpen) {
                        if (!this.disabled)
                            this.#popup.open();
                    }
                    else {
                        this.#highlightedIndex = Math.max(this.#highlightedIndex - 1, 0);
                    }
                    break;
                case "Enter": {
                    event.preventDefault();
                    if (this.#popup.isOpen) {
                        const index = this.#highlightedIndex >= 0 ? this.#highlightedIndex : 0;
                        const option = filtered[index];
                        if (option) {
                            this.#selectOption(option);
                        }
                    }
                    else if (!this.disabled) {
                        this.#popup.open();
                    }
                    break;
                }
                case "Escape":
                    if (this.#popup.isOpen) {
                        event.preventDefault();
                        this.#inputValue = "";
                        this.#popup.close();
                    }
                    break;
                case "Tab":
                    if (this.#popup.isOpen) {
                        this.#popup.close();
                    }
                    break;
                case "Home":
                    if (this.#popup.isOpen) {
                        event.preventDefault();
                        this.#highlightedIndex = 0;
                    }
                    break;
                case "End":
                    if (this.#popup.isOpen) {
                        event.preventDefault();
                        this.#highlightedIndex = filtered.length - 1;
                    }
                    break;
                case "Backspace":
                    if (this.multiple && this.#inputValue === "" && this.values.size > 0) {
                        const lastValue = Array.from(this.values).at(-1);
                        if (lastValue) {
                            this.#removeValue(lastValue);
                        }
                    }
                    break;
            }
        };
        // ---- Selection ----
        #selectOption(option) {
            if (this.multiple) {
                const newValues = new Set(this.values);
                const selected = !newValues.has(option.value);
                if (selected) {
                    newValues.add(option.value);
                }
                else {
                    newValues.delete(option.value);
                }
                this.values = newValues;
                this.#inputValue = "";
                this.#highlightedIndex = -1;
                this.dispatchEvent(valuesChangeEvent({
                    value: option.value,
                    selected,
                    values: newValues,
                }));
                const input = this.shadowRoot?.querySelector(".Input");
                input?.focus();
            }
            else {
                this.value = option.value;
                this.#inputValue = option.label;
                this.dispatchEvent(valueChangeEvent({ value: option.value, option }));
                this.#popup.close();
            }
        }
        #removeValue(value) {
            const newValues = new Set(this.values);
            newValues.delete(value);
            this.values = newValues;
            this.dispatchEvent(valuesChangeEvent({ value, selected: false, values: newValues }));
        }
        #onItemClick = (option) => {
            this.#selectOption(option);
        };
        #onListMouseDown = (event) => {
            event.preventDefault();
        };
        #onListMouseMove = () => {
            if (this.#highlightedIndex !== -1) {
                this.#highlightedIndex = -1;
            }
        };
        #onChipsClick = () => {
            const input = this.shadowRoot?.querySelector(".Input");
            input?.focus();
        };
        // ---- Render ----
        #renderChip = (value) => {
            const option = this.options.find((o) => o.value === value);
            const label = option?.label ?? value;
            return html `
      <span class="Chip">
        <span class="ChipLabel">${label}</span>
        <button
          class="ChipRemove"
          type="button"
          tabindex="-1"
          @mousedown="${(e) => e.preventDefault()}"
          @click="${(e) => {
                e.stopPropagation();
                this.#removeValue(value);
            }}"
        >
          <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></dui-icon>
        </button>
      </span>
    `;
        };
        #renderItem = (option, index) => {
            const isSelected = this.multiple
                ? this.values.has(option.value)
                : option.value === this.value;
            const isHighlighted = index === this.#highlightedIndex;
            return html `
      <div
        class="Item"
        role="option"
        id="${this.#listId}-option-${index}"
        aria-selected="${isSelected}"
        ?data-selected="${isSelected}"
        ?data-highlighted="${isHighlighted}"
        @click="${() => this.#onItemClick(option)}"
      >
        <span class="ItemText">${option.label}</span>
        <span class="ItemIndicator">
          ${isSelected ? html `<dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></dui-icon>` : nothing}
        </span>
      </div>
    `;
        };
        render() {
            const inputHtml = html `
      <input
        class="Input"
        id="${this.#inputId}"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-haspopup="listbox"
        aria-expanded="${this.#popup.isOpen}"
        aria-controls="${this.#listId}"
        aria-activedescendant="${this.#highlightedIndex >= 0
                ? `${this.#listId}-option-${this.#highlightedIndex}`
                : nothing}"
        .value="${live(this.#inputValue)}"
        .placeholder="${this.placeholder}"
        ?disabled="${this.disabled}"
        @input="${this.#onInput}"
        @focus="${this.#onInputFocus}"
        @keydown="${this.#onInputKeyDown}"
      />
    `;
            if (this.multiple) {
                return html `
        <div
          class="Chips"
          part="chips"
          ?data-disabled="${this.disabled}"
          @click="${this.#onChipsClick}"
        >
          ${repeat(Array.from(this.values), (v) => v, this.#renderChip)}
          ${inputHtml}
          <dui-icon class="Arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></dui-icon>
        </div>
      `;
            }
            return html `
      <div class="InputWrapper" part="input-wrapper">
        ${inputHtml}
        <dui-icon class="Arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></dui-icon>
      </div>
    `;
        }
    };
})();
export { DuiComboboxPrimitive };
