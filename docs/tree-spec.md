# Tree Primitive — Spec

## Overview

A Tree displays hierarchical data as an expandable/collapsible list. Users navigate the tree with arrow keys, expand/collapse branches, and optionally select items.

**Prior art:** [React Aria Tree](https://react-aria.adobe.com/Tree) · [W3C APG Treeview Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) · [W3C Navigation Treeview Example](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/)

---

## Anatomy

```
<dui-tree>                              ← role="tree", manages focus + keyboard
  <dui-tree-item value="docs">          ← role="treeitem", branch (has children)
    <span slot="label">Documents</span>
    <span slot="end">3 items</span>     ← trailing content (optional)
    <dui-tree-item value="readme">      ← role="treeitem", leaf (no children)
      <span slot="label">README.md</span>
      <span slot="end">✅</span>
    </dui-tree-item>
    <dui-tree-item value="license">
      <span slot="label">LICENSE</span>
    </dui-tree-item>
  </dui-tree-item>
  <dui-tree-item value="src">
    <span slot="label">src/</span>
    <dui-tree-item value="index">
      <span slot="label">index.ts</span>
    </dui-tree-item>
  </dui-tree-item>
</dui-tree>
```

Two elements:

| Element | Role | Description |
|---------|------|-------------|
| `<dui-tree>` | `tree` | Root container. Owns keyboard navigation, expanded state, and selection state. |
| `<dui-tree-item>` | `treeitem` | A node in the tree. Can be a leaf (no children) or a branch (has `<dui-tree-item>` children, or `has-children` set). |

Branch vs. leaf is determined automatically: if a `<dui-tree-item>` contains other `<dui-tree-item>` elements (or has the `has-children` attribute), it's a branch.

---

## Phase 1 — Essential (v1)

### `<dui-tree>` Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `expandedValues` | — | `string[]` | `undefined` | Controlled expanded branches. |
| `defaultExpandedValues` | `default-expanded-values` | `string[]` | `[]` | Initial expanded branches (uncontrolled). |
| `selectionMode` | `selection-mode` | `"none" \| "single" \| "multiple"` | `"none"` | Selection behavior. |
| `selectedValues` | — | `string[]` | `undefined` | Controlled selected items. |
| `defaultSelectedValues` | `default-selected-values` | `string[]` | `[]` | Initial selected items (uncontrolled). |
| `disabled` | `disabled` | `boolean` | `false` | Disables the entire tree. |

When `selectionMode` changes at runtime, internal selection state is normalized: switching to `"none"` clears selection; switching to `"single"` trims to the first selected value. When `selectedValues` is controlled, normalization is the consumer's responsibility.

### `<dui-tree-item>` Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `value` | `value` | `string` | *required* | Unique identifier for this item. |
| `disabled` | `disabled` | `boolean` | `false` | Disables this item (and its descendants). |
| `hasChildren` | `has-children` | `boolean` | `false` | Marks the item as a branch even when no children are slotted yet (for async/lazy loading). When set, the chevron renders and `dui-load-children` fires on first expand. |
| `loading` | `loading` | `boolean` | `false` | Indicates async children are loading. Reflects `aria-busy="true"` and `data-loading` on the host. |

### Events

| Event | Detail | Fired on | Description |
|-------|--------|----------|-------------|
| `dui-expanded-change` | `{ values: string[] }` | `<dui-tree>` | Branches expanded or collapsed. |
| `dui-selection-change` | `{ values: string[] }` | `<dui-tree>` | Selection changed. |
| `dui-action` | `{ value: string }` | `<dui-tree>` | User activated a leaf item (Enter/click on non-selectable tree). |
| `dui-load-children` | `{ value: string }` | `<dui-tree-item>` | First expand of a `has-children` branch with no slotted children. Bubbles + composes — listenable at `<dui-tree>` level. Re-fires on next expand if children remained empty (e.g. after a failed fetch). |

### Slots

| Element | Slot | Description |
|---------|------|-------------|
| `<dui-tree>` | (default) | `<dui-tree-item>` children |
| `<dui-tree-item>` | `label` | The visible label/content for this node |
| `<dui-tree-item>` | `end` | Trailing content (status icons, badges, actions) — rendered at the far right of the row |
| `<dui-tree-item>` | (default) | Child `<dui-tree-item>` elements (makes it a branch) |

### CSS Parts

| Element | Part | Description |
|---------|------|-------------|
| `<dui-tree>` | `root` | The tree layout container. (`role="tree"` is on the host element so consumer-provided `aria-label` applies naturally.) |
| `<dui-tree-item>` | `root` | The treeitem row container. **Wraps both the row content and the children group**, so styling `:hover` here will bleed onto descendants. Style `::part(content)` instead. |
| `<dui-tree-item>` | `content` | Row layout container — `display: flex; align-items: center`. Contains indicator, label slot, and end slot. **Style hover/selected backgrounds here**, not on root. |
| `<dui-tree-item>` | `indicator` | Expand/collapse chevron target. **Always rendered** (for both branches and leaves) so leaf labels align with branch labels at the same level. Use `[data-branch]` on the host to add chevron content; leaves render an empty placeholder. |
| `<dui-tree-item>` | `group` | The child group container (`role="group"`, hidden when collapsed). |

### Data Attributes

State attributes are reflected to **both `[part="root"]` AND the host element**. Use the host attribute when combining with `::part(content)`:

```css
dui-tree-item[data-selected]::part(content) { background: #dbeafe; }
```

| Attribute | When present |
|-----------|-------------|
| `data-expanded` | Branch is expanded |
| `data-selected` | Item is selected |
| `data-disabled` | Item is disabled (own attr OR ancestor disabled OR tree disabled) |
| `data-branch` | Item has children (slotted, or `has-children` set) |
| `data-leaf` | Item has no children |
| `data-level` | Nesting depth (1-based). e.g. `data-level="2"` |
| `data-focus` | Item has keyboard focus |
| `data-loading` | Item is loading async children |

### ARIA Mapping (per W3C APG)

| Element | ARIA | Source |
|---------|------|--------|
| `<dui-tree>` host | `role="tree"` | Set automatically in `connectedCallback` |
| `<dui-tree>` host | `aria-label` or `aria-labelledby` | Consumer provides via attribute on the host |
| `<dui-tree>` host | `aria-multiselectable="true"` | When `selectionMode="multiple"` |
| `<dui-tree-item>` root | `role="treeitem"` | Static |
| `<dui-tree-item>` root | `aria-expanded="true/false"` | Branches only; reflects expanded state |
| `<dui-tree-item>` root | `aria-selected="true/false"` | When `selectionMode !== "none"` |
| `<dui-tree-item>` root | `aria-disabled="true"` | When disabled |
| `<dui-tree-item>` root | `aria-busy="true"` | When `loading` is set |
| `<dui-tree-item>` root | `aria-level` | Nesting depth (1-based) |
| `<dui-tree-item>` root | `aria-setsize` | Number of siblings at this level |
| `<dui-tree-item>` root | `aria-posinset` | Position among siblings (1-based) |
| `<dui-tree-item>` group | `role="group"` | Container for child treeitems (branches only) |

### Keyboard Interaction (W3C APG)

| Key | Behavior |
|-----|----------|
| `↓` | Move focus to next visible treeitem |
| `↑` | Move focus to previous visible treeitem |
| `→` | On closed branch: expand. On open branch: move focus to first child. On leaf: nothing. |
| `←` | On open branch: collapse. On closed branch or leaf: move focus to parent. |
| `Enter` | Activates the item. If selectable, toggles selection. If leaf in `selectionMode="none"`, fires `dui-action`. |
| `Space` | If selectable, toggles selection. Otherwise same as Enter. |
| `Home` | Move focus to first visible treeitem |
| `End` | Move focus to last visible treeitem |
| `*` (asterisk) | Expand all sibling branches at the focused item's level |
| Type-ahead | Move focus to next item starting with typed character(s) |

Focus management uses **roving tabindex**: one treeitem has `tabindex="0"`, all others have `tabindex="-1"`. On first render, the first non-disabled visible item becomes the tab stop. The tree's `MutationObserver` re-runs the init for late-arriving items (async loading).

### Internal render structure (`<dui-tree-item>`)

```
[part="root"]                      ← role="treeitem", data-level, data-branch|data-leaf, etc.
                                     Wraps both content AND group — DO NOT style :hover here.
  [part="content"]                  ← display: flex; align-items: center
    [part="indicator"]              ← ALWAYS rendered (data-branch | data-leaf | data-loading).
                                     For branches, click toggles expand. For leaves, click bubbles
                                     to row handler. Width is consumer's choice (always reserved
                                     so leaf and branch labels align at the same level).
    <slot name="label">            ← label content
    <span style="flex: 1"></span>  ← spacer pushes end slot right
    <slot name="end">              ← trailing content (icons, badges)
  [part="group"]                    ← role="group" (branches only), hidden when collapsed
    <slot>                          ← child <dui-tree-item> elements
```

### CSS custom properties

| Property | Default | Description |
|----------|---------|-------------|
| `--dui-tree-level` | (set per item) | The 1-based nesting depth of the item. Set automatically by the primitive on each `<dui-tree-item>`. Use for indentation, font-size, or any level-dependent styling. |

The primitive **does not apply indentation**. Consumers control it on `[part="content"]` (NOT `[part="root"]`, which contains the children group):

```css
dui-tree-item::part(content) {
  padding-inline-start: calc((var(--dui-tree-level) - 1) * 22px);
}
```

### Structural CSS (primitive provides)

- `:host` → `display: block`
- `[part="root"]` → no aesthetic styles, just `outline: none` for focus management
- `[part="content"]` → `display: flex; align-items: center` (layout for indicator + label + end)
- `[part="group"]` → `display: none` when collapsed (via `[hidden]`)
- `[part="indicator"]` → `display: inline-flex` for centering, no aesthetic sizing
- **No indentation** — consumer uses `--dui-tree-level` to apply their own

### Recommended consumer styling pattern

```css
/* 1. Indent the row, NOT the host. (level - 1) gives 0 for top-level. */
dui-tree-item::part(content) {
  padding-block: 4px;
  padding-inline-start: calc(8px + (var(--dui-tree-level) - 1) * 22px);
  padding-inline-end: 8px;
  border-radius: 6px;
  cursor: pointer;
  gap: 6px;
}

/* 2. Reserve indicator space for ALL items so labels align at the same level. */
dui-tree-item::part(indicator) {
  width: 16px;
  height: 16px;
}

/* 3. Add chevron content via [data-branch] on the host. */
dui-tree-item[data-branch]::part(indicator)::before {
  content: "▸";
  transition: transform 200ms ease;
}
dui-tree-item[data-expanded]::part(indicator)::before {
  transform: rotate(90deg);
}

/* 4. Style ::part(content) for hover and selection — NOT ::part(root).
      [part="root"] contains the children group; styling :hover on it would
      bleed the highlight onto every descendant row. */
dui-tree-item::part(content):hover         { background: #f3f4f6; }
dui-tree-item[data-selected]::part(content){ background: #dbeafe; }
dui-tree-item[data-disabled]::part(content){ opacity: 0.45; cursor: not-allowed; }
dui-tree-item[data-focus]::part(content)   { outline: 2px solid #3b82f6; outline-offset: -2px; }
```

> **Browser support note:** `::part(name)::before` requires Chrome 90+, Safari 16.4+, Firefox 128+ (July 2024). For older Firefox, use a `mask-image` or `background-image` SVG on `::part(indicator)` instead.

---

## Phase 2 — Enhancements (future)

These features are **not in v1** but the architecture should not preclude them.

### Drag and drop

**Goal:** Reorder items within a tree, move items between branches, drop external items into a tree.

**Plan:**
- Use the platform [Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API).
- Add a `draggable` boolean property to `<dui-tree-item>` (default `false`).
- Tree dispatches `dui-drag-start`, `dui-drag-over`, `dui-drop` events with payload `{ source: TreeItem, target: TreeItem, position: "before" | "after" | "inside" }`.
- Consumer is responsible for the actual reorder/move (mutates the data → re-renders → tree updates).
- `[part="indicator"]` reused or new `[part="drop-indicator"]` part for visual drop targets.
- Position is computed from cursor Y relative to the target row (top third = `before`, middle = `inside`, bottom third = `after`).
- Auto-scroll when dragging near top/bottom of a scrollable tree container.
- Auto-expand branches after a hover delay (~700ms).

**Open questions:**
- Should the primitive prevent invalid drops (e.g. dropping an ancestor onto its descendant)? Lean: yes, by default, with an opt-out.
- Multi-select drag (drag multiple selected items)? Yes if `selectionMode="multiple"` and the dragged item is selected.

### Virtualization

**Goal:** Handle trees with 10k+ nodes without rendering them all.

**Plan:**
- New `virtual` boolean attribute on `<dui-tree>`. When set, switches to a windowed render strategy.
- The data model shifts from "DOM-as-source-of-truth" to "data-as-source-of-truth": consumer provides items via a `data` property (array or async iterator), and the primitive renders only visible rows.
- Today's slot-based API becomes opt-out: `<dui-tree virtual .data=${tree}>` instead of declarative `<dui-tree-item>` children.
- Use a fixed row height (configurable via `--dui-tree-row-height`) for simplicity in v2.1; variable heights with measured rows in v2.2.
- Implementation: scroll listener + intersection observer, render-window of `bufferStart..bufferEnd` items.
- ARIA: `aria-setsize` and `aria-posinset` come from data, not DOM. `aria-rowcount` / `aria-rowindex` may be needed.
- Keyboard navigation operates on the data model, not the DOM.

**Open questions:**
- API for tree data: flat list with parent ids, or nested? Lean: nested (matches DOM mental model).
- How does it interact with async loading? Lazy expansion still works — `dui-load-children` fires when the windowed render reaches an unloaded branch.

### Async loading (DELIVERED in Phase 1)

`hasChildren` + `loading` properties on `<dui-tree-item>`, plus the `dui-load-children` event. See Phase 1 sections above.

### Checkbox selection (mixed/tri-state)
- Parent checkboxes show indeterminate state when only some children are selected.
- `selectionMode="checkbox"` with visible checkbox in each row (or via a new `[part="checkbox"]` slot).

### Inline editing
- Double-click or F2 to edit item labels in-place.
- `dui-rename` event with old/new values.

### Context menu
- Right-click or Shift+F10 to open a context menu on an item.
- Integration with `<dui-menu>`.

### Filtering / search
- Filter tree items by text, collapsing branches with no matching descendants.

---

## Implementation Notes

### Coordination model

Follows the same Lit Context pattern as Accordion:

- `<dui-tree>` provides a `treeContext` with expanded/selected state + callbacks.
- `<dui-tree-item>` consumes context, calls `ctx.toggleExpand(value)`, `ctx.activate(value, isBranch)`, etc.
- State lives in `<dui-tree>`, items are stateless renderers.

### Click bubbling between nested items

Nested tree-items are slotted into ancestor items' shadow DOM. A click on a child's `[part="root"]` bubbles through the slot composition into the ancestor's `[part="root"]` click handler. The item's row click handler calls `e.stopPropagation()` to prevent this. The indicator click handler does the same so expanding a branch doesn't also fire its row's `activate`.

### Disabled propagation

A `<dui-tree-item>` is effectively disabled if **any** of these are true:
- Own `disabled` attribute is set.
- The tree is `disabled`.
- Any ancestor `<dui-tree-item>` has `disabled` set.

The item walks up the DOM in `#isDisabled` to check ancestors. The parent tree uses a `MutationObserver` watching descendant `disabled` attribute changes to trigger a context rebuild, which re-renders all items so they re-evaluate.

### Nesting depth

`<dui-tree-item>` calculates its own level by walking up the DOM, counting `DUI-TREE-ITEM` ancestors and stopping at the `DUI-TREE` root.

### Visible items for keyboard navigation

`<dui-tree>` builds a flat list of currently visible treeitems via `querySelectorAll("dui-tree-item")` filtered by ancestor expanded state. Rebuilt on each keystroke (cheap for typical trees; revisit for virtualization).

### Branch detection

A `<dui-tree-item>` is a branch if:
- It has slotted `<dui-tree-item>` children (detected via `slotchange` on the default slot), OR
- The `has-children` attribute is set (for async loading).

The indicator part is **always rendered**, with `data-branch` / `data-leaf` differentiation. This keeps leaf and branch labels horizontally aligned at the same nesting level when the consumer reserves indicator width.

### State attribute reflection

State attributes (`data-expanded`, `data-selected`, `data-disabled`, `data-branch`, `data-leaf`, `data-focus`, `data-loading`, `data-level`) are reflected to **both `[part="root"]` AND the host element** in `updated()`. The host reflection enables the primary styling pattern:

```css
dui-tree-item[data-selected]::part(content) { ... }
```

CSS does not allow chaining `::part()` selectors (`::part(root)[data-selected]::part(content)` is invalid), so the host attribute is the only way to combine "this item is in state X" with "style this part of it".

---

## Usage Examples

### Basic file tree with status icons

```html
<dui-tree
  aria-label="Project files"
  selection-mode="single"
  default-expanded-values='["src"]'
>
  <dui-tree-item value="src">
    <span slot="label">📁 src</span>
    <span slot="end" class="badge">3 files</span>
    <dui-tree-item value="index.ts">
      <span slot="label">📄 index.ts</span>
      <span slot="end">✅</span>
    </dui-tree-item>
    <dui-tree-item value="utils">
      <span slot="label">📁 utils</span>
      <dui-tree-item value="helpers.ts">
        <span slot="label">📄 helpers.ts</span>
      </dui-tree-item>
    </dui-tree-item>
  </dui-tree-item>
  <dui-tree-item value="package.json">
    <span slot="label">📄 package.json</span>
  </dui-tree-item>
</dui-tree>
```

### Async loading

```html
<dui-tree aria-label="Remote files">
  <dui-tree-item value="remote-root" has-children>
    <span slot="label">📁 remote/</span>
  </dui-tree-item>
</dui-tree>

<script>
  const tree = document.querySelector("dui-tree");
  tree.addEventListener("dui-load-children", async (e) => {
    const item = e.target;
    item.loading = true;
    const children = await fetch(`/api/tree/${e.detail.value}`).then(r => r.json());
    for (const c of children) {
      const el = document.createElement("dui-tree-item");
      el.value = c.id;
      if (c.hasChildren) el.hasChildren = true;
      el.innerHTML = `<span slot="label">${c.label}</span>`;
      item.appendChild(el);
    }
    item.loading = false;
  });
</script>
```

### Controlled mode

```html
<dui-tree id="t" selection-mode="single">
  <dui-tree-item value="a">
    <span slot="label">A</span>
    <dui-tree-item value="a-1"><span slot="label">A.1</span></dui-tree-item>
  </dui-tree-item>
</dui-tree>

<script>
  const tree = document.getElementById("t");
  tree.expandedValues = ["a"];
  tree.selectedValues = ["a-1"];

  tree.addEventListener("dui-expanded-change", e => tree.expandedValues = e.detail.values);
  tree.addEventListener("dui-selection-change", e => tree.selectedValues = e.detail.values);
</script>
```
