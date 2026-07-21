/** Ported from original DUI: deep-future-app/app/client/components/dui/data-table */

import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap, type StyleInfo } from "lit/directives/style-map.js";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";


// ── Types ──────────────────────────────────────────────────────────────

export type ColumnDef<T> = {
  /** Unique key identifying the column (usually a key of T). */
  key: string;
  /** Column header label. */
  header: string;
  /** Whether this column is sortable. */
  sortable?: boolean;
  /** Fixed column width (CSS value). */
  width?: string;
  /**
   * Derives the value used for sorting, filter matching, and default cell
   * content. Falls back to `row[key]` when absent. The resolved value is also
   * passed as the first argument to `render`.
   */
  accessorFn?: (row: T) => unknown;
  /** Custom render function for cell content. */
  render?: (value: unknown, row: T) => TemplateResult | string | number;
};

export type SortDirection = "asc" | "desc";

export type SortState = {
  column: string;
  direction: SortDirection;
} | null;

export type PageState = {
  page: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
};

/** Row-selection behavior. `"none"` (default) renders no selection UI. */
export type SelectionMode = "none" | "single" | "multiple";

export type SelectionChangeDetail<T> = {
  selectedKeys: string[];
  selectedRows: T[];
};

export type RowClickDetail<T> = {
  row: T;
  key: string | undefined;
};

// ── Events ─────────────────────────────────────────────────────────────

export const sortChangeEvent = customEvent<SortState>("sort-change", {
  bubbles: true,
  composed: true,
});

export const pageChangeEvent = customEvent<PageState>("page-change", {
  bubbles: true,
  composed: true,
});

export const selectionChangeEvent = customEvent<SelectionChangeDetail<unknown>>(
  "selection-change",
  { bubbles: true, composed: true },
);

export const rowClickEvent = customEvent<RowClickDetail<unknown>>("row-click", {
  bubbles: true,
  composed: true,
});

// ── Inline SVG sort icons ──────────────────────────────────────────────

const chevronUpDown = html`<svg
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

const chevronUp = html`<svg
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

const chevronDown = html`<svg
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

/** Resolve the value a column exposes for a row (accessor fn or `row[key]`). */
export function resolveValue<T>(row: T, col: ColumnDef<T>): unknown {
  return col.accessorFn
    ? col.accessorFn(row)
    : (row as Record<string, unknown>)[col.key];
}

export function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();

  return String(a).localeCompare(String(b));
}

export function sortData<T extends Record<string, unknown>>(
  data: T[],
  sort: SortState,
  columns: ColumnDef<T>[] = [],
): T[] {
  if (!sort) return [...data];

  const { column, direction } = sort;
  const multiplier = direction === "asc" ? 1 : -1;
  const accessor = columns.find((c) => c.key === column)?.accessorFn;
  const get = accessor ?? ((row: T) => row[column]);

  return [...data].sort((a, b) => multiplier * compareValues(get(a), get(b)));
}

/**
 * Filter rows through a consumer-owned predicate. Returns the input unchanged
 * when no predicate is supplied; the predicate owns all semantics (including
 * treating an "empty" filter value as match-all).
 */
export function filterData<T>(
  data: T[],
  filterValue: unknown,
  filterFn: ((row: T, filterValue: unknown) => boolean) | undefined,
): T[] {
  if (!filterFn) return data;
  return data.filter((row) => filterFn(row, filterValue));
}

export function paginateData<T>(data: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return data.slice(start, start + pageSize);
}

/** Total pages for a row count. `pageSize <= 0` (pagination off) → 1. */
export function totalPages(count: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(count / pageSize));
}

/** Clamp a page number into `[1, pages]`. */
export function clampPage(page: number, pages: number): number {
  return Math.max(1, Math.min(page, pages));
}

/**
 * Derive the header select-all checkbox state from the current filtered set.
 * `checked` when every filtered key is selected; `indeterminate` when some
 * (but not all) are.
 */
export function deriveSelectAllState(
  filteredKeys: string[],
  selectedKeys: Set<string>,
): { checked: boolean; indeterminate: boolean } {
  if (filteredKeys.length === 0) return { checked: false, indeterminate: false };

  let selected = 0;
  for (const key of filteredKeys) {
    if (selectedKeys.has(key)) selected++;
  }

  return {
    checked: selected === filteredKeys.length,
    indeterminate: selected > 0 && selected < filteredKeys.length,
  };
}

// ── Styles ─────────────────────────────────────────────────────────────

const hostStyles = css`
  :host {
    display: block;
  }
