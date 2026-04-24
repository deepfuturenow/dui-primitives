/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
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
import { css, html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { sidebarContext } from "./sidebar-context.ts";
const styles = css `
  :host {
    display: block;
  }

  .Row {
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .Button {
    box-sizing: border-box;
    display: flex;
    flex: 1;
    min-width: 0;
    align-items: center;
    height: 100%;
    border: none;
    border-radius: 0;
    background: transparent;
    text-align: left;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    font: inherit;
    color: inherit;
    padding: 0;
  }

  .Button:focus-visible {
    outline: none;
  }

  .Label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .Suffix {
    flex-shrink: 0;
  }

  .Row[data-icon-collapsed] {
    justify-content: center;
  }

  .Row[data-icon-collapsed] .Label,
  .Row[data-icon-collapsed] .Suffix {
    display: none;
  }

  :host([disabled]) .Button {
    pointer-events: none;
  }
`;
/**
 * `<dui-sidebar-menu-button>` — Interactive button or link within a sidebar menu.
 *
 * Renders as a `<button>` by default, or an `<a>` when `href` is set.
 * Supports icon-collapsed mode where only the icon is visible, with an
 * optional tooltip.
 *
 * @slot icon - Icon slot, shown before the label.
 * @slot - Default slot for label text.
 * @slot suffix - Suffix slot, shown after the label.
 * @fires spa-navigate - Fired on normal link clicks. Detail: { href: string }
 */
let DuiSidebarMenuButtonPrimitive = (() => {
    let _classSuper = LitElement;
    let _active_decorators;
    let _active_initializers = [];
    let _active_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _tooltip_decorators;
    let _tooltip_initializers = [];
    let _tooltip_extraInitializers = [];
    let _href_decorators;
    let _href_initializers = [];
    let _href_extraInitializers = [];
    return class DuiSidebarMenuButtonPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _active_decorators = [property({ type: Boolean, reflect: true })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _tooltip_decorators = [property()];
            _href_decorators = [property()];
            __esDecorate(this, null, _active_decorators, { kind: "accessor", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _tooltip_decorators, { kind: "accessor", name: "tooltip", static: false, private: false, access: { has: obj => "tooltip" in obj, get: obj => obj.tooltip, set: (obj, value) => { obj.tooltip = value; } }, metadata: _metadata }, _tooltip_initializers, _tooltip_extraInitializers);
            __esDecorate(this, null, _href_decorators, { kind: "accessor", name: "href", static: false, private: false, access: { has: obj => "href" in obj, get: obj => obj.href, set: (obj, value) => { obj.href = value; } }, metadata: _metadata }, _href_initializers, _href_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-sidebar-menu-button";
        static styles = [base, styles];
        #active_accessor_storage = __runInitializers(this, _active_initializers, false);
        /** Whether the button is in active/selected state. */
        get active() { return this.#active_accessor_storage; }
        set active(value) { this.#active_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _active_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Whether the button is disabled. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #tooltip_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _tooltip_initializers, ""));
        /** Tooltip text shown when sidebar is icon-collapsed. */
        get tooltip() { return this.#tooltip_accessor_storage; }
        set tooltip(value) { this.#tooltip_accessor_storage = value; }
        #href_accessor_storage = (__runInitializers(this, _tooltip_extraInitializers), __runInitializers(this, _href_initializers, undefined));
        /** When set, renders as an anchor tag instead of a button. */
        get href() { return this.#href_accessor_storage; }
        set href(value) { this.#href_accessor_storage = value; }
        #ctx = (__runInitializers(this, _href_extraInitializers), new ContextConsumer(this, {
            context: sidebarContext,
            subscribe: true,
        }));
        get #isIconCollapsed() {
            const ctx = this.#ctx.value;
            return ctx?.collapsible === "icon" && ctx?.state === "collapsed";
        }
        #onLinkClick = (event) => {
            if (this.disabled) {
                event.preventDefault();
                return;
            }
            if (this.href &&
                !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) {
                event.preventDefault();
                this.dispatchEvent(new CustomEvent("spa-navigate", {
                    detail: { href: this.href },
                    bubbles: true,
                    composed: true,
                }));
            }
        };
        #renderButton() {
            return html `
      <button
        class="Button"
        ?disabled=${this.disabled}
        ?data-active=${this.active}
      >
        <slot name="icon"></slot>
        <span class="Label"><slot></slot></span>
        <span class="Suffix"><slot name="suffix"></slot></span>
      </button>
    `;
        }
        #renderLink() {
            return html `
      <a
        class="Button"
        href=${this.href ?? nothing}
        aria-disabled=${this.disabled || nothing}
        ?data-active=${this.active}
        @click=${this.#onLinkClick}
      >
        <slot name="icon"></slot>
        <span class="Label"><slot></slot></span>
        <span class="Suffix"><slot name="suffix"></slot></span>
      </a>
    `;
        }
        #renderContent() {
            const iconCollapsed = this.#isIconCollapsed;
            return html `
      <div
        class="Row"
        ?data-icon-collapsed=${iconCollapsed}
        ?data-active=${this.active}
      >
        ${this.href !== undefined ? this.#renderLink() : this.#renderButton()}
      </div>
    `;
        }
        render() {
            const iconCollapsed = this.#isIconCollapsed;
            if (iconCollapsed && this.tooltip) {
                return html `
        <dui-tooltip>
          <dui-tooltip-trigger>
            ${this.#renderContent()}
          </dui-tooltip-trigger>
          <dui-tooltip-popup side="right">
            ${this.tooltip}
          </dui-tooltip-popup>
        </dui-tooltip>
      `;
            }
            return this.#renderContent();
        }
    };
})();
export { DuiSidebarMenuButtonPrimitive };
