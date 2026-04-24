/** Ported from original DUI: deep-future-app/app/client/components/dui/data-table */
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
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
// ── Events ─────────────────────────────────────────────────────────────
export const sortChangeEvent = customEvent("sort-change", {
    bubbles: true,
    composed: true,
});
export const pageChangeEvent = customEvent("page-change", {
    bubbles: true,
    composed: true,
});
// ── Inline SVG sort icons ──────────────────────────────────────────────
const chevronUpDown = html `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="100%"
  height="100%"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="m7 15 5 5 5-5" />
  <path d="m7 9 5-5 5 5" />
</svg>`;
const chevronUp = html `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="100%"
  height="100%"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="m18 15-6-6-6 6" />
</svg>`;
const chevronDown = html `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="100%"
  height="100%"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="m6 9 6 6 6-6" />
</svg>`;
// ── Pure helpers ────────────────────────────────────────────────────────
function compareValues(a, b) {
    if (a == null && b == null)
        return 0;
    if (a == null)
        return -1;
    if (b == null)
        return 1;
    if (typeof a === "number" && typeof b === "number")
        return a - b;
    if (typeof a === "string" && typeof b === "string")
        return a.localeCompare(b);
    if (a instanceof Date && b instanceof Date)
        return a.getTime() - b.getTime();
    return String(a).localeCompare(String(b));
}
function sortData(data, sort) {
    if (!sort)
        return [...data];
    const { column, direction } = sort;
    const multiplier = direction === "asc" ? 1 : -1;
    return [...data].sort((a, b) => multiplier * compareValues(a[column], b[column]));
}
function paginateData(data, page, pageSize) {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
}
// ── Styles ─────────────────────────────────────────────────────────────
const hostStyles = css `
  :host {
    display: block;
  }
`;
const componentStyles = css `
  .DataTable {
    display: flex;
    flex-direction: column;
  }

  .TableWindow {
    overflow: auto;
  }

  table {
    border-collapse: collapse;
    min-width: 100%;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  th {
    text-align: left;
    white-space: nowrap;
    user-select: none;
  }

  th[aria-sort] {
    cursor: pointer;
  }

  .HeaderContent {
    display: inline-flex;
    align-items: center;
  }

  .SortIcon {
    display: inline-flex;
    flex-shrink: 0;
  }

  .Pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .PageInfo {
    display: flex;
    align-items: center;
  }

  .PageControls {
    display: flex;
    align-items: center;
  }

  .PageButton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    background: transparent;
  }

  .PageButton:disabled {
    cursor: not-allowed;
  }
`;
// ── Component ──────────────────────────────────────────────────────────
/**
 * `<dui-data-table>` — A sortable, paginated data table.
 *
 * Accepts column definitions and row data, with optional sorting and
 * pagination. Cells can be customized via column `render` functions.
 *
 * @fires sort-change - Fired when a sortable column header is clicked. Detail: SortState
 * @fires page-change - Fired when the page changes. Detail: PageState
 */
