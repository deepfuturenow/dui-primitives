/** Ported from original DUI: deep-future-app/app/client/components/dui/dialog */
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
import { getComposedFocusableElements, queryComposedAutofocus, } from "@dui/core/dom";
import { dialogContext } from "./dialog-context.ts";
const hostStyles = css `
  :host {
    display: contents;
  }

  :host(:not([mounted])) [part="backdrop"],
  :host(:not([mounted])) [part="popup"] {
    display: none;
  }
`;
const componentStyles = css `
  [part="backdrop"] {
    position: fixed;
    min-height: 100dvh;
    inset: 0;
    z-index: 999;
  }

  [part="popup"] {
    box-sizing: border-box;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: var(--popup-width, 24rem);
    max-width: calc(100vw - 3rem);
    overflow: hidden;
    z-index: 1000;
    transition-property: opacity, transform;
  }
`;
/**
 * `<dui-dialog-popup>` — The popup overlay for the dialog.
 *
 * Renders a backdrop and a centered dialog popup with focus trapping.
 * Handles open/close animations via `data-starting-style` / `data-ending-style`.
 * Closes on backdrop click (unlike `<dui-alert-dialog-popup>`).
 *
 * Title and description are provided via named slots and rendered as
 * semantic `<h2>` and `<p>` elements with ARIA linkage.
 *
 * @slot title - Title text for the dialog (rendered as `<h2>`).
 * @slot description - Description text for the dialog (rendered as `<p>`).
 * @slot - Default slot for dialog content (actions, form fields, etc.).
 * @csspart backdrop - The overlay backdrop behind the dialog.
 * @csspart popup - The dialog popup container.
 * @csspart title - The heading element wrapping the title slot.
 * @csspart description - The paragraph element wrapping the description slot.
 */
