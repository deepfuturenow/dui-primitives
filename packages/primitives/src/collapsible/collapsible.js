/** Ported from original DUI: deep-future-app/app/client/components/dui/collapsible */
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
import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
export const openChangeEvent = customEvent("open-change", { bubbles: true, composed: true });
const styles = css `
  :host {
    display: block;
  }

  [part="trigger"] {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
    border: none;
    background: none;
    text-align: left;
    outline: none;
    box-sizing: border-box;
  }

  [part="trigger"][data-disabled] {
    cursor: default;
  }

  slot[name="trigger"] {
    flex: 1;
    min-width: 0;
  }

  [part="panel"] {
    overflow: hidden;
    contain: content;
    transition-property: height;
  }
`;
let DuiCollapsiblePrimitive = (() => {
    let _classSuper = LitElement;
    let _open_decorators;
    let _open_initializers = [];
    let _open_extraInitializers = [];
    let _defaultOpen_decorators;
    let _defaultOpen_initializers = [];
    let _defaultOpen_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _keepMounted_decorators;
    let _keepMounted_initializers = [];
    let _keepMounted_extraInitializers = [];
    let _private_starting_decorators;
    let _private_starting_initializers = [];
    let _private_starting_extraInitializers = [];
    let _private_starting_descriptor;
    let _private_ending_decorators;
    let _private_ending_initializers = [];
    let _private_ending_extraInitializers = [];
    let _private_ending_descriptor;
    let _private_panelHeight_decorators;
    let _private_panelHeight_initializers = [];
    let _private_panelHeight_extraInitializers = [];
    let _private_panelHeight_descriptor;
    let _private_visible_decorators;
    let _private_visible_initializers = [];
    let _private_visible_extraInitializers = [];
    let _private_visible_descriptor;
    let _private_internalOpen_decorators;
    let _private_internalOpen_initializers = [];
    let _private_internalOpen_extraInitializers = [];
    let _private_internalOpen_descriptor;
    return class DuiCollapsiblePrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _open_decorators = [property({ type: Boolean, reflect: true })];
            _defaultOpen_decorators = [property({ type: Boolean, attribute: "default-open" })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _keepMounted_decorators = [property({ type: Boolean, attribute: "keep-mounted" })];
            _private_starting_decorators = [state()];
            _private_ending_decorators = [state()];
            _private_panelHeight_decorators = [state()];
            _private_visible_decorators = [state()];
            _private_internalOpen_decorators = [state()];
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } }, metadata: _metadata }, _open_initializers, _open_extraInitializers);
            __esDecorate(this, null, _defaultOpen_decorators, { kind: "accessor", name: "defaultOpen", static: false, private: false, access: { has: obj => "defaultOpen" in obj, get: obj => obj.defaultOpen, set: (obj, value) => { obj.defaultOpen = value; } }, metadata: _metadata }, _defaultOpen_initializers, _defaultOpen_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _keepMounted_decorators, { kind: "accessor", name: "keepMounted", static: false, private: false, access: { has: obj => "keepMounted" in obj, get: obj => obj.keepMounted, set: (obj, value) => { obj.keepMounted = value; } }, metadata: _metadata }, _keepMounted_initializers, _keepMounted_extraInitializers);
            __esDecorate(this, _private_starting_descriptor = { get: __setFunctionName(function () { return this.#starting_accessor_storage; }, "#starting", "get"), set: __setFunctionName(function (value) { this.#starting_accessor_storage = value; }, "#starting", "set") }, _private_starting_decorators, { kind: "accessor", name: "#starting", static: false, private: true, access: { has: obj => #starting in obj, get: obj => obj.#starting, set: (obj, value) => { obj.#starting = value; } }, metadata: _metadata }, _private_starting_initializers, _private_starting_extraInitializers);
            __esDecorate(this, _private_ending_descriptor = { get: __setFunctionName(function () { return this.#ending_accessor_storage; }, "#ending", "get"), set: __setFunctionName(function (value) { this.#ending_accessor_storage = value; }, "#ending", "set") }, _private_ending_decorators, { kind: "accessor", name: "#ending", static: false, private: true, access: { has: obj => #ending in obj, get: obj => obj.#ending, set: (obj, value) => { obj.#ending = value; } }, metadata: _metadata }, _private_ending_initializers, _private_ending_extraInitializers);
            __esDecorate(this, _private_panelHeight_descriptor = { get: __setFunctionName(function () { return this.#panelHeight_accessor_storage; }, "#panelHeight", "get"), set: __setFunctionName(function (value) { this.#panelHeight_accessor_storage = value; }, "#panelHeight", "set") }, _private_panelHeight_decorators, { kind: "accessor", name: "#panelHeight", static: false, private: true, access: { has: obj => #panelHeight in obj, get: obj => obj.#panelHeight, set: (obj, value) => { obj.#panelHeight = value; } }, metadata: _metadata }, _private_panelHeight_initializers, _private_panelHeight_extraInitializers);
            __esDecorate(this, _private_visible_descriptor = { get: __setFunctionName(function () { return this.#visible_accessor_storage; }, "#visible", "get"), set: __setFunctionName(function (value) { this.#visible_accessor_storage = value; }, "#visible", "set") }, _private_visible_decorators, { kind: "accessor", name: "#visible", static: false, private: true, access: { has: obj => #visible in obj, get: obj => obj.#visible, set: (obj, value) => { obj.#visible = value; } }, metadata: _metadata }, _private_visible_initializers, _private_visible_extraInitializers);
            __esDecorate(this, _private_internalOpen_descriptor = { get: __setFunctionName(function () { return this.#internalOpen_accessor_storage; }, "#internalOpen", "get"), set: __setFunctionName(function (value) { this.#internalOpen_accessor_storage = value; }, "#internalOpen", "set") }, _private_internalOpen_decorators, { kind: "accessor", name: "#internalOpen", static: false, private: true, access: { has: obj => #internalOpen in obj, get: obj => obj.#internalOpen, set: (obj, value) => { obj.#internalOpen = value; } }, metadata: _metadata }, _private_internalOpen_initializers, _private_internalOpen_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-collapsible";
        static styles = [base, styles];
        #open_accessor_storage = __runInitializers(this, _open_initializers, false);
        /** Controlled open state. When set, the component is fully controlled. */
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #defaultOpen_accessor_storage = (__runInitializers(this, _open_extraInitializers), __runInitializers(this, _defaultOpen_initializers, false));
        /** Uncontrolled initial open state. Only used on first render. */
        get defaultOpen() { return this.#defaultOpen_accessor_storage; }
        set defaultOpen(value) { this.#defaultOpen_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _defaultOpen_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #keepMounted_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _keepMounted_initializers, false));
        /** Keep panel content mounted when closed. */
        get keepMounted() { return this.#keepMounted_accessor_storage; }
        set keepMounted(value) { this.#keepMounted_accessor_storage = value; }
        #starting_accessor_storage = (__runInitializers(this, _keepMounted_extraInitializers), __runInitializers(this, _private_starting_initializers, false));
        get #starting() { return _private_starting_descriptor.get.call(this); }
        set #starting(value) { return _private_starting_descriptor.set.call(this, value); }
        #ending_accessor_storage = (__runInitializers(this, _private_starting_extraInitializers), __runInitializers(this, _private_ending_initializers, false));
        get #ending() { return _private_ending_descriptor.get.call(this); }
        set #ending(value) { return _private_ending_descriptor.set.call(this, value); }
        #panelHeight_accessor_storage = (__runInitializers(this, _private_ending_extraInitializers), __runInitializers(this, _private_panelHeight_initializers, "0"));
        get #panelHeight() { return _private_panelHeight_descriptor.get.call(this); }
        set #panelHeight(value) { return _private_panelHeight_descriptor.set.call(this, value); }
        #visible_accessor_storage = (__runInitializers(this, _private_panelHeight_extraInitializers), __runInitializers(this, _private_visible_initializers, false));
        get #visible() { return _private_visible_descriptor.get.call(this); }
        set #visible(value) { return _private_visible_descriptor.set.call(this, value); }
        #internalOpen_accessor_storage = (__runInitializers(this, _private_visible_extraInitializers), __runInitializers(this, _private_internalOpen_initializers, false));
        get #internalOpen() { return _private_internalOpen_descriptor.get.call(this); }
        set #internalOpen(value) { return _private_internalOpen_descriptor.set.call(this, value); }
        #prevOpen = (__runInitializers(this, _private_internalOpen_extraInitializers), undefined);
        #animGen = 0;
        #controlled = false;
        get #isOpen() {
            return this.#controlled ? this.open : this.#internalOpen;
        }
        connectedCallback() {
            super.connectedCallback();
            // Check if `open` attribute was explicitly set (controlled mode)
            this.#controlled = this.hasAttribute("open");
            if (!this.#controlled && this.defaultOpen) {
                this.#internalOpen = true;
            }
        }
        willUpdate(changed) {
            // If `open` property is set after initial render, switch to controlled mode
            if (changed.has("open") && this.#prevOpen !== undefined) {
                this.#controlled = true;
            }
            const isOpen = this.#isOpen;
            if (this.#prevOpen === undefined) {
                this.#visible = isOpen;
                this.#panelHeight = isOpen ? "auto" : "0";
            }
            else if (this.#prevOpen !== isOpen) {
                if (isOpen) {
                    this.#startOpenAnimation();
                }
                else {
                    this.#startCloseAnimation();
                }
            }
            this.#prevOpen = isOpen;
        }
        #startOpenAnimation() {
            const gen = ++this.#animGen;
            this.#ending = false;
            this.#visible = true;
            this.#starting = true;
            this.#panelHeight = "0";
            requestAnimationFrame(() => {
                if (this.#animGen !== gen)
                    return;
                const panel = this.shadowRoot?.querySelector("[part='panel']");
                if (panel) {
                    this.#panelHeight = `${panel.scrollHeight}px`;
                }
                this.#starting = false;
            });
        }
        #startCloseAnimation() {
            const gen = ++this.#animGen;
            this.#starting = false;
            const panel = this.shadowRoot?.querySelector("[part='panel']");
            if (panel) {
                this.#panelHeight = `${panel.scrollHeight}px`;
            }
            requestAnimationFrame(() => {
                if (this.#animGen !== gen)
                    return;
                this.#ending = true;
                this.#panelHeight = "0";
            });
        }
        #onTransitionEnd = (event) => {
            if (event.propertyName !== "height")
                return;
            if (this.#ending) {
                this.#ending = false;
                if (!this.keepMounted) {
                    this.#visible = false;
                }
            }
            else if (this.#isOpen) {
                this.#panelHeight = "auto";
            }
        };
        #onClick = () => {
            if (this.disabled)
                return;
            const nextOpen = !this.#isOpen;
            if (!this.#controlled) {
                this.#internalOpen = nextOpen;
            }
            this.dispatchEvent(openChangeEvent({ open: nextOpen }));
        };
        render() {
            const isOpen = this.#isOpen;
            const shouldRender = this.#visible || this.keepMounted;
            return html `
      <button
        part="trigger"
        aria-expanded=${isOpen}
        ?data-open=${isOpen}
        ?data-disabled=${this.disabled}
        ?disabled=${this.disabled}
        @click=${this.#onClick}
      >
        <slot name="trigger"></slot>
      </button>
      ${shouldRender
                ? html `
            <div
              part="panel"
              role="region"
              style="height: ${this.#panelHeight}"
              ?data-open=${isOpen && !this.#starting}
              ?data-starting-style=${this.#starting}
              ?data-ending-style=${this.#ending}
              ?hidden=${!this.#visible && !this.#ending}
              @transitionend=${this.#onTransitionEnd}
            >
              <div part="content">
                <slot></slot>
              </div>
            </div>
          `
                : nothing}
    `;
        }
    };
})();
export { DuiCollapsiblePrimitive };
