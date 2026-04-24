/** Ported from original DUI: deep-future-app/app/client/components/dui/spinner */
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
import { css, html, LitElement, svg } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
/** Pulsing circle loading animation SVG */
const pulseSvg = svg `
  <svg
    part="svg"
    viewBox="0 0 44 44"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Loading"
  >
    <circle cx="22" cy="22" r="8" fill="currentColor">
      <animate
        attributeName="r"
        values="8;14;8"
        dur="1.2s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.445,0.05,0.55,0.95;0.445,0.05,0.55,0.95"
        keyTimes="0;0.5;1"
      />
      <animate
        attributeName="opacity"
        values="1;0.2;1"
        dur="1.2s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.445,0.05,0.55,0.95;0.445,0.05,0.55,0.95"
        keyTimes="0;0.5;1"
      />
    </circle>
  </svg>
`;
/** Lucide loader icon with rotation animation */
const lucideLoaderSvg = svg `
  <svg
    part="svg"
    data-rotate
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    role="img"
    aria-label="Loading"
  >
    <path d="M12 2v4" />
    <path d="m16.2 7.8 2.9-2.9" />
    <path d="M18 12h4" />
    <path d="m16.2 16.2 2.9 2.9" />
    <path d="M12 18v4" />
    <path d="m4.9 19.1 2.9-2.9" />
    <path d="M2 12h4" />
    <path d="m4.9 4.9 2.9 2.9" />
  </svg>
`;
/** Lucide loader circle icon with rotation animation */
const lucideLoaderCircleSvg = svg `
  <svg
    part="svg"
    data-rotate
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    role="img"
    aria-label="Loading"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
`;
const styles = css `
  :host {
    display: block;
  }

  [part="svg"] {
    display: block;
    width: 100%;
    height: 100%;
  }

  [part="svg"][data-rotate] {
    animation: spin 1.25s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
/**
 * A loading indicator with multiple animation variants and sizes.
 */
let DuiSpinnerPrimitive = (() => {
    let _classSuper = LitElement;
    let _variant_decorators;
    let _variant_initializers = [];
    let _variant_extraInitializers = [];
    return class DuiSpinnerPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _variant_decorators = [property({ reflect: true })];
            __esDecorate(this, null, _variant_decorators, { kind: "accessor", name: "variant", static: false, private: false, access: { has: obj => "variant" in obj, get: obj => obj.variant, set: (obj, value) => { obj.variant = value; } }, metadata: _metadata }, _variant_initializers, _variant_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-spinner";
        static styles = [base, styles];
        #variant_accessor_storage = __runInitializers(this, _variant_initializers, "");
        /** Animation variant. */
        get variant() { return this.#variant_accessor_storage; }
        set variant(value) { this.#variant_accessor_storage = value; }
        #getSvg() {
            switch (this.variant) {
                case "lucide-loader":
                    return lucideLoaderSvg;
                case "lucide-loader-circle":
                    return lucideLoaderCircleSvg;
                default:
                    return pulseSvg;
            }
        }
        render() {
            return html `${this.#getSvg()}`;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _variant_extraInitializers);
        }
    };
})();
export { DuiSpinnerPrimitive };
