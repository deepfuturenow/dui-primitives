import { assertEquals } from "jsr:@std/assert@^1";
import {
  clampPage,
  type ColumnDef,
  deriveSelectAllState,
  filterData,
  paginateData,
  resolvePage,
  resolveRange,
  resolveValue,
  sortData,
  totalPages,
} from "./data-table.ts";

type Row = { id: string; name: string; age: number };

const rows: Row[] = [
  { id: "a", name: "Charlie", age: 30 },
  { id: "b", name: "alice", age: 25 },
  { id: "c", name: "Bob", age: 40 },
];

// ── resolveValue ────────────────────────────────────────────────────────

Deno.test("resolveValue falls back to row[key] when no accessorFn", () => {
  const col: ColumnDef<Row> = { key: "name", header: "Name" };
  assertEquals(resolveValue(rows[0], col), "Charlie");
});

Deno.test("resolveValue uses accessorFn when present", () => {
  const col: ColumnDef<Row> = {
    key: "label",
    header: "Label",
    accessorFn: (r) => `${r.name} (${r.age})`,
  };
  assertEquals(resolveValue(rows[0], col), "Charlie (30)");
});

// ── sortData (accessor-aware) ───────────────────────────────────────────

Deno.test("sortData sorts ascending by a plain key", () => {
  const cols: ColumnDef<Row>[] = [{ key: "age", header: "Age" }];
  const sorted = sortData(rows, { column: "age", direction: "asc" }, cols);
  assertEquals(sorted.map((r) => r.age), [25, 30, 40]);
});

Deno.test("sortData sorts descending by a plain key", () => {
  const cols: ColumnDef<Row>[] = [{ key: "age", header: "Age" }];
  const sorted = sortData(rows, { column: "age", direction: "desc" }, cols);
  assertEquals(sorted.map((r) => r.age), [40, 30, 25]);
});

Deno.test("sortData resolves the sort column's accessorFn", () => {
  // Sort by name length via accessor, not the raw string.
  const cols: ColumnDef<Row>[] = [
    { key: "nameLen", header: "Len", accessorFn: (r) => r.name.length },
  ];
  const sorted = sortData(rows, { column: "nameLen", direction: "asc" }, cols);
  assertEquals(sorted.map((r) => r.name), ["Bob", "alice", "Charlie"]);
});

Deno.test("sortData returns a copy when sort is null", () => {
  const sorted = sortData(rows, null, []);
  assertEquals(sorted, rows);
  assertEquals(sorted === rows, false);
});

// ── filterData ──────────────────────────────────────────────────────────

Deno.test("filterData returns input unchanged when no predicate", () => {
  assertEquals(filterData(rows, "anything", undefined), rows);
});

Deno.test("filterData applies a global text predicate", () => {
  const fn = (row: Row, fv: unknown) =>
    row.name.toLowerCase().includes(String(fv).toLowerCase());
  // Only "Bob" (id c) contains a "b"; "Charlie"/"alice" do not.
  assertEquals(filterData(rows, "b", fn).map((r) => r.id), ["c"]);
});

Deno.test("filterData supports a faceted (object) filter value", () => {
  const fn = (row: Row, fv: unknown) => {
    const { minAge } = fv as { minAge: number };
    return row.age >= minAge;
  };
  assertEquals(filterData(rows, { minAge: 30 }, fn).map((r) => r.id), [
    "a",
    "c",
  ]);
});

// ── pagination math + filtered totals ───────────────────────────────────

Deno.test("totalPages computes from a row count", () => {
  assertEquals(totalPages(0, 10), 1);
  assertEquals(totalPages(10, 10), 1);
  assertEquals(totalPages(11, 10), 2);
  assertEquals(totalPages(25, 10), 3);
});

Deno.test("totalPages returns 1 when pagination is disabled", () => {
  assertEquals(totalPages(999, 0), 1);
});

Deno.test("filtered set drives pagination totals", () => {
  const fn = (row: Row, fv: unknown) => row.age >= (fv as number);
  const filtered = filterData(rows, 30, fn); // 2 rows
  assertEquals(totalPages(filtered.length, 1), 2);
  assertEquals(paginateData(filtered, 1, 1).map((r) => r.id), ["a"]);
  assertEquals(paginateData(filtered, 2, 1).map((r) => r.id), ["c"]);
});

// ── clampPage (page reset / defensive clamp) ────────────────────────────

