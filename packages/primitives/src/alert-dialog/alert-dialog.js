/** Ported from original DUI: deep-future-app/app/client/components/dui/alert-dialog */
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
import { alertDialogContext, } from "./alert-dialog-context.ts";
export const openChangeEvent = customEvent("open-change", { bubbles: true, composed: true });
const hostStyles = css `
  :host {
    display: contents;
  }
`;
/**
 * `<dui-alert-dialog>` — Root element for the alert dialog compound component.
 *
 * Manages open/close state and provides context to child elements.
 * Does not render visible DOM — uses `display: contents`.
 *
 * Unlike `<dui-dialog>`, alert dialogs do NOT close on backdrop click,
 * requiring explicit user action to dismiss.
 *
 * @slot - Default slot for trigger, popup, and other alert dialog parts.
 * @fires open-change - Fired when the dialog opens or closes. Detail: { open: boolean }
 */
let DuiAlertDialogPrimitive = (() => {
    let _classSuper = LitElement;
    let _open_decorators;
    let _open_initializers = [];
    let _open_extraInitializers = [];
    let _defaultOpen_decorators;
    let _defaultOpen_initializers = [];
    let _defaultOpen_extraInitializers = [];
    let _private_internalOpen_decorators;
    let _private_internalOpen_initializers = [];
    let _private_internalOpen_extraInitializers = [];
    let _private_internalOpen_descriptor;
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiAlertDialogPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _open_decorators = [property({ type: Boolean, reflect: true })];
            _defaultOpen_decorators = [property({ type: Boolean, attribute: "default-open" })];
            _private_internalOpen_decorators = [state()];
            __ctx_decorators = [provide({ context: alertDialogContext }), state()];
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } }, metadata: _metadata }, _open_initializers, _open_extraInitializers);
            __esDecorate(this, null, _defaultOpen_decorators, { kind: "accessor", name: "defaultOpen", static: false, private: false, access: { has: obj => "defaultOpen" in obj, get: obj => obj.defaultOpen, set: (obj, value) => { obj.defaultOpen = value; } }, metadata: _metadata }, _defaultOpen_initializers, _defaultOpen_extraInitializers);
            __esDecorate(this, _private_internalOpen_descriptor = { get: __setFunctionName(function () { return this.#internalOpen_accessor_storage; }, "#internalOpen", "get"), set: __setFunctionName(function (value) { this.#internalOpen_accessor_storage = value; }, "#internalOpen", "set") }, _private_internalOpen_decorators, { kind: "accessor", name: "#internalOpen", static: false, private: true, access: { has: obj => #internalOpen in obj, get: obj => obj.#internalOpen, set: (obj, value) => { obj.#internalOpen = value; } }, metadata: _metadata }, _private_internalOpen_initializers, _private_internalOpen_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-alert-dialog";
        static styles = [base, hostStyles];
        #open_accessor_storage = __runInitializers(this, _open_initializers, undefined);
        /** Controls the dialog open state (controlled mode). */
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #defaultOpen_accessor_storage = (__runInitializers(this, _open_extraInitializers), __runInitializers(this, _defaultOpen_initializers, false));
        /** Initial open state for uncontrolled mode. */
        get defaultOpen() { return this.#defaultOpen_accessor_storage; }
        set defaultOpen(value) { this.#defaultOpen_accessor_storage = value; }
        #internalOpen_accessor_storage = (__runInitializers(this, _defaultOpen_extraInitializers), __runInitializers(this, _private_internalOpen_initializers, false));
        get #internalOpen() { return _private_internalOpen_descriptor.get.call(this); }
        set #internalOpen(value) { return _private_internalOpen_descriptor.set.call(this, value); }
        #instanceId = (__runInitializers(this, _private_internalOpen_extraInitializers), crypto.randomUUID().slice(0, 8));
        #dialogId = `dui-alert-dialog-${this.#instanceId}`;
        #triggerId = `dui-alert-trigger-${this.#instanceId}`;
        #titleId = `dui-alert-title-${this.#instanceId}`;
        #descriptionId = `dui-alert-desc-${this.#instanceId}`;
        get #isOpen() {
            return this.open ?? this.#internalOpen;
        }
        #openDialog = () => {
            if (this.open === undefined) {
                this.#internalOpen = true;
            }
            this.dispatchEvent(openChangeEvent({ open: true }));
        };
        #closeDialog = () => {
            if (this.open === undefined) {
                this.#internalOpen = false;
            }
            this.dispatchEvent(openChangeEvent({ open: false }));
        };
        #_ctx_accessor_storage = __runInitializers(this, __ctx_initializers, this.#buildContext());
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #buildContext() {
            return {
                open: this.#isOpen,
                dialogId: this.#dialogId,
                triggerId: this.#triggerId,
                titleId: this.#titleId,
                descriptionId: this.#descriptionId,
                openDialog: this.#openDialog,
                closeDialog: this.#closeDialog,
            };
        }
        connectedCallback() {
            super.connectedCallback();
            if (this.open === undefined && this.defaultOpen) {
                this.#internalOpen = true;
            }
            this._ctx = this.#buildContext();
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
export { DuiAlertDialogPrimitive };
