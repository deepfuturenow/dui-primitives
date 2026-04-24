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
    border: none;
    margin: 0;
    padding: 0;
    min-width: 0;
  }

  [part="legend"]:not([data-slotted]) { display: none; }
  [part="legend"] { padding: 0; }
`;
/**
 * `<dui-fieldset>` — Semantic grouping for related form fields.
 *
 * Wraps content in a native `<fieldset>` element, providing semantic
 * grouping for radio groups, checkbox groups, or logical field clusters.
 *
 * @slot legend - Legend text (e.g. `<span slot="legend">Personal Info</span>`).
 * @slot - Default slot for field children.
 * @csspart root - The native `<fieldset>` element.
 * @csspart legend - The native `<legend>` element.
 */
let DuiFieldsetPrimitive = (() => {
    let _classSuper = LitElement;
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _private_hasLegend_decorators;
    let _private_hasLegend_initializers = [];
    let _private_hasLegend_extraInitializers = [];
    let _private_hasLegend_descriptor;
    return class DuiFieldsetPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _private_hasLegend_decorators = [state()];
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, _private_hasLegend_descriptor = { get: __setFunctionName(function () { return this.#hasLegend_accessor_storage; }, "#hasLegend", "get"), set: __setFunctionName(function (value) { this.#hasLegend_accessor_storage = value; }, "#hasLegend", "set") }, _private_hasLegend_decorators, { kind: "accessor", name: "#hasLegend", static: false, private: true, access: { has: obj => #hasLegend in obj, get: obj => obj.#hasLegend, set: (obj, value) => { obj.#hasLegend = value; } }, metadata: _metadata }, _private_hasLegend_initializers, _private_hasLegend_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-fieldset";
        static styles = [base, styles];
        #disabled_accessor_storage = __runInitializers(this, _disabled_initializers, false);
        /** Disables all child form controls. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #hasLegend_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _private_hasLegend_initializers, false));
        get #hasLegend() { return _private_hasLegend_descriptor.get.call(this); }
        set #hasLegend(value) { return _private_hasLegend_descriptor.set.call(this, value); }
        #onLegendSlotChange = (__runInitializers(this, _private_hasLegend_extraInitializers), (e) => {
            const slot = e.target;
            this.#hasLegend = slot.assignedNodes({ flatten: true }).length > 0;
        });
        render() {
            return html `
      <fieldset
        part="root"
        ?disabled="${this.disabled}"
        ?data-disabled="${this.disabled}"
      >
        <legend part="legend" ?data-slotted="${this.#hasLegend}">
          <slot name="legend" @slotchange="${this.#onLegendSlotChange}"></slot>
        </legend>
        <slot></slot>
      </fieldset>
    `;
        }
    };
})();
export { DuiFieldsetPrimitive };
