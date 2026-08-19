/** Ported from original DUI: deep-future-app/app/client/components/dui/data-table */

import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap, type StyleInfo } from "lit/directives/style-map.js";
import { base } from "../core/base.ts";
import { isApplePlatform } from "../core/dom.ts";
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

/** Internal: the two modifier gestures over a body row. */
type ModifierGesture = "toggle" | "range";

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
 * Resolve the page to render from the controlled property and the internal
 * fallback, and say whether the controlled value needs a correction.
 *
 * `controlled` is `undefined` in uncontrolled mode, where the clamp is applied
 * silently to the internal page (as it always has been). When it is set, the
 * component still renders the clamped page — a consumer that forgets to reset
 * on a filter change must not strand its users on page 9 of a two-page result —
 * but it must not silently rewrite the consumer's value either. So the clamp
 * comes back as a `proposal`, for the caller to emit as a `page-change`.
 *
 * `proposal` is `undefined` whenever there is nothing to correct, which
 * includes every uncontrolled call. A consumer that honours the proposal comes
 * back with `controlled === page` and gets no further proposal: a fixed point.
 */
export function resolvePage(
  { controlled, internal, totalPages }: {
    controlled: number | undefined;
    internal: number;
    totalPages: number;
  },
): { page: number; proposal: number | undefined } {
  const page = clampPage(controlled ?? internal, totalPages);
  return {
    page,
    proposal: controlled !== undefined && page !== controlled ? page : undefined,
  };
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

/**
 * Keys between `anchorKey` and `targetKey` inclusive, in display order.
 * Order-agnostic: the target may sit above or below the anchor. Returns `[]`
 * if either key is absent from `orderedKeys`.
 */
export function resolveRange(
  orderedKeys: string[],
  anchorKey: string,
  targetKey: string,
): string[] {
  const anchorIndex = orderedKeys.indexOf(anchorKey);
  const targetIndex = orderedKeys.indexOf(targetKey);
  if (anchorIndex === -1 || targetIndex === -1) return [];

  const start = Math.min(anchorIndex, targetIndex);
  const end = Math.max(anchorIndex, targetIndex);
  return orderedKeys.slice(start, end + 1);
}

/** Set equality over key collections, order-insensitive. */
function sameKeys(a: Iterable<string>, b: Iterable<string>): boolean {
  const left = a instanceof Set ? a : new Set(a);
  const right = b instanceof Set ? b : new Set(b);
  if (left.size !== right.size) return false;
  for (const key of left) {
    if (!right.has(key)) return false;
  }
  return true;
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

    /* A tabindex="-1" scripting target: the user can never tab here, so its
       focus is never navigational and a ring communicates nothing. Without
       this it inherits the UA default, because the preventDefault() in
       #onGestureMouseDown stops the press from setting the document's input
       modality to pointer — so :focus-visible matches the focus() that ends
       the gesture. Consumers wanting a ring can add one via
       ::part(table-window). */
    outline: none;
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
    /* Sane structural default so the raw primitive isn't unbounded;
       override via ::part(sort-icon). */
    width: 1em;
    height: 1em;
  }

  /* Selection column: size to its checkbox, keep contents centered. */
  [part~="selection"] {
    width: 1%;
    white-space: nowrap;
    text-align: center;
  }

  /* The selection checkbox is an inline-level box; its baseline shifts
     between the unchecked and checked states, which would make selected rows
     render a pixel or two shorter. Center it so row height is independent of
     selection state. */
  [part~="selection"] dui-checkbox {
    vertical-align: middle;
  }

  /* While a selection modifier is down, a click on a row selects it instead of
     placing a text caret, so the I-beam would be advertising a gesture that is
     no longer available. Cells only: links keep their pointer cursor, because
     cmd-click still opens them. */
  .TableWindow[data-modifier] tbody td {
    cursor: default;
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
 * ### Pagination
 *
 * Uncontrolled by default: the component owns the page, the pager moves it, and
 * a `data` / filter change resets to page 1. Set `page` to take that state over
 * — the component then renders the page you give it and never mutates it,
 * `page-change` becomes a proposal, and the reset on a `data` change is yours
 * to make (or not, which is the point: replacing the array to edit one row
 * should not knock the user back to page 1). `default-page` seeds the
 * uncontrolled page and is ignored once `page` is set.
 *
 * ### Range selection (`selection-mode="multiple"`)
 *
 * A Finder-style desktop accelerator layered on top of the checkbox column.
 * An unmodified click never touches selection, so none of these collide with
 * selecting text, clicking a link, or a button in a cell:
 *
 * - **Cmd-click** (⌘ on Apple platforms, Ctrl elsewhere) anywhere on a row
 *   toggles it and moves the anchor. It yields to `a[href]` only — cmd-click a
 *   link and it opens in a new tab; cmd-click a button and the row is selected
 *   without the button firing.
 * - **Shift-click** selects `base ∪ range(anchor, target)`, where `base` is the
 *   selection as it stood when the anchor was set. Shift-clicking back inside
 *   the range contracts it. With no anchor it behaves as a cmd-click.
 * - **Escape** clears the selection.
 *
 * While either modifier is held, body cells drop the text I-beam for the
 * default cursor, since a click there now selects rather than placing a caret.
 * Links keep their pointer cursor — cmd-click still opens them.
 *
 * The anchor is dropped whenever the rows on screen change — sort, filter,
 * data, page, page size — and on header select-all, so ranges never span
 * pages. It is also dropped when an incoming `selectedKeys` differs from the
 * set this component last proposed: a consumer that rewrites the proposal
 * (say, clamping it to ten rows) resets the anchor on every gesture, which
 * effectively disables range selection.
 *
 * Modifiers are ignored in `<thead>` and in the other selection modes, and
 * touch has no modifiers, so the checkbox column remains the universal path.
 *
 * @csspart root - The outer container.
 * @csspart table-window - The scroll container around the table.
 * @csspart table - The `<table>` element.
 * @csspart header-row - The header `<tr>`.
 * @csspart header-cell - Each header `<th>`.
 * @csspart sort-icon - The sort indicator inside a sortable header.
 * @csspart row - Each body `<tr>`. Selected rows also carry the `selected` part.
 * @csspart cell - Each body `<td>`. Selection cells also carry the `selection` part.
 * @csspart checkbox - The selection checkbox box (forwarded from `dui-checkbox`).
 * @csspart checkbox-indicator - The selection checkbox check/dash indicator.
 * @csspart pagination - The pagination footer.
 *
 * @cssprop --data-table-selected-background - Background for selected rows
 *   (default `transparent`; set by the styled layer).
 *
 * @fires sort-change - Fired when a sortable column header is clicked. Detail: SortState
 * @fires page-change - Fired when the page changes. With `page` set the detail
 *   is a *proposal*: the component has not moved, and won't until `page` does.
 *   Detail: PageState
 * @fires selection-change - Fired with the proposed next selection. Detail: { selectedKeys, selectedRows }
 * @fires row-click - Fired when a body row is clicked (not on interactive cell
 *   content). Suppressed when a modifier gesture claims the click, i.e. a
 *   cmd/shift-click in `selection-mode="multiple"`. Detail: { row, key }
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

  /**
   * Current page, 1-based (controlled). When set, the component renders this
   * page and never mutates it — the pager, sorting and an out-of-range clamp
   * all propose changes through `page-change` instead.
   *
   * Not reflected: writing the component's own state back onto the attribute
   * would blur the line between the two modes.
   */
  @property({ type: Number })
  accessor page: number | undefined = undefined;

  /** Initial page for uncontrolled mode. Ignored when `page` is set. */
  @property({ type: Number, attribute: "default-page" })
  accessor defaultPage: number = 1;

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

  /**
   * The page actually on screen: `page` when controlled, `#page` when not,
   * clamped into range either way. Derived in `willUpdate` alongside
   * `#filtered`, so the two are always read from the same update.
   */
  #currentPage = 1;

  /**
   * The `(controlled, clamped)` pair we last proposed, so an out-of-range
   * `page` the consumer declines to fix is not re-proposed on every unrelated
   * re-render — a search box would otherwise emit one `page-change` per
   * keystroke. Cleared once the page is back in range, so a later drift is
   * proposed afresh. Rewriting `page` to a different out-of-range value is a
   * new pair and does get its own proposal.
   */
  #lastPageProposal: { controlled: number; clamped: number } | null = null;

  /**
   * A clamp proposal queued by `willUpdate` for `updated` to dispatch. Emitting
   * mid-update would hand the consumer a component whose render hasn't happened
   * yet, and a `page` they set from the handler wouldn't reach this cycle.
   */
  #pendingPageProposal: number | null = null;

  /**
   * The row a shift-click range extends from.
   *
   * Invariant: the anchor is a key present in `#displayRows`, or it is `null`.
   * That is what lets a range be computed over the current page alone.
   */
  #anchorKey: string | null = null;

  /**
   * Snapshot of the selection taken when the anchor was set. Ranges are
   * `base ∪ range(anchor, target)`, so repeated shift-clicks recompute the
   * range (and can shrink it) instead of accumulating, while selections made
   * before the anchor survive.
   */
  #baseKeys: ReadonlySet<string> | null = null;

  /**
   * The last selection we proposed. Selection is controlled, so an incoming
   * `selectedKeys` that differs from this means the consumer rewrote our
   * proposal and `#baseKeys` no longer describes anything real.
   */
  #lastProposal: ReadonlySet<string> | null = null;

  /** The scroll container; owns the modifier gestures and the Escape key. */
  #tableWindow: HTMLElement | null = null;

  /** Whether a selection modifier is currently down. Drives the cursor only. */
  #modifierHeld = false;

  // ── Lifecycle ──────────────────────────────────────────────────────

  override connectedCallback(): void {
    super.connectedCallback();

    // Uncontrolled seed, applied once — before the first render only, so
    // moving the element in the DOM doesn't send it back to the default page.
    // Later changes to `default-page` are ignored; internal navigation takes
    // over from here.
    if (!this.hasUpdated && this.page === undefined && this.defaultPage !== 1) {
      this.#page = this.defaultPage;
    }

    // Document-level, because the modifier can go down while the pointer is
    // over the table but focus is somewhere else entirely. Capture phase so a
    // wrapper that swallows key events can't leave the cursor stale.
    const doc = this.ownerDocument;
    doc.addEventListener("keydown", this.#onModifierKey, true);
    doc.addEventListener("keyup", this.#onModifierKey, true);
    // Cmd-tabbing away never delivers the keyup.
    doc.defaultView?.addEventListener("blur", this.#onWindowBlur);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    const doc = this.ownerDocument;
    doc.removeEventListener("keydown", this.#onModifierKey, true);
    doc.removeEventListener("keyup", this.#onModifierKey, true);
    doc.defaultView?.removeEventListener("blur", this.#onWindowBlur);
  }

  override willUpdate(changed: PropertyValues): void {
    const dataOrFilterChanged =
      changed.has("data") ||
      changed.has("filterValue") ||
      changed.has("globalFilterFn");

    // Recompute display rows when data, filter, sort, page, or pageSize change.
    if (
      dataOrFilterChanged ||
      changed.has("pageSize") ||
      changed.has("page") ||
      changed.has("#sort" as keyof this) ||
      changed.has("#page" as keyof this)
    ) {
      // Reset page when the underlying (filtered) set changes — but only in
      // uncontrolled mode. This is the crux of the controlled property: the
      // component can't tell "new filter, go to page 1" from "same list, one
      // row edited, stay put", and only the consumer can.
      //
      // Skipped on the first update too, where every property counts as
      // changed and there is no previous set to have changed from. Without
      // that, the initial `.data` assignment would wipe `default-page`. It
      // costs existing consumers nothing: `#page` is already 1 there.
      if (dataOrFilterChanged && this.hasUpdated && this.page === undefined) {
        this.#page = 1;
      }

      this.#filtered = filterData(
        this.data,
        this.filterValue,
        this.globalFilterFn,
      );

      // Clamp: a shrinking set can't strand the view on an empty page. Silent
      // when uncontrolled; a proposal when the page belongs to the consumer.
      const { page, proposal } = resolvePage({
        controlled: this.page,
        internal: this.#page,
        totalPages: this.#totalPages,
      });
      if (this.page === undefined) this.#page = page;
      this.#currentPage = page;
      this.#queuePageProposal(proposal);

      const sorted = sortData(this.#filtered, this.#sort, this.columns);

      if (this.pageSize > 0) {
        this.#displayRows = paginateData(
          sorted,
          this.#currentPage,
          this.pageSize,
        );
      } else {
        this.#displayRows = sorted;
      }

      // Anything that reshuffles which rows are on screen can silently carry
      // the anchor out of `#displayRows`, breaking the invariant above.
      this.#dropAnchor();
    }

    // Controlled divergence: a `selectedKeys` that isn't the set we last
    // proposed means our base snapshot describes a selection that never
    // happened, and ranges built on it would be fiction.
    if (
      changed.has("selectedKeys") &&
      (this.#lastProposal === null ||
        !sameKeys(this.#lastProposal, this.selectedKeys))
    ) {
      this.#dropAnchor();
    }
  }

  override firstUpdated(): void {
    this.#tableWindow = this.renderRoot.querySelector<HTMLElement>(
      ".TableWindow",
    );

    // Capture phase, deliberately: a `<dui-button>` or `<dui-checkbox>` in a
    // row handles its own click at the target, so a bubble-phase listener here
    // would run too late to take the gesture away from it.
    this.#tableWindow?.addEventListener(
      "mousedown",
      this.#onGestureMouseDown,
      true,
    );
    this.#tableWindow?.addEventListener("click", this.#onGestureClick, true);

    // The modifier may already be down when the table first renders.
    this.#tableWindow?.toggleAttribute("data-modifier", this.#modifierHeld);
  }

  override updated(): void {
    const proposal = this.#pendingPageProposal;
    if (proposal === null) return;
    this.#pendingPageProposal = null;

    // `#pageState.page` is the clamped page, which is the proposal itself.
    this.dispatchEvent(pageChangeEvent(this.#pageState));
  }

  // ── Computed ───────────────────────────────────────────────────────

  get #totalPages(): number {
    return totalPages(this.#filtered.length, this.pageSize);
  }

  get #pageState(): PageState {
    return {
      page: this.#currentPage,
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

    if (this.page === undefined) this.#page = 1;
    this.dispatchEvent(sortChangeEvent(this.#sort));

    // Sorting moves the page. In controlled mode it can't move it itself, so
    // it proposes — otherwise sorting leaves the consumer on page 3 of a
    // freshly re-sorted list with nothing to tell it. Uncontrolled stays
    // silent, as it always has: emitting there too is the more correct
    // behaviour, but it would be a new event for every existing consumer.
    // The asymmetry is accepted, not endorsed, and expires at the next major.
    if (this.page !== undefined && this.page !== 1) {
      this.dispatchEvent(pageChangeEvent({ ...this.#pageState, page: 1 }));
    }
  }

  // ── Pagination handling ───────────────────────────────────────────

  #goToPage(page: number): void {
    const next = clampPage(page, this.#totalPages);
    // Controlled: the pager proposes, the consumer moves us.
    if (this.page === undefined) this.#page = next;
    this.dispatchEvent(pageChangeEvent({ ...this.#pageState, page: next }));
  }

  /**
   * Record a clamp proposal for `updated` to emit, unless it repeats the last
   * one we sent. `undefined` means the page is in range and clears the memo.
   */
  #queuePageProposal(proposal: number | undefined): void {
    if (proposal === undefined) {
      this.#lastPageProposal = null;
      return;
    }

    const controlled = this.page as number;
    if (
      this.#lastPageProposal?.controlled === controlled &&
      this.#lastPageProposal.clamped === proposal
    ) {
      return;
    }

    this.#lastPageProposal = { controlled, clamped: proposal };
    this.#pendingPageProposal = proposal;
  }

  // ── Selection handling ────────────────────────────────────────────

  /** Set the anchor and re-snapshot the base selection it ranges from. */
  #setAnchor(key: string, selection: Iterable<string>): void {
    this.#anchorKey = key;
    this.#baseKeys = new Set(selection);
  }

  #dropAnchor(): void {
    this.#anchorKey = null;
    this.#baseKeys = null;
  }

  #emitSelection(nextKeys: string[]): void {
    const next = new Set(nextKeys);

    // Emission hygiene: a proposal identical to the current selection is
    // noise. Still recorded, so an unchanged set echoed back by the consumer
    // doesn't read as divergence.
    this.#lastProposal = next;
    if (sameKeys(next, this.selectedKeys)) return;

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

    // A checkbox click is an anchor-setting gesture, so shift-clicking a second
    // checkbox extends from here.
    this.#setAnchor(key, current);
    this.#emitSelection([...current]);
  }

  /** Cmd-click: toggle one row, then re-anchor on it with a fresh base. */
  #toggleRow(key: string): void {
    const next = new Set(this.selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);

    this.#setAnchor(key, next);
    this.#emitSelection([...next]);
  }

  /** Shift-click: `base ∪ range(anchor, target)`. Anchor and base are kept. */
  #extendRange(targetKey: string): void {
    const rowKey = this.rowKey;
    if (!rowKey) return;

    const range = this.#anchorKey === null
      ? []
      : resolveRange(this.#displayRows.map(rowKey), this.#anchorKey, targetKey);

    // No anchor is a common state, not an edge case — every page change
    // produces one — so degrade to a cmd-click rather than a dead gesture.
    if (range.length === 0) {
      this.#toggleRow(targetKey);
      return;
    }

    this.#emitSelection([...new Set([...(this.#baseKeys ?? []), ...range])]);
  }

  /** Select-all / clear-all over the current filtered set (multiple only). */
  #toggleAll(checked: boolean): void {
    const rowKey = this.rowKey;
    if (!rowKey) return;

    const filteredKeys = this.#filtered.map(rowKey);

    // Select-all is a bulk verb with no row behind it: it drops the anchor
    // rather than setting one.
    this.#dropAnchor();

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

  // ── Modifier gestures ─────────────────────────────────────────────

  /** Modifier gestures are a desktop accelerator, and `multiple` only. */
  get #gesturesEnabled(): boolean {
    return this.selectionMode === "multiple" && this.rowKey != null;
  }

  /**
   * Track the selection modifiers so the rows can drop the I-beam while one is
   * down: with a modifier held a click selects rather than placing a text
   * caret, so a text cursor would be advertising the wrong gesture.
   */
  #onModifierKey = (e: Event): void => {
    this.#setModifierHeld(this.#gestureForModifiers(e as KeyboardEvent) != null);
  };

  #onWindowBlur = (): void => this.#setModifierHeld(false);

  #setModifierHeld(held: boolean): void {
    const next = held && this.#gesturesEnabled;
    if (next === this.#modifierHeld) return;

    this.#modifierHeld = next;
    // Set imperatively rather than through `render()`: this fires on every
    // press of a common modifier, and it must not re-render every row to do it.
    this.#tableWindow?.toggleAttribute("data-modifier", next);
  }

  /**
   * Which gesture a modifier combination names, if any. Shared by the pointer
   * handlers and the cursor, so the cursor changes exactly when a gesture is
   * live.
   *
   * The toggle modifier is `metaKey` on Apple platforms and `ctrlKey`
   * elsewhere — never both, or a macOS ctrl-click would open the context menu
   * *and* toggle the row.
   */
  #gestureForModifiers(
    m: { metaKey: boolean; ctrlKey: boolean; shiftKey: boolean },
  ): ModifierGesture | null {
    const apple = isApplePlatform();
    if (apple && m.ctrlKey) return null; // context-menu gesture on macOS

    if (m.shiftKey) return "range";
    return (apple ? m.metaKey : m.ctrlKey) ? "toggle" : null;
  }

  /** Which modifier gesture a pointer event carries, if any. */
  #gestureFor(e: MouseEvent): ModifierGesture | null {
    if (!this.#gesturesEnabled) return null;
    if (e.button !== 0) return null;
    return this.#gestureForModifiers(e);
  }

  /**
   * Resolve a pointer event to the body row it landed on. Returns `null` for
   * header clicks, the empty-state row, and anything outside a row — the
   * header keeps its existing sort / select-all behaviour under modifiers.
   */
  #resolveGestureTarget(e: Event): { key: string; overLink: boolean } | null {
    const rowKey = this.rowKey;
    if (!rowKey) return null;

    let overLink = false;
    let row: Element | null = null;

    for (const node of e.composedPath()) {
      if (node === e.currentTarget) break;
      if (!(node instanceof Element)) continue;
      if (node.localName === "thead") return null;
      if (node.localName === "a" && node.hasAttribute("href")) overLink = true;
      if (node.localName === "tr") row = node;
    }

    const body = row?.parentElement;
    if (!row || body?.localName !== "tbody") return null;

    // Row order in the DOM is `#displayRows` order.
    const index = Array.prototype.indexOf.call(body.children, row);
    const rowData = this.#displayRows[index];
    if (rowData === undefined) return null; // the empty-state row

    return { key: rowKey(rowData), overLink };
  }

  /**
   * A gesture the row owns, i.e. one we intercept. Cmd-click is the single
   * carve-out: it yields to `a[href]` so "open in new tab" keeps working.
   * Shift-click does not yield — native shift-click opens a new window, which
   * nobody invokes deliberately, and the name column is a link in most tables.
   */
  #claimGesture(
    e: MouseEvent,
  ): { gesture: ModifierGesture; key: string } | null {
    const gesture = this.#gestureFor(e);
    if (!gesture) return null;

    const target = this.#resolveGestureTarget(e);
    if (!target) return null;
    if (gesture === "toggle" && target.overLink) return null;

    return { gesture, key: target.key };
  }

  /**
   * `preventDefault()` here is what suppresses the browser's native
   * shift-extends-text-selection: without it, clicking one row's text and
   * shift-clicking another's selects everything between.
   */
  #onGestureMouseDown = (e: Event): void => {
    if (!this.#claimGesture(e as MouseEvent)) return;
    e.preventDefault();
  };

  #onGestureClick = (e: Event): void => {
    const claimed = this.#claimGesture(e as MouseEvent);
    if (!claimed) return;

    // Starve everything inside the row: the checkbox's own click listener, a
    // button in a cell, a link on shift-click, and our own `row-click`. The
    // modifier means "select", so it means that everywhere on the row.
    e.preventDefault();
    e.stopPropagation();

    if (claimed.gesture === "toggle") this.#toggleRow(claimed.key);
    else this.#extendRange(claimed.key);

    // The `preventDefault()` above also suppressed the focus move, which would
    // otherwise leave Escape dead right after the gesture that most calls for
    // it. `preventScroll` because `.TableWindow` is a scroll container: the
    // default would scroll it into view in every scroll ancestor, so a
    // cmd-click on a partly-offscreen table would yank the page to it.
    this.#tableWindow?.focus({ preventScroll: true });
  };

  #onKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== "Escape") return;
    if (!this.#selectionEnabled || this.selectedKeys.length === 0) return;

    // Only stop propagation when we actually handled it, so a table inside a
    // dialog clears the selection on the first Escape and closes on the second.
    e.stopPropagation();
    this.#dropAnchor();
    this.#emitSelection([]);
  };

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
      return html`<span class="SortIcon" part="sort-icon"
        >${this.#sort.direction === "asc" ? chevronUp : chevronDown}</span
      >`;
    }

    return html`<span class="SortIcon" part="sort-icon">${chevronUpDown}</span>`;
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
          exportparts="root:checkbox, indicator:checkbox-indicator"
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
                        exportparts="root:checkbox, indicator:checkbox-indicator"
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
    const current = this.#currentPage;
    const start = (current - 1) * this.pageSize + 1;
    const end = Math.min(current * this.pageSize, total);
    const isFirst = current === 1;
    const isLast = current === this.#totalPages;

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
            @click=${() => this.#goToPage(current - 1)}
            aria-label="Previous page"
          >
            <dui-icon style="--icon-size: var(--text-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></dui-icon>
          </button>
          <button
            class="PageButton"
            ?disabled=${isLast}
            @click=${() => this.#goToPage(current + 1)}
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
        <div
          class="TableWindow"
          part="table-window"
          tabindex="-1"
          @keydown=${this.#onKeyDown}
        >
          <table part="table">
            ${this.#renderHeader()} ${this.#renderBody()}
          </table>
        </div>
        ${this.#renderPagination()}
      </div>
    `;
  }
}