Deno.test("clampPage clamps into [1, pages]", () => {
  assertEquals(clampPage(0, 3), 1);
  assertEquals(clampPage(5, 3), 3);
  assertEquals(clampPage(2, 3), 2);
});

Deno.test("clampPage rescues a stranded page after the set shrinks", () => {
  // Was on page 3 of 3; filter shrinks the set to a single page.
  const fn = (row: Row, _fv: unknown) => row.id === "a";
  const filtered = filterData(rows, null, fn); // 1 row
  const pages = totalPages(filtered.length, 1);
  assertEquals(clampPage(3, pages), 1);
});

// ── resolvePage ─────────────────────────────────────────────────────────

Deno.test("resolvePage: uncontrolled falls back to the internal page", () => {
  assertEquals(resolvePage({ controlled: undefined, internal: 2, totalPages: 3 }), {
    page: 2,
    proposal: undefined,
  });
});

Deno.test("resolvePage: uncontrolled clamps silently", () => {
  // The old defensive clamp: no proposal, because there is nobody to propose to.
  assertEquals(resolvePage({ controlled: undefined, internal: 9, totalPages: 2 }), {
    page: 2,
    proposal: undefined,
  });
});

Deno.test("resolvePage: an in-range controlled page wins over the internal one", () => {
  assertEquals(resolvePage({ controlled: 3, internal: 1, totalPages: 5 }), {
    page: 3,
    proposal: undefined,
  });
});

Deno.test("resolvePage: an out-of-range controlled page renders clamped and proposes", () => {
  assertEquals(resolvePage({ controlled: 9, internal: 1, totalPages: 2 }), {
    page: 2,
    proposal: 2,
  });
  assertEquals(resolvePage({ controlled: 0, internal: 1, totalPages: 2 }), {
    page: 1,
    proposal: 1,
  });
});

Deno.test("resolvePage: honouring a proposal is a fixed point", () => {
  const first = resolvePage({ controlled: 9, internal: 1, totalPages: 2 });
  const echo = resolvePage({
    controlled: first.proposal,
    internal: 1,
    totalPages: 2,
  });
  assertEquals(echo, { page: 2, proposal: undefined });
});

// ── deriveSelectAllState ────────────────────────────────────────────────

Deno.test("deriveSelectAllState: none selected", () => {
  assertEquals(deriveSelectAllState(["a", "b", "c"], new Set()), {
    checked: false,
    indeterminate: false,
  });
});

Deno.test("deriveSelectAllState: all selected", () => {
  assertEquals(
    deriveSelectAllState(["a", "b", "c"], new Set(["a", "b", "c"])),
    { checked: true, indeterminate: false },
  );
});

Deno.test("deriveSelectAllState: partial → indeterminate", () => {
  assertEquals(deriveSelectAllState(["a", "b", "c"], new Set(["a"])), {
    checked: false,
    indeterminate: true,
  });
});

Deno.test("deriveSelectAllState: empty filtered set is neither", () => {
  assertEquals(deriveSelectAllState([], new Set(["a"])), {
    checked: false,
    indeterminate: false,
  });
});

Deno.test("deriveSelectAllState considers only the filtered keys", () => {
  // A selection outside the filtered set doesn't make the header checked.
  assertEquals(deriveSelectAllState(["a"], new Set(["a", "z"])), {
    checked: true,
    indeterminate: false,
  });
});

// ── resolveRange ────────────────────────────────────────────────────────

const ORDER = ["a", "b", "c", "d", "e", "f"];

Deno.test("resolveRange returns the keys between anchor and target", () => {
  assertEquals(resolveRange(ORDER, "b", "e"), ["b", "c", "d", "e"]);
});

Deno.test("resolveRange is order-agnostic: target above the anchor", () => {
  assertEquals(resolveRange(ORDER, "e", "b"), ["b", "c", "d", "e"]);
});

Deno.test("resolveRange of a key with itself is that single key", () => {
  assertEquals(resolveRange(ORDER, "c", "c"), ["c"]);
});

Deno.test("resolveRange returns [] when either key is absent", () => {
  assertEquals(resolveRange(ORDER, "z", "c"), []);
  assertEquals(resolveRange(ORDER, "c", "z"), []);
  assertEquals(resolveRange([], "a", "b"), []);
});

// ── Gesture algebra ─────────────────────────────────────────────────────
// A model of the component's `#toggleRow` / `#extendRange` over the pure
// helper, so the traces in the spec are executable without a DOM. Keep this in
// step with those two methods; the DOM plumbing around them (capture-phase
// handling, the link carve-out, anchor lifetime) is not covered here.

