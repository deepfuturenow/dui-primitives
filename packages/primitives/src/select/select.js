/** Ported from original DUI: deep-future-app/app/client/components/dui/select */
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
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { FloatingPortalController } from "@dui/core/floating-portal-controller";
export const valueChangeEvent = customEvent("value-change", { bubbles: true, composed: true });
/** Structural styles only — layout CSS. */
const hostStyles = css `
  :host {
    display: block;
  }
`;
const componentStyles = css `
  .Trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
  }

  .Trigger[data-disabled] {
    cursor: not-allowed;
  }

  .Value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .Icon {
    flex-shrink: 0;
  }
`;
/** Structural styles injected into the portal positioner. */
const portalPopupStyles = [
    css `
    .Popup {
      max-height: 240px;
      overflow-y: auto;
      overscroll-behavior: contain;
      opacity: 1;
      transform: translateY(0);
      transition-property: opacity, transform;
      pointer-events: auto;
    }

    .Popup[data-starting-style],
    .Popup[data-ending-style] {
      opacity: 0;
    }

    .Item {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .Item[data-disabled] {
      cursor: not-allowed;
    }

    .ItemIndicator {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ItemText {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `,
];
/**
 * `<dui-select>` — A dropdown select for choosing from a list of options.
 *
 * @csspart trigger - The trigger button.
 * @csspart value - The displayed value text.
 * @fires value-change - Fired when the selected value changes.
 *   Detail: { value: string, option: SelectOption }
 */
