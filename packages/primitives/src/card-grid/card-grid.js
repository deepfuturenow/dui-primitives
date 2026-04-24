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
import { base } from "@dui/core/base";
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: block;
    min-width: 100%;
  }

  [part="root"] {
    display: grid;
    grid-template-columns: repeat(var(--_columns, 3), 1fr);
    box-sizing: border-box;
  }

  :host([columns="1"]) { --_columns: 1; }
  :host([columns="2"]) { --_columns: 2; }
  :host([columns="3"]) { --_columns: 3; }
  :host([columns="4"]) { --_columns: 4; }

  /* Responsive collapse: narrow viewports reduce columns */
  @media (max-width: 768px) {
    :host([columns="3"]) { --_columns: 2; }
    :host([columns="4"]) { --_columns: 2; }
  }

  @media (max-width: 480px) {
    :host([columns="2"]),
    :host([columns="3"]),
    :host([columns="4"]) {
      --_columns: 1;
    }
  }
`;
/**
 * `<dui-card-grid>` — A responsive grid layout for cards and panels.
 *
 * Distributes children into equal-width columns that collapse at narrow
 * container widths. Use `columns` to set the maximum column count.
 *
 * @slot - Grid children (cards, panels, or any block content).
 * @csspart root - The grid container element.
 */
let DuiCardGridPrimitive = (() => {
    let _classSuper = LitElement;
    let _columns_decorators;
    let _columns_initializers = [];
    let _columns_extraInitializers = [];
    return class DuiCardGridPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _columns_decorators = [property({ reflect: true })];
            __esDecorate(this, null, _columns_decorators, { kind: "accessor", name: "columns", static: false, private: false, access: { has: obj => "columns" in obj, get: obj => obj.columns, set: (obj, value) => { obj.columns = value; } }, metadata: _metadata }, _columns_initializers, _columns_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-card-grid";
        static styles = [base, styles];
        #columns_accessor_storage = __runInitializers(this, _columns_initializers, "3");
        /** Maximum number of columns (1–4). Responsive breakpoints reduce this automatically. */
        get columns() { return this.#columns_accessor_storage; }
        set columns(value) { this.#columns_accessor_storage = value; }
        render() {
            return html `
      <div part="root">
        <slot></slot>
      </div>
    `;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _columns_extraInitializers);
        }
    };
})();
export { DuiCardGridPrimitive };
