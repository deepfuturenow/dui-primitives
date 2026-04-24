/** Ported from original DUI: deep-future-app/app/client/components/dui/command */
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
import { provide } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { commandContext, } from "./command-context.ts";
import { commandScore } from "./command-score.ts";
export const selectEvent = customEvent("select", {
    bubbles: true,
    composed: true,
});
export const searchChangeEvent = customEvent("search-change", {
    bubbles: true,
    composed: true,
});
export const escapeEvent = customEvent("escape", {
    bubbles: true,
    composed: true,
});
let idCounter = 0;
const nextId = () => `dui-command-${++idCounter}`;
const styles = css `
  :host {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;
let DuiCommandPrimitive = (() => {
    let _classSuper = LitElement;
    let _loop_decorators;
    let _loop_initializers = [];
    let _loop_extraInitializers = [];
    let _shouldFilter_decorators;
    let _shouldFilter_initializers = [];
    let _shouldFilter_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _filter_decorators;
    let _filter_initializers = [];
    let _filter_extraInitializers = [];
    let _private_search_decorators;
    let _private_search_initializers = [];
    let _private_search_extraInitializers = [];
    let _private_search_descriptor;
    let _private_selectedItemId_decorators;
    let _private_selectedItemId_initializers = [];
    let _private_selectedItemId_extraInitializers = [];
    let _private_selectedItemId_descriptor;
    let __ctx_decorators;
    let __ctx_initializers = [];
    let __ctx_extraInitializers = [];
    return class DuiCommandPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _loop_decorators = [property({ type: Boolean })];
            _shouldFilter_decorators = [property({ type: Boolean, attribute: "should-filter" })];
            _value_decorators = [property({ type: String })];
            _filter_decorators = [property({ attribute: false })];
            _private_search_decorators = [state()];
            _private_selectedItemId_decorators = [state()];
            __ctx_decorators = [provide({ context: commandContext }), state()];
            __esDecorate(this, null, _loop_decorators, { kind: "accessor", name: "loop", static: false, private: false, access: { has: obj => "loop" in obj, get: obj => obj.loop, set: (obj, value) => { obj.loop = value; } }, metadata: _metadata }, _loop_initializers, _loop_extraInitializers);
            __esDecorate(this, null, _shouldFilter_decorators, { kind: "accessor", name: "shouldFilter", static: false, private: false, access: { has: obj => "shouldFilter" in obj, get: obj => obj.shouldFilter, set: (obj, value) => { obj.shouldFilter = value; } }, metadata: _metadata }, _shouldFilter_initializers, _shouldFilter_extraInitializers);
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _filter_decorators, { kind: "accessor", name: "filter", static: false, private: false, access: { has: obj => "filter" in obj, get: obj => obj.filter, set: (obj, value) => { obj.filter = value; } }, metadata: _metadata }, _filter_initializers, _filter_extraInitializers);
            __esDecorate(this, _private_search_descriptor = { get: __setFunctionName(function () { return this.#search_accessor_storage; }, "#search", "get"), set: __setFunctionName(function (value) { this.#search_accessor_storage = value; }, "#search", "set") }, _private_search_decorators, { kind: "accessor", name: "#search", static: false, private: true, access: { has: obj => #search in obj, get: obj => obj.#search, set: (obj, value) => { obj.#search = value; } }, metadata: _metadata }, _private_search_initializers, _private_search_extraInitializers);
            __esDecorate(this, _private_selectedItemId_descriptor = { get: __setFunctionName(function () { return this.#selectedItemId_accessor_storage; }, "#selectedItemId", "get"), set: __setFunctionName(function (value) { this.#selectedItemId_accessor_storage = value; }, "#selectedItemId", "set") }, _private_selectedItemId_decorators, { kind: "accessor", name: "#selectedItemId", static: false, private: true, access: { has: obj => #selectedItemId in obj, get: obj => obj.#selectedItemId, set: (obj, value) => { obj.#selectedItemId = value; } }, metadata: _metadata }, _private_selectedItemId_initializers, _private_selectedItemId_extraInitializers);
            __esDecorate(this, null, __ctx_decorators, { kind: "accessor", name: "_ctx", static: false, private: false, access: { has: obj => "_ctx" in obj, get: obj => obj._ctx, set: (obj, value) => { obj._ctx = value; } }, metadata: _metadata }, __ctx_initializers, __ctx_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-command";
        static styles = [base, styles];
        #loop_accessor_storage = __runInitializers(this, _loop_initializers, false);
        /** Whether keyboard navigation wraps from last to first and vice versa. */
        get loop() { return this.#loop_accessor_storage; }
        set loop(value) { this.#loop_accessor_storage = value; }
        #shouldFilter_accessor_storage = (__runInitializers(this, _loop_extraInitializers), __runInitializers(this, _shouldFilter_initializers, true));
        /** Whether items should be filtered based on search text. */
        get shouldFilter() { return this.#shouldFilter_accessor_storage; }
        set shouldFilter(value) { this.#shouldFilter_accessor_storage = value; }
        #value_accessor_storage = (__runInitializers(this, _shouldFilter_extraInitializers), __runInitializers(this, _value_initializers, undefined));
        /** Controlled value — the currently selected item value. */
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #filter_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _filter_initializers, undefined));
        /** Custom filter function. */
        get filter() { return this.#filter_accessor_storage; }
        set filter(value) { this.#filter_accessor_storage = value; }
        #search_accessor_storage = (__runInitializers(this, _filter_extraInitializers), __runInitializers(this, _private_search_initializers, ""));
        get #search() { return _private_search_descriptor.get.call(this); }
        set #search(value) { return _private_search_descriptor.set.call(this, value); }
        #selectedItemId_accessor_storage = (__runInitializers(this, _private_search_extraInitializers), __runInitializers(this, _private_selectedItemId_initializers, undefined));
        get #selectedItemId() { return _private_selectedItemId_descriptor.get.call(this); }
        set #selectedItemId(value) { return _private_selectedItemId_descriptor.set.call(this, value); }
        #items = (__runInitializers(this, _private_selectedItemId_extraInitializers), new Map());
        #itemOrder = [];
        #groups = new Set();
        #scoresMap = new Map();
        #listId = nextId();
        #recomputeScores() {
            this.#scoresMap.clear();
            for (const [id, entry] of this.#items) {
                const score = this.filter
                    ? this.filter(entry.value, this.#search, entry.keywords)
                    : commandScore(this.#search, entry.value, entry.textContent, entry.keywords);
                this.#scoresMap.set(id, score);
            }
        }
        #getScore = (itemId) => {
            if (!this.shouldFilter)
                return 1;
            return this.#scoresMap.get(itemId) ?? 0;
        };
        #getVisibleItems() {
            return this.#itemOrder
                .map((id) => this.#items.get(id))
                .filter((entry) => {
                if (!entry)
                    return false;
                if (!this.shouldFilter)
                    return true;
                return (this.#scoresMap.get(entry.id) ?? 0) > 0;
            });
        }
        #getVisibleCount = () => {
            return this.#getVisibleItems().length;
        };
        #getGroupVisibleCount = (groupId) => {
            return this.#getVisibleItems().filter((e) => e.groupId === groupId).length;
        };
        #registerItem = (entry) => {
            this.#items.set(entry.id, entry);
            if (!this.#itemOrder.includes(entry.id)) {
                this.#itemOrder.push(entry.id);
            }
            // Recompute scores for new item
            const score = this.filter
                ? this.filter(entry.value, this.#search, entry.keywords)
                : commandScore(this.#search, entry.value, entry.textContent, entry.keywords);
            this.#scoresMap.set(entry.id, score);
            // Auto-select first visible item if nothing selected
            if (!this.#selectedItemId) {
                const visible = this.#getVisibleItems();
                if (visible.length > 0 && !visible[0].disabled) {
                    this.#selectedItemId = visible[0].id;
                }
            }
            this.requestUpdate();
        };
        #unregisterItem = (id) => {
            this.#items.delete(id);
            this.#itemOrder = this.#itemOrder.filter((v) => v !== id);
            this.#scoresMap.delete(id);
            this.requestUpdate();
        };
        #updateItem = (entry) => {
            this.#items.set(entry.id, entry);
            const score = this.filter
                ? this.filter(entry.value, this.#search, entry.keywords)
                : commandScore(this.#search, entry.value, entry.textContent, entry.keywords);
            this.#scoresMap.set(entry.id, score);
            this.requestUpdate();
        };
        #registerGroup = (groupId) => {
            this.#groups.add(groupId);
        };
        #unregisterGroup = (groupId) => {
            this.#groups.delete(groupId);
        };
        #setSearch = (value) => {
            this.#search = value;
            this.#recomputeScores();
            // Select first visible non-disabled item
            const visible = this.#getVisibleItems();
            const firstSelectable = visible.find((e) => !e.disabled);
            this.#selectedItemId = firstSelectable?.id;
            this.dispatchEvent(searchChangeEvent(value));
        };
        #selectItem = (id) => {
            this.#selectedItemId = id;
        };
        #handleItemSelect = (value) => {
            this.dispatchEvent(selectEvent(value));
        };
        #handleKeyDown = (event) => {
            const visible = this.#getVisibleItems().filter((e) => !e.disabled);
            if (visible.length === 0)
                return;
            const currentIndex = visible.findIndex((e) => e.id === this.#selectedItemId);
            const selectByIndex = (index) => {
                const item = visible[index];
                if (item) {
                    this.#selectedItemId = item.id;
                }
            };
            switch (event.key) {
                case "ArrowDown":
                case "n":
                case "j": {
                    // Ctrl+N and Ctrl+J for down
                    if (event.key !== "ArrowDown" &&
                        !event.ctrlKey &&
                        !event.metaKey) {
                        return;
                    }
                    event.preventDefault();
                    if (currentIndex < visible.length - 1) {
                        selectByIndex(currentIndex + 1);
                    }
                    else if (this.loop) {
                        selectByIndex(0);
                    }
                    break;
                }
                case "ArrowUp":
                case "p":
                case "k": {
                    // Ctrl+P and Ctrl+K for up
                    if (event.key !== "ArrowUp" &&
                        !event.ctrlKey &&
                        !event.metaKey) {
                        return;
                    }
                    event.preventDefault();
                    if (currentIndex > 0) {
                        selectByIndex(currentIndex - 1);
                    }
                    else if (this.loop) {
                        selectByIndex(visible.length - 1);
                    }
                    break;
                }
                case "Home": {
                    event.preventDefault();
                    selectByIndex(0);
                    break;
                }
                case "End": {
                    event.preventDefault();
                    selectByIndex(visible.length - 1);
                    break;
                }
                case "Enter": {
                    event.preventDefault();
                    const selected = visible.find((e) => e.id === this.#selectedItemId);
                    if (selected) {
                        this.#handleItemSelect(selected.value);
                    }
                    break;
                }
                case "Escape": {
                    event.preventDefault();
                    this.dispatchEvent(escapeEvent());
                    break;
                }
            }
        };
        #_ctx_accessor_storage = __runInitializers(this, __ctx_initializers, this.#buildContext());
        get _ctx() { return this.#_ctx_accessor_storage; }
        set _ctx(value) { this.#_ctx_accessor_storage = value; }
        #buildContext() {
            return {
                search: this.#search,
                selectedItemId: this.#selectedItemId,
                listId: this.#listId,
                loop: this.loop,
                shouldFilter: this.shouldFilter,
                getScore: this.#getScore,
                getVisibleCount: this.#getVisibleCount,
                getGroupVisibleCount: this.#getGroupVisibleCount,
                registerItem: this.#registerItem,
                unregisterItem: this.#unregisterItem,
                updateItem: this.#updateItem,
                registerGroup: this.#registerGroup,
                unregisterGroup: this.#unregisterGroup,
                setSearch: this.#setSearch,
                selectItem: this.#selectItem,
                handleItemSelect: this.#handleItemSelect,
            };
        }
        connectedCallback() {
            super.connectedCallback();
            this.addEventListener("keydown", this.#handleKeyDown);
            this._ctx = this.#buildContext();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.removeEventListener("keydown", this.#handleKeyDown);
        }
        willUpdate() {
            this._ctx = this.#buildContext();
        }
        render() {
            return html `<slot></slot>`;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, __ctx_extraInitializers);
        }
    };
})();
export { DuiCommandPrimitive };
