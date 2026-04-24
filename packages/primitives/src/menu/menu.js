/** Ported from original DUI: deep-future-app/app/client/components/dui/menu */
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
import { FloatingPortalController } from "@dui/core/floating-portal-controller";
import { DuiMenuItemPrimitive } from "./menu-item.ts";
const hostStyles = css `
  :host {
    display: block;
  }
`;
const componentStyles = css `
  .Trigger {
    display: contents;
    cursor: pointer;
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
 * `<dui-menu>` — A popup menu triggered by a slotted element.
 *
 * @slot trigger - The element that opens the menu on click.
 * @slot default - `dui-menu-item` children rendered inside the popup.
 */
let DuiMenuPrimitive = (() => {
    let _classSuper = LitElement;
    let _popupMinWidth_decorators;
    let _popupMinWidth_initializers = [];
    let _popupMinWidth_extraInitializers = [];
    let _private_highlightedIndex_decorators;
    let _private_highlightedIndex_initializers = [];
    let _private_highlightedIndex_extraInitializers = [];
    let _private_highlightedIndex_descriptor;
    return class DuiMenuPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _popupMinWidth_decorators = [property({ attribute: "popup-min-width" })];
            _private_highlightedIndex_decorators = [state()];
            __esDecorate(this, null, _popupMinWidth_decorators, { kind: "accessor", name: "popupMinWidth", static: false, private: false, access: { has: obj => "popupMinWidth" in obj, get: obj => obj.popupMinWidth, set: (obj, value) => { obj.popupMinWidth = value; } }, metadata: _metadata }, _popupMinWidth_initializers, _popupMinWidth_extraInitializers);
            __esDecorate(this, _private_highlightedIndex_descriptor = { get: __setFunctionName(function () { return this.#highlightedIndex_accessor_storage; }, "#highlightedIndex", "get"), set: __setFunctionName(function (value) { this.#highlightedIndex_accessor_storage = value; }, "#highlightedIndex", "set") }, _private_highlightedIndex_decorators, { kind: "accessor", name: "#highlightedIndex", static: false, private: true, access: { has: obj => #highlightedIndex in obj, get: obj => obj.#highlightedIndex, set: (obj, value) => { obj.#highlightedIndex = value; } }, metadata: _metadata }, _private_highlightedIndex_initializers, _private_highlightedIndex_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-menu";
        static styles = [base, hostStyles, componentStyles];
        #popupMinWidth_accessor_storage = __runInitializers(this, _popupMinWidth_initializers, "var(--space-28)");
        /** Sets `min-width` on the popup panel (e.g. `"200px"`). Defaults to `"var(--space-28)".` */
        get popupMinWidth() { return this.#popupMinWidth_accessor_storage; }
        set popupMinWidth(value) { this.#popupMinWidth_accessor_storage = value; }
        #highlightedIndex_accessor_storage = (__runInitializers(this, _popupMinWidth_extraInitializers), __runInitializers(this, _private_highlightedIndex_initializers, -1));
        get #highlightedIndex() { return _private_highlightedIndex_descriptor.get.call(this); }
        set #highlightedIndex(value) { return _private_highlightedIndex_descriptor.set.call(this, value); }
        #getTriggerElement = (__runInitializers(this, _private_highlightedIndex_extraInitializers), () => {
            const slot = this.shadowRoot?.querySelector('slot[name="trigger"]');
            return slot?.assignedElements()?.[0];
        });
        #popup = new FloatingPortalController(this, {
            getAnchor: () => this.#getTriggerElement() ?? this,
            matchWidth: false,
            styles: portalPopupStyles,
            contentContainer: ".Menu",
            contentSelector: "dui-menu-item, dui-separator",
            onOpen: () => {
                this.#highlightedIndex = -1;
                this.#getTriggerElement()?.setAttribute("data-open", "");
            },
            onClose: () => {
                this.#highlightedIndex = -1;
                this.#getTriggerElement()?.removeAttribute("data-open");
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
        #menuId = `menu-${crypto.randomUUID().slice(0, 8)}`;
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
        #togglePopup() {
            if (this.#popup.isOpen) {
                this.#popup.close();
            }
            else {
                this.#popup.open();
            }
        }
        #onTriggerClick = (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.#togglePopup();
        };
        #onItemSlotClick = (event) => {
            const item = event
                .composedPath()
                .find((el) => el instanceof HTMLElement && el.matches(DuiMenuItemPrimitive.tagName));
            if (item && !item.disabled) {
                this.#popup.close();
            }
        };
        #onKeyDown = (event) => {
            const items = this.#items;
            switch (event.key) {
                case "ArrowDown": {
                    event.preventDefault();
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
                    event.preventDefault();
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
                case "Home":
                    if (this.#popup.isOpen) {
                        event.preventDefault();
                        const firstEnabled = items.findIndex((item) => !item.disabled);
                        if (firstEnabled >= 0)
                            this.#highlightedIndex = firstEnabled;
                    }
                    break;
                case "End":
                    if (this.#popup.isOpen) {
                        event.preventDefault();
                        for (let i = items.length - 1; i >= 0; i--) {
                            if (!items[i]?.disabled) {
                                this.#highlightedIndex = i;
                                break;
                            }
                        }
                    }
                    break;
                case "Enter":
                case " ": {
                    if (this.#popup.isOpen && this.#highlightedIndex >= 0) {
                        event.preventDefault();
                        const item = items[this.#highlightedIndex];
                        if (item && !item.disabled) {
                            item.click();
                            this.#popup.close();
                        }
                    }
                    else if (!this.#popup.isOpen) {
                        event.preventDefault();
                        this.#popup.open();
                    }
                    break;
                }
                case "Escape":
                    if (this.#popup.isOpen) {
                        event.preventDefault();
                        this.#popup.close();
                    }
                    break;
                case "Tab":
                    if (this.#popup.isOpen) {
                        this.#popup.close();
                    }
                    break;
            }
        };
        #onMenuMouseMove = () => {
            if (this.#highlightedIndex >= 0) {
                this.#highlightedIndex = -1;
            }
        };
        render() {
            return html `
      <div
        class="Trigger"
        aria-haspopup="menu"
        aria-expanded="${this.#popup.isOpen}"
        aria-controls="${this.#menuId}"
        @click="${this.#onTriggerClick}"
        @keydown="${this.#onKeyDown}"
      >
        <slot name="trigger"></slot>
      </div>
    `;
        }
    };
})();
export { DuiMenuPrimitive };
