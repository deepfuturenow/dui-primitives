/** Ported from original DUI: deep-future-app/app/client/components/dui/tooltip */
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
import { tooltipContext, } from "./tooltip-context.ts";
export const openChangeEvent = customEvent("open-change", { bubbles: true, composed: true });
const hostStyles = css `
  :host {
    display: contents;
  }
`;
/**
 * `<dui-tooltip>` — A tooltip root that provides context for trigger and popup.
 *
 * @slot - Default slot for dui-tooltip-trigger and dui-tooltip-popup.
 * @fires open-change - Dispatched when the tooltip opens or closes.
 */
let DuiTooltipPrimitive = (() => {
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
    let _sideOffset_decorators;
    let _sideOffset_initializers = [];
    let _sideOffset_extraInitializers = [];
    let _delay_decorators;
    let _delay_initializers = [];
    let _delay_extraInitializers = [];
    let _closeDelay_decorators;
    let _closeDelay_initializers = [];
    let _closeDelay_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _private_internalOpen_decorators;
    let _private_internalOpen_initializers = [];
    let _private_internalOpen_extraInitializers = [];
    let _private_internalOpen_descriptor;
    let _private_triggerEl_decorators;
    let _private_triggerEl_initializers = [];
    let _private_triggerEl_extraInitializers = [];
    let _private_triggerEl_descriptor;
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiTooltipPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _open_decorators = [property({ type: Boolean, reflect: true })];
            _defaultOpen_decorators = [property({ type: Boolean, attribute: "default-open" })];
            _side_decorators = [property({ reflect: true })];
            _sideOffset_decorators = [property({ type: Number, attribute: "side-offset" })];
            _delay_decorators = [property({ type: Number })];
            _closeDelay_decorators = [property({ type: Number, attribute: "close-delay" })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _private_internalOpen_decorators = [state()];
            _private_triggerEl_decorators = [state()];
            __ctx_decorators = [provide({ context: tooltipContext }), state()];
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } }, metadata: _metadata }, _open_initializers, _open_extraInitializers);
            __esDecorate(this, null, _defaultOpen_decorators, { kind: "accessor", name: "defaultOpen", static: false, private: false, access: { has: obj => "defaultOpen" in obj, get: obj => obj.defaultOpen, set: (obj, value) => { obj.defaultOpen = value; } }, metadata: _metadata }, _defaultOpen_initializers, _defaultOpen_extraInitializers);
            __esDecorate(this, null, _side_decorators, { kind: "accessor", name: "side", static: false, private: false, access: { has: obj => "side" in obj, get: obj => obj.side, set: (obj, value) => { obj.side = value; } }, metadata: _metadata }, _side_initializers, _side_extraInitializers);
            __esDecorate(this, null, _sideOffset_decorators, { kind: "accessor", name: "sideOffset", static: false, private: false, access: { has: obj => "sideOffset" in obj, get: obj => obj.sideOffset, set: (obj, value) => { obj.sideOffset = value; } }, metadata: _metadata }, _sideOffset_initializers, _sideOffset_extraInitializers);
            __esDecorate(this, null, _delay_decorators, { kind: "accessor", name: "delay", static: false, private: false, access: { has: obj => "delay" in obj, get: obj => obj.delay, set: (obj, value) => { obj.delay = value; } }, metadata: _metadata }, _delay_initializers, _delay_extraInitializers);
            __esDecorate(this, null, _closeDelay_decorators, { kind: "accessor", name: "closeDelay", static: false, private: false, access: { has: obj => "closeDelay" in obj, get: obj => obj.closeDelay, set: (obj, value) => { obj.closeDelay = value; } }, metadata: _metadata }, _closeDelay_initializers, _closeDelay_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, _private_internalOpen_descriptor = { get: __setFunctionName(function () { return this.#internalOpen_accessor_storage; }, "#internalOpen", "get"), set: __setFunctionName(function (value) { this.#internalOpen_accessor_storage = value; }, "#internalOpen", "set") }, _private_internalOpen_decorators, { kind: "accessor", name: "#internalOpen", static: false, private: true, access: { has: obj => #internalOpen in obj, get: obj => obj.#internalOpen, set: (obj, value) => { obj.#internalOpen = value; } }, metadata: _metadata }, _private_internalOpen_initializers, _private_internalOpen_extraInitializers);
            __esDecorate(this, _private_triggerEl_descriptor = { get: __setFunctionName(function () { return this.#triggerEl_accessor_storage; }, "#triggerEl", "get"), set: __setFunctionName(function (value) { this.#triggerEl_accessor_storage = value; }, "#triggerEl", "set") }, _private_triggerEl_decorators, { kind: "accessor", name: "#triggerEl", static: false, private: true, access: { has: obj => #triggerEl in obj, get: obj => obj.#triggerEl, set: (obj, value) => { obj.#triggerEl = value; } }, metadata: _metadata }, _private_triggerEl_initializers, _private_triggerEl_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-tooltip";
        static styles = [base, hostStyles];
        #open_accessor_storage = __runInitializers(this, _open_initializers, false);
        /** Controlled open state. */
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #defaultOpen_accessor_storage = (__runInitializers(this, _open_extraInitializers), __runInitializers(this, _defaultOpen_initializers, false));
        /** Default open state for uncontrolled usage. */
        get defaultOpen() { return this.#defaultOpen_accessor_storage; }
        set defaultOpen(value) { this.#defaultOpen_accessor_storage = value; }
        #side_accessor_storage = (__runInitializers(this, _defaultOpen_extraInitializers), __runInitializers(this, _side_initializers, "top"));
        /** Which side of the trigger the tooltip appears on. */
        get side() { return this.#side_accessor_storage; }
        set side(value) { this.#side_accessor_storage = value; }
        #sideOffset_accessor_storage = (__runInitializers(this, _side_extraInitializers), __runInitializers(this, _sideOffset_initializers, 6));
        /** Offset from the trigger in pixels. */
        get sideOffset() { return this.#sideOffset_accessor_storage; }
        set sideOffset(value) { this.#sideOffset_accessor_storage = value; }
        #delay_accessor_storage = (__runInitializers(this, _sideOffset_extraInitializers), __runInitializers(this, _delay_initializers, 500));
        /** Delay before opening in milliseconds. */
        get delay() { return this.#delay_accessor_storage; }
        set delay(value) { this.#delay_accessor_storage = value; }
        #closeDelay_accessor_storage = (__runInitializers(this, _delay_extraInitializers), __runInitializers(this, _closeDelay_initializers, 0));
        /** Delay before closing in milliseconds. */
        get closeDelay() { return this.#closeDelay_accessor_storage; }
        set closeDelay(value) { this.#closeDelay_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _closeDelay_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Disable the tooltip. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #internalOpen_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _private_internalOpen_initializers, false));
        get #internalOpen() { return _private_internalOpen_descriptor.get.call(this); }
        set #internalOpen(value) { return _private_internalOpen_descriptor.set.call(this, value); }
        #triggerEl_accessor_storage = (__runInitializers(this, _private_internalOpen_extraInitializers), __runInitializers(this, _private_triggerEl_initializers, void 0));
        get #triggerEl() { return _private_triggerEl_descriptor.get.call(this); }
        set #triggerEl(value) { return _private_triggerEl_descriptor.set.call(this, value); }
        #openTimeout = __runInitializers(this, _private_triggerEl_extraInitializers);
        #closeTimeout;
        #triggerId = `tooltip-trigger-${crypto.randomUUID().slice(0, 8)}`;
        #popupId = `tooltip-popup-${crypto.randomUUID().slice(0, 8)}`;
        #_ctx_accessor_storage = __runInitializers(this, __ctx_initializers, {
            open: false,
            triggerId: this.#triggerId,
            popupId: this.#popupId,
            side: "top",
            sideOffset: 6,
            disabled: false,
            triggerEl: undefined,
            openTooltip: () => this.#scheduleOpen(),
            closeTooltip: () => this.#scheduleClose(),
            setTriggerEl: (el) => this.#setTriggerEl(el),
        });
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        connectedCallback() {
            super.connectedCallback();
            if (this.defaultOpen && !this.disabled) {
                this.#internalOpen = true;
            }
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.#clearTimeouts();
        }
        willUpdate(changed) {
            const isOpen = this.open || this.#internalOpen;
            if (changed.has("open") ||
                changed.has("side") ||
                changed.has("sideOffset") ||
                changed.has("disabled") ||
                this._ctx.open !== isOpen ||
                this._ctx.triggerEl !== this.#triggerEl) {
                this._ctx = {
                    ...this._ctx,
                    open: isOpen,
                    side: this.side,
                    sideOffset: this.sideOffset,
                    disabled: this.disabled,
                    triggerEl: this.#triggerEl,
                };
            }
        }
        #clearTimeouts() {
            if (this.#openTimeout) {
                clearTimeout(this.#openTimeout);
                this.#openTimeout = undefined;
            }
            if (this.#closeTimeout) {
                clearTimeout(this.#closeTimeout);
                this.#closeTimeout = undefined;
            }
        }
        #scheduleOpen() {
            if (this.disabled)
                return;
            this.#clearTimeouts();
            if (this.delay <= 0) {
                this.#doOpen();
            }
            else {
                this.#openTimeout = setTimeout(() => this.#doOpen(), this.delay);
            }
        }
        #scheduleClose() {
            this.#clearTimeouts();
            if (this.closeDelay <= 0) {
                this.#doClose();
            }
            else {
                this.#closeTimeout = setTimeout(() => this.#doClose(), this.closeDelay);
            }
        }
        #doOpen() {
            if (this.#internalOpen)
                return;
            this.#internalOpen = true;
            this.dispatchEvent(openChangeEvent({ open: true }));
        }
        #doClose() {
            if (!this.#internalOpen)
                return;
            this.#internalOpen = false;
            this.dispatchEvent(openChangeEvent({ open: false }));
        }
        #setTriggerEl(el) {
            this.#triggerEl = el;
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
export { DuiTooltipPrimitive };