class GestureModel {
  #ordered: string[];
  #selected = new Set<string>();
  #anchor: string | null = null;
  #base: ReadonlySet<string> | null = null;

  constructor(ordered: string[]) {
    this.#ordered = ordered;
  }

  /** Cmd-click, and the checkbox click, which share anchor-setting semantics. */
  cmdClick(key: string): this {
    const next = new Set(this.#selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);

    this.#selected = next;
    this.#anchor = key;
    this.#base = new Set(next);
    return this;
  }

  shiftClick(key: string): this {
    const range = this.#anchor === null
      ? []
      : resolveRange(this.#ordered, this.#anchor, key);

    if (range.length === 0) return this.cmdClick(key);

    this.#selected = new Set([...(this.#base ?? []), ...range]);
    return this;
  }

  /** Every anchor-invalidating event: sort, filter, page change, select-all. */
  dropAnchor(): this {
    this.#anchor = null;
    this.#base = null;
    return this;
  }

  /** Selected keys in display order. */
  keys(): string[] {
    return this.#ordered.filter((k) => this.#selected.has(k));
  }
}

const rowKeys = (...ns: number[]) => ns.map((n) => `r${n}`);
const ROWS = Array.from({ length: 30 }, (_, i) => `r${i + 1}`);
const model = () => new GestureModel(ROWS);

Deno.test("shift-click extends from the anchor", () => {
  const sel = model().cmdClick("r3").shiftClick("r9");
  assertEquals(sel.keys(), rowKeys(3, 4, 5, 6, 7, 8, 9));
});

Deno.test("a second shift-click recomputes rather than accumulates", () => {
  // {3} → shift 9 → shift 12 → shift 5 contracts back to {3,4,5}.
  const sel = model().cmdClick("r3").shiftClick("r9").shiftClick("r12");
  assertEquals(sel.keys(), rowKeys(3, 4, 5, 6, 7, 8, 9, 10, 11, 12));

  sel.shiftClick("r5");
  assertEquals(sel.keys(), rowKeys(3, 4, 5));
});

Deno.test("cmd-click re-snapshots the base, so prior selections survive", () => {
  const sel = model()
    .cmdClick("r3").shiftClick("r5") // {3,4,5}
    .cmdClick("r20") // anchor moves, base becomes {3,4,5,20}
    .shiftClick("r25");

  assertEquals(sel.keys(), rowKeys(3, 4, 5, 20, 21, 22, 23, 24, 25));
});

Deno.test("shift-click with no anchor behaves as a cmd-click", () => {
  // The state after any page/sort/filter change.
  const sel = model().cmdClick("r3").shiftClick("r9").dropAnchor();
  sel.shiftClick("r20");
  assertEquals(sel.keys(), rowKeys(3, 4, 5, 6, 7, 8, 9, 20));

  // …and the next shift-click extends from the anchor it just set.
  sel.shiftClick("r22");
  assertEquals(sel.keys(), rowKeys(3, 4, 5, 6, 7, 8, 9, 20, 21, 22));
});

Deno.test("cmd-click toggles a selected row back off", () => {
  const sel = model().cmdClick("r3").shiftClick("r5").cmdClick("r4");
  assertEquals(sel.keys(), rowKeys(3, 5));
});

// ── Pager algebra ───────────────────────────────────────────────────────
// A model of the component's page lifecycle — `willUpdate`'s reset + clamp,
// `#goToPage`, `#handleSort`, `updated`'s proposal — over `resolvePage`, so the
// controlled/uncontrolled split is executable without an element. Keep it in
// step with those; the wiring itself (which `changed.has(...)` keys enter the
// recompute) is not covered here and is verified by review. See #5.

type PagerOptions = {
  /** Rows in the filtered set. */
  rows: number;
  pageSize?: number;
  /** The controlled `page` property; omit for uncontrolled. */
  page?: number;
  defaultPage?: number;
};

class PagerModel {
  rows: number;
  pageSize: number;
  page: number | undefined;
  /** Every `page-change` detail page, in emission order. */
  events: number[] = [];

  #internal = 1; // `#page`
  #rendered = 1; // `#currentPage`
  #hasUpdated = false;
  #lastProposal: { controlled: number; clamped: number } | null = null;

  constructor(o: PagerOptions) {
    this.rows = o.rows;
    this.pageSize = o.pageSize ?? 10;
    this.page = o.page;

    // connectedCallback: the uncontrolled seed, applied once.
    const defaultPage = o.defaultPage ?? 1;
    if (this.page === undefined && defaultPage !== 1) this.#internal = defaultPage;

    this.#update({ dataOrFilterChanged: true }); // first update
  }

  get totalPages(): number {
    return totalPages(this.rows, this.pageSize);
  }

  /** The page on screen. */
  get rendered(): number {
    return this.#rendered;
  }

  /** The internal fallback, which controlled mode must never touch. */
  get internal(): number {
    return this.#internal;
  }

  // ── Update cycle ──

  #update({ dataOrFilterChanged = false } = {}): void {
    if (dataOrFilterChanged && this.#hasUpdated && this.page === undefined) {
      this.#internal = 1;
    }

    const { page, proposal } = resolvePage({
      controlled: this.page,
      internal: this.#internal,
      totalPages: this.totalPages,
    });
    if (this.page === undefined) this.#internal = page;
    this.#rendered = page;

    if (proposal === undefined) {
      this.#lastProposal = null;
    } else {
      const repeat = this.#lastProposal?.controlled === this.page &&
        this.#lastProposal?.clamped === proposal;
      if (!repeat) {
        this.#lastProposal = {
          controlled: this.page as number,
          clamped: proposal,
        };
        this.events.push(proposal); // dispatched from `updated`
      }
    }

    this.#hasUpdated = true;
  }

