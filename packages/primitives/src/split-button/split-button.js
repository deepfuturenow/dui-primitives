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
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { FloatingPortalController } from "@dui/core/floating-portal-controller";
import { DuiMenuItemPrimitive } from "../menu/menu-item.ts";
/** Fired when the action (left) button is clicked. */
export const actionEvent = customEvent("dui-action", { bubbles: true, composed: true });
/** Structural styles only — layout and behavioral CSS. */
const hostStyles = css `
  :host {
    display: inline-block;
  }
`;
const componentStyles = css `
  .Root {
    display: inline-flex;
    align-items: stretch;
    box-sizing: border-box;
  }

  .Action,
  .Trigger {
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
  }

  .Action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .Divider {
    display: block;
    width: 0;
    align-self: stretch;
  }

  .Trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
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
  `,
];
/**
 * `<dui-split-button>` — A button with an attached dropdown menu trigger.
 *
 * The action zone (left) performs a primary action. The menu trigger (right)
 * opens a dropdown of `dui-menu-item` children for secondary actions.
 *
 * @slot - Action button label / content.
 * @slot icon - Custom icon for the dropdown trigger (defaults to chevron-down).
 * @slot menu - `dui-menu-item` elements rendered inside the dropdown popup.
 * @csspart root - The outer container wrapping both zones.
 * @csspart action - The left action button element.
 * @csspart divider - The vertical separator between action and trigger.
 * @csspart trigger - The right dropdown trigger button element.
 * @fires dui-action - Fired when the action button is clicked. Detail: {}
 */
