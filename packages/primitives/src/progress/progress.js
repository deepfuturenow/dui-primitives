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
import { base } from "@dui/core/base";
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: block;
  }

  [part="track"] {
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  [part="indicator"] {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: var(--progress-value, 0%);
    height: 100%;
  }
`;
/**
 * `<dui-progress>` — A progress bar indicating completion status.
 *
 * Set `value` to a number for determinate progress, or leave `null` for indeterminate.
 *
 * @csspart root - The outer container.
 * @csspart track - The progress track.
 * @csspart indicator - The filled indicator.
 */
let DuiProgressPrimitive = (() => {
    let _classSuper = LitElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _min_decorators;
    let _min_initializers = [];
    let _min_extraInitializers = [];
    let _max_decorators;
    let _max_initializers = [];
    let _max_extraInitializers = [];
    return class DuiProgressPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property({ type: Number })];
            _min_decorators = [property({ type: Number })];
            _max_decorators = [property({ type: Number })];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _min_decorators, { kind: "accessor", name: "min", static: false, private: false, access: { has: obj => "min" in obj, get: obj => obj.min, set: (obj, value) => { obj.min = value; } }, metadata: _metadata }, _min_initializers, _min_extraInitializers);
            __esDecorate(this, null, _max_decorators, { kind: "accessor", name: "max", static: false, private: false, access: { has: obj => "max" in obj, get: obj => obj.max, set: (obj, value) => { obj.max = value; } }, metadata: _metadata }, _max_initializers, _max_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-progress";
        static styles = [base, styles];
        #value_accessor_storage = __runInitializers(this, _value_initializers, null);
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #min_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _min_initializers, 0));
        get min() { return this.#min_accessor_storage; }
        set min(value) { this.#min_accessor_storage = value; }
        #max_accessor_storage = (__runInitializers(this, _min_extraInitializers), __runInitializers(this, _max_initializers, 100));
        get max() { return this.#max_accessor_storage; }
        set max(value) { this.#max_accessor_storage = value; }
        get #percent() {
            if (this.value === null)
                return 0;
            const range = this.max - this.min;
            if (range <= 0)
                return 0;
            return Math.max(0, Math.min(100, ((this.value - this.min) / range) * 100));
        }
        get #isIndeterminate() {
            return this.value === null;
        }
        get #isComplete() {
            return this.value !== null && this.value >= this.max;
        }
        render() {
            const percent = this.#percent;
            return html `
      <div
        part="root"
        role="progressbar"
        aria-valuenow="${this.value ?? nothing}"
        aria-valuemin="${this.min}"
        aria-valuemax="${this.max}"
        ?data-complete="${this.#isComplete}"
        ?data-progressing="${!this.#isIndeterminate && !this.#isComplete}"
        ?data-indeterminate="${this.#isIndeterminate}"
        style="--progress-value: ${percent}%"
      >
        <div part="track">
          <div part="indicator"></div>
        </div>
      </div>
    `;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _max_extraInitializers);
        }
    };
})();
export { DuiProgressPrimitive };