  // ── Consumer-driven ──

  /** The consumer writes `page` (from a URL, or honouring a proposal). */
  setPage(page: number): this {
    this.page = page;
    this.#update();
    return this;
  }

  /** A new `data` identity or filter value: same row count unless given one. */
  replaceData(rows: number = this.rows): this {
    this.rows = rows;
    this.#update({ dataOrFilterChanged: true });
    return this;
  }

  setPageSize(pageSize: number): this {
    this.pageSize = pageSize;
    this.#update();
    return this;
  }

  /** An update with nothing page-related in it (a re-render, a new column set). */
  touch(): this {
    this.#update();
    return this;
  }

  // ── User-driven ──

  /** A pager button: `#goToPage`. */
  clickPage(page: number): this {
    const next = clampPage(page, this.totalPages);
    if (this.page === undefined) {
      this.#internal = next;
      this.events.push(next);
      this.#update();
    } else {
      // Controlled: nothing mutates, so no update cycle runs either.
      this.events.push(next);
    }
    return this;
  }

  /** A sortable header click, as far as the page is concerned. */
  sort(): this {
    if (this.page === undefined) this.#internal = 1;
    else if (this.page !== 1) this.events.push(1);
    this.#update();
    return this;
  }

  /** The rows on screen, as ids `1..rows`. */
  slice(): number[] {
    const all = Array.from({ length: this.rows }, (_, i) => i + 1);
    return this.pageSize > 0
      ? paginateData(all, this.#rendered, this.pageSize)
      : all;
  }
}

// ── Uncontrolled: unchanged behaviour ──

Deno.test("uncontrolled: the pager moves the page", () => {
  const pager = new PagerModel({ rows: 25, pageSize: 10 });
  assertEquals(pager.rendered, 1);

  pager.clickPage(3);
  assertEquals(pager.rendered, 3);
  assertEquals(pager.slice(), [21, 22, 23, 24, 25]);
  assertEquals(pager.events, [3]);
});

Deno.test("uncontrolled: a data replacement still resets to page 1", () => {
  // The behaviour every existing consumer has today, filter change included.
  const pager = new PagerModel({ rows: 25, pageSize: 10 }).clickPage(3);
  pager.replaceData();
  assertEquals(pager.rendered, 1);
});

Deno.test("uncontrolled: a shrinking set clamps silently", () => {
  const pager = new PagerModel({ rows: 25, pageSize: 10 }).clickPage(3);
  pager.setPageSize(25); // one page now
  assertEquals(pager.rendered, 1);
  assertEquals(pager.events, [3]); // no proposal: nobody to propose to
});

Deno.test("uncontrolled: sorting resets to page 1 without an event", () => {
  const pager = new PagerModel({ rows: 25, pageSize: 10 }).clickPage(3);
  pager.sort();
  assertEquals(pager.rendered, 1);
  assertEquals(pager.events, [3]);
});

// ── Controlled ──

Deno.test("controlled: the passed page is the rendered page", () => {
  const pager = new PagerModel({ rows: 25, pageSize: 10, page: 3 });
  assertEquals(pager.rendered, 3);
  assertEquals(pager.slice(), [21, 22, 23, 24, 25]);
  assertEquals(pager.events, []);
});

Deno.test("controlled: a data replacement does not reset the page", () => {
  // The motivating case: editing one row rebuilds the array, and the user
  // stays where they were.
  const pager = new PagerModel({ rows: 25, pageSize: 10, page: 3 });
  pager.replaceData();
  assertEquals(pager.rendered, 3);
  assertEquals(pager.events, []);
});

Deno.test("controlled: a pager click proposes without moving the table", () => {
  const pager = new PagerModel({ rows: 25, pageSize: 10, page: 1 });
  pager.clickPage(2);

  assertEquals(pager.events, [2]);
  assertEquals(pager.rendered, 1); // still page 1 until the consumer says so
  assertEquals(pager.internal, 1); // and the internal page never moved

  pager.setPage(2);
  assertEquals(pager.rendered, 2);
});

Deno.test("controlled: sorting proposes page 1", () => {
  const pager = new PagerModel({ rows: 25, pageSize: 10, page: 3 });
  pager.sort();
  assertEquals(pager.events, [1]);
  assertEquals(pager.rendered, 3); // the consumer still owns the move
});

Deno.test("controlled: sorting on page 1 proposes nothing", () => {
  const pager = new PagerModel({ rows: 25, pageSize: 10, page: 1 });
  pager.sort();
  assertEquals(pager.events, []);
});

// ── Controlled clamp ──

Deno.test("controlled: an out-of-range page renders clamped and proposes once", () => {
  // ?page=9 in the URL, two pages of results.
  const pager = new PagerModel({ rows: 15, pageSize: 10, page: 9 });
  assertEquals(pager.rendered, 2);
  assertEquals(pager.events, [2]);

  // The echo: the consumer honours the proposal, and it settles.
  pager.setPage(2);
  assertEquals(pager.rendered, 2);
  assertEquals(pager.events, [2]);
});

Deno.test("controlled: an ignored clamp proposal is not repeated", () => {
  // The search-box case: a keystroke per update, the page still out of range.
  const pager = new PagerModel({ rows: 15, pageSize: 10, page: 9 });
  assertEquals(pager.events, [2]);

  pager.touch().touch().replaceData(15);
  assertEquals(pager.events, [2]);
});

Deno.test("controlled: a clamp against a different page count proposes again", () => {
  const pager = new PagerModel({ rows: 15, pageSize: 10, page: 9 }); // → 2
  pager.replaceData(5); // one page now → 1
  assertEquals(pager.rendered, 1);
  assertEquals(pager.events, [2, 1]);
});

Deno.test("controlled: rewriting to another out-of-range page proposes again", () => {
  // Two different bad URLs deserve two answers, even at the same page count.
  const pager = new PagerModel({ rows: 15, pageSize: 10, page: 9 });
  pager.setPage(7);
  assertEquals(pager.events, [2, 2]);
});

Deno.test("controlled: a page back in range re-arms the clamp", () => {
  const pager = new PagerModel({ rows: 15, pageSize: 10, page: 9 }); // → 2
  pager.setPage(1); // in range, memo cleared
  pager.setPage(9); // out of range again
  assertEquals(pager.events, [2, 2]);
});

// ── default-page ──

Deno.test("default-page seeds the uncontrolled page", () => {
  const pager = new PagerModel({ rows: 25, pageSize: 10, defaultPage: 3 });
  assertEquals(pager.rendered, 3);
  assertEquals(pager.slice(), [21, 22, 23, 24, 25]);
});

Deno.test("default-page yields to internal navigation, and to the reset", () => {
  const pager = new PagerModel({ rows: 25, pageSize: 10, defaultPage: 3 });
  pager.clickPage(2);
  assertEquals(pager.rendered, 2);

  pager.replaceData();
  assertEquals(pager.rendered, 1); // back to 1, not to 3
});

Deno.test("default-page is ignored when page is set", () => {
  const pager = new PagerModel({
    rows: 25,
    pageSize: 10,
    page: 2,
    defaultPage: 3,
  });
  assertEquals(pager.rendered, 2);
});

Deno.test("default-page out of range clamps silently", () => {
  const pager = new PagerModel({ rows: 15, pageSize: 10, defaultPage: 9 });
  assertEquals(pager.rendered, 2);
  assertEquals(pager.events, []);
});
