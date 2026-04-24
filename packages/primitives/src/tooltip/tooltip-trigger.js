/** Ported from original DUI: deep-future-app/app/client/components/dui/tooltip */
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
import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { tooltipContext } from "./tooltip-context.ts";
const hostStyles = css `
  :host {
    display: contents;
  }
`;
const componentStyles = css `
  .Trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: inherit;
  }

  .Trigger[data-disabled] {
    cursor: not-allowed;
  }
`;
/**
 * `<dui-tooltip-trigger>` — The element that triggers the tooltip on hover/focus.
 *
 * @slot - Content that triggers the tooltip.
 */
let DuiTooltipTriggerPrimitive = (() => {
    let _classSuper = LitElement;
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    return class DuiTooltipTriggerPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-tooltip-trigger";
        static styles = [base, hostStyles, componentStyles];
        #disabled_accessor_storage = __runInitializers(this, _disabled_initializers, false);
        /** Disable the trigger. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #ctx = (__runInitializers(this, _disabled_extraInitializers), new ContextConsumer(this, {
            context: tooltipContext,
            subscribe: true,
        }));
        #handleMouseEnter = () => {
            if (this.#isDisabled)
                return;
            this.#updateTriggerEl();
            this.#ctx.value?.openTooltip();
        };
        #handleMouseLeave = () => {
            this.#ctx.value?.closeTooltip();
        };
        #handleFocus = () => {
            if (this.#isDisabled)
                return;
            this.#updateTriggerEl();
            this.#ctx.value?.openTooltip();
        };
        #handleBlur = () => {
            this.#ctx.value?.closeTooltip();
        };
        #handleKeyDown = (e) => {
            if (e.key === "Escape" && this.#ctx.value?.open) {
                this.#ctx.value?.closeTooltip();
            }
        };
        #updateTriggerEl() {
            const trigger = this.shadowRoot?.querySelector('[part="trigger"]') ??
                this;
            this.#ctx.value?.setTriggerEl(trigger);
        }
        get #isDisabled() {
            return this.disabled || (this.#ctx.value?.disabled ?? false);
        }
        render() {
            const isOpen = this.#ctx.value?.open ?? false;
            const popupId = this.#ctx.value?.popupId ?? "";
            const triggerId = this.#ctx.value?.triggerId ?? "";
            return html `
      <span
        class="Trigger"
        part="trigger"
        id="${triggerId}"
        role="button"
        tabindex="0"
        aria-describedby="${isOpen ? popupId : ""}"
        ?data-popup-open="${isOpen}"
        ?data-disabled="${this.#isDisabled}"
        @mouseenter="${this.#handleMouseEnter}"
        @mouseleave="${this.#handleMouseLeave}"
        @focus="${this.#handleFocus}"
        @blur="${this.#handleBlur}"
        @keydown="${this.#handleKeyDown}"
      >
        <slot></slot>
      </span>
    `;
        }
    };
})();
export { DuiTooltipTriggerPrimitive };
