import { assertEquals } from "jsr:@std/assert@^1";
import {
  clampPage,
  type ColumnDef,
  deriveSelectAllState,
  filterData,
  paginateData,
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
