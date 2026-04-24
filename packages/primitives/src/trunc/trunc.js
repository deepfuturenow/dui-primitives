/** Ported from original DUI: deep-future-app/app/client/components/dui/trunc */
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
import { styleMap } from "lit/directives/style-map.js";
import { base } from "@dui/core/base";
const styles = css `
  :host {
    display: block;
  }

  [part="root"] {
    overflow: hidden;
  }

  :host(:not([max-lines])) [part="root"] {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :host([max-lines]) [part="root"] {
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
`;
/**
 * Text truncation with ellipsis.
 *
 * By default, truncates to a single line using `max-width` (default `20rem`).
 * Set `max-lines` to clamp to N visible lines instead.
 * Both attributes can be combined: `max-width` constrains inline size,
 * `max-lines` constrains block size.
 */
let DuiTruncPrimitive = (() => {
    let _classSuper = LitElement;
    let _maxWidth_decorators;
    let _maxWidth_initializers = [];
    let _maxWidth_extraInitializers = [];
    let _maxLines_decorators;
    let _maxLines_initializers = [];
    let _maxLines_extraInitializers = [];
    return class DuiTruncPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _maxWidth_decorators = [property({ attribute: "max-width" })];
            _maxLines_decorators = [property({ attribute: "max-lines", type: Number, reflect: true })];
            __esDecorate(this, null, _maxWidth_decorators, { kind: "accessor", name: "maxWidth", static: false, private: false, access: { has: obj => "maxWidth" in obj, get: obj => obj.maxWidth, set: (obj, value) => { obj.maxWidth = value; } }, metadata: _metadata }, _maxWidth_initializers, _maxWidth_extraInitializers);
            __esDecorate(this, null, _maxLines_decorators, { kind: "accessor", name: "maxLines", static: false, private: false, access: { has: obj => "maxLines" in obj, get: obj => obj.maxLines, set: (obj, value) => { obj.maxLines = value; } }, metadata: _metadata }, _maxLines_initializers, _maxLines_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-trunc";
        static styles = [base, styles];
        #maxWidth_accessor_storage = __runInitializers(this, _maxWidth_initializers, "20rem");
        /** Maximum inline size before single-line truncation kicks in. */
        get maxWidth() { return this.#maxWidth_accessor_storage; }
        set maxWidth(value) { this.#maxWidth_accessor_storage = value; }
        #maxLines_accessor_storage = (__runInitializers(this, _maxWidth_extraInitializers), __runInitializers(this, _maxLines_initializers, void 0));
        /** Maximum number of visible lines before clamping. */
        get maxLines() { return this.#maxLines_accessor_storage; }
        set maxLines(value) { this.#maxLines_accessor_storage = value; }
        render() {
            const clamp = this.maxLines !== undefined
                ? Math.max(1, this.maxLines).toString()
                : undefined;
            const dynamicStyles = styleMap({
                "max-width": this.maxWidth,
                "-webkit-line-clamp": clamp,
                "line-clamp": clamp,
            });
            return html `<div part="root" style=${dynamicStyles}><slot></slot></div>`;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _maxLines_extraInitializers);
        }
    };
})();
export { DuiTruncPrimitive };
