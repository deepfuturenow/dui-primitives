/** Ported from ShadCN/ui: https://ui.shadcn.com/docs/components/card */
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
import { base } from "@dui/core/base";
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  [part="header"]:not([hidden]) {
    display: flex;
    align-items: start;
  }

  [part="header-text"] {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  [part="action"] {
    height: 0;
    overflow: visible;
    display: flex;
    align-items: start;
  }

  [part="footer"]:not([hidden]) {
    display: flex;
    align-items: center;
  }
`;
/**
 * `<dui-card>` — A container for grouped content with header, body,
 * and footer sections.
 *
 * Uses flex-column + gap for vertical rhythm. The card owns all internal
 * spacing; consumers slot content into named regions.
 *
 * @slot - Main card content (body).
 * @slot title - Card heading text.
 * @slot description - Helper text below the title.
 * @slot action - Top-right header action (button, badge, etc.).
 * @slot footer - Footer content (buttons, links, etc.).
 *
 * @csspart root - The outer card container.
 * @csspart header - The header section (title + description + action).
 * @csspart header-text - The vertical stack holding title and description.
 * @csspart content - The wrapper around the default slot.
 * @csspart footer - The footer section.
 */
let DuiCardPrimitive = (() => {
    let _classSuper = LitElement;
    let _size_decorators;
    let _size_initializers = [];
    let _size_extraInitializers = [];
    let _private_hasHeader_decorators;
    let _private_hasHeader_initializers = [];
    let _private_hasHeader_extraInitializers = [];
    let _private_hasHeader_descriptor;
    let _private_hasFooter_decorators;
    let _private_hasFooter_initializers = [];
    let _private_hasFooter_extraInitializers = [];
    let _private_hasFooter_descriptor;
    return class DuiCardPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _size_decorators = [property({ reflect: true })];
            _private_hasHeader_decorators = [state()];
            _private_hasFooter_decorators = [state()];
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
            __esDecorate(this, _private_hasHeader_descriptor = { get: __setFunctionName(function () { return this.#hasHeader_accessor_storage; }, "#hasHeader", "get"), set: __setFunctionName(function (value) { this.#hasHeader_accessor_storage = value; }, "#hasHeader", "set") }, _private_hasHeader_decorators, { kind: "accessor", name: "#hasHeader", static: false, private: true, access: { has: obj => #hasHeader in obj, get: obj => obj.#hasHeader, set: (obj, value) => { obj.#hasHeader = value; } }, metadata: _metadata }, _private_hasHeader_initializers, _private_hasHeader_extraInitializers);
            __esDecorate(this, _private_hasFooter_descriptor = { get: __setFunctionName(function () { return this.#hasFooter_accessor_storage; }, "#hasFooter", "get"), set: __setFunctionName(function (value) { this.#hasFooter_accessor_storage = value; }, "#hasFooter", "set") }, _private_hasFooter_decorators, { kind: "accessor", name: "#hasFooter", static: false, private: true, access: { has: obj => #hasFooter in obj, get: obj => obj.#hasFooter, set: (obj, value) => { obj.#hasFooter = value; } }, metadata: _metadata }, _private_hasFooter_initializers, _private_hasFooter_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-card";
        static styles = [base, styles];
        #size_accessor_storage = __runInitializers(this, _size_initializers, "");
        /** Card size — controls internal spacing via `--card-*` tokens. */
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #hasHeader_accessor_storage = (__runInitializers(this, _size_extraInitializers), __runInitializers(this, _private_hasHeader_initializers, false));
        get #hasHeader() { return _private_hasHeader_descriptor.get.call(this); }
        set #hasHeader(value) { return _private_hasHeader_descriptor.set.call(this, value); }
        #hasFooter_accessor_storage = (__runInitializers(this, _private_hasHeader_extraInitializers), __runInitializers(this, _private_hasFooter_initializers, false));
        get #hasFooter() { return _private_hasFooter_descriptor.get.call(this); }
        set #hasFooter(value) { return _private_hasFooter_descriptor.set.call(this, value); }
        #titleFilled = (__runInitializers(this, _private_hasFooter_extraInitializers), false);
        #descFilled = false;
        #actionFilled = false;
        #onHeaderSlotChange = (e) => {
            const slot = e.target;
            const filled = slot.assignedElements().length > 0;
            if (slot.name === "title")
                this.#titleFilled = filled;
            else if (slot.name === "description")
                this.#descFilled = filled;
            else if (slot.name === "action")
                this.#actionFilled = filled;
            this.#hasHeader = this.#titleFilled || this.#descFilled ||
                this.#actionFilled;
        };
        #onFooterSlotChange = (e) => {
            const slot = e.target;
            this.#hasFooter = slot.assignedElements().length > 0;
        };
        render() {
            return html `
      <div part="root">
        <div part="header" ?hidden=${!this.#hasHeader}>
          <div part="header-text">
            <slot name="title" @slotchange=${this.#onHeaderSlotChange}></slot>
            <slot
              name="description"
              @slotchange=${this.#onHeaderSlotChange}
            ></slot>
          </div>
          <div part="action">
            <slot name="action" @slotchange=${this.#onHeaderSlotChange}></slot>
          </div>
        </div>
        <div part="content">
          <slot></slot>
        </div>
        <div part="footer" ?hidden=${!this.#hasFooter}>
          <slot name="footer" @slotchange=${this.#onFooterSlotChange}></slot>
        </div>
      </div>
    `;
        }
    };
})();
export { DuiCardPrimitive };
