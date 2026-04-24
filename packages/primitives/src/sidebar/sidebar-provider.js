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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { sidebarContext } from "./sidebar-context.ts";
export const openChangeEvent = customEvent("open-change", { bubbles: true, composed: true });
const styles = css `
  :host {
    display: flex;
    width: 100%;
    height: 100%;
  }
`;
/**
 * `<dui-sidebar-provider>` — Root state manager for the sidebar compound component.
 *
 * Manages open/close state, mobile detection, and provides context to all
 * sidebar sub-components. Wraps the entire layout (sidebar + main content).
 *
 * @slot - Default slot for sidebar and content areas.
 * @fires open-change - Fired when the sidebar opens or closes. Detail: { open: boolean }
 */
let DuiSidebarProviderPrimitive = (() => {
    let _classSuper = LitElement;
    let _open_decorators;
    let _open_initializers = [];
    let _open_extraInitializers = [];
    let _defaultOpen_decorators;
    let _defaultOpen_initializers = [];
    let _defaultOpen_extraInitializers = [];
    let _side_decorators;
    let _side_initializers = [];
    let _side_extraInitializers = [];
    let _variant_decorators;
    let _variant_initializers = [];
    let _variant_extraInitializers = [];
    let _collapsible_decorators;
    let _collapsible_initializers = [];
    let _collapsible_extraInitializers = [];
    let _private_internalOpen_decorators;
    let _private_internalOpen_initializers = [];
    let _private_internalOpen_extraInitializers = [];
    let _private_internalOpen_descriptor;
    let _private_openMobile_decorators;
    let _private_openMobile_initializers = [];
    let _private_openMobile_extraInitializers = [];
    let _private_openMobile_descriptor;
    let _private_isMobile_decorators;
    let _private_isMobile_initializers = [];
    let _private_isMobile_extraInitializers = [];
    let _private_isMobile_descriptor;
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiSidebarProviderPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _open_decorators = [property({ type: Boolean })];
            _defaultOpen_decorators = [property({ type: Boolean, attribute: "default-open" })];
            _side_decorators = [property({ reflect: true })];
            _variant_decorators = [property({ reflect: true })];
            _collapsible_decorators = [property({ reflect: true })];
            _private_internalOpen_decorators = [state()];
            _private_openMobile_decorators = [state()];
            _private_isMobile_decorators = [state()];
            __ctx_decorators = [provide({ context: sidebarContext }), state()];
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } }, metadata: _metadata }, _open_initializers, _open_extraInitializers);
            __esDecorate(this, null, _defaultOpen_decorators, { kind: "accessor", name: "defaultOpen", static: false, private: false, access: { has: obj => "defaultOpen" in obj, get: obj => obj.defaultOpen, set: (obj, value) => { obj.defaultOpen = value; } }, metadata: _metadata }, _defaultOpen_initializers, _defaultOpen_extraInitializers);
            __esDecorate(this, null, _side_decorators, { kind: "accessor", name: "side", static: false, private: false, access: { has: obj => "side" in obj, get: obj => obj.side, set: (obj, value) => { obj.side = value; } }, metadata: _metadata }, _side_initializers, _side_extraInitializers);
            __esDecorate(this, null, _variant_decorators, { kind: "accessor", name: "variant", static: false, private: false, access: { has: obj => "variant" in obj, get: obj => obj.variant, set: (obj, value) => { obj.variant = value; } }, metadata: _metadata }, _variant_initializers, _variant_extraInitializers);
            __esDecorate(this, null, _collapsible_decorators, { kind: "accessor", name: "collapsible", static: false, private: false, access: { has: obj => "collapsible" in obj, get: obj => obj.collapsible, set: (obj, value) => { obj.collapsible = value; } }, metadata: _metadata }, _collapsible_initializers, _collapsible_extraInitializers);
            __esDecorate(this, _private_internalOpen_descriptor = { get: __setFunctionName(function () { return this.#internalOpen_accessor_storage; }, "#internalOpen", "get"), set: __setFunctionName(function (value) { this.#internalOpen_accessor_storage = value; }, "#internalOpen", "set") }, _private_internalOpen_decorators, { kind: "accessor", name: "#internalOpen", static: false, private: true, access: { has: obj => #internalOpen in obj, get: obj => obj.#internalOpen, set: (obj, value) => { obj.#internalOpen = value; } }, metadata: _metadata }, _private_internalOpen_initializers, _private_internalOpen_extraInitializers);
            __esDecorate(this, _private_openMobile_descriptor = { get: __setFunctionName(function () { return this.#openMobile_accessor_storage; }, "#openMobile", "get"), set: __setFunctionName(function (value) { this.#openMobile_accessor_storage = value; }, "#openMobile", "set") }, _private_openMobile_decorators, { kind: "accessor", name: "#openMobile", static: false, private: true, access: { has: obj => #openMobile in obj, get: obj => obj.#openMobile, set: (obj, value) => { obj.#openMobile = value; } }, metadata: _metadata }, _private_openMobile_initializers, _private_openMobile_extraInitializers);
            __esDecorate(this, _private_isMobile_descriptor = { get: __setFunctionName(function () { return this.#isMobile_accessor_storage; }, "#isMobile", "get"), set: __setFunctionName(function (value) { this.#isMobile_accessor_storage = value; }, "#isMobile", "set") }, _private_isMobile_decorators, { kind: "accessor", name: "#isMobile", static: false, private: true, access: { has: obj => #isMobile in obj, get: obj => obj.#isMobile, set: (obj, value) => { obj.#isMobile = value; } }, metadata: _metadata }, _private_isMobile_initializers, _private_isMobile_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-sidebar-provider";
        static styles = [base, styles];
        #open_accessor_storage = __runInitializers(this, _open_initializers, undefined);
        /** Controls the sidebar open state (controlled mode). */
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #defaultOpen_accessor_storage = (__runInitializers(this, _open_extraInitializers), __runInitializers(this, _defaultOpen_initializers, true));
        /** Initial open state for uncontrolled mode. Defaults to true. */
        get defaultOpen() { return this.#defaultOpen_accessor_storage; }
        set defaultOpen(value) { this.#defaultOpen_accessor_storage = value; }
        #side_accessor_storage = (__runInitializers(this, _defaultOpen_extraInitializers), __runInitializers(this, _side_initializers, "left"));
        /** Which side the sidebar appears on. */
        get side() { return this.#side_accessor_storage; }
        set side(value) { this.#side_accessor_storage = value; }
        #variant_accessor_storage = (__runInitializers(this, _side_extraInitializers), __runInitializers(this, _variant_initializers, ""));
        /** Visual variant of the sidebar. */
        get variant() { return this.#variant_accessor_storage; }
        set variant(value) { this.#variant_accessor_storage = value; }
        #collapsible_accessor_storage = (__runInitializers(this, _variant_extraInitializers), __runInitializers(this, _collapsible_initializers, "offcanvas"));
        /** How the sidebar collapses. */
        get collapsible() { return this.#collapsible_accessor_storage; }
        set collapsible(value) { this.#collapsible_accessor_storage = value; }
        #internalOpen_accessor_storage = (__runInitializers(this, _collapsible_extraInitializers), __runInitializers(this, _private_internalOpen_initializers, true));
        get #internalOpen() { return _private_internalOpen_descriptor.get.call(this); }
        set #internalOpen(value) { return _private_internalOpen_descriptor.set.call(this, value); }
        #openMobile_accessor_storage = (__runInitializers(this, _private_internalOpen_extraInitializers), __runInitializers(this, _private_openMobile_initializers, false));
        get #openMobile() { return _private_openMobile_descriptor.get.call(this); }
        set #openMobile(value) { return _private_openMobile_descriptor.set.call(this, value); }
        #isMobile_accessor_storage = (__runInitializers(this, _private_openMobile_extraInitializers), __runInitializers(this, _private_isMobile_initializers, false));
        get #isMobile() { return _private_isMobile_descriptor.get.call(this); }
        set #isMobile(value) { return _private_isMobile_descriptor.set.call(this, value); }
        #mediaQuery = __runInitializers(this, _private_isMobile_extraInitializers);
        #boundOnMediaChange;
        #boundOnKeyDown;
        get #isOpen() {
            return this.open ?? this.#internalOpen;
        }
        #setOpen = (value) => {
            if (this.#isMobile) {
                this.#openMobile = value;
            }
            else {
                if (this.open === undefined) {
                    this.#internalOpen = value;
                }
                this.dispatchEvent(openChangeEvent({ open: value }));
            }
        };
        #toggleSidebar = () => {
            if (this.#isMobile) {
                this.#openMobile = !this.#openMobile;
            }
            else {
                this.#setOpen(!this.#isOpen);
            }
        };
        #onMediaChange = (e) => {
            this.#isMobile = !e.matches;
            if (!this.#isMobile) {
                this.#openMobile = false;
            }
        };
        #onKeyDown = (e) => {
            if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                this.#toggleSidebar();
            }
        };
        #_ctx_accessor_storage = __runInitializers(this, __ctx_initializers, this.#buildContext());
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #buildContext() {
            return {
                state: this.#isOpen ? "expanded" : "collapsed",
                open: this.#isOpen,
                openMobile: this.#openMobile,
                isMobile: this.#isMobile,
                side: this.side,
                variant: this.variant,
                collapsible: this.collapsible,
                setOpen: this.#setOpen,
                toggleSidebar: this.#toggleSidebar,
            };
        }
        connectedCallback() {
            super.connectedCallback();
            if (this.open === undefined) {
                this.#internalOpen = this.defaultOpen;
            }
            this.#mediaQuery = matchMedia("(min-width: 768px)");
            this.#isMobile = !this.#mediaQuery.matches;
            this.#boundOnMediaChange = this.#onMediaChange.bind(this);
            this.#mediaQuery.addEventListener("change", this.#boundOnMediaChange);
            this.#boundOnKeyDown = this.#onKeyDown.bind(this);
            document.addEventListener("keydown", this.#boundOnKeyDown);
            this._ctx = this.#buildContext();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            if (this.#mediaQuery && this.#boundOnMediaChange) {
                this.#mediaQuery.removeEventListener("change", this.#boundOnMediaChange);
            }
            if (this.#boundOnKeyDown) {
                document.removeEventListener("keydown", this.#boundOnKeyDown);
            }
        }
        willUpdate() {
            this._ctx = this.#buildContext();
        }
        render() {
            return html `<slot></slot>`;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, __ctx_extraInitializers);
        }
    };
})();
export { DuiSidebarProviderPrimitive };
