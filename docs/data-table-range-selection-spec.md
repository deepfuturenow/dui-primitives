# Spec: `<dui-data-table>` — Finder-style range selection

Adds modifier-driven row selection to `selectionMode="multiple"`: cmd-click to toggle a row,
shift-click to select a consecutive range, and Escape to clear. Modelled on macOS Finder's list
view.

**Layer: `dui-primitives`.** Anchor tracking, range resolution and event emission are pure
behaviour. The styled layer gets no changes at all — see §8.

**Scope.** This spec covers only what ships in the first pass. Shift-drag, `row-dblclick`, the
`row-click` text guard, and arrow-key navigation were all designed and then deliberately deferred —
they are recorded in full in [`data-table-range-selection-deferred.md`](./data-table-range-selection-deferred.md),
which is written to be filed as GitHub issues once this lands. Everything deferred is purely
additive; nothing here needs to be undone to add it later.

Notably, this scope needs **no changes to any other component**, adds **no new public events**, and
has **no cross-browser research blocking the merge**.

---

## 0. Two implementation notes

### 0.1 Platform modifier

The toggle modifier is `metaKey` on Apple platforms and `ctrlKey` everywhere else — **never both**.
Accepting `metaKey || ctrlKey` universally means a macOS ctrl-click opens the context menu *and*
toggles the row. Detect once and reuse; a small `isApplePlatform()` helper in `core/dom.ts` is the
natural home.

### 0.2 The capture-phase handler intentionally starves `dui-checkbox`

`DuiCheckboxPrimitive` toggles from a `click` listener on its own host (`checkbox/checkbox.ts:196`).
Our modifier handler runs in the **capture** phase on `.TableWindow` and calls `stopPropagation()`,
so the checkbox never sees a modified click. That is deliberate, and it is what centralises all
modifier handling at the table level: the checkbox only ever handles *unmodified* clicks.

---

## 1. The governing principle

**An unmodified click never touches row selection.**

This is the whole design. Every collision the feature would otherwise create — click-drag to select
text, double-click to select a word, triple-click for a line, clicking a link or a button in a cell
— disappears, because none of those gestures involve a modifier. There is no drag-distance
heuristic, no `getSelection()` probing, and no `user-select: none`.

Selection is only ever changed by: the row checkbox, the header checkbox, a modifier gesture, or
Escape.

---

## 2. Gesture table

| Gesture | Row body | Checkbox cell | Header |
| --- | --- | --- | --- |
| Click | nothing to selection; fires `row-click` | toggle row, move anchor | sort / select-all, drop anchor |
| Double-click | nothing to selection | — | — |
| **Cmd-click** (⌘ on Apple, Ctrl elsewhere) | toggle row, move anchor | toggle row, move anchor | ignored |
| **Shift-click** | `base ∪ range(anchor, target)` | same | ignored |
| Escape | clear selection, drop anchor | | |
| Space | toggles the focused checkbox natively, which moves the anchor — free, no code | | |

Modifier gestures are **`selectionMode="multiple"` only**. In `"single"` they behave as plain
clicks. Modifiers are ignored entirely in `<thead>` — sort headers and the select-all checkbox keep
their current behaviour.

Touch has no modifiers, so on touch the checkbox column remains the only selection affordance. This
is a desktop accelerator by design.

---

## 3. State and algorithm

Two pieces of internal state:

```ts
@state() accessor #anchorKey: string | null = null;
#baseKeys: ReadonlySet<string> | null = null;
```

`#baseKeys` is a snapshot of the selection taken **at the moment the anchor is set**. It is what
makes ranges recompute rather than accumulate:

```
shift-click(target) → selectedKeys = base ∪ range(anchor, target)
```

Trace, matching Finder exactly:

```
click 3         → sel {3}          anchor 3   base {3}
shift-click 9   → sel {3..9}       anchor 3   base {3}
shift-click 12  → sel {3..12}      anchor 3   base {3}
shift-click 5   → sel {3,4,5}      anchor 3   base {3}     ← shrinks
cmd-click 20    → sel {3,4,5,20}   anchor 20  base {3,4,5,20}
shift-click 25  → sel {3,4,5,20..25}
```

Shift-clicking back inside a range **contracts** it — the user can scrub the boundary in and out
with repeated shift-clicks. Prior disjoint selections survive because they live in `base`.

The anchor is set (and `base` re-snapshotted) by: a checkbox click, a cmd-click, or a shift-click
that had no anchor to work from (§4). The header select-all **drops** the anchor rather than setting
one.

### New pure helper