let DuiSelectPrimitive = (() => {
    let _classSuper = LitElement;
    let _options_decorators;
    let _options_initializers = [];
    let _options_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _placeholder_decorators;
    let _placeholder_initializers = [];
    let _placeholder_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _alignItemToTrigger_decorators;
    let _alignItemToTrigger_initializers = [];
    let _alignItemToTrigger_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _private_highlightedIndex_decorators;
    let _private_highlightedIndex_initializers = [];
    let _private_highlightedIndex_extraInitializers = [];
    let _private_highlightedIndex_descriptor;
    return class DuiSelectPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _options_decorators = [property({ attribute: false })];
            _value_decorators = [property({ type: String })];
            _placeholder_decorators = [property({ type: String })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _alignItemToTrigger_decorators = [property({ type: Boolean, attribute: "align-item-to-trigger", reflect: true })];
            _name_decorators = [property({ type: String })];
            _private_highlightedIndex_decorators = [state()];
            __esDecorate(this, null, _options_decorators, { kind: "accessor", name: "options", static: false, private: false, access: { has: obj => "options" in obj, get: obj => obj.options, set: (obj, value) => { obj.options = value; } }, metadata: _metadata }, _options_initializers, _options_extraInitializers);
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } }, metadata: _metadata }, _placeholder_initializers, _placeholder_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _alignItemToTrigger_decorators, { kind: "accessor", name: "alignItemToTrigger", static: false, private: false, access: { has: obj => "alignItemToTrigger" in obj, get: obj => obj.alignItemToTrigger, set: (obj, value) => { obj.alignItemToTrigger = value; } }, metadata: _metadata }, _alignItemToTrigger_initializers, _alignItemToTrigger_extraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(this, _private_highlightedIndex_descriptor = { get: __setFunctionName(function () { return this.#highlightedIndex_accessor_storage; }, "#highlightedIndex", "get"), set: __setFunctionName(function (value) { this.#highlightedIndex_accessor_storage = value; }, "#highlightedIndex", "set") }, _private_highlightedIndex_decorators, { kind: "accessor", name: "#highlightedIndex", static: false, private: true, access: { has: obj => #highlightedIndex in obj, get: obj => obj.#highlightedIndex, set: (obj, value) => { obj.#highlightedIndex = value; } }, metadata: _metadata }, _private_highlightedIndex_initializers, _private_highlightedIndex_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-select";
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
        /** Currently selected value. */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #placeholder_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _placeholder_initializers, "Select..."));
        /** Placeholder text shown when no value is selected. */
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _placeholder_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Whether the select is disabled. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #alignItemToTrigger_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _alignItemToTrigger_initializers, true));
        /** Position the popup so the selected item overlays the trigger (macOS-style). */
        get alignItemToTrigger() { return this.#alignItemToTrigger_accessor_storage; }
        set alignItemToTrigger(value) { this.#alignItemToTrigger_accessor_storage = value; }
        #name_accessor_storage = (__runInitializers(this, _alignItemToTrigger_extraInitializers), __runInitializers(this, _name_initializers, ""));
        /** Name for form submission. */
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #highlightedIndex_accessor_storage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _private_highlightedIndex_initializers, -1));
        get #highlightedIndex() { return _private_highlightedIndex_descriptor.get.call(this); }
        set #highlightedIndex(value) { return _private_highlightedIndex_descriptor.set.call(this, value); }
        #triggerId = (__runInitializers(this, _private_highlightedIndex_extraInitializers), `select-trigger-${crypto.randomUUID().slice(0, 8)}`);
        #listboxId = `select-listbox-${crypto.randomUUID().slice(0, 8)}`;
        #popup = new FloatingPortalController(this, {
            getAnchor: () => this.shadowRoot?.querySelector(".Trigger"),
            matchWidth: false,
            minMatchWidth: true,
            styles: portalPopupStyles,
            alignToInner: () => {
                if (!this.alignItemToTrigger)
                    return null;
                const root = this.#popup.renderRoot;
                const selectedItem = root?.querySelector("[data-selected]");
                return selectedItem?.querySelector(".ItemText") ?? selectedItem ?? null;
            },
            alignToInnerReference: () => {
                if (!this.alignItemToTrigger)
                    return null;
                return this.shadowRoot?.querySelector(".Value") ?? null;
            },
            onOpen: () => {
                this.#highlightedIndex = this.#selectedIndex;
            },
            onClose: () => {
                this.#highlightedIndex = -1;
            },
            renderPopup: (portal) => {
                return html `
        <div
          class="Popup"
          ?data-align-inner="${this.alignItemToTrigger && this.value !== ""}"
          ?data-starting-style="${portal.isStarting}"
          ?data-ending-style="${portal.isEnding}"
        >
          <div
            class="Listbox"
            id="${this.#listboxId}"
            role="listbox"

            @mousedown="${this.#onListMouseDown}"
          >
            ${repeat(this.options, (option) => option.value, this.#renderItem)}
          </div>
        </div>
      `;
            },
        });
        willUpdate() {
            this.#internals.setFormValue(this.value);
        }
        // ---- Computed ----
        get #selectedOption() {
            return this.options.find((o) => o.value === this.value);
        }
        get #selectedIndex() {
            return this.options.findIndex((o) => o.value === this.value);
        }
        get #displayValue() {
            return this.#selectedOption?.label ?? "";
        }
        // ---- Event handlers ----
        #onTriggerClick = (event) => {
            event.stopPropagation();
            if (this.disabled)
                return;
            if (this.#popup.isOpen) {
                this.#popup.close();
            }
            else {
                this.#popup.open();
            }
        };
        #onTriggerKeyDown = (event) => {
            if (this.disabled)
                return;
            switch (event.key) {
                case "Enter":
                case " ": {
                    event.preventDefault();
                    if (this.#popup.isOpen) {
                        const option = this.options[this.#highlightedIndex];
                        if (option && !option.disabled) {
                            this.#selectOption(option);
                        }
                    }
                    else {
                        this.#popup.open();
                    }
                    break;
                }
                case "ArrowDown": {
                    event.preventDefault();
                    if (!this.#popup.isOpen) {
                        this.#popup.open();
                    }
                    else {
                        this.#highlightedIndex = this.#nextEnabledIndex(this.#highlightedIndex, 1);
                    }
                    break;
                }
                case "ArrowUp": {
                    event.preventDefault();
                    if (!this.#popup.isOpen) {
                        this.#popup.open();
                    }
                    else {
                        this.#highlightedIndex = this.#nextEnabledIndex(this.#highlightedIndex, -1);
                    }
                    break;
                }
                case "Home": {
                    if (this.#popup.isOpen) {
                        event.preventDefault();
                        this.#highlightedIndex = this.#nextEnabledIndex(-1, 1);
                    }
                    break;
                }
                case "End": {
                    if (this.#popup.isOpen) {
                        event.preventDefault();
                        this.#highlightedIndex = this.#nextEnabledIndex(this.options.length, -1);
                    }
                    break;
                }
                case "Escape": {
                    if (this.#popup.isOpen) {
                        event.preventDefault();
                        this.#popup.close();
                        this.#focusTrigger();
                    }
                    break;
                }
                case "Tab": {
                    if (this.#popup.isOpen) {
                        this.#popup.close();
                    }
                    break;
                }
            }
        };
        #onListMouseDown = (event) => {
            event.preventDefault();
        };
        #onItemClick = (option) => {
            if (option.disabled)
                return;
            this.#selectOption(option);
        };
        #onItemMouseEnter = (index) => {
            if (!this.options[index]?.disabled) {
                this.#highlightedIndex = index;
            }
        };
        // ---- Selection ----
        #selectOption(option) {
            this.value = option.value;
            this.dispatchEvent(valueChangeEvent({ value: option.value, option }));
            this.#popup.close();
            this.#focusTrigger();
        }
        #nextEnabledIndex(current, direction) {
            const len = this.options.length;
            let next = current + direction;
            while (next >= 0 && next < len) {
                if (!this.options[next].disabled)
                    return next;
                next += direction;
            }
            return current;
        }
        #focusTrigger() {
            const trigger = this.shadowRoot?.querySelector(".Trigger");
            trigger?.focus();
        }
        // ---- Render ----
        #renderItem = (option, index) => {
            const isSelected = option.value === this.value;
            const isHighlighted = index === this.#highlightedIndex;
            return html `
      <div
        class="Item"
        role="option"
        id="${this.#listboxId}-option-${index}"
        aria-selected="${isSelected}"
        ?data-selected="${isSelected}"
        ?data-highlighted="${isHighlighted}"
        ?data-disabled="${option.disabled}"
        @click="${() => this.#onItemClick(option)}"
        @mouseenter="${() => this.#onItemMouseEnter(index)}"
      >
        <span class="ItemIndicator">
          ${isSelected
                ? html `<dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></dui-icon>`
                : nothing}
        </span>
        <span class="ItemText">${option.label}</span>
      </div>
    `;
        };
        render() {
            const hasValue = this.value !== "" && this.#selectedOption != null;
            return html `
      <div
        class="Trigger"
        part="trigger"
        id="${this.#triggerId}"
        role="combobox"
        tabindex="${this.disabled ? -1 : 0}"
        aria-haspopup="listbox"
        aria-expanded="${this.#popup.isOpen}"
        aria-controls="${this.#listboxId}"
        aria-activedescendant="${this.#highlightedIndex >= 0
                ? `${this.#listboxId}-option-${this.#highlightedIndex}`
                : nothing}"
        ?data-disabled="${this.disabled}"
        ?data-open="${this.#popup.isOpen}"
        @click="${this.#onTriggerClick}"
        @keydown="${this.#onTriggerKeyDown}"
      >
        <span
          class="Value"
          part="value"
          ?data-placeholder="${!hasValue}"
        >
          ${hasValue ? this.#displayValue : this.placeholder}
        </span>
        <span class="Icon">
          <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></dui-icon>
        </span>
      </div>

    `;
        }
    };
})();
export { DuiSelectPrimitive };
