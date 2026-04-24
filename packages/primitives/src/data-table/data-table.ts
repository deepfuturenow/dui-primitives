/** Ported from original DUI: deep-future-app/app/client/components/dui/data-table */

import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap, type StyleInfo } from "lit/directives/style-map.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";


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

// ── Events ─────────────────────────────────────────────────────────────

export const sortChangeEvent = customEvent<SortState>("sort-change", {
  bubbles: true,
  composed: true,
});

export const pageChangeEvent = customEvent<PageState>("page-change", {
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

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();

  return String(a).localeCompare(String(b));
}

function sortData<T extends Record<string, unknown>>(
  data: T[],
  sort: SortState,
): T[] {
  if (!sort) return [...data];

  const { column, direction } = sort;
  const multiplier = direction === "asc" ? 1 : -1;

  return [...data].sort(
    (a, b) => multiplier * compareValues(a[column], b[column]),
  );
}

function paginateData<T>(data: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return data.slice(start, start + pageSize);
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
export class DuiDataTablePrimitive<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends LitElement {
  static tagName = "dui-data-table" as const;
  static override styles = [base, hostStyles, componentStyles];

  /** Column definitions describing each visible column. */
  @property({ attribute: false })
  accessor columns: ColumnDef<T>[] = [];

  /** The full data array. Sorting and pagination are applied internally. */
  @property({ attribute: false })
  accessor data: T[] = [];

  /** Number of rows per page. Set to 0 to disable pagination. */
  @property({ type: Number, attribute: "page-size" })
  accessor pageSize: number = 10;

  /** Key function to derive a unique identifier from each row. */
  @property({ attribute: false })
  accessor rowKey: ((row: T) => string) | undefined = undefined;

  /** Text shown when the data array is empty. */
  @property({ attribute: "empty-text" })
  accessor emptyText: string = "No results.";

  @state() accessor #sort: SortState = null;
  @state() accessor #page: number = 1;
  @state() accessor #displayRows: T[] = [];

  // ── Lifecycle ──────────────────────────────────────────────────────

  override willUpdate(changed: PropertyValues): void {
    // Recompute display rows when data, sort, page, or pageSize change.
    if (
      changed.has("data") ||
      changed.has("pageSize") ||
      changed.has("#sort" as keyof this) ||
      changed.has("#page" as keyof this)
    ) {
      // Reset page when data changes.
      if (changed.has("data")) {
        this.#page = 1;
      }

      const sorted = sortData(this.data, this.#sort);

      if (this.pageSize > 0) {
        this.#displayRows = paginateData(sorted, this.#page, this.pageSize);
      } else {
        this.#displayRows = sorted;
      }
    }
  }

  // ── Computed ───────────────────────────────────────────────────────

  get #totalPages(): number {
    if (this.pageSize <= 0) return 1;
    return Math.max(1, Math.ceil(this.data.length / this.pageSize));
  }

  get #pageState(): PageState {
    return {
      page: this.#page,
      pageSize: this.pageSize,
      totalRows: this.data.length,
      totalPages: this.#totalPages,
    };
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
    this.#page = Math.max(1, Math.min(page, this.#totalPages));
    this.dispatchEvent(pageChangeEvent(this.#pageState));
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

  #renderHeader(): TemplateResult {
    return html`
      <thead>
        <tr>
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
    if (this.#displayRows.length === 0) {
      return html`
        <tbody>
          <tr class="EmptyRow">
            <td colspan=${this.columns.length}>${this.emptyText}</td>
          </tr>
        </tbody>
      `;
    }

    const keyFn = this.rowKey
      ? (row: T, index: number) => this.rowKey!(row)
      : (_row: T, index: number) => index;

    return html`
      <tbody>
        ${repeat(
          this.#displayRows,
          keyFn,
          (row) => html`
            <tr>
              ${this.columns.map((col) => {
                const value = row[col.key];
                const content = col.render
                  ? col.render(value, row)
                  : (value ?? "");
                return html`<td>${content}</td>`;
              })}
            </tr>
          `,
        )}
      </tbody>
    `;
  }

  #renderPagination(): TemplateResult | typeof nothing {
    if (this.pageSize <= 0 || this.data.length === 0) return nothing;

    const start = (this.#page - 1) * this.pageSize + 1;
    const end = Math.min(this.#page * this.pageSize, this.data.length);
    const isFirst = this.#page === 1;
    const isLast = this.#page === this.#totalPages;

    return html`
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
