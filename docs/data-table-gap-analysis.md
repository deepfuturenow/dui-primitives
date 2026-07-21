# Data Table — Feature Gap Analysis

**Component:** `packages/primitives/src/data-table/` (`<dui-data-table>`)
**Compared against:** shadcn Base UI Data Table — https://ui.shadcn.com/docs/components/base/data-table
**Date:** 2026-07-21

## Framing

These two aren't the same *kind* of thing.

- **shadcn Base UI "data-table"** is not a component — it's a **recipe/guide**. It wires
  [TanStack Table](https://tanstack.com/table) (a headless, framework-agnostic table engine) into
  shadcn's presentational primitives (`Table`, `Button`, `Checkbox`, `Input`, `DropdownMenu`). You
  copy the code and own it. TanStack Table does the state/logic; shadcn supplies the markup.
- **`<dui-data-table>`** is a **self-contained Lit web component** that owns its own sort +
  pagination logic internally, with a declarative `columns`/`data` API. Batteries included, but the
  batteries are fixed.

So the "gap" is really: *what does the TanStack-backed recipe expose that the closed component
doesn't?*

## Feature-by-feature

| Capability | `<dui-data-table>` | shadcn / TanStack | Gap |
|---|---|---|---|
| **Sorting** | ✅ Built-in, single-column, 3-state (asc→desc→clear), client-side | ✅ Multi-column, custom sort fns, server-side sort | Partial — lacks multi-sort & custom comparators per column |
| **Column render** | ✅ `render(value, row)` returns Lit template/string | ✅ `cell` render fn | Parity |
| **Pagination** | ✅ Built-in client-side, first/prev/next/last | ✅ Via `getPaginationRowModel`, configurable page sizes | Partial — lacks **page-size selector**, jump-to-page |
| **Column filtering** | ❌ | ✅ Per-column + global filter input | **Missing** |
| **Faceted filters** | ❌ | ✅ (TanStack faceted row models) | **Missing** |
| **Row selection** | ❌ | ✅ Checkbox, select-all-on-page, selected-count | **Missing** |
| **Column visibility toggle** | ❌ (columns are static) | ✅ Dropdown show/hide | **Missing** |
| **Row actions** | ⚠️ Possible via `render` (put a menu in a cell) | ✅ First-class pattern (`row.original`) | Can emulate |
| **Empty state** | ✅ `emptyText` | ✅ Manual | Parity (ours is nicer/declarative) |
| **Loading state** | ❌ | ❌ (manual in both) | Neither ships it |
| **Sticky header** | ✅ (`position: sticky`) | ⚠️ Not in base recipe | **Ahead** |
| **Column width** | ✅ `width` per column | ✅ | Parity |
| **Column resizing** | ❌ | ⚠️ TanStack supports, not in recipe | Both lack out-of-box |
| **Column pinning/ordering** | ❌ | ⚠️ TanStack supports, not in recipe | Both lack out-of-box |
| **Row expansion / sub-rows** | ❌ | ⚠️ TanStack supports, not in recipe | Both lack out-of-box |
| **Grouping / aggregation** | ❌ | ⚠️ TanStack supports, not in recipe | Both lack out-of-box |
| **Virtualization** | ❌ | ⚠️ External (`@tanstack/virtual`) | Both lack out-of-box |
| **Server-side data** | ❌ (always sorts/paginates the full `data` array in-memory) | ✅ Manual mode: you own fetching, TanStack just renders | **Missing** — architecturally significant |
| **Controlled vs uncontrolled state** | ❌ Internal-only state; emits `sort-change`/`page-change` but can't be driven externally | ✅ Fully controllable via state props | **Missing** |
| **Accessibility** | ✅ `aria-sort`, real `<table>` semantics, `aria-label`ed page buttons | ⚠️ Depends on how you wire it | **Ahead** by default |
| **Row keying** | ✅ `rowKey` fn for stable `repeat()` | ✅ `getRowId` | Parity |

## The material gaps (in priority order)

1. **Row selection** — the single biggest missing feature. Table-stakes for any "manage a list"
   UI and pairs with bulk actions. Requires a selection state, a header checkbox column, and a
   `selection-change` event.

2. **Column filtering / global search** — no way to reduce rows by query today. A `filterable`
   flag per column + a `filter-change` event, or a global `filter` property.

3. **Server-side / controlled mode** — the architectural ceiling. Because `willUpdate` always runs
   `sortData(this.data)` and `paginateData` over the *entire* `data` array, the component **cannot**
   back a paginated API — it assumes it holds the full dataset in memory. For large or remote
   datasets you'd need a `manual` mode where sort/page become inputs (properties) rather than
   internal state, and the component just renders `data` as-is while emitting change events. The
   events exist (`sort-change`, `page-change`) but nothing consumes external state back in — sort/page
   are private `@state`, not properties.

4. **Column visibility toggle** — cheap to add, high-value for wide tables.

5. **Multi-column sort** — `#handleSort` hard-replaces `#sort` with a single object; there's no
   shift-click accumulation.

6. **Page-size selector** — `pageSize` is a fixed property; users can't change rows-per-page at
   runtime.

## Where `<dui-data-table>` is ahead

- **Sticky header** and correct **`aria-sort` / semantic table** come for free — the shadcn recipe
  leaves a11y polish to the consumer.
- **Declarative, closed API** (`columns` + `data`) is dramatically less code to consume than
  assembling TanStack + 5 primitives. For simple in-memory tables, ours is the better DX.

## Recommendation

The component is well-suited to its current niche (small, client-held datasets) and beats the recipe
on ergonomics and default a11y. But it has two *categories* of gap:

- **Feature gaps** (selection, filtering, column visibility, multi-sort, page-size selector) —
  additive, backward-compatible. Row selection and filtering are the two to prioritize.
- **An architectural gap** (no controlled/server-side mode). Not additive — requires promoting
  `#sort`/`#page` to optional controlled properties and adding a `manual`/`server` flag so the
  component stops assuming it owns the full dataset. Worth doing before this gets adopted for
  anything backed by a real API.

Highest-leverage next steps: **row selection** and **controlled/server-side mode**.