Exported from `data-table.ts` alongside `sortData` / `deriveSelectAllState`:

```ts
/**
 * Keys between `anchorKey` and `targetKey` inclusive, in display order.
 * Returns `[]` if either key is absent from `orderedKeys`.
 */
export function resolveRange(
  orderedKeys: string[],
  anchorKey: string,
  targetKey: string,
): string[];
```

Kept local to data-table. Promote to `@dui/core` only if `tree` or `card-grid` grows the same need —
per CLAUDE.md, avoid the abstraction until there is a second consumer.

---

## 4. Anchor lifetime

**Invariant: the anchor is present in `#displayRows`, or it is `null`.**

That invariant is what lets the range be computed over `#displayRows` alone (the current page, or
the whole sorted set when `pageSize: 0`). Maintain it by dropping the anchor **and** base on:

- **Page change** — the anchor row leaves the view.
- **Sort change** — re-sorting reshuffles which rows land on the current page, so the anchor can
  silently exit `#displayRows`.
- **Filter / data change** — the anchor row may no longer exist.
- **Header select-all / clear-all.**
- **Externally divergent `selectedKeys`** — see below.

### Controlled-component divergence

Selection is controlled: the component emits a *proposal* and renders whatever it is handed back. If
an incoming `selectedKeys` differs from the last proposal we emitted, our `base` snapshot is stale
and subsequent ranges would be computed against fiction. So: in `willUpdate`, when `selectedKeys`
changes and does not match the last emitted proposal, **drop both anchor and base**.

Consequence worth documenting: a consumer that clamps the proposal (e.g. "max 10 rows") will see the
anchor reset on every gesture, and range selection will effectively stop working. That is correct
behaviour, but it is surprising, so it belongs in the docs.

### Degradation when there is no anchor

Shift-click with `#anchorKey === null` **behaves as a cmd-click**: select that one row, set the
anchor, capture the base. Never a dead gesture.

This matters because "no anchor" is a *common* state after the rules above, not an edge case — every
page change produces it. Under this rule the user's first shift-click after paging selects one row
and the second one works normally, which they will almost certainly not notice.

---

## 5. Interactive content precedence

Modifier gestures are handled in the **capture phase** on `.TableWindow`, with `preventDefault()`
and `stopPropagation()`. Capture, not bubble, because otherwise an inner `<dui-button>`'s own
handler runs first.

Concretely: **cmd-clicking a "Delete" button in a row selects the row and does not delete.** That is
the intended meaning of "the modifier disambiguates intent, so it works anywhere on the row."

`preventDefault()` on the `mousedown` is also what suppresses the browser's native shift-extends-
text-selection behaviour. Without it, click row 3's text then shift-click row 9's text and the
browser selects everything between.

### The one carve-out: `a[href]`

**Cmd-click yields to links.** Cmd-clicking an anchor opens it in a new tab and does not change the
selection. macOS-level muscle memory for "open in new tab" is too strong to steal.

**Shift-click does not yield.** Native shift-click on a link opens a new *window* — a vestigial
behaviour nobody invokes deliberately. And because the name column is a link in most real tables,
yielding there would make the range gesture dead across the widest column of every table we ship.

```
cmd-click   <a href>     → new tab, no selection change
cmd-click   <button>     → row selected, button does NOT fire
cmd-click   text / <td>  → row selected
shift-click <a href>     → range select, new-window suppressed
```

No other element gets a carve-out.

**Known risk to watch in real use.** This is the asymmetry most likely to produce a "feels weird"
report: cmd-click means "new tab" over the name column and "select row" everywhere else in the same
row. It is the right call for muscle memory, but the dead zone is real.

---

## 6. Focus and Escape

Escape clears the entire selection and drops the anchor. `stopPropagation()` **only when handled**
(selection non-empty), so a table inside a `dui-dialog` nests correctly: first Escape clears, second
closes. Escape on an empty selection emits nothing.

There is a hole this does not close on its own: **cmd-click calls `preventDefault()` in the capture
phase, so it never moves focus.** After the primary selection gesture `document.activeElement` is
still `<body>`, a `keydown` on `.TableWindow` never fires, and Escape is dead exactly when the user
most wants it.

Fix:

```html
<div class="TableWindow" part="table-window" tabindex="-1" @keydown=${this.#onKeyDown}>
```

- `tabindex="-1"` — programmatically focusable, not a tab stop.
- **Call `.focus()` on it at the end of every modifier gesture.** No focus ring appears:
  `:focus-visible` does not match programmatic focus following a pointer interaction.

