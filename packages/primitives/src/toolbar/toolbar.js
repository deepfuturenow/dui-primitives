/** Ported from original DUI: deep-future-app/app/client/components/dui/toolbar */
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
const styles = css `
  :host {
    display: block;
  }

  [part="root"] {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    box-sizing: border-box;
  }

  [part="left"] {
    justify-self: start;
    display: flex;
    align-items: center;
  }

  [part="center"] {
    justify-self: center;
    grid-column: 2;
    display: flex;
    align-items: center;
  }

  [part="right"] {
    justify-self: end;
    grid-column: 3;
    display: flex;
    align-items: center;
  }
`;
let DuiToolbarPrimitive = (() => {
    let _classSuper = LitElement;
    let _inset_decorators;
    let _inset_initializers = [];
    let _inset_extraInitializers = [];
    let _hasButtonLeft_decorators;
    let _hasButtonLeft_initializers = [];
    let _hasButtonLeft_extraInitializers = [];
    let _hasButtonRight_decorators;
    let _hasButtonRight_initializers = [];
    let _hasButtonRight_extraInitializers = [];
    return class DuiToolbarPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _inset_decorators = [property({ type: Boolean, reflect: true })];
            _hasButtonLeft_decorators = [property({ type: Boolean, reflect: true, attribute: "has-button-left" })];
            _hasButtonRight_decorators = [property({ type: Boolean, reflect: true, attribute: "has-button-right" })];
            __esDecorate(this, null, _inset_decorators, { kind: "accessor", name: "inset", static: false, private: false, access: { has: obj => "inset" in obj, get: obj => obj.inset, set: (obj, value) => { obj.inset = value; } }, metadata: _metadata }, _inset_initializers, _inset_extraInitializers);
            __esDecorate(this, null, _hasButtonLeft_decorators, { kind: "accessor", name: "hasButtonLeft", static: false, private: false, access: { has: obj => "hasButtonLeft" in obj, get: obj => obj.hasButtonLeft, set: (obj, value) => { obj.hasButtonLeft = value; } }, metadata: _metadata }, _hasButtonLeft_initializers, _hasButtonLeft_extraInitializers);
            __esDecorate(this, null, _hasButtonRight_decorators, { kind: "accessor", name: "hasButtonRight", static: false, private: false, access: { has: obj => "hasButtonRight" in obj, get: obj => obj.hasButtonRight, set: (obj, value) => { obj.hasButtonRight = value; } }, metadata: _metadata }, _hasButtonRight_initializers, _hasButtonRight_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-toolbar";
        static styles = [base, styles];
        #inset_accessor_storage = __runInitializers(this, _inset_initializers, false);
        /** Adds horizontal and vertical padding. */
        get inset() { return this.#inset_accessor_storage; }
        set inset(value) { this.#inset_accessor_storage = value; }
        #hasButtonLeft_accessor_storage = (__runInitializers(this, _inset_extraInitializers), __runInitializers(this, _hasButtonLeft_initializers, false));
        /** Reduces left inset padding when a button is the first item. */
        get hasButtonLeft() { return this.#hasButtonLeft_accessor_storage; }
        set hasButtonLeft(value) { this.#hasButtonLeft_accessor_storage = value; }
        #hasButtonRight_accessor_storage = (__runInitializers(this, _hasButtonLeft_extraInitializers), __runInitializers(this, _hasButtonRight_initializers, false));
        /** Reduces right inset padding when a button is the last item. */
        get hasButtonRight() { return this.#hasButtonRight_accessor_storage; }
        set hasButtonRight(value) { this.#hasButtonRight_accessor_storage = value; }
        render() {
            return html `
      <nav part="root" role="toolbar">
        <div part="left">
          <slot name="left"></slot>
        </div>
        <div part="center">
          <slot name="center"></slot>
        </div>
        <div part="right">
          <slot name="right"></slot>
        </div>
      </nav>
    `;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _hasButtonRight_extraInitializers);
        }
    };
})();
export { DuiToolbarPrimitive };
