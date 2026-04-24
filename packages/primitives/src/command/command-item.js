/** Ported from original DUI: deep-future-app/app/client/components/dui/command */
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
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { commandContext } from "./command-context.ts";
let itemIdCounter = 0;
const nextItemId = () => `dui-command-item-${++itemIdCounter}`;
const styles = css `
  :host {
    display: block;
  }

  :host([data-hidden]) .Item {
    display: none;
  }

  .Item {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    outline: none;
  }
`;
let DuiCommandItemPrimitive = (() => {
    let _classSuper = LitElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _keywords_decorators;
    let _keywords_initializers = [];
    let _keywords_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiCommandItemPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property({ type: String })];
            _keywords_decorators = [property({ type: Array, attribute: false })];
            _disabled_decorators = [property({ type: Boolean })];
            __ctx_decorators = [consume({ context: commandContext, subscribe: true })];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _keywords_decorators, { kind: "accessor", name: "keywords", static: false, private: false, access: { has: obj => "keywords" in obj, get: obj => obj.keywords, set: (obj, value) => { obj.keywords = value; } }, metadata: _metadata }, _keywords_initializers, _keywords_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-command-item";
        static styles = [base, styles];
        #value_accessor_storage = __runInitializers(this, _value_initializers, "");
        /** The value this item represents. */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #keywords_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _keywords_initializers, []));
        /** Additional search keywords. */
        get keywords() { return this.#keywords_accessor_storage; }
        set keywords(value) { this.#keywords_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _keywords_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Whether this item is disabled. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #_ctx_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, __ctx_initializers, void 0));
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #id = (__runInitializers(this, __ctx_extraInitializers), nextItemId());
        // Track previous own-property values to avoid infinite update loops
        #prevValue = undefined;
        #prevKeywords = undefined;
        #prevDisabled = undefined;
        #registered = false;
        get #isSelected() {
            return this._ctx?.selectedItemId === this.#id;
        }
        get #isVisible() {
            if (!this._ctx)
                return true;
            return this._ctx.getScore(this.#id) > 0;
        }
        #getGroupId() {
            const groupHost = this.closest("[data-group-id]");
            return groupHost?.getAttribute("data-group-id") ?? undefined;
        }
        #buildEntry() {
            return {
                id: this.#id,
                value: this.value,
                keywords: this.keywords,
                textContent: this.textContent?.trim() ?? "",
                disabled: this.disabled,
                groupId: this.#getGroupId(),
            };
        }
        connectedCallback() {
            super.connectedCallback();
            // Defer registration to next frame so context is available
            requestAnimationFrame(() => {
                if (!this.isConnected)
                    return;
                this._ctx?.registerItem(this.#buildEntry());
                this.#registered = true;
                this.#prevValue = this.value;
                this.#prevKeywords = this.keywords;
                this.#prevDisabled = this.disabled;
            });
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this._ctx?.unregisterItem(this.#id);
            this.#registered = false;
        }
        willUpdate() {
            // Only call updateItem when own properties change, not on every context update
            if (this.#registered) {
                const valueChanged = this.#prevValue !== this.value;
                const keywordsChanged = this.#prevKeywords !== this.keywords;
                const disabledChanged = this.#prevDisabled !== this.disabled;
                if (valueChanged || keywordsChanged || disabledChanged) {
                    this._ctx?.updateItem(this.#buildEntry());
                    this.#prevValue = this.value;
                    this.#prevKeywords = this.keywords;
                    this.#prevDisabled = this.disabled;
                }
            }
            // Toggle data-hidden attribute
            if (this._ctx?.shouldFilter) {
                if (!this.#isVisible) {
                    this.setAttribute("data-hidden", "");
                }
                else {
                    this.removeAttribute("data-hidden");
                }
            }
            else {
                this.removeAttribute("data-hidden");
            }
            // Update selected attribute
            if (this.#isSelected) {
                this.setAttribute("data-selected", "");
            }
            else {
                this.removeAttribute("data-selected");
            }
        }
        updated() {
            // Scroll into view when selected
            if (this.#isSelected) {
                this.scrollIntoView({ block: "nearest" });
            }
        }
        #handleMouseMove = () => {
            if (!this.disabled && this._ctx?.selectedItemId !== this.#id) {
                this._ctx?.selectItem(this.#id);
            }
        };
        #handleClick = () => {
            if (!this.disabled) {
                this._ctx?.handleItemSelect(this.value);
            }
        };
        render() {
            return html `
      <div
        class="Item"
        role="option"
        id="${this.#id}"
        aria-selected="${this.#isSelected}"
        aria-disabled="${this.disabled}"
        ?data-selected="${this.#isSelected}"
        ?data-disabled="${this.disabled}"
        @mousemove="${this.#handleMouseMove}"
        @click="${this.#handleClick}"
      >
        <slot></slot>
      </div>
    `;
        }
    };
})();
export { DuiCommandItemPrimitive };
