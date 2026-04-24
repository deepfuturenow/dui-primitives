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
import { provide } from "@lit/context";
import { base } from "@dui/core/base";
import { menubarContext, } from "./menubar-context.ts";
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    align-items: center;
  }

  :host([orientation="vertical"]) [part="root"] {
    flex-direction: column;
    align-items: stretch;
  }
`;
/**
 * `<dui-menubar>` — A horizontal bar of menus with coordinated open/close.
 *
 * Contains `<dui-menu>` children. When one menu is open, hovering another
 * menu trigger opens it and closes the previous one.
 *
 * @slot - `dui-menu` children.
 * @csspart root - The menubar container.
 */
let DuiMenubarPrimitive = (() => {
    let _classSuper = LitElement;
    let _loop_decorators;
    let _loop_initializers = [];
    let _loop_extraInitializers = [];
    let _orientation_decorators;
    let _orientation_initializers = [];
    let _orientation_extraInitializers = [];
    let _private_activeMenuId_decorators;
    let _private_activeMenuId_initializers = [];
    let _private_activeMenuId_extraInitializers = [];
    let _private_activeMenuId_descriptor;
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiMenubarPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _loop_decorators = [property({ type: Boolean })];
            _orientation_decorators = [property({ reflect: true })];
            _private_activeMenuId_decorators = [state()];
            __ctx_decorators = [provide({ context: menubarContext }), state()];
            __esDecorate(this, null, _loop_decorators, { kind: "accessor", name: "loop", static: false, private: false, access: { has: obj => "loop" in obj, get: obj => obj.loop, set: (obj, value) => { obj.loop = value; } }, metadata: _metadata }, _loop_initializers, _loop_extraInitializers);
            __esDecorate(this, null, _orientation_decorators, { kind: "accessor", name: "orientation", static: false, private: false, access: { has: obj => "orientation" in obj, get: obj => obj.orientation, set: (obj, value) => { obj.orientation = value; } }, metadata: _metadata }, _orientation_initializers, _orientation_extraInitializers);
            __esDecorate(this, _private_activeMenuId_descriptor = { get: __setFunctionName(function () { return this.#activeMenuId_accessor_storage; }, "#activeMenuId", "get"), set: __setFunctionName(function (value) { this.#activeMenuId_accessor_storage = value; }, "#activeMenuId", "set") }, _private_activeMenuId_decorators, { kind: "accessor", name: "#activeMenuId", static: false, private: true, access: { has: obj => #activeMenuId in obj, get: obj => obj.#activeMenuId, set: (obj, value) => { obj.#activeMenuId = value; } }, metadata: _metadata }, _private_activeMenuId_initializers, _private_activeMenuId_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-menubar";
        static styles = [base, styles];
        #loop_accessor_storage = __runInitializers(this, _loop_initializers, true);
        get loop() { return this.#loop_accessor_storage; }
        set loop(value) { this.#loop_accessor_storage = value; }
        #orientation_accessor_storage = (__runInitializers(this, _loop_extraInitializers), __runInitializers(this, _orientation_initializers, "horizontal"));
        get orientation() { return this.#orientation_accessor_storage; }
        set orientation(value) { this.#orientation_accessor_storage = value; }
        #activeMenuId_accessor_storage = (__runInitializers(this, _orientation_extraInitializers), __runInitializers(this, _private_activeMenuId_initializers, null));
        get #activeMenuId() { return _private_activeMenuId_descriptor.get.call(this); }
        set #activeMenuId(value) { return _private_activeMenuId_descriptor.set.call(this, value); }
        #getMenus() {
            return [...this.querySelectorAll("dui-menu")];
        }
        #openMenu = (__runInitializers(this, _private_activeMenuId_extraInitializers), (id) => {
            this.#activeMenuId = id;
        });
        #closeAll = () => {
            this.#activeMenuId = null;
        };
        #navigateToMenu = (direction) => {
            const menus = this.#getMenus();
            if (menus.length === 0)
                return;
            const currentIndex = menus.findIndex((m) => m.getAttribute("data-menubar-id") === this.#activeMenuId);
            let nextIndex;
            if (direction === "next") {
                nextIndex = currentIndex + 1;
                if (nextIndex >= menus.length) {
                    nextIndex = this.loop ? 0 : menus.length - 1;
                }
            }
            else {
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) {
                    nextIndex = this.loop ? menus.length - 1 : 0;
                }
            }
            const nextMenu = menus[nextIndex];
            if (!nextMenu)
                return;
            const nextId = nextMenu.getAttribute("data-menubar-id");
            if (nextId) {
                this.#activeMenuId = nextId;
            }
            // Focus the trigger of the next menu
            const trigger = nextMenu.querySelector('[slot="trigger"]');
            trigger?.focus();
        };
        #_ctx_accessor_storage = __runInitializers(this, __ctx_initializers, this.#buildContext());
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #buildContext() {
            return {
                activeMenuId: this.#activeMenuId,
                openMenu: this.#openMenu,
                closeAll: this.#closeAll,
                navigateToMenu: this.#navigateToMenu,
            };
        }
        willUpdate() {
            this._ctx = this.#buildContext();
        }
        #onKeyDown = (__runInitializers(this, __ctx_extraInitializers), (e) => {
            const isHorizontal = this.orientation === "horizontal";
            const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
            const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
            if (e.key === nextKey) {
                e.preventDefault();
                this.#navigateToMenu("next");
            }
            else if (e.key === prevKey) {
                e.preventDefault();
                this.#navigateToMenu("prev");
            }
        });
        render() {
            return html `
      <div
        part="root"
        role="menubar"
        aria-orientation="${this.orientation}"
        @keydown="${this.#onKeyDown}"
      >
        <slot></slot>
      </div>
    `;
        }
    };
})();
export { DuiMenubarPrimitive };