let DuiDataTablePrimitive = (() => {
    let _classSuper = LitElement;
    let _columns_decorators;
    let _columns_initializers = [];
    let _columns_extraInitializers = [];
    let _data_decorators;
    let _data_initializers = [];
    let _data_extraInitializers = [];
    let _pageSize_decorators;
    let _pageSize_initializers = [];
    let _pageSize_extraInitializers = [];
    let _rowKey_decorators;
    let _rowKey_initializers = [];
    let _rowKey_extraInitializers = [];
    let _emptyText_decorators;
    let _emptyText_initializers = [];
    let _emptyText_extraInitializers = [];
    let _private_sort_decorators;
    let _private_sort_initializers = [];
    let _private_sort_extraInitializers = [];
    let _private_sort_descriptor;
    let _private_page_decorators;
    let _private_page_initializers = [];
    let _private_page_extraInitializers = [];
    let _private_page_descriptor;
    let _private_displayRows_decorators;
    let _private_displayRows_initializers = [];
    let _private_displayRows_extraInitializers = [];
    let _private_displayRows_descriptor;
    return class DuiDataTablePrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _columns_decorators = [property({ attribute: false })];
            _data_decorators = [property({ attribute: false })];
            _pageSize_decorators = [property({ type: Number, attribute: "page-size" })];
            _rowKey_decorators = [property({ attribute: false })];
            _emptyText_decorators = [property({ attribute: "empty-text" })];
            _private_sort_decorators = [state()];
            _private_page_decorators = [state()];
            _private_displayRows_decorators = [state()];
            __esDecorate(this, null, _columns_decorators, { kind: "accessor", name: "columns", static: false, private: false, access: { has: obj => "columns" in obj, get: obj => obj.columns, set: (obj, value) => { obj.columns = value; } }, metadata: _metadata }, _columns_initializers, _columns_extraInitializers);
            __esDecorate(this, null, _data_decorators, { kind: "accessor", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
            __esDecorate(this, null, _pageSize_decorators, { kind: "accessor", name: "pageSize", static: false, private: false, access: { has: obj => "pageSize" in obj, get: obj => obj.pageSize, set: (obj, value) => { obj.pageSize = value; } }, metadata: _metadata }, _pageSize_initializers, _pageSize_extraInitializers);
            __esDecorate(this, null, _rowKey_decorators, { kind: "accessor", name: "rowKey", static: false, private: false, access: { has: obj => "rowKey" in obj, get: obj => obj.rowKey, set: (obj, value) => { obj.rowKey = value; } }, metadata: _metadata }, _rowKey_initializers, _rowKey_extraInitializers);
            __esDecorate(this, null, _emptyText_decorators, { kind: "accessor", name: "emptyText", static: false, private: false, access: { has: obj => "emptyText" in obj, get: obj => obj.emptyText, set: (obj, value) => { obj.emptyText = value; } }, metadata: _metadata }, _emptyText_initializers, _emptyText_extraInitializers);
            __esDecorate(this, _private_sort_descriptor = { get: __setFunctionName(function () { return this.#sort_accessor_storage; }, "#sort", "get"), set: __setFunctionName(function (value) { this.#sort_accessor_storage = value; }, "#sort", "set") }, _private_sort_decorators, { kind: "accessor", name: "#sort", static: false, private: true, access: { has: obj => #sort in obj, get: obj => obj.#sort, set: (obj, value) => { obj.#sort = value; } }, metadata: _metadata }, _private_sort_initializers, _private_sort_extraInitializers);
            __esDecorate(this, _private_page_descriptor = { get: __setFunctionName(function () { return this.#page_accessor_storage; }, "#page", "get"), set: __setFunctionName(function (value) { this.#page_accessor_storage = value; }, "#page", "set") }, _private_page_decorators, { kind: "accessor", name: "#page", static: false, private: true, access: { has: obj => #page in obj, get: obj => obj.#page, set: (obj, value) => { obj.#page = value; } }, metadata: _metadata }, _private_page_initializers, _private_page_extraInitializers);
            __esDecorate(this, _private_displayRows_descriptor = { get: __setFunctionName(function () { return this.#displayRows_accessor_storage; }, "#displayRows", "get"), set: __setFunctionName(function (value) { this.#displayRows_accessor_storage = value; }, "#displayRows", "set") }, _private_displayRows_decorators, { kind: "accessor", name: "#displayRows", static: false, private: true, access: { has: obj => #displayRows in obj, get: obj => obj.#displayRows, set: (obj, value) => { obj.#displayRows = value; } }, metadata: _metadata }, _private_displayRows_initializers, _private_displayRows_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-data-table";
        static styles = [base, hostStyles, componentStyles];
        #columns_accessor_storage = __runInitializers(this, _columns_initializers, []);
        /** Column definitions describing each visible column. */
        get columns() { return this.#columns_accessor_storage; }
        set columns(value) { this.#columns_accessor_storage = value; }
        #data_accessor_storage = (__runInitializers(this, _columns_extraInitializers), __runInitializers(this, _data_initializers, []));
        /** The full data array. Sorting and pagination are applied internally. */
        get data() { return this.#data_accessor_storage; }
        set data(value) { this.#data_accessor_storage = value; }
        #pageSize_accessor_storage = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _pageSize_initializers, 10));
        /** Number of rows per page. Set to 0 to disable pagination. */
        get pageSize() { return this.#pageSize_accessor_storage; }
        set pageSize(value) { this.#pageSize_accessor_storage = value; }
        #rowKey_accessor_storage = (__runInitializers(this, _pageSize_extraInitializers), __runInitializers(this, _rowKey_initializers, undefined));
        /** Key function to derive a unique identifier from each row. */
        get rowKey() { return this.#rowKey_accessor_storage; }
        set rowKey(value) { this.#rowKey_accessor_storage = value; }
        #emptyText_accessor_storage = (__runInitializers(this, _rowKey_extraInitializers), __runInitializers(this, _emptyText_initializers, "No results."));
        /** Text shown when the data array is empty. */
        get emptyText() { return this.#emptyText_accessor_storage; }
        set emptyText(value) { this.#emptyText_accessor_storage = value; }
        #sort_accessor_storage = (__runInitializers(this, _emptyText_extraInitializers), __runInitializers(this, _private_sort_initializers, null));
        get #sort() { return _private_sort_descriptor.get.call(this); }
        set #sort(value) { return _private_sort_descriptor.set.call(this, value); }
        #page_accessor_storage = (__runInitializers(this, _private_sort_extraInitializers), __runInitializers(this, _private_page_initializers, 1));
        get #page() { return _private_page_descriptor.get.call(this); }
        set #page(value) { return _private_page_descriptor.set.call(this, value); }
        #displayRows_accessor_storage = (__runInitializers(this, _private_page_extraInitializers), __runInitializers(this, _private_displayRows_initializers, []));
        get #displayRows() { return _private_displayRows_descriptor.get.call(this); }
        set #displayRows(value) { return _private_displayRows_descriptor.set.call(this, value); }
        // ── Lifecycle ──────────────────────────────────────────────────────
        willUpdate(changed) {
            // Recompute display rows when data, sort, page, or pageSize change.
            if (changed.has("data") ||
                changed.has("pageSize") ||
                changed.has("#sort") ||
                changed.has("#page")) {
                // Reset page when data changes.
                if (changed.has("data")) {
                    this.#page = 1;
                }
                const sorted = sortData(this.data, this.#sort);
                if (this.pageSize > 0) {
                    this.#displayRows = paginateData(sorted, this.#page, this.pageSize);
                }
                else {
                    this.#displayRows = sorted;
                }
            }
        }
        // ── Computed ───────────────────────────────────────────────────────
        get #totalPages() {
            if (this.pageSize <= 0)
                return 1;
            return Math.max(1, Math.ceil(this.data.length / this.pageSize));
        }
        get #pageState() {
            return {
                page: this.#page,
                pageSize: this.pageSize,
                totalRows: this.data.length,
                totalPages: this.#totalPages,
            };
        }
        // ── Sort handling ─────────────────────────────────────────────────
        #handleSort(column) {
            if (this.#sort?.column === column) {
                if (this.#sort.direction === "asc") {
                    this.#sort = { column, direction: "desc" };
                }
                else {
                    // desc → clear
                    this.#sort = null;
                }
            }
            else {
                this.#sort = { column, direction: "asc" };
            }
            this.#page = 1;
            this.dispatchEvent(sortChangeEvent(this.#sort));
        }
        // ── Pagination handling ───────────────────────────────────────────
        #goToPage(page) {
            this.#page = Math.max(1, Math.min(page, this.#totalPages));
            this.dispatchEvent(pageChangeEvent(this.#pageState));
        }
        // ── Render ────────────────────────────────────────────────────────
        #renderSortIcon(column) {
            if (!column.sortable)
                return nothing;
            if (this.#sort?.column === column.key) {
                return html `<span class="SortIcon"
        >${this.#sort.direction === "asc" ? chevronUp : chevronDown}</span
      >`;
            }
            return html `<span class="SortIcon">${chevronUpDown}</span>`;
        }
        #renderHeader() {
            return html `
      <thead>
        <tr>
          ${this.columns.map((col) => {
                const style = col.width ? { width: col.width } : {};
                const sortAttr = col.sortable
                    ? this.#sort?.column === col.key
                        ? this.#sort.direction === "asc"
                            ? "ascending"
                            : "descending"
                        : "none"
                    : undefined;
                return html `
              <th
                style=${styleMap(style)}
                aria-sort=${sortAttr ?? nothing}
                @click=${col.sortable
                    ? () => this.#handleSort(col.key)
                    : nothing}
              >
                <span class="HeaderContent">
                  ${col.header} ${this.#renderSortIcon(col)}
                </span>
              </th>
            `;
            })}
        </tr>
      </thead>
    `;
        }
        #renderBody() {
            if (this.#displayRows.length === 0) {
                return html `
        <tbody>
          <tr class="EmptyRow">
            <td colspan=${this.columns.length}>${this.emptyText}</td>
          </tr>
        </tbody>
      `;
            }
            const keyFn = this.rowKey
                ? (row, index) => this.rowKey(row)
                : (_row, index) => index;
            return html `
      <tbody>
        ${repeat(this.#displayRows, keyFn, (row) => html `
            <tr>
              ${this.columns.map((col) => {
                const value = row[col.key];
                const content = col.render
                    ? col.render(value, row)
                    : (value ?? "");
                return html `<td>${content}</td>`;
            })}
            </tr>
          `)}
      </tbody>
    `;
        }
        #renderPagination() {
            if (this.pageSize <= 0 || this.data.length === 0)
                return nothing;
            const start = (this.#page - 1) * this.pageSize + 1;
            const end = Math.min(this.#page * this.pageSize, this.data.length);
            const isFirst = this.#page === 1;
            const isLast = this.#page === this.#totalPages;
            return html `
      <div class="Pagination" part="pagination">
        <div class="PageInfo">
          <span>${start}-${end} of ${this.data.length}</span>
        </div>
        <div class="PageControls">
          <button
            class="PageButton"
            ?disabled=${isFirst}
            @click=${() => this.#goToPage(1)}
            aria-label="First page"
          >
            <dui-icon style="--icon-size: var(--text-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg></dui-icon>
          </button>
          <button
            class="PageButton"
            ?disabled=${isFirst}
            @click=${() => this.#goToPage(this.#page - 1)}
            aria-label="Previous page"
          >
            <dui-icon style="--icon-size: var(--text-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></dui-icon>
          </button>
          <button
            class="PageButton"
            ?disabled=${isLast}
            @click=${() => this.#goToPage(this.#page + 1)}
            aria-label="Next page"
          >
            <dui-icon style="--icon-size: var(--text-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></dui-icon>
          </button>
          <button
            class="PageButton"
            ?disabled=${isLast}
            @click=${() => this.#goToPage(this.#totalPages)}
            aria-label="Last page"
          >
            <dui-icon style="--icon-size: var(--text-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg></dui-icon>
          </button>
        </div>
      </div>
    `;
        }
        render() {
            return html `
      <div class="DataTable" part="root">
        <div class="TableWindow" part="table-window">
          <table part="table">
            ${this.#renderHeader()} ${this.#renderBody()}
          </table>
        </div>
        ${this.#renderPagination()}
      </div>
    `;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _private_displayRows_extraInitializers);
        }
    };
})();
export { DuiDataTablePrimitive };
