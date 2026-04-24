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
let groupIdCounter = 0;
const nextGroupId = () => `dui-command-group-${++groupIdCounter}`;
const styles = css `
  :host {
    display: block;
  }

  :host([data-hidden]) .Group {
    display: none;
  }

  .Group {
    overflow: hidden;
  }
`;
let DuiCommandGroupPrimitive = (() => {
    let _classSuper = LitElement;
    let _heading_decorators;
    let _heading_initializers = [];
    let _heading_extraInitializers = [];
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiCommandGroupPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _heading_decorators = [property({ type: String })];
            __ctx_decorators = [consume({ context: commandContext, subscribe: true })];
            __esDecorate(this, null, _heading_decorators, { kind: "accessor", name: "heading", static: false, private: false, access: { has: obj => "heading" in obj, get: obj => obj.heading, set: (obj, value) => { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-command-group";
        static styles = [base, styles];
        #heading_accessor_storage = __runInitializers(this, _heading_initializers, "");
        /** Heading text for this group. */
        get heading() { return this.#heading_accessor_storage; }
        set heading(value) { this.#heading_accessor_storage = value; }
        #_ctx_accessor_storage = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, __ctx_initializers, void 0));
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #groupId = (__runInitializers(this, __ctx_extraInitializers), nextGroupId());
        connectedCallback() {
            super.connectedCallback();
            this.setAttribute("data-group-id", this.#groupId);
            this._ctx?.registerGroup(this.#groupId);
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this._ctx?.unregisterGroup(this.#groupId);
        }
        willUpdate() {
            // Hide group when no visible items
            if (this._ctx?.shouldFilter) {
                const visibleCount = this._ctx.getGroupVisibleCount(this.#groupId);
                if (visibleCount === 0 && this._ctx.search !== "") {
                    this.setAttribute("data-hidden", "");
                }
                else {
                    this.removeAttribute("data-hidden");
                }
            }
            else {
                this.removeAttribute("data-hidden");
            }
        }
        render() {
            return html `
      <div class="Group" role="group" aria-label="${this.heading || nothing}">
        ${this.heading
                ? html `<div class="Heading" aria-hidden="true">${this.heading}</div>`
                : nothing}
        <slot></slot>
      </div>
    `;
        }
    };
})();
export { DuiCommandGroupPrimitive };