let DuiSplitButtonPrimitive = (() => {
    let _classSuper = LitElement;
    let _variant_decorators;
    let _variant_initializers = [];
    let _variant_extraInitializers = [];
    let _appearance_decorators;
    let _appearance_initializers = [];
    let _appearance_extraInitializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _size_extraInitializers = [];
    let _popupMinWidth_decorators;
    let _popupMinWidth_initializers = [];
    let _popupMinWidth_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _private_highlightedIndex_decorators;
    let _private_highlightedIndex_initializers = [];
    let _private_highlightedIndex_extraInitializers = [];
    let _private_highlightedIndex_descriptor;
    return class DuiSplitButtonPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _variant_decorators = [property({ reflect: true })];
            _appearance_decorators = [property({ reflect: true })];
            _size_decorators = [property({ reflect: true })];
            _popupMinWidth_decorators = [property({ attribute: "popup-min-width" })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _private_highlightedIndex_decorators = [state()];
            __esDecorate(this, null, _variant_decorators, { kind: "accessor", name: "variant", static: false, private: false, access: { has: obj => "variant" in obj, get: obj => obj.variant, set: (obj, value) => { obj.variant = value; } }, metadata: _metadata }, _variant_initializers, _variant_extraInitializers);
            __esDecorate(this, null, _appearance_decorators, { kind: "accessor", name: "appearance", static: false, private: false, access: { has: obj => "appearance" in obj, get: obj => obj.appearance, set: (obj, value) => { obj.appearance = value; } }, metadata: _metadata }, _appearance_initializers, _appearance_extraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
            __esDecorate(this, null, _popupMinWidth_decorators, { kind: "accessor", name: "popupMinWidth", static: false, private: false, access: { has: obj => "popupMinWidth" in obj, get: obj => obj.popupMinWidth, set: (obj, value) => { obj.popupMinWidth = value; } }, metadata: _metadata }, _popupMinWidth_initializers, _popupMinWidth_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, _private_highlightedIndex_descriptor = { get: __setFunctionName(function () { return this.#highlightedIndex_accessor_storage; }, "#highlightedIndex", "get"), set: __setFunctionName(function (value) { this.#highlightedIndex_accessor_storage = value; }, "#highlightedIndex", "set") }, _private_highlightedIndex_decorators, { kind: "accessor", name: "#highlightedIndex", static: false, private: true, access: { has: obj => #highlightedIndex in obj, get: obj => obj.#highlightedIndex, set: (obj, value) => { obj.#highlightedIndex = value; } }, metadata: _metadata }, _private_highlightedIndex_initializers, _private_highlightedIndex_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-split-button";
        static styles = [base, hostStyles, componentStyles];
        #variant_accessor_storage = __runInitializers(this, _variant_initializers, "");
        /** Visual variant — mapped to theme styles (e.g. neutral, primary, danger). */
        get variant() { return this.#variant_accessor_storage; }
        set variant(value) { this.#variant_accessor_storage = value; }
        #appearance_accessor_storage = (__runInitializers(this, _variant_extraInitializers), __runInitializers(this, _appearance_initializers, ""));
        /** Visual appearance — mapped to theme styles (e.g. filled, outline, ghost). */
        get appearance() { return this.#appearance_accessor_storage; }
        set appearance(value) { this.#appearance_accessor_storage = value; }
        #size_accessor_storage = (__runInitializers(this, _appearance_extraInitializers), __runInitializers(this, _size_initializers, ""));
        /** Size — mapped to theme styles (e.g. xs, sm, md, lg). */
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #popupMinWidth_accessor_storage = (__runInitializers(this, _size_extraInitializers), __runInitializers(this, _popupMinWidth_initializers, "var(--space-28)"));
        /** Sets `min-width` on the popup panel (e.g. `"200px"`). Defaults to `"var(--space-28)"`. */
        get popupMinWidth() { return this.#popupMinWidth_accessor_storage; }
        set popupMinWidth(value) { this.#popupMinWidth_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _popupMinWidth_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Whether the entire split button is disabled. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #highlightedIndex_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _private_highlightedIndex_initializers, -1));
        get #highlightedIndex() { return _private_highlightedIndex_descriptor.get.call(this); }
        set #highlightedIndex(value) { return _private_highlightedIndex_descriptor.set.call(this, value); }
        #menuId = (__runInitializers(this, _private_highlightedIndex_extraInitializers), `split-menu-${crypto.randomUUID().slice(0, 8)}`);
        #popup = new FloatingPortalController(this, {
            getAnchor: () => this.shadowRoot?.querySelector(".Root"),
            matchWidth: false,
            styles: portalPopupStyles,
            contentContainer: ".Menu",
            contentSelector: "dui-menu-item",
            onOpen: () => {
                this.#highlightedIndex = -1;
            },
            onClose: () => {
                this.#highlightedIndex = -1;
            },
            renderPopup: (portal) => html `
      <div
        class="Popup"
        style="${this.popupMinWidth ? `min-width:${this.popupMinWidth}` : ""}"
        ?data-starting-style="${portal.isStarting}"
        ?data-ending-style="${portal.isEnding}"
      >
        <div
          class="Menu"
          id="${this.#menuId}"
          role="menu"
          @click="${this.#onItemSlotClick}"
          @mousemove="${this.#onMenuMouseMove}"
        ></div>
      </div>
    `,
        });
        get #items() {
            const container = this.#popup.renderRoot?.querySelector(".Menu") ?? this;
            return [...container.querySelectorAll("dui-menu-item")];
        }
        updated() {
            const items = this.#items;
            for (let i = 0; i < items.length; i++) {
                if (i === this.#highlightedIndex) {
                    items[i].setAttribute("data-highlighted", "");
                }
                else {
                    items[i].removeAttribute("data-highlighted");
                }
            }
        }
        // ---- Action zone handlers ----
        #onActionClick = (e) => {
            e.stopPropagation();
            if (this.disabled)
                return;
            this.dispatchEvent(actionEvent({}));
        };
        #onActionKeyDown = (e) => {
            if (this.disabled)
                return;
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this.dispatchEvent(actionEvent({}));
            }
        };
        // ---- Trigger zone handlers ----
        #onTriggerClick = (e) => {
            e.stopPropagation();
            if (this.disabled)
                return;
            if (this.#popup.isOpen) {
                this.#popup.close();
            }
            else {
                this.#popup.open();
            }
        };
        #onTriggerKeyDown = (e) => {
            if (this.disabled)
                return;
            const items = this.#items;
            switch (e.key) {
                case "Enter":
                case " ": {
                    if (this.#popup.isOpen && this.#highlightedIndex >= 0) {
                        e.preventDefault();
                        const item = items[this.#highlightedIndex];
                        if (item && !item.disabled) {
                            item.click();
                            this.#popup.close();
                        }
                    }
                    else if (!this.#popup.isOpen) {
                        e.preventDefault();
                        this.#popup.open();
                    }
                    break;
                }
                case "ArrowDown": {
                    e.preventDefault();
                    if (!this.#popup.isOpen) {
                        this.#popup.open();
                    }
                    else {
                        let next = this.#highlightedIndex + 1;
                        while (next < items.length && items[next]?.disabled)
                            next++;
                        if (next < items.length)
                            this.#highlightedIndex = next;
                    }
                    break;
                }
                case "ArrowUp": {
                    e.preventDefault();
                    if (!this.#popup.isOpen) {
                        this.#popup.open();
                    }
                    else {
                        let prev = this.#highlightedIndex - 1;
                        while (prev >= 0 && items[prev]?.disabled)
                            prev--;
                        if (prev >= 0)
                            this.#highlightedIndex = prev;
                    }
                    break;
                }
                case "Home": {
                    if (this.#popup.isOpen) {
                        e.preventDefault();
                        const firstEnabled = items.findIndex((item) => !item.disabled);
                        if (firstEnabled >= 0)
                            this.#highlightedIndex = firstEnabled;
                    }
                    break;
                }
                case "End": {
                    if (this.#popup.isOpen) {
                        e.preventDefault();
                        for (let i = items.length - 1; i >= 0; i--) {
                            if (!items[i]?.disabled) {
                                this.#highlightedIndex = i;
                                break;
                            }
                        }
                    }
                    break;
                }
                case "Escape": {
                    if (this.#popup.isOpen) {
                        e.preventDefault();
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
        // ---- Menu handlers ----
        #onItemSlotClick = (e) => {
            const item = e
                .composedPath()
                .find((el) => el instanceof HTMLElement && el.matches(DuiMenuItemPrimitive.tagName));
            if (item && !item.disabled) {
                this.#popup.close();
            }
        };
        #onMenuMouseMove = () => {
            if (this.#highlightedIndex >= 0) {
                this.#highlightedIndex = -1;
            }
        };
        #focusTrigger() {
            this.shadowRoot?.querySelector(".Trigger")?.focus();
        }
        render() {
            return html `
      <div class="Root" part="root">
        <button
          class="Action"
          part="action"
          type="button"
          ?disabled="${this.disabled}"
          @click="${this.#onActionClick}"
          @keydown="${this.#onActionKeyDown}"
        >
          <slot></slot>
        </button>

        <span part="divider" class="Divider"></span>

        <button
          class="Trigger"
          part="trigger"
          type="button"
          ?disabled="${this.disabled}"
          aria-haspopup="menu"
          aria-expanded="${this.#popup.isOpen}"
          aria-controls="${this.#menuId}"
          ?data-open="${this.#popup.isOpen || nothing}"
          @click="${this.#onTriggerClick}"
          @keydown="${this.#onTriggerKeyDown}"
        >
          <slot name="icon">
            <dui-icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </dui-icon>
          </slot>
        </button>
      </div>
    `;
        }
    };
})();
export { DuiSplitButtonPrimitive };
