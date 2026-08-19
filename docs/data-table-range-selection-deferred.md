# Deferred: `<dui-data-table>` range-selection follow-ups

Companion to [`data-table-range-selection-spec.md`](./data-table-range-selection-spec.md). These
were designed alongside the base feature and then cut from the first pass to keep it shippable —
**deferred, not cancelled.**

Everything here is **purely additive**. Nothing in the base spec needs to be undone to add any of
it.

**File these as GitHub issues on `dui-primitives` once the base feature lands.** Each section below
is written to be pasted into one issue: what it is, why it was deferred, what it depends on, and
what was already decided so the design work does not have to be redone.

The base feature landed in `7b46a33` and shipped in v2.2.0. Items 1, 3 and 4 are now filed — see the
**Filed as** line under each heading. Items 2, 5 and 6 are still unfiled; this document remains their
only record.

Ordered roughly by value.

---

## 1. Fix: `row-click` fires after drag-to-copy

**Filed as [#6](https://github.com/deepfuturenow/dui-primitives/issues/6).**

**Type:** bug fix. Independent of everything else here — file and fix on its own merits.

Dragging across a cell to select and copy a value (an ID, an email, an error string) currently fires
`row-click`. A consumer wiring `row-click` to navigation navigates away mid-drag.

### The fix

Suppress `row-click` when the gesture leaves a **non-collapsed text selection inside the row**.

### Why it was deferred

Not because it isn't worth doing — because it is gated on cross-engine research that would otherwise
have blocked the range-selection merge. Splitting it out lets each ship on its own timeline.

### The research it needs

Nothing in this repo currently calls `getSelection()`, so there is no in-house precedent. Behaviour
for selections *inside* a shadow root differs by engine:

- Standards-track: `selection.getComposedRanges({ shadowRoots: [this.shadowRoot] })`
- Legacy Chrome-only: `this.shadowRoot.getSelection()`
- `window.getSelection()` may retarget its anchor/focus nodes to the host, or report an empty
  selection, depending on engine.

**Verify empirically in Chrome, Safari and Firefox before relying on `isCollapsed`.**

### Design constraint

**Fail open.** If the selection state cannot be determined, do **not** suppress the event — that is
exactly today's behaviour, so an undetectable case degrades to the status quo rather than to a dead
event.

Portable fallback if the selection APIs prove unusable: suppress on pointer travel instead (compare
`pointerdown`/`pointerup` coordinates, ~4px threshold), which catches drag-to-copy specifically.

---

## 2. Shift-drag to scrub a range

Hold shift, press on a row, drag: the range updates live from the anchor as the pointer crosses
rows. Finder supports it.

```
shift + pointerdown row 9  → sel = base ∪ [anchor..9]
drag to row 14             → sel = base ∪ [anchor..14]
drag back to row 6         → sel = base ∪ [anchor..6]
pointerup                  → done, anchor unchanged
```

Same `base ∪ range(anchor, target)` call as shift-click, driven by `pointermove` instead of `click`.
Shift-mousedown already suppresses the native text drag, so the groundwork is in place. Use
`setPointerCapture`.

### Why it was deferred

It adds **zero new capability** — shift-click already selects 3→9 in two clicks. It is a different
feel, not a different outcome. Against that: a pointer state machine, and row hit-testing during the
drag (`elementFromPoint` retargets across shadow boundaries, so this is fiddlier than it reads).

It was also the only feature that forced a **performance caveat into a public API's docs**, which
would then apply to every consumer including those who never drag.

### Decided: emission model

**Emit once per row crossed**, not once per `pointermove`. The component is controlled — it renders
whatever `selectedKeys` it is handed — so a live-scrubbing drag can only show the range if it emits
during the drag.

Rejected alternative: a transient internal `#pendingRange` overlay rendering `selectedKeys ∪
pending` and emitting once on `pointerup`. It would break the invariant that the component never
displays a selection the consumer has not approved — a consumer that rejects the final selection
would see rows light up during the drag and then snap back.

Bounded by `pageSize` (default 10) events per drag. Requires this docs line:

> During a shift-drag, `selection-change` fires once per row crossed. Debounce if your handler is
> expensive.

### Decided: no autoscroll

`.TableWindow` sets no height in either layer, so it shrink-wraps and is not scrollable — the page
scrolls instead. With the default `pageSize: 10` a drag never reaches an edge. This only bites at
`pageSize: 0` with a consumer-constrained window height. Revisit only if that configuration appears.

---

## 3. Keyboard row navigation

**Filed as [#7](https://github.com/deepfuturenow/dui-primitives/issues/7).**

Arrow-key navigation over rows, with range extension.

| Key | Behaviour |
| --- | --- |
| `↑` / `↓` | move focus to the previous / next row checkbox on the current page. Stops at the boundary — does not turn the page. |
| `Shift` + `↑` / `↓` | move focus **and** apply `base ∪ range(anchor, focused)`. Degrades to cmd-click semantics when there is no anchor. |
| `Cmd`/`Ctrl` + `A` | union over the **filtered** set, matching `#toggleAll`. |
| `Home` / `End` | focus first / last row checkbox on the current page. |

Escape and Space already ship in the base spec.

### Why it was deferred

Checkboxes are already fully keyboard-operable via Tab + Space, so **selection has a complete
keyboard path today**. Arrow navigation is a power-user accelerator, not an accessibility
requirement — and it is the only thing forcing a change to a shared, shipped component (below).
`Cmd+A` additionally duplicates the header checkbox, which is one click away and always visible.

### Blocking prerequisite: `delegatesFocus` on `dui-checkbox`

`DuiCheckboxPrimitive` has **no `delegatesFocus`**, and its focusable element is a
`<span part="root" tabindex="0">` inside its own shadow root (`checkbox/checkbox.ts:265-272`). So:

- `checkboxEl.focus()` from the data table is a **no-op** — the `<dui-checkbox>` host is not itself
  focusable and focus does not forward.
- Reaching the inner span would mean `querySelector` into another component's shadow root, which
  CLAUDE.md explicitly forbids.

Fix, in the checkbox primitive:

```ts
static override shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true,
};
```

Six primitives already do this (`input`, `number-field`, `stepper`, `toggle`, `button`, `textarea`),
so the pattern is established. Treat it as a bug fix — a form control you cannot `.focus()` is
broken — but it is a change to a shipped component: verify `:focus-visible` ring placement and
click-to-focus behaviour on `dui-checkbox` before and after, and add a regression test to
`checkbox.test.ts`.

### Other implementation notes

- **Reading the focused row.** `document.activeElement` retargets to the outermost host, so it
  reports `<dui-data-table>`. Use `this.shadowRoot.activeElement` — the table's own tree, so no
  shadow-DOM rule violation.
- **Guard the arrow keys.** Handle `↑`/`↓` only when the focused element is a row checkbox.
  Otherwise arrows inside a text input or select in a cell would move row focus instead of doing
  their normal job.
- **First arrow from `.TableWindow` focus.** After a modifier gesture, focus is on `.TableWindow`
  itself with no focused row. On the first `↓` from that state, focus the first row checkbox on the
  page.
- **Bulk-gesture scope** was decided: `Cmd+A` unions over the filtered set (same as the header
  checkbox, because it *is* the keyboard form of it); Escape clears everything unconditionally
  ("select all" is a scoped verb, "clear" is not).

---

## 4. `row-dblclick` event

**Filed as [#8](https://github.com/deepfuturenow/dui-primitives/issues/8), which depends on
[#6](https://github.com/deepfuturenow/dui-primitives/issues/6).**

A `row-dblclick` event so a consumer can build the full Finder model — cmd/shift to select,
double-click to open.

```ts
export const rowDblclickEvent = customEvent<RowDblclickDetail<unknown>>(
  "row-dblclick",
  { bubbles: true, composed: true },
);
```

Same interactive-content bail as `row-click`, same modifier suppression, and the same text guard
from item 1.

`RowDblclickDetail<T>` would need adding to `data-table/index.ts`'s `export type { … }` block.

### Why it was deferred

Speculative public API on a shipped component — no consumer has asked for it. It exists so someone
*could* build open-on-double-click. It also depends on item 1's cross-engine research.

### Dependency

Item 1. Without the text guard, double-clicking a word to copy it fires `row-dblclick`, so a
consumer wired to navigation opens a detail view — which is the exact bug the guard exists to
prevent, relocated.

### Bundled with it: `--data-table-row-user-select`

The guard becomes **self-tuning** if consumers can turn text selection off. New CSS custom property
on the primitive, following the existing `--data-table-selected-background` pattern (inert
structural hook, default preserves current behaviour):

```css
tbody tr {
  user-select: var(--data-table-row-user-select, auto);
}
```

Set it to `none` and no text selection can ever exist, so the guard never trips and both row events
always fire — the Finder-style configuration, with no extra JS API:

| Config | `--data-table-row-user-select` | Drag to copy | Word select | `row-dblclick` |
| --- | --- | --- | --- | --- |
| Text-first (default) | `auto` | ✓ | ✓ | suppressed on text |
| Finder-first | `none` | ✗ | ✗ | always fires |

### Explicitly decided against

A third configuration — text stays drag-selectable but `row-dblclick` always fires — is a
**documented non-goal**. "Double-click a word and we both select it and open a detail view" is a bug
a consumer would be asking for on purpose. Relax only if someone actually needs it.

Also decided against: making the row events `cancelable`. It is inert here — `preventDefault()` lets
a consumer veto an action the component was going to take, and these events have no default action;
the consumer *is* the action. It also cannot restore a suppressed event.

---

## 5. `role="grid"` and full APG grid semantics

`role="grid"` + `aria-multiselectable` + roving tabindex on rows + focusable sort headers +
Enter/F2 cell-interaction mode.

Would also make the existing `aria-selected` on `<tr>` meaningful — it is currently inert (`<tr>` is
`role="row"`, which supports the attribute, but `<table>` is `role="table"`, which is not a
selection container). No markup churn needed when it lands; the attribute is already there.

### Why it was deferred

The *focus model* is cheap — `tree.ts:262` and `calendar.ts:405-437` both already do roving tabindex
in this repo. The **contract** is what is expensive:

1. **Cell-interaction mode.** With row-level focus, APG expects Enter/F2 to enter a cell and Escape
   to leave — colliding directly with Escape-clears-selection. Needs arbitration.
2. **←/→ become claimed but unhonoured.** Calendar earns `role="grid"` because a calendar genuinely
   is cell-navigable; a data table with row focus and no cell navigation does not.
3. **Sortable headers are unfocusable today** (`<th @click>`, no tabindex, no keydown). Claiming
   grid exposes that gap and forces fixing it in the same change.
4. **Pagination would couple to focus** — what does `↓` do on the last row of page 3? Finder has no
   pages, so there is no answer to borrow.

Its own project, not a follow-up.

---

## 6. Smaller items

### `cmd-drag` to paint a toggle across rows

Real Finder behaviour. Needs a third state machine: crossing a mix of selected and unselected rows,
you must **paint-lock** to the first row's resulting state rather than toggling each individually,
or you get a checkerboard. Nobody has asked.

### Ranges spanning pages

Currently impossible by construction — the anchor is dropped on page change so the range is always
within one page. Making ranges span pages would mean selecting rows the user cannot see, which is
what the header checkbox already does, so there is precedent if it is ever wanted. Would require
computing the range over the filtered+sorted set rather than `#displayRows`, and relaxing the anchor
lifetime invariant.

### Touch / long-press selection

No modifiers exist on touch, so the checkbox column is currently the only path. A long-press
equivalent for cmd-click would need its own gesture-conflict analysis against scrolling and the
native context menu.

### `selection-change` gesture context

Decided against, recorded here in case it comes back. There are now several ways selection changes
(checkbox, header checkbox, cmd-click, shift-click, Escape). A `reason: "toggle" | "range" | "all" |
"clear"` field — and optionally `addedKeys` / `removedKeys` — would help undo stacks, confirmation
prompts before large bulk selections, and consumers syncing to a server who currently have to diff
against their own previous set.

Rejected for now on the CLAUDE.md "avoid over-abstraction" line: the consumer's job is to reflect
the proposed set, not to care how it was produced. Additive if a real use case appears.
