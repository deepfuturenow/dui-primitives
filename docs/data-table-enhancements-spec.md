# Spec: `<dui-data-table>` — filtering, derived-value accessors & row selection

**Status:** Proposed
**Target:** `@dui/primitives` (published `@deepfuture/dui-primitives`) — minor, additive, backward-compatible bump from 1.8.4
**Source of truth:** `packages/primitives/src/data-table/data-table.ts` (`.js`/`.d.ts` are build artifacts — regenerate via `deno task build`)
**Public exports:** `packages/primitives/src/data-table/index.ts`

## Goal

Extend the self-contained data-table primitive with three capabilities identified in the
[gap analysis](./data-table-gap-analysis.md) — derived-value accessors, filtering, and row
selection — plus low-cost styling/interaction hooks (row & cell `part`s, `row-click`). Every
addition is inert when its new prop is unset, so markup and behavior are **identical to today** for
existing consumers.

The component's internal pipeline evolves from `data → sort → paginate` to
**`data → filter → sort → paginate`**, with all values resolved through a shared accessor.

## Guiding constraints (repo idioms)

- **The primitive stays "structure and behavior only."** `@deepfuture/dui-primitives` ships
  unstyled components; all theme tokens (`--surface-1`, `--border`, …) live in the downstream styled
  `dui` layer (`dui/packages/components/src/data-table/data-table.ts`). The current primitive's CSS
  is purely structural (`display`, `overflow`, `cursor`) and this spec keeps it that way. See
  [§3 selected-row styling](#selected-row-styling) for how this changes the original proposal.
- **Events** use the `customEvent<Detail>(type, { bubbles: true, composed: true })` factory from
  `core/event.ts`, matching `sortChangeEvent` / `pageChangeEvent`.
- **Cross-primitive composition is established** — pagination already renders `<dui-icon>`; selection
  will render `<dui-checkbox>` and listen for its `checked-change` event.
- **Pure logic is module-scoped and testable** — `sortData` / `paginateData` are already free
  functions; new logic follows suit so it can be unit-tested without a DOM. The build already
  excludes `*.test.ts` (`scripts/build.ts` tsconfig `exclude`), so co-located tests won't publish.

---

## 1. Derived-value accessor (foundational — implement first)

Add to `ColumnDef<T>`:

```ts
/** Derives the value used for sorting, filter matching, and default cell content.
 *  Falls back to `row[key]` when absent. */
accessorFn?: (row: T) => unknown;
```

**Implementation (suggested):** introduce one shared resolver and route *every* value read through
it so the three consumers can never drift:

```ts
function resolveValue<T>(row: T, col: ColumnDef<T>): unknown {
  return col.accessorFn ? col.accessorFn(row) : (row as Record<string, unknown>)[col.key];
}
```

- `sortData` takes `columns` (or the resolved sort column) so it compares `resolveValue(row, col)`
  rather than `row[column]`.
- The body cell uses `resolveValue(row, col)` for default content, and passes that same resolved
  value as the first arg to `col.render(value, row)`. (Backward compatible: with no `accessorFn`,
  `value` is still `row[col.key]`.)

---

## 2. Filtering

Add two properties:

```ts
/** Opaque, consumer-owned filter state. Passed verbatim to `globalFilterFn`. */
@property({ attribute: false }) accessor filterValue: unknown = undefined;

/** When set, rows are filtered (before sort + paginate). The predicate owns ALL
 *  semantics — including treating an "empty" filterValue as match-all. */
@property({ attribute: false }) accessor globalFilterFn?: (row: T, filterValue: unknown) => boolean;
```

**Behavior**

- Pipeline: `data → filter → sort → paginate`. Filtering runs only when `globalFilterFn` is defined.
- `willUpdate` watches `filterValue` and `globalFilterFn`; when either changes, reset `#page` to 1
  (same treatment `data` already gets).
- **Pagination totals and the "start–end of N" label use the filtered row count, not
  `data.length`.** Store the filtered count during the `willUpdate` pipeline (a plain field set
  before pagination) and have `#totalPages` / `#pageState` / the label read it.
- **Defensive clamp:** after recomputing, clamp `#page` to `[1, #totalPages]` so a shrinking
  filtered set can't strand the view on an empty page.

**Design rationale (keep the value+predicate split):** the opaque `filterValue` lets a single
predicate cover global text search *and* faceted/multi-select filtering. A consumer passes e.g.
`filterValue = { query, types }` with a `globalFilterFn` that ANDs the sub-conditions — no separate
per-column or faceted-filter API is needed at the primitive layer.

---

## 3. Row selection + selected-row styling

Add:

```ts
export type SelectionMode = "none" | "single" | "multiple";

@property({ attribute: "selection-mode" }) accessor selectionMode: SelectionMode = "none";
@property({ attribute: false })            accessor selectedKeys: string[] = [];   // controlled

// event
selection-change → detail: { selectedKeys: string[]; selectedRows: T[] }
```

**Behavior**

- **Requires `rowKey`.** Selection is keyed by the existing `rowKey` fn. If `rowKey` is unset,
  selection is a documented no-op (no checkbox column rendered). Reason: keys are what let selection
  survive filter/sort/page changes.
- When `selectionMode !== "none"`, render a **leading checkbox column** using `<dui-checkbox>`,
  listening to its `checked-change` event (not raw clicks).
  - **`"multiple"`** — header checkbox is select-all over the **current filtered set** (all filtered
    rows, not just the visible page); `indeterminate` when the filtered set is partially selected.
    Every row gets a checkbox.
  - **`"single"`** — no header checkbox; selecting a row **replaces** the selection.
- **Controlled only.** The component never mutates `selectedKeys`; it emits `selection-change` with
  the *proposed next* selection and reflects whatever `selectedKeys` it's given.
  - Row toggle (multiple): next = `selectedKeys` with the row's key added/removed.
  - Select-all (multiple): **union** the filtered keys into `selectedKeys`; clear-all = **difference**
    (remove the filtered keys). This deliberately **preserves selections outside the current
    filter** rather than clobbering them.
  - Single: next = `[key]`, or `[]` when re-selecting the already-selected row.
- Selection persists across filter/sort/page changes because it's key-based.

**Suggested pure helper (for testing the header state):**

```ts
function deriveSelectAllState(filteredKeys: string[], selectedKeys: Set<string>):
  { checked: boolean; indeterminate: boolean } { ... }
```

<a id="selected-row-styling"></a>
### Selected-row styling — revised from the original proposal

Original proposal: *"Provide a default subtle selected background … resolving to an existing theme
token."* That would put a **theme token inside the unstyled primitive**, violating the package's
"structure and behavior only" contract (all other color/token styling lives in the downstream `dui`
layer). Revision:

- **In the primitive:** set `aria-selected="true"` on selected `<tr>`, expose the part
  `part="row selected"` (vs `part="row"`), and add exactly one *inert* structural hook:

  ```css
  tr[aria-selected="true"] { background: var(--data-table-selected-background, transparent); }
  ```

  The `transparent` fallback keeps the primitive visually unstyled while giving a documented
  override point.
- **In the downstream `dui` styled layer (follow-up, separate repo `dui`):** set
  `--data-table-selected-background` to a real theme token (e.g. `--surface-1` or an accent tint) so
  the styled `<dui-data-table>` shows a selected background by default. Track this as a companion
  task; it is out of scope for the `dui-primitives` change but must land before the styled component
  ships selection visually.

---

## 4. Row/cell parts + `row-click`

- Add `part="row"` to every body `<tr>` and `part="cell"` to every body `<td>` (today only
  `root` / `table-window` / `table` / `pagination` are exposed). *(Optional nicety: `part="header-row"`
  / `part="header-cell"` on the `<thead>` `<tr>`/`<th>` for symmetry — include if cheap.)*
- Emit `row-click` → detail `{ row: T; key: string | undefined }` on body-row click. Additive and
  **independent of selection** (lets a consumer open a detail view without wiring selection).
- **Guard against interactive content:** ignore the click when it originates inside the selection
  cell or on interactive content. Suggested: inspect `event.composedPath()` / `event.target.closest`
  for `dui-checkbox, a, button, input, select, textarea, [role="button"]` (and the selection cell)
  and bail before dispatching.

```ts
const rowClickEvent = customEvent<{ row: T; key: string | undefined }>(
  "row-click", { bubbles: true, composed: true },
);
```

---

## 5. Exports, docs, tests, build

- **Exports (`index.ts`):** add any new public type — `SelectionMode` — alongside the existing
  `ColumnDef` / `SortDirection` / `SortState` / `PageState`.
- **Docs/JSDoc:** extend the class `@fires` list (`selection-change`, `row-click`), document the new
  props (`accessorFn`, `filterValue`, `globalFilterFn`, `selectionMode`, `selectedKeys`), the new
  `@csspart`s (`row`, `cell`, `selected`), and the `--data-table-selected-background` custom property.
  - **Additional parts exposed while building the demo page** (needed to make the unstyled primitive
    usable standalone): `header-row` / `header-cell`; `sort-icon` for the sort indicator (its
    `.SortIcon` also gained a `1em` structural default so it isn't unbounded); and `checkbox` /
    `checkbox-indicator`, forwarded from the nested `<dui-checkbox>` via `exportparts` so consumers
    can style a control that lives two shadow levels deep.
- **Tests (new infra):** add co-located `data-table.test.ts` using `deno test` + `jsr:@std/assert`.
  Cover the extracted pure functions:
  - accessor-based sorting (`accessorFn` vs `row[key]` fallback),
  - `globalFilterFn` filtering, including filtered pagination totals and page-reset-to-1,
  - `deriveSelectAllState` (all / none / partial → checked / indeterminate),
  - defensive page clamp on a shrinking filtered set.

  Keep DOM-free by testing module-scoped helpers. `scripts/build.ts` already excludes `*.test.ts`
  from the published output, so no build change is needed — but **verify** the artifacts don't
  include tests after building.
- **Build:** run `deno task build`; confirm it compiles clean and regenerates `.js`/`.d.ts`.

## Backward-compatibility checklist

With `accessorFn`, `filterValue`, `globalFilterFn`, and `selectionMode` all unset:

- No checkbox column, no `aria-selected`, no `selection-change`/`row-click` wiring changes output.
- Pipeline degenerates to `data → sort → paginate` (filter step is skipped).
- Pagination totals use `data.length` (filtered count == full count).
- New `part="row"`/`part="cell"` are additive and don't alter existing selectors.
- `resolveValue` returns `row[col.key]` — identical to today.

## Out of scope (documented non-goals)

Multi-column sort, column visibility/resizing/pinning/ordering, row expansion, grouping, server-side
data mode, virtualization. Tracked separately in the gap analysis; not part of this change.
