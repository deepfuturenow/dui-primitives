import { assertEquals } from "jsr:@std/assert@^1";
import {
  clampPage,
  type ColumnDef,
  deriveSelectAllState,
  filterData,
  paginateData,
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