Both entry paths then work: after a modifier gesture the keydown lands on `.TableWindow` directly;
after a plain checkbox click it bubbles up from the focused checkbox.

### Why no `role="grid"` and no arrow keys

Checkboxes are already fully keyboard-operable via Tab + Space, so selection has a complete keyboard
path today. Arrow-key row navigation is a power-user accelerator, not an accessibility requirement,
and it is the only thing that would force `delegatesFocus` onto `dui-checkbox` — a shared, shipped
component. Deferred; see the companion doc.

`aria-selected` on `<tr>` **stays as-is.** It is inert rather than invalid — `<tr>` maps to
`role="row"`, which supports the attribute, but `<table>` maps to `role="table"`, which is not a
selection container, so AT has no reason to announce it. It costs nothing, some tooling and tests
read it, and leaving it means zero CSS churn in either layer.

---

## 7. Public API delta

**New:**

- `resolveRange()` exported helper
- `tabindex="-1"` on `.TableWindow` (§6)

**Changed:**

- `row-click` no longer fires when a modifier is held. Modifier = selection gesture. This is a
  behaviour change to a shipped event and belongs in the release notes.

**Unchanged:**

- `selection-change` detail stays `{ selectedKeys, selectedRows }`. No `reason`, no delta fields —
  the consumer's job is to reflect the proposed set, not to care how it was produced.
- `selectedKeys`, `selectionMode`, `rowKey`, `row-click` (otherwise), `aria-selected`, all existing
  parts and CSS properties.
- **No new properties.** In particular there is no `select-on-row-click` gate: because plain clicks
  never select, modifier gestures cannot collide with the existing `row-click` contract, so there is
  nothing to opt into and no breaking change to guard against.
- **No new exported types**, so `data-table/index.ts` needs no changes.

### Emission hygiene

Skip `selection-change` entirely when the proposed set equals the current one.

---

## 8. Styled layer (`dui`)

No changes required. `aria-selected` stays, so `tbody tr[aria-selected="true"]` and its `:hover`
companion keep working untouched. `dui` picks this up on the next `@dui/primitives` bump — a version
bump alone.

Deliberately no hover-preview of the pending range (Finder has none) and no discoverability chrome —
checkboxes are always rendered in `multiple` mode, so there is a visible path; cmd/shift are
accelerators, documented rather than advertised.

---

## 9. Known limitations shipping with this

Not bugs introduced here, but things a reviewer will notice and ask about:

- **Double-click still fires `row-click` twice.** Native `click` fires twice before `dblclick`; we do
  not debounce, because a timer would put latency on every single click.
- **Drag-across-a-cell-to-copy still fires `row-click`.** A pre-existing bug. The fix is a text guard
  on `row-click`, deliberately split out as its own bug fix so this feature is not gated on
  cross-engine `getSelection()` research. See the companion doc.
- **Ranges never span pages**, by construction (§4).

---

## 10. Delivery

Ships entirely in `dui-primitives`. Nothing in `dui/packages/components` changes.

Suggested order:

1. `resolveRange()` + its unit tests — pure, no DOM, no dependencies.
2. Anchor/base state + lifetime rules (§3, §4), driven by the checkbox column only. At this point
   shift-click on a checkbox already works end to end.
3. Row-body modifier gestures: capture-phase handling, link carve-out, platform modifier (§0.1, §5).
4. `.TableWindow` focus + Escape (§6).
5. Docs.

### Docs to update

In `data-table.ts`'s class JSDoc: amend the `@fires row-click` line to note modifier suppression.

In `dui`: `packages/docs/src/component-registry.ts` and the data-table demo page, via the
`/edit-docs` skill. The demo page should show a `multiple`-mode table with enough rows to make
shift-click worth doing.

### Test coverage

`data-table.test.ts` already covers the pure helpers. Add:

- `resolveRange` — normal, reversed (target above anchor), single-row, missing key.
- The shrink case: `{3} → shift 9 → shift 12 → shift 5` yields `{3,4,5}`.
- Base preservation: `{3,4,5} + cmd 20 + shift 25` yields `{3,4,5,20..25}`.
- Anchor dropped on sort / filter / page change / header select-all.
- Anchor dropped when `selectedKeys` arrives differing from the last proposal.
- Shift-click with no anchor behaves as cmd-click.
- Cmd-click over `a[href]` does not change selection; shift-click over `a[href]` does.
- Cmd-click over a `<button>` selects the row and does not fire the button's handler.
- `row-click` does not fire when a modifier is held.
- Escape works immediately after a cmd-click with no prior keyboard focus (§6 regression).
- No `selection-change` emitted when the proposed set is unchanged.
