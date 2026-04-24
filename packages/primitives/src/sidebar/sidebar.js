/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
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
import { state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { sidebarContext } from "./sidebar-context.ts";
const styles = css `
  :host {
    display: block;
    flex-shrink: 0;
    height: 100%;
  }

  .DesktopOuter {
    position: relative;
    height: 100%;
    overflow: hidden;
    transition-property: width;
  }

  .DesktopInner {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }

  :host([data-side="left"]) .DesktopInner {
    left: 0;
  }

  :host([data-side="right"]) .DesktopInner {
    right: 0;
  }

  :host([data-collapsible="offcanvas"][data-state="collapsed"][data-side="left"])
    .DesktopInner {
    left: calc(-1 * var(--sidebar-width));
  }

  :host([data-collapsible="offcanvas"][data-state="collapsed"][data-side="right"])
    .DesktopInner {
    right: calc(-1 * var(--sidebar-width));
  }

  :host([data-variant="floating"]) .DesktopInner,
  :host([data-variant="inset"]) .DesktopInner {
    top: 0;
    bottom: 0;
  }

  :host([data-collapsible="icon"][data-state="collapsed"]) .DesktopInner {
    overflow: hidden;
  }

  .Backdrop {
    position: fixed;
    inset: 0;
    z-index: 999;
    transition-property: opacity;
  }

  .MobilePanel {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    transition-property: transform;
  }

  :host([data-side="left"]) .MobilePanel {
    left: 0;
  }

  :host([data-side="right"]) .MobilePanel {
    right: 0;
  }

  .MobilePanel[data-starting-style] {
    transform: translateX(var(--mobile-start-x));
  }

  .MobilePanel[data-ending-style] {
    transform: translateX(var(--mobile-end-x));
  }
`;
/**
 * `<dui-sidebar>` — Main sidebar container.
 *
 * Consumes sidebar context and renders the appropriate desktop or mobile layout.
 * Desktop uses a width-transitioning wrapper; mobile uses a backdrop + sliding panel.
 *
 * @slot - Default slot for sidebar content (header, content, footer, etc.).
 * @csspart desktop-outer - The outer desktop wrapper that transitions width.
 * @csspart desktop-inner - The inner desktop container with content.
 * @csspart backdrop - The mobile backdrop overlay.
 * @csspart mobile-panel - The sliding mobile panel.
 */
let DuiSidebarPrimitive = (() => {
    let _classSuper = LitElement;
    let _private_mounted_decorators;
    let _private_mounted_initializers = [];
    let _private_mounted_extraInitializers = [];
    let _private_mounted_descriptor;
    let _private_startingStyle_decorators;
    let _private_startingStyle_initializers = [];
    let _private_startingStyle_extraInitializers = [];
    let _private_startingStyle_descriptor;
    let _private_endingStyle_decorators;
    let _private_endingStyle_initializers = [];
    let _private_endingStyle_extraInitializers = [];
    let _private_endingStyle_descriptor;
    return class DuiSidebarPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _private_mounted_decorators = [state()];
            _private_startingStyle_decorators = [state()];
            _private_endingStyle_decorators = [state()];
            __esDecorate(this, _private_mounted_descriptor = { get: __setFunctionName(function () { return this.#mounted_accessor_storage; }, "#mounted", "get"), set: __setFunctionName(function (value) { this.#mounted_accessor_storage = value; }, "#mounted", "set") }, _private_mounted_decorators, { kind: "accessor", name: "#mounted", static: false, private: true, access: { has: obj => #mounted in obj, get: obj => obj.#mounted, set: (obj, value) => { obj.#mounted = value; } }, metadata: _metadata }, _private_mounted_initializers, _private_mounted_extraInitializers);
            __esDecorate(this, _private_startingStyle_descriptor = { get: __setFunctionName(function () { return this.#startingStyle_accessor_storage; }, "#startingStyle", "get"), set: __setFunctionName(function (value) { this.#startingStyle_accessor_storage = value; }, "#startingStyle", "set") }, _private_startingStyle_decorators, { kind: "accessor", name: "#startingStyle", static: false, private: true, access: { has: obj => #startingStyle in obj, get: obj => obj.#startingStyle, set: (obj, value) => { obj.#startingStyle = value; } }, metadata: _metadata }, _private_startingStyle_initializers, _private_startingStyle_extraInitializers);
            __esDecorate(this, _private_endingStyle_descriptor = { get: __setFunctionName(function () { return this.#endingStyle_accessor_storage; }, "#endingStyle", "get"), set: __setFunctionName(function (value) { this.#endingStyle_accessor_storage = value; }, "#endingStyle", "set") }, _private_endingStyle_decorators, { kind: "accessor", name: "#endingStyle", static: false, private: true, access: { has: obj => #endingStyle in obj, get: obj => obj.#endingStyle, set: (obj, value) => { obj.#endingStyle = value; } }, metadata: _metadata }, _private_endingStyle_initializers, _private_endingStyle_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-sidebar";
        static styles = [base, styles];
        #mounted_accessor_storage = __runInitializers(this, _private_mounted_initializers, false);
        get #mounted() { return _private_mounted_descriptor.get.call(this); }
        set #mounted(value) { return _private_mounted_descriptor.set.call(this, value); }
        #startingStyle_accessor_storage = (__runInitializers(this, _private_mounted_extraInitializers), __runInitializers(this, _private_startingStyle_initializers, false));
        get #startingStyle() { return _private_startingStyle_descriptor.get.call(this); }
        set #startingStyle(value) { return _private_startingStyle_descriptor.set.call(this, value); }
        #endingStyle_accessor_storage = (__runInitializers(this, _private_startingStyle_extraInitializers), __runInitializers(this, _private_endingStyle_initializers, false));
        get #endingStyle() { return _private_endingStyle_descriptor.get.call(this); }
        set #endingStyle(value) { return _private_endingStyle_descriptor.set.call(this, value); }
        #ctx = (__runInitializers(this, _private_endingStyle_extraInitializers), new ContextConsumer(this, {
            context: sidebarContext,
            subscribe: true,
        }));
        willUpdate() {
            const ctx = this.#ctx.value;
            if (!ctx)
                return;
            this.dataset.state = ctx.state;
            this.dataset.side = ctx.side;
            this.dataset.variant = ctx.variant;
            this.dataset.collapsible = ctx.collapsible;
            // Handle mobile panel animation
            if (ctx.isMobile) {
                if (ctx.openMobile && !this.#mounted) {
                    this.#animateOpen();
                }
                else if (!ctx.openMobile && this.#mounted && !this.#endingStyle) {
                    this.#animateClose();
                }
            }
        }
        async #animateOpen() {
            this.#mounted = true;
            this.#startingStyle = true;
            await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
            this.#startingStyle = false;
        }
        #animateClose() {
            this.#endingStyle = true;
            const panel = this.shadowRoot?.querySelector(".MobilePanel");
            if (!panel) {
                this.#finishClose();
                return;
            }
            let called = false;
            const done = () => {
                if (called)
                    return;
                called = true;
                panel.removeEventListener("transitionend", onEnd);
                clearTimeout(timer);
                this.#finishClose();
            };
            const onEnd = () => {
                done();
            };
            panel.addEventListener("transitionend", onEnd);
            const timer = setTimeout(done, 250);
        }
        #finishClose() {
            this.#endingStyle = false;
            this.#mounted = false;
        }
        #onBackdropClick = () => {
            this.#ctx.value?.setOpen(false);
        };
        #onMobileKeyDown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                this.#ctx.value?.setOpen(false);
            }
        };
        render() {
            const ctx = this.#ctx.value;
            if (!ctx)
                return html ``;
            const side = ctx.side;
            const startX = side === "left" ? "-100%" : "100%";
            if (ctx.isMobile) {
                if (!this.#mounted)
                    return html ``;
                return html `
        <div
          class="Backdrop"
          part="backdrop"
          ?data-starting-style=${this.#startingStyle}
          ?data-ending-style=${this.#endingStyle}
          @click=${this.#onBackdropClick}
        ></div>
        <div
          class="MobilePanel"
          part="mobile-panel"
          role="dialog"
          tabindex="-1"
          style="--mobile-start-x: ${startX}; --mobile-end-x: ${startX}"
          ?data-starting-style=${this.#startingStyle}
          ?data-ending-style=${this.#endingStyle}
          @keydown=${this.#onMobileKeyDown}
        >
          <slot></slot>
        </div>
      `;
            }
            if (ctx.collapsible === "none") {
                return html `
        <div class="DesktopOuter" part="desktop-outer">
          <div class="DesktopInner" part="desktop-inner">
            <slot></slot>
          </div>
        </div>
      `;
            }
            return html `
      <div class="DesktopOuter" part="desktop-outer">
        <div class="DesktopInner" part="desktop-inner">
          <slot></slot>
        </div>
      </div>
    `;
        }
    };
})();
export { DuiSidebarPrimitive };
