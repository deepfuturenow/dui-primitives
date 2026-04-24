/** Ported from original DUI: deep-future-app/app/client/components/dui/popover */
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
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { popoverContext } from "./popover-context.ts";
import { FloatingPortalController } from "@dui/core/floating-portal-controller";
import { renderArrow, } from "@dui/core/floating-popup-utils";
const hostStyles = css `
  :host {
    display: contents;
  }

  .slot-wrapper {
    display: none;
  }
`;
/** Structural styles injected into the portal positioner. */
const portalPopupStyles = [
    css `
    .Popup {
      box-sizing: border-box;
      pointer-events: auto;
      transform-origin: var(--transform-origin, center);
      opacity: 1;
      transform: scale(1);
      transition-property: opacity, transform;
    }

    .Popup[data-starting-style],
    .Popup[data-ending-style] {
      opacity: 0;
      transform: scale(0.96);
    }

    .Popup[data-side="top"] {
      --transform-origin: bottom center;
    }

    .Popup[data-side="bottom"] {
      --transform-origin: top center;
    }

    .Arrow {
      position: absolute;
      width: 10px;
      height: 6px;
    }

    .Arrow[data-side="top"] {
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
    }

    .Arrow[data-side="bottom"] {
      top: -5px;
      left: 50%;
      transform: translateX(-50%) rotate(180deg);
    }
  `,
];
/**
 * `<dui-popover-popup>` — The popover popup content container.
 *
 * @slot - Popover content.
 */
let DuiPopoverPopupPrimitive = (() => {
    let _classSuper = LitElement;
    let _showArrow_decorators;
    let _showArrow_initializers = [];
    let _showArrow_extraInitializers = [];
    let _closeOnClick_decorators;
    let _closeOnClick_initializers = [];
    let _closeOnClick_extraInitializers = [];
    let _private_side_decorators;
    let _private_side_initializers = [];
    let _private_side_extraInitializers = [];
    let _private_side_descriptor;
    return class DuiPopoverPopupPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _showArrow_decorators = [property({ type: Boolean, attribute: "show-arrow" })];
            _closeOnClick_decorators = [property({ type: Boolean, attribute: "close-on-click" })];
            _private_side_decorators = [state()];
            __esDecorate(this, null, _showArrow_decorators, { kind: "accessor", name: "showArrow", static: false, private: false, access: { has: obj => "showArrow" in obj, get: obj => obj.showArrow, set: (obj, value) => { obj.showArrow = value; } }, metadata: _metadata }, _showArrow_initializers, _showArrow_extraInitializers);
            __esDecorate(this, null, _closeOnClick_decorators, { kind: "accessor", name: "closeOnClick", static: false, private: false, access: { has: obj => "closeOnClick" in obj, get: obj => obj.closeOnClick, set: (obj, value) => { obj.closeOnClick = value; } }, metadata: _metadata }, _closeOnClick_initializers, _closeOnClick_extraInitializers);
            __esDecorate(this, _private_side_descriptor = { get: __setFunctionName(function () { return this.#side_accessor_storage; }, "#side", "get"), set: __setFunctionName(function (value) { this.#side_accessor_storage = value; }, "#side", "set") }, _private_side_decorators, { kind: "accessor", name: "#side", static: false, private: true, access: { has: obj => #side in obj, get: obj => obj.#side, set: (obj, value) => { obj.#side = value; } }, metadata: _metadata }, _private_side_initializers, _private_side_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-popover-popup";
        static styles = [base, hostStyles];
        #showArrow_accessor_storage = __runInitializers(this, _showArrow_initializers, true);
        /** Whether to show an arrow pointing to the trigger. */
        get showArrow() { return this.#showArrow_accessor_storage; }
        set showArrow(value) { this.#showArrow_accessor_storage = value; }
        #closeOnClick_accessor_storage = (__runInitializers(this, _showArrow_extraInitializers), __runInitializers(this, _closeOnClick_initializers, false));
        /** Close the popover when content inside the popup is clicked. */
        get closeOnClick() { return this.#closeOnClick_accessor_storage; }
        set closeOnClick(value) { this.#closeOnClick_accessor_storage = value; }
        #side_accessor_storage = (__runInitializers(this, _closeOnClick_extraInitializers), __runInitializers(this, _private_side_initializers, "bottom"));
        get #side() { return _private_side_descriptor.get.call(this); }
        set #side(value) { return _private_side_descriptor.set.call(this, value); }
        #ctx = (__runInitializers(this, _private_side_extraInitializers), new ContextConsumer(this, {
            context: popoverContext,
            subscribe: true,
        }));
        #wasOpen = false;
        #portal = new FloatingPortalController(this, {
            getAnchor: () => this.#ctx.value?.triggerEl,
            matchWidth: false,
            placement: "bottom",
            offset: 8,
            styles: portalPopupStyles,
            contentContainer: ".Content",
            onPosition: ({ placement }) => {
                const actualSide = placement.split("-")[0];
                if (actualSide !== this.#side) {
                    this.#side = actualSide;
                }
            },
            renderPopup: (portal) => {
                const popupId = this.#ctx.value?.popupId ?? "";
                return html `
        <div
          class="Popup"
          id="${popupId}"
          role="dialog"
          ?data-starting-style="${portal.isStarting}"
          ?data-ending-style="${portal.isEnding}"
          data-side="${this.#side}"
          @click="${this.#handleContentClick}"
        >
          <div class="Content"></div>
          ${this.showArrow ? renderArrow(this.#side) : ""}
        </div>
      `;
            },
        });
        /** Check if an event path includes this popup's portal positioner. */
        containsEventTarget(path) {
            const positioner = this.#portal.positionerElement;
            return positioner !== null && path.includes(positioner);
        }
        #handleContentClick = () => {
            if (this.closeOnClick) {
                this.#ctx.value?.closePopover();
            }
        };
        updated() {
            const isOpen = this.#ctx.value?.open ?? false;
            if (isOpen && !this.#wasOpen) {
                this.#updatePlacement();
                this.#portal.open();
            }
            else if (!isOpen && this.#wasOpen) {
                this.#portal.close();
            }
            this.#wasOpen = isOpen;
        }
        #updatePlacement() {
            const side = this.#ctx.value?.side ?? "bottom";
            this.#portal.placement = side;
            this.#portal.offset = this.#ctx.value?.sideOffset ?? 8;
        }
        render() {
            return html `<div class="slot-wrapper"><slot></slot></div>`;
        }
    };
})();
export { DuiPopoverPopupPrimitive };