let DuiDialogPopupPrimitive = (() => {
    let _classSuper = LitElement;
    let _keepMounted_decorators;
    let _keepMounted_initializers = [];
    let _keepMounted_extraInitializers = [];
    let _initialFocus_decorators;
    let _initialFocus_initializers = [];
    let _initialFocus_extraInitializers = [];
    let _finalFocus_decorators;
    let _finalFocus_initializers = [];
    let _finalFocus_extraInitializers = [];
    let _width_decorators;
    let _width_initializers = [];
    let _width_extraInitializers = [];
    let _private_mounted_decorators;
    let _private_mounted_initializers = [];
    let _private_mounted_extraInitializers = [];
    let _private_mounted_descriptor;
    let _private_startingStyle_decorators;
    let _private_startingStyle_initializers = [];
    let _private_startingStyle_extraInitializers = [];
    let _private_startingStyle_descriptor;
    let _private_endingStyle_decorators;
    let _private_endingStyle_initializers = [];
    let _private_endingStyle_extraInitializers = [];
    let _private_endingStyle_descriptor;
    return class DuiDialogPopupPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _keepMounted_decorators = [property({ type: Boolean, attribute: "keep-mounted" })];
            _initialFocus_decorators = [property({ attribute: "initial-focus" })];
            _finalFocus_decorators = [property({ attribute: "final-focus" })];
            _width_decorators = [property()];
            _private_mounted_decorators = [state()];
            _private_startingStyle_decorators = [state()];
            _private_endingStyle_decorators = [state()];
            __esDecorate(this, null, _keepMounted_decorators, { kind: "accessor", name: "keepMounted", static: false, private: false, access: { has: obj => "keepMounted" in obj, get: obj => obj.keepMounted, set: (obj, value) => { obj.keepMounted = value; } }, metadata: _metadata }, _keepMounted_initializers, _keepMounted_extraInitializers);
            __esDecorate(this, null, _initialFocus_decorators, { kind: "accessor", name: "initialFocus", static: false, private: false, access: { has: obj => "initialFocus" in obj, get: obj => obj.initialFocus, set: (obj, value) => { obj.initialFocus = value; } }, metadata: _metadata }, _initialFocus_initializers, _initialFocus_extraInitializers);
            __esDecorate(this, null, _finalFocus_decorators, { kind: "accessor", name: "finalFocus", static: false, private: false, access: { has: obj => "finalFocus" in obj, get: obj => obj.finalFocus, set: (obj, value) => { obj.finalFocus = value; } }, metadata: _metadata }, _finalFocus_initializers, _finalFocus_extraInitializers);
            __esDecorate(this, null, _width_decorators, { kind: "accessor", name: "width", static: false, private: false, access: { has: obj => "width" in obj, get: obj => obj.width, set: (obj, value) => { obj.width = value; } }, metadata: _metadata }, _width_initializers, _width_extraInitializers);
            __esDecorate(this, _private_mounted_descriptor = { get: __setFunctionName(function () { return this.#mounted_accessor_storage; }, "#mounted", "get"), set: __setFunctionName(function (value) { this.#mounted_accessor_storage = value; }, "#mounted", "set") }, _private_mounted_decorators, { kind: "accessor", name: "#mounted", static: false, private: true, access: { has: obj => #mounted in obj, get: obj => obj.#mounted, set: (obj, value) => { obj.#mounted = value; } }, metadata: _metadata }, _private_mounted_initializers, _private_mounted_extraInitializers);
            __esDecorate(this, _private_startingStyle_descriptor = { get: __setFunctionName(function () { return this.#startingStyle_accessor_storage; }, "#startingStyle", "get"), set: __setFunctionName(function (value) { this.#startingStyle_accessor_storage = value; }, "#startingStyle", "set") }, _private_startingStyle_decorators, { kind: "accessor", name: "#startingStyle", static: false, private: true, access: { has: obj => #startingStyle in obj, get: obj => obj.#startingStyle, set: (obj, value) => { obj.#startingStyle = value; } }, metadata: _metadata }, _private_startingStyle_initializers, _private_startingStyle_extraInitializers);
            __esDecorate(this, _private_endingStyle_descriptor = { get: __setFunctionName(function () { return this.#endingStyle_accessor_storage; }, "#endingStyle", "get"), set: __setFunctionName(function (value) { this.#endingStyle_accessor_storage = value; }, "#endingStyle", "set") }, _private_endingStyle_decorators, { kind: "accessor", name: "#endingStyle", static: false, private: true, access: { has: obj => #endingStyle in obj, get: obj => obj.#endingStyle, set: (obj, value) => { obj.#endingStyle = value; } }, metadata: _metadata }, _private_endingStyle_initializers, _private_endingStyle_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-dialog-popup";
        static styles = [base, hostStyles, componentStyles];
        #keepMounted_accessor_storage = __runInitializers(this, _keepMounted_initializers, false);
        /** Keep the popup in the DOM when closed. */
        get keepMounted() { return this.#keepMounted_accessor_storage; }
        set keepMounted(value) { this.#keepMounted_accessor_storage = value; }
        #initialFocus_accessor_storage = (__runInitializers(this, _keepMounted_extraInitializers), __runInitializers(this, _initialFocus_initializers, undefined));
        /** CSS selector within the popup to focus when the dialog opens. */
        get initialFocus() { return this.#initialFocus_accessor_storage; }
        set initialFocus(value) { this.#initialFocus_accessor_storage = value; }
        #finalFocus_accessor_storage = (__runInitializers(this, _initialFocus_extraInitializers), __runInitializers(this, _finalFocus_initializers, undefined));
        /** CSS selector in the document to focus when the dialog closes. */
        get finalFocus() { return this.#finalFocus_accessor_storage; }
        set finalFocus(value) { this.#finalFocus_accessor_storage = value; }
        #width_accessor_storage = (__runInitializers(this, _finalFocus_extraInitializers), __runInitializers(this, _width_initializers, undefined));
        /** Width of the popup (CSS value, e.g. "32rem" or "600px"). Defaults to 24rem. */
        get width() { return this.#width_accessor_storage; }
        set width(value) { this.#width_accessor_storage = value; }
        #mounted_accessor_storage = (__runInitializers(this, _width_extraInitializers), __runInitializers(this, _private_mounted_initializers, false));
        get #mounted() { return _private_mounted_descriptor.get.call(this); }
        set #mounted(value) { return _private_mounted_descriptor.set.call(this, value); }
        #startingStyle_accessor_storage = (__runInitializers(this, _private_mounted_extraInitializers), __runInitializers(this, _private_startingStyle_initializers, false));
        get #startingStyle() { return _private_startingStyle_descriptor.get.call(this); }
        set #startingStyle(value) { return _private_startingStyle_descriptor.set.call(this, value); }
        #endingStyle_accessor_storage = (__runInitializers(this, _private_startingStyle_extraInitializers), __runInitializers(this, _private_endingStyle_initializers, false));
        get #endingStyle() { return _private_endingStyle_descriptor.get.call(this); }
        set #endingStyle(value) { return _private_endingStyle_descriptor.set.call(this, value); }
        #previouslyFocused = __runInitializers(this, _private_endingStyle_extraInitializers);
        #ctx = new ContextConsumer(this, {
            context: dialogContext,
            subscribe: true,
        });
        updated() {
            const isOpen = this.#ctx.value?.open ?? false;
            if (isOpen && !this.#mounted) {
                this.#animateOpen();
            }
            else if (!isOpen && this.#mounted && !this.#endingStyle) {
                this.#animateClose();
            }
        }
        async #animateOpen() {
            this.#previouslyFocused =
                document.activeElement ?? undefined;
            this.#mounted = true;
            this.#startingStyle = true;
            await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
            this.#startingStyle = false;
            await this.updateComplete;
            this.#trapFocusIn();
        }
        #animateClose() {
            this.#endingStyle = true;
            const popup = this.shadowRoot?.querySelector('[part="popup"]');
            if (!popup) {
                this.#finishClose();
                return;
            }
            let called = false;
            const done = () => {
                if (called)
                    return;
                called = true;
                popup.removeEventListener("transitionend", onEnd);
                clearTimeout(timer);
                this.#finishClose();
            };
            const onEnd = (e) => {
                if (e.propertyName === "opacity") {
                    done();
                }
            };
            popup.addEventListener("transitionend", onEnd);
            const timer = setTimeout(done, 200);
        }
        #finishClose() {
            if (!this.#endingStyle && !this.#mounted)
                return;
            this.#endingStyle = false;
            if (!this.keepMounted) {
                this.#mounted = false;
            }
            this.#restoreFocus();
        }
        #trapFocusIn() {
            const popup = this.shadowRoot?.querySelector('[part="popup"]');
            if (!popup)
                return;
            if (this.initialFocus) {
                const target = popup.querySelector(this.initialFocus);
                if (target) {
                    target.focus();
                    return;
                }
            }
            const autoEl = queryComposedAutofocus(popup);
            if (autoEl) {
                autoEl.focus();
                return;
            }
            const focusables = getComposedFocusableElements(popup);
            if (focusables.length > 0) {
                focusables[0].focus();
                return;
            }
            popup.focus();
        }
        #restoreFocus() {
            if (this.finalFocus) {
                const target = document.querySelector(this.finalFocus);
                target?.focus();
                return;
            }
            this.#previouslyFocused?.focus();
            this.#previouslyFocused = undefined;
        }
        #handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                this.#ctx.value?.closeDialog();
            }
            if (e.key === "Tab") {
                this.#handleTabTrap(e);
            }
        };
        #handleTabTrap(e) {
            const popup = this.shadowRoot?.querySelector('[part="popup"]');
            if (!popup)
                return;
            const focusables = getComposedFocusableElements(popup);
            if (focusables.length === 0) {
                e.preventDefault();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const isFirst = first.matches(":focus");
            const isLast = last.matches(":focus");
            const popupHasFocus = !focusables.some((el) => el.matches(":focus"));
            if (e.shiftKey && (isFirst || popupHasFocus)) {
                e.preventDefault();
                last.focus();
            }
            else if (!e.shiftKey && isLast) {
                e.preventDefault();
                first.focus();
            }
        }
        #handleBackdropClick = () => {
            this.#ctx.value?.closeDialog();
        };
        willUpdate(changed) {
            if (changed.has("width")) {
                if (this.width)
                    this.style.setProperty("--popup-width", this.width);
                else
                    this.style.removeProperty("--popup-width");
            }
            if (this.#mounted || this.keepMounted) {
                this.setAttribute("mounted", "");
            }
            else {
                this.removeAttribute("mounted");
            }
        }
        render() {
            const isOpen = this.#ctx.value?.open ?? false;
            const titleId = this.#ctx.value?.titleId ?? "";
            const descriptionId = this.#ctx.value?.descriptionId ?? "";
            if (!this.#mounted && !this.keepMounted) {
                return html ``;
            }
            return html `
      <div
        part="backdrop"
        ?data-open="${isOpen && !this.#endingStyle}"
        ?data-closed="${!isOpen || this.#endingStyle}"
        ?data-starting-style="${this.#startingStyle}"
        ?data-ending-style="${this.#endingStyle}"
        @click="${this.#handleBackdropClick}"
      ></div>
      <div
        part="popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="${titleId}"
        aria-describedby="${descriptionId}"
        ?data-open="${isOpen && !this.#endingStyle}"
        ?data-closed="${!isOpen || this.#endingStyle}"
        ?data-starting-style="${this.#startingStyle}"
        ?data-ending-style="${this.#endingStyle}"
        tabindex="-1"
        @keydown="${this.#handleKeyDown}"
      >
        <h2 part="title" id="${titleId}"><slot name="title"></slot></h2>
        <p part="description" id="${descriptionId}"><slot name="description"></slot></p>
        <slot></slot>
      </div>
    `;
        }
    };
})();
export { DuiDialogPopupPrimitive };
