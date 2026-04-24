/** Ported from original DUI: deep-future-app/app/client/components/dui/accordion */
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
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { accordionContext, } from "./accordion-context.ts";
export const openChangeEvent = customEvent("open-change", { bubbles: true, composed: true });
const styles = css `
  :host {
    display: block;
  }

  [part="trigger"] {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
    border: none;
    background: none;
    text-align: left;
    outline: none;
    box-sizing: border-box;
  }

  [part="trigger"][data-disabled] {
    cursor: default;
  }

  [part="panel"] {
    overflow: hidden;
    contain: content;
    transition-property: height;
  }
`;
let DuiAccordionItemPrimitive = (() => {
    let _classSuper = LitElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    let _private_starting_decorators;
    let _private_starting_initializers = [];
    let _private_starting_extraInitializers = [];
    let _private_starting_descriptor;
    let _private_ending_decorators;
    let _private_ending_initializers = [];
    let _private_ending_extraInitializers = [];
    let _private_ending_descriptor;
    let _private_panelHeight_decorators;
    let _private_panelHeight_initializers = [];
    let _private_panelHeight_extraInitializers = [];
    let _private_panelHeight_descriptor;
    let _private_visible_decorators;
    let _private_visible_initializers = [];
    let _private_visible_extraInitializers = [];
    let _private_visible_descriptor;
    return class DuiAccordionItemPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property({ type: String })];
            _disabled_decorators = [property({ type: Boolean })];
            __ctx_decorators = [consume({ context: accordionContext, subscribe: true })];
            _private_starting_decorators = [state()];
            _private_ending_decorators = [state()];
            _private_panelHeight_decorators = [state()];
            _private_visible_decorators = [state()];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            __esDecorate(this, _private_starting_descriptor = { get: __setFunctionName(function () { return this.#starting_accessor_storage; }, "#starting", "get"), set: __setFunctionName(function (value) { this.#starting_accessor_storage = value; }, "#starting", "set") }, _private_starting_decorators, { kind: "accessor", name: "#starting", static: false, private: true, access: { has: obj => #starting in obj, get: obj => obj.#starting, set: (obj, value) => { obj.#starting = value; } }, metadata: _metadata }, _private_starting_initializers, _private_starting_extraInitializers);
            __esDecorate(this, _private_ending_descriptor = { get: __setFunctionName(function () { return this.#ending_accessor_storage; }, "#ending", "get"), set: __setFunctionName(function (value) { this.#ending_accessor_storage = value; }, "#ending", "set") }, _private_ending_decorators, { kind: "accessor", name: "#ending", static: false, private: true, access: { has: obj => #ending in obj, get: obj => obj.#ending, set: (obj, value) => { obj.#ending = value; } }, metadata: _metadata }, _private_ending_initializers, _private_ending_extraInitializers);
            __esDecorate(this, _private_panelHeight_descriptor = { get: __setFunctionName(function () { return this.#panelHeight_accessor_storage; }, "#panelHeight", "get"), set: __setFunctionName(function (value) { this.#panelHeight_accessor_storage = value; }, "#panelHeight", "set") }, _private_panelHeight_decorators, { kind: "accessor", name: "#panelHeight", static: false, private: true, access: { has: obj => #panelHeight in obj, get: obj => obj.#panelHeight, set: (obj, value) => { obj.#panelHeight = value; } }, metadata: _metadata }, _private_panelHeight_initializers, _private_panelHeight_extraInitializers);
            __esDecorate(this, _private_visible_descriptor = { get: __setFunctionName(function () { return this.#visible_accessor_storage; }, "#visible", "get"), set: __setFunctionName(function (value) { this.#visible_accessor_storage = value; }, "#visible", "set") }, _private_visible_decorators, { kind: "accessor", name: "#visible", static: false, private: true, access: { has: obj => #visible in obj, get: obj => obj.#visible, set: (obj, value) => { obj.#visible = value; } }, metadata: _metadata }, _private_visible_initializers, _private_visible_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-accordion-item";
        static styles = [base, styles];
        #value_accessor_storage = __runInitializers(this, _value_initializers, "");
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #_ctx_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, __ctx_initializers, void 0));
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #starting_accessor_storage = (__runInitializers(this, __ctx_extraInitializers), __runInitializers(this, _private_starting_initializers, false));
        get #starting() { return _private_starting_descriptor.get.call(this); }
        set #starting(value) { return _private_starting_descriptor.set.call(this, value); }
        #ending_accessor_storage = (__runInitializers(this, _private_starting_extraInitializers), __runInitializers(this, _private_ending_initializers, false));
        get #ending() { return _private_ending_descriptor.get.call(this); }
        set #ending(value) { return _private_ending_descriptor.set.call(this, value); }
        #panelHeight_accessor_storage = (__runInitializers(this, _private_ending_extraInitializers), __runInitializers(this, _private_panelHeight_initializers, "0"));
        get #panelHeight() { return _private_panelHeight_descriptor.get.call(this); }
        set #panelHeight(value) { return _private_panelHeight_descriptor.set.call(this, value); }
        #visible_accessor_storage = (__runInitializers(this, _private_panelHeight_extraInitializers), __runInitializers(this, _private_visible_initializers, false));
        get #visible() { return _private_visible_descriptor.get.call(this); }
        set #visible(value) { return _private_visible_descriptor.set.call(this, value); }
        #prevOpen = (__runInitializers(this, _private_visible_extraInitializers), undefined);
        #animGen = 0;
        get #open() {
            return this._ctx?.openValues.includes(this.value) ?? false;
        }
        get #isDisabled() {
            return this.disabled || this._ctx?.disabled;
        }
        get #triggerId() {
            return `dui-trigger-${this.value}`;
        }
        get #panelId() {
            return `dui-panel-${this.value}`;
        }
        connectedCallback() {
            super.connectedCallback();
            this._ctx?.registerItem(this.value, this);
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this._ctx?.unregisterItem(this.value);
        }
        willUpdate() {
            const isOpen = this.#open;
            if (this.#prevOpen === undefined) {
                this.#visible = isOpen;
                this.#panelHeight = isOpen ? "auto" : "0";
            }
            else if (this.#prevOpen !== isOpen) {
                if (isOpen) {
                    this.#startOpenAnimation();
                }
                else {
                    this.#startCloseAnimation();
                }
                this.dispatchEvent(openChangeEvent({ value: this.value, open: isOpen }));
            }
            this.#prevOpen = isOpen;
        }
        #startOpenAnimation() {
            const gen = ++this.#animGen;
            this.#ending = false;
            this.#visible = true;
            this.#starting = true;
            this.#panelHeight = "0";
            requestAnimationFrame(() => {
                if (this.#animGen !== gen)
                    return;
                const panel = this.shadowRoot?.querySelector("[part='panel']");
                if (panel) {
                    this.#panelHeight = `${panel.scrollHeight}px`;
                }
                this.#starting = false;
            });
        }
        #startCloseAnimation() {
            const gen = ++this.#animGen;
            this.#starting = false;
            const panel = this.shadowRoot?.querySelector("[part='panel']");
            if (panel) {
                this.#panelHeight = `${panel.scrollHeight}px`;
            }
            requestAnimationFrame(() => {
                if (this.#animGen !== gen)
                    return;
                this.#ending = true;
                this.#panelHeight = "0";
            });
        }
        #onTransitionEnd = (event) => {
            if (event.propertyName !== "height")
                return;
            if (this.#ending) {
                this.#ending = false;
                if (!this._ctx?.keepMounted) {
                    this.#visible = false;
                }
            }
            else if (this.#open) {
                this.#panelHeight = "auto";
            }
        };
        #onClick = () => {
            if (this.#isDisabled)
                return;
            this._ctx.toggle(this.value);
        };
        #onKeyDown = (event) => {
            if (this.#isDisabled)
                return;
            const isVertical = this._ctx.orientation === "vertical";
            const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
            const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
            switch (event.key) {
                case nextKey:
                    event.preventDefault();
                    this._ctx.focusItem(this.value, "next");
                    break;
                case prevKey:
                    event.preventDefault();
                    this._ctx.focusItem(this.value, "prev");
                    break;
                case "Home":
                    event.preventDefault();
                    this._ctx.focusItem(this.value, "first");
                    break;
                case "End":
                    event.preventDefault();
                    this._ctx.focusItem(this.value, "last");
                    break;
            }
        };
        render() {
            const shouldRender = this.#visible || this._ctx?.keepMounted;
            return html `
      <div
        part="item"
        ?data-open=${this.#open}
        ?data-disabled=${this.#isDisabled}
      >
        <h3 part="header">
          <button
            part="trigger"
            id=${this.#triggerId}
            aria-expanded=${this.#open}
            aria-controls=${this.#panelId}
            ?data-open=${this.#open}
            ?data-disabled=${this.#isDisabled}
            @click=${this.#onClick}
            @keydown=${this.#onKeyDown}
          >
            <slot name="trigger"></slot>
          </button>
        </h3>
        ${shouldRender
                ? html `
              <div
                part="panel"
                id=${this.#panelId}
                role="region"
                aria-labelledby=${this.#triggerId}
                style="height: ${this.#panelHeight}"
                ?data-open=${this.#open && !this.#starting}
                ?data-starting-style=${this.#starting}
                ?data-ending-style=${this.#ending}
                ?hidden=${!this.#visible && !this.#ending}
                @transitionend=${this.#onTransitionEnd}
              >
                <div part="content">
                  <slot></slot>
                </div>
              </div>
            `
                : nothing}
      </div>
    `;
        }
    };
})();
export { DuiAccordionItemPrimitive };
