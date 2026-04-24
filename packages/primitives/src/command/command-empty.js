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
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { commandContext } from "./command-context.ts";
const styles = css `
  :host {
    display: block;
  }

  :host([data-hidden]) .Empty {
    display: none;
  }

  .Empty {
    text-align: center;
  }
`;
let DuiCommandEmptyPrimitive = (() => {
    let _classSuper = LitElement;
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiCommandEmptyPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __ctx_decorators = [consume({ context: commandContext, subscribe: true })];
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-command-empty";
        static styles = [base, styles];
        #_ctx_accessor_storage = __runInitializers(this, __ctx_initializers, void 0);
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        willUpdate() {
            const shouldShow = this._ctx?.search !== "" && this._ctx?.getVisibleCount() === 0;
            if (shouldShow) {
                this.removeAttribute("data-hidden");
            }
            else {
                this.setAttribute("data-hidden", "");
            }
        }
        render() {
            return html `
      <div class="Empty" role="status">
        <slot></slot>
      </div>
    `;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, __ctx_extraInitializers);
        }
    };
})();
export { DuiCommandEmptyPrimitive };
