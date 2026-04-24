/** Ported from original DUI: deep-future-app/app/client/components/dui/portal */
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
import { getRootDocument } from "@dui/core/dom";
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: contents;
  }
`;
/**
 * `<dui-portal>` — Teleports light DOM children to a target container.
 *
 * Children are moved back into the portal when the element disconnects,
 * allowing the portal and its children to be moved or garbage-collected
 * correctly.
 *
 * @slot - Content to teleport.
 * @attr {string} target - CSS selector for the destination container (default: "body").
 * @attr {"shadow" | "document"} target-root - Where to resolve the target selector.
 */
let DuiPortalPrimitive = (() => {
    let _classSuper = LitElement;
    let _target_decorators;
    let _target_initializers = [];
    let _target_extraInitializers = [];
    let _targetRoot_decorators;
    let _targetRoot_initializers = [];
    let _targetRoot_extraInitializers = [];
    let _targetElement_decorators;
    let _targetElement_initializers = [];
    let _targetElement_extraInitializers = [];
    return class DuiPortalPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _target_decorators = [property({ type: String })];
            _targetRoot_decorators = [property({ type: String, attribute: "target-root", reflect: true })];
            _targetElement_decorators = [property({ attribute: false })];
            __esDecorate(this, null, _target_decorators, { kind: "accessor", name: "target", static: false, private: false, access: { has: obj => "target" in obj, get: obj => obj.target, set: (obj, value) => { obj.target = value; } }, metadata: _metadata }, _target_initializers, _target_extraInitializers);
            __esDecorate(this, null, _targetRoot_decorators, { kind: "accessor", name: "targetRoot", static: false, private: false, access: { has: obj => "targetRoot" in obj, get: obj => obj.targetRoot, set: (obj, value) => { obj.targetRoot = value; } }, metadata: _metadata }, _targetRoot_initializers, _targetRoot_extraInitializers);
            __esDecorate(this, null, _targetElement_decorators, { kind: "accessor", name: "targetElement", static: false, private: false, access: { has: obj => "targetElement" in obj, get: obj => obj.targetElement, set: (obj, value) => { obj.targetElement = value; } }, metadata: _metadata }, _targetElement_initializers, _targetElement_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-portal";
        static styles = [styles];
        #target_accessor_storage = __runInitializers(this, _target_initializers, "body");
        /** CSS selector for the destination container. */
        get target() { return this.#target_accessor_storage; }
        set target(value) { this.#target_accessor_storage = value; }
        #targetRoot_accessor_storage = (__runInitializers(this, _target_extraInitializers), __runInitializers(this, _targetRoot_initializers, "document"));
        /** Where to resolve the target selector: "document" (default) or "shadow". */
        get targetRoot() { return this.#targetRoot_accessor_storage; }
        set targetRoot(value) { this.#targetRoot_accessor_storage = value; }
        #targetElement_accessor_storage = (__runInitializers(this, _targetRoot_extraInitializers), __runInitializers(this, _targetElement_initializers, void 0));
        /** Direct element reference for cross-shadow-root targets. Takes precedence over `target` selector. */
        get targetElement() { return this.#targetElement_accessor_storage; }
        set targetElement(value) { this.#targetElement_accessor_storage = value; }
        #container = (__runInitializers(this, _targetElement_extraInitializers), undefined);
        #movedNodes = new Set();
        #isMoving = false;
        #queryTarget() {
            const root = getRootDocument(this, {
                composed: this.targetRoot === "document",
            });
            return root?.querySelector(this.target) ?? undefined;
        }
        connectedCallback() {
            super.connectedCallback();
            this.#container = this.targetElement ?? this.#queryTarget();
            if (this.#container && this.childNodes.length > 0) {
                this.#moveChildrenToTarget();
            }
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.#detach();
        }
        updated(changed) {
            if (changed.has("target") ||
                changed.has("targetRoot") ||
                changed.has("targetElement")) {
                this.#detach();
                this.#attach();
            }
        }
        #attach() {
            this.#container = this.targetElement ?? this.#queryTarget();
            this.#moveChildrenToTarget();
        }
        #detach() {
            if (this.#movedNodes.size === 0)
                return;
            this.#isMoving = true;
            for (const node of this.#movedNodes) {
                this.append(node);
            }
            this.#movedNodes.clear();
            this.#isMoving = false;
            this.#container = undefined;
        }
        #moveChildrenToTarget() {
            if (!this.#container) {
                throw new Error(`Portal target does not exist: ${this.target}`);
            }
            this.#isMoving = true;
            const nodes = Array.from(this.childNodes);
            for (const node of nodes) {
                this.#container.appendChild(node);
                this.#movedNodes.add(node);
            }
            this.#isMoving = false;
        }
        #handleSlotChange = () => {
            if (this.#isMoving || !this.#container)
                return;
            this.#moveChildrenToTarget();
        };
        render() {
            return html `<slot @slotchange=${this.#handleSlotChange}></slot>`;
        }
    };
})();
export { DuiPortalPrimitive };
