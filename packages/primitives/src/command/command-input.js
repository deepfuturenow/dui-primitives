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
import { css, html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { commandContext } from "./command-context.ts";
const styles = css `
  :host {
    display: block;
  }

  .InputWrapper {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .SearchIcon {
    flex-shrink: 0;
  }

  .Input {
    display: flex;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
  }
`;
let DuiCommandInputPrimitive = (() => {
    let _classSuper = LitElement;
    let _placeholder_decorators;
    let _placeholder_initializers = [];
    let _placeholder_extraInitializers = [];
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiCommandInputPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _placeholder_decorators = [property({ type: String })];
            __ctx_decorators = [consume({ context: commandContext, subscribe: true })];
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } }, metadata: _metadata }, _placeholder_initializers, _placeholder_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-command-input";
        static styles = [base, styles];
        #placeholder_accessor_storage = __runInitializers(this, _placeholder_initializers, "Search...");
        /** Placeholder text for the search input. */
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        #_ctx_accessor_storage = (__runInitializers(this, _placeholder_extraInitializers), __runInitializers(this, __ctx_initializers, void 0));
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #prevSearch = (__runInitializers(this, __ctx_extraInitializers), undefined);
        #handleInput = (event) => {
            const input = event.target;
            this._ctx?.setSearch(input.value);
        };
        #handleKeyDown = (event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
            }
        };
        willUpdate() {
            // Sync input value when search is cleared externally
            if (this.#prevSearch !== undefined &&
                this._ctx?.search === "" &&
                this.#prevSearch !== "") {
                const input = this.shadowRoot?.querySelector(".Input");
                if (input)
                    input.value = "";
            }
            this.#prevSearch = this._ctx?.search;
        }
        render() {
            return html `
      <div class="InputWrapper">
        <svg
          class="SearchIcon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          class="Input"
          type="text"
          role="combobox"
          autocomplete="off"
          aria-expanded="true"
          aria-controls="${this._ctx?.listId ?? nothing}"
          aria-activedescendant="${this._ctx?.selectedItemId ?? nothing}"
          .placeholder="${this.placeholder}"
          @input="${this.#handleInput}"
          @keydown="${this.#handleKeyDown}"
        />
      </div>
    `;
        }
    };
})();
export { DuiCommandInputPrimitive };
