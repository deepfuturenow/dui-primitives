/** Ported from original DUI: deep-future-app/app/client/components/dui/tabs */
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
import { tabsContext } from "./tabs-context.ts";
const styles = css `
  :host {
    display: block;
  }

  [part="tab"] {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    margin: 0;
    outline: 0;
    background: none;
    appearance: none;
    font-family: inherit;
    user-select: none;
    white-space: nowrap;
    word-break: keep-all;
    cursor: pointer;
  }

  [part="tab"][data-disabled] {
    cursor: not-allowed;
  }
`;
/**
 * Individual tab trigger button.
 */
let DuiTabPrimitive = (() => {
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
    return class DuiTabPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property()];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            __ctx_decorators = [consume({ context: tabsContext, subscribe: true })];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-tab";
        static styles = [base, styles];
        #value_accessor_storage = __runInitializers(this, _value_initializers, "");
        /** Tab value used to match with the corresponding panel. */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #_ctx_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, __ctx_initializers, void 0));
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        get #isActive() {
            return this._ctx?.value === this.value;
        }
        #handleClick = (__runInitializers(this, __ctx_extraInitializers), () => {
            if (this.disabled)
                return;
            this._ctx?.select(this.value);
        });
        #handleKeyDown = (event) => {
            if (this.disabled)
                return;
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                this._ctx?.select(this.value);
            }
        };
        render() {
            const isActive = this.#isActive;
            return html `
      <button
        part="tab"
        role="tab"
        aria-selected=${isActive}
        ?data-active=${isActive}
        ?data-disabled=${this.disabled}
        ?disabled=${this.disabled}
        tabindex=${isActive ? 0 : -1}
        @click=${this.#handleClick}
        @keydown=${this.#handleKeyDown}
      >
        <slot></slot>
      </button>
    `;
        }
    };
})();
export { DuiTabPrimitive };