`;

const componentStyles = css`
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

  /* Selection column: size to its checkbox, keep contents centered. */
  [part~="selection"] {
    width: 1%;
    white-space: nowrap;
    text-align: center;
  }

  /* Structural hook only — the styled layer supplies the real token.
     Inert (transparent) by default so the primitive stays unstyled. */
  tr[aria-selected="true"] {
    background: var(--data-table-selected-background, transparent);
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
 * `<dui-data-table>` — A sortable, filterable, paginated data table with
 * optional row selection.
 *
 * Accepts column definitions and row data. The internal pipeline is
 * `data → filter → sort → paginate`. Cells can be customized via column
 * `render` functions, and values for sorting/filtering/default content are
 * resolved through an optional per-column `accessorFn`.
 *
 * Selection is controlled and keyed by `rowKey`: the component reflects
 * `selectedKeys` and emits the proposed next selection on change.
 *
 * @csspart root - The outer container.
 * @csspart table-window - The scroll container around the table.
 * @csspart table - The `<table>` element.
 * @csspart header-row - The header `<tr>`.
 * @csspart header-cell - Each header `<th>`.
 * @csspart row - Each body `<tr>`. Selected rows also carry the `selected` part.
 * @csspart cell - Each body `<td>`. Selection cells also carry the `selection` part.
 * @csspart pagination - The pagination footer.
 *
 * @cssprop --data-table-selected-background - Background for selected rows
 *   (default `transparent`; set by the styled layer).
 *
 * @fires sort-change - Fired when a sortable column header is clicked. Detail: SortState
 * @fires page-change - Fired when the page changes. Detail: PageState
 * @fires selection-change - Fired with the proposed next selection. Detail: { selectedKeys, selectedRows }
 * @fires row-click - Fired when a body row is clicked (not on interactive cell content). Detail: { row, key }
 */
export class DuiDataTablePrimitive<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends LitElement {
  static tagName = "dui-data-table" as const;
  static override styles = [base, hostStyles, componentStyles];

  /** Column definitions describing each visible column. */
  @property({ attribute: false })
  accessor columns: ColumnDef<T>[] = [];

  /** The full data array. Filtering, sorting and pagination are applied internally. */
  @property({ attribute: false })
  accessor data: T[] = [];

  /** Number of rows per page. Set to 0 to disable pagination. */
  @property({ type: Number, attribute: "page-size" })
  accessor pageSize: number = 10;

  /** Key function to derive a unique identifier from each row. Required for selection. */
  @property({ attribute: false })
  accessor rowKey: ((row: T) => string) | undefined = undefined;

  /** Text shown when there are no rows to display. */
  @property({ attribute: "empty-text" })
  accessor emptyText: string = "No results.";

  /**
   * Opaque, consumer-owned filter state, passed verbatim to `globalFilterFn`.
   * Can hold anything — a search string, a facet object, etc.
   */
  @property({ attribute: false })
  accessor filterValue: unknown = undefined;

  /**
   * When set, rows are filtered (before sort + paginate) via this predicate.
   * The predicate owns all semantics, including treating an empty
   * `filterValue` as "match all".
   */
  @property({ attribute: false })
  accessor globalFilterFn:
    | ((row: T, filterValue: unknown) => boolean)
    | undefined = undefined;

  /** Row-selection behavior. `"none"` (default) renders no selection UI. */
  @property({ attribute: "selection-mode" })
  accessor selectionMode: SelectionMode = "none";

  /** Selected row keys (controlled; keys per `rowKey`). */
  @property({ attribute: false })
  accessor selectedKeys: string[] = [];

  @state() accessor #sort: SortState = null;
  @state() accessor #page: number = 1;
  @state() accessor #displayRows: T[] = [];

  /** Rows after filtering (before sort/paginate). Drives totals + select-all. */
  #filtered: T[] = [];

  // ── Lifecycle ──────────────────────────────────────────────────────

  override willUpdate(changed: PropertyValues): void {
    const dataOrFilterChanged =
      changed.has("data") ||
      changed.has("filterValue") ||
      changed.has("globalFilterFn");

    // Recompute display rows when data, filter, sort, page, or pageSize change.
    if (
      dataOrFilterChanged ||
      changed.has("pageSize") ||
      changed.has("#sort" as keyof this) ||
      changed.has("#page" as keyof this)
    ) {
      // Reset page when the underlying (filtered) set changes.
      if (dataOrFilterChanged) {
        this.#page = 1;
      }

      this.#filtered = filterData(
        this.data,
        this.filterValue,
        this.globalFilterFn,
      );

      // Defensive clamp: a shrinking set can't strand the view on an empty page.
      this.#page = clampPage(this.#page, this.#totalPages);

      const sorted = sortData(this.#filtered, this.#sort, this.columns);

      if (this.pageSize > 0) {
        this.#displayRows = paginateData(sorted, this.#page, this.pageSize);
      } else {
        this.#displayRows = sorted;
      }
    }
  }

  // ── Computed ───────────────────────────────────────────────────────

  get #totalPages(): number {
    return totalPages(this.#filtered.length, this.pageSize);
  }

  get #pageState(): PageState {
    return {
      page: this.#page,
      pageSize: this.pageSize,
      totalRows: this.#filtered.length,
      totalPages: this.#totalPages,
    };
  }

  get #selectionEnabled(): boolean {
    return this.selectionMode !== "none" && this.rowKey != null;
  }

  // ── Sort handling ─────────────────────────────────────────────────

  #handleSort(column: string): void {
    if (this.#sort?.column === column) {
      if (this.#sort.direction === "asc") {
        this.#sort = { column, direction: "desc" };
      } else {
        // desc → clear
        this.#sort = null;
      }
    } else {
      this.#sort = { column, direction: "asc" };
    }

    this.#page = 1;
    this.dispatchEvent(sortChangeEvent(this.#sort));
  }

  // ── Pagination handling ───────────────────────────────────────────

  #goToPage(page: number): void {
    this.#page = clampPage(page, this.#totalPages);
    this.dispatchEvent(pageChangeEvent(this.#pageState));
  }

  // ── Selection handling ────────────────────────────────────────────

  #emitSelection(nextKeys: string[]): void {
    const next = new Set(nextKeys);
    const rowKey = this.rowKey;
    const selectedRows = rowKey
      ? this.data.filter((row) => next.has(rowKey(row)))
      : [];

    this.dispatchEvent(
      selectionChangeEvent({ selectedKeys: nextKeys, selectedRows }) as CustomEvent<
        SelectionChangeDetail<unknown>
      >,
    );
  }

  /** Toggle a single row's selection, honoring single vs multiple semantics. */
  #onRowCheckbox(key: string | undefined, checked: boolean): void {
    if (key == null) return;

    if (this.selectionMode === "single") {
      this.#emitSelection(checked ? [key] : []);
      return;
    }

    // multiple
    const current = new Set(this.selectedKeys);
    if (checked) current.add(key);
    else current.delete(key);
    this.#emitSelection([...current]);
  }

  /** Select-all / clear-all over the current filtered set (multiple only). */
  #toggleAll(checked: boolean): void {
    const rowKey = this.rowKey;
    if (!rowKey) return;

    const filteredKeys = this.#filtered.map(rowKey);

    if (checked) {
      // Union: preserve any selections outside the current filter.
      this.#emitSelection([
        ...new Set([...this.selectedKeys, ...filteredKeys]),
      ]);
    } else {
      // Difference: drop only the filtered keys.
      const filteredSet = new Set(filteredKeys);
      this.#emitSelection(
        this.selectedKeys.filter((k) => !filteredSet.has(k)),
      );
    }
  }

  // ── Row-click handling ────────────────────────────────────────────

  #handleRowClick(e: Event, row: T, key: string | undefined): void {
    // Ignore clicks that originate on interactive content or the selection cell.
    const interactive = new Set([
      "dui-checkbox",
      "a",
      "button",
      "input",
      "select",
      "textarea",
    ]);

    for (const node of e.composedPath()) {
      if (node === e.currentTarget) break;
      if (!(node instanceof Element)) continue;
      if (interactive.has(node.localName)) return;
      if (node.getAttribute("role") === "button") return;
      if (node.getAttribute("part")?.split(/\s+/).includes("selection")) return;
    }

    this.dispatchEvent(
      rowClickEvent({ row, key }) as CustomEvent<RowClickDetail<unknown>>,
    );
  }

  // ── Render ────────────────────────────────────────────────────────

  #renderSortIcon(column: ColumnDef<T>): TemplateResult | typeof nothing {
    if (!column.sortable) return nothing;

    if (this.#sort?.column === column.key) {
      return html`<span class="SortIcon"
        >${this.#sort.direction === "asc" ? chevronUp : chevronDown}</span
      >`;
    }

    return html`<span class="SortIcon">${chevronUpDown}</span>`;
  }

  #renderSelectionHeader(): TemplateResult {
    if (this.selectionMode === "single") {
      return html`<th part="header-cell selection"></th>`;
    }

    const filteredKeys = this.rowKey ? this.#filtered.map(this.rowKey) : [];
    const { checked, indeterminate } = deriveSelectAllState(
      filteredKeys,
      new Set(this.selectedKeys),
    );

    return html`
      <th part="header-cell selection">
        <dui-checkbox
          .checked=${checked}
          .indeterminate=${indeterminate}
          aria-label="Select all rows"
          @checked-change=${(e: Event) =>
            this.#toggleAll(
              (e as CustomEvent<{ checked: boolean }>).detail.checked,
            )}
        ></dui-checkbox>
      </th>
    `;
  }

  #renderHeader(): TemplateResult {
    return html`
      <thead>
        <tr part="header-row">
          ${this.#selectionEnabled ? this.#renderSelectionHeader() : nothing}
          ${this.columns.map((col) => {
            const style: StyleInfo = col.width ? { width: col.width } : {};
            const sortAttr = col.sortable
              ? this.#sort?.column === col.key
                ? this.#sort.direction === "asc"
                  ? "ascending"
                  : "descending"
                : "none"
              : undefined;

            return html`
              <th
                part="header-cell"
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

  #renderBody(): TemplateResult {
    const selectionEnabled = this.#selectionEnabled;
    const colSpan = this.columns.length + (selectionEnabled ? 1 : 0);

    if (this.#displayRows.length === 0) {
      return html`
        <tbody>
          <tr class="EmptyRow">
            <td colspan=${colSpan}>${this.emptyText}</td>
          </tr>
        </tbody>
      `;
    }

    const selectedSet = new Set(this.selectedKeys);
    const rowKey = this.rowKey;
    const keyFn = rowKey
      ? (row: T) => rowKey(row)
      : (_row: T, index: number) => index;

    return html`
      <tbody>
        ${repeat(this.#displayRows, keyFn, (row) => {
          const key = rowKey ? rowKey(row) : undefined;
          const isSelected =
            selectionEnabled && key != null && selectedSet.has(key);

          return html`
            <tr
              part=${isSelected ? "row selected" : "row"}
              aria-selected=${isSelected ? "true" : nothing}
              @click=${(e: Event) => this.#handleRowClick(e, row, key)}
            >
              ${selectionEnabled
                ? html`
                    <td part="cell selection">
                      <dui-checkbox
                        .checked=${isSelected}
                        aria-label="Select row"
                        @checked-change=${(e: Event) =>
                          this.#onRowCheckbox(
                            key,
                            (e as CustomEvent<{ checked: boolean }>).detail
                              .checked,
                          )}
                      ></dui-checkbox>
                    </td>
                  `
                : nothing}
              ${this.columns.map((col) => {
                const value = resolveValue(row, col);
                const content = col.render
                  ? col.render(value, row)
                  : (value ?? "");
                return html`<td part="cell">${content}</td>`;
              })}
            </tr>
          `;
        })}
      </tbody>
    `;
  }

  #renderPagination(): TemplateResult | typeof nothing {
    if (this.pageSize <= 0 || this.#filtered.length === 0) return nothing;

    const total = this.#filtered.length;
    const start = (this.#page - 1) * this.pageSize + 1;
    const end = Math.min(this.#page * this.pageSize, total);
    const isFirst = this.#page === 1;
    const isLast = this.#page === this.#totalPages;

    return html`
      <div class="Pagination" part="pagination">
        <div class="PageInfo">
          <span>${start}-${end} of ${total}</span>
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

  override render(): TemplateResult {
    return html`
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
}
