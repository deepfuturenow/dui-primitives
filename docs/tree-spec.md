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
| `<dui-tree-item>` | `treeitem` | A node in the tree. Can be a leaf (no children) or a branch (has `<dui-tree-item>` children). |

Branch vs. leaf is determined automatically: if a `<dui-tree-item>` contains other `<dui-tree-item>` elements, it's a branch.

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

### `<dui-tree-item>` Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `value` | `value` | `string` | *required* | Unique identifier for this item. |
| `disabled` | `disabled` | `boolean` | `false` | Disables this item (and its descendants). |

### Events

| Event | Detail | Fired on | Description |
|-------|--------|----------|-------------|
| `dui-expanded-change` | `{ values: string[] }` | `<dui-tree>` | Branches expanded or collapsed. |
| `dui-selection-change` | `{ values: string[] }` | `<dui-tree>` | Selection changed. |
| `dui-action` | `{ value: string }` | `<dui-tree>` | User activated a leaf item (Enter/click on non-selectable tree). |

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
| `<dui-tree>` | `root` | The tree container (`role="tree"`) |
| `<dui-tree-item>` | `root` | The treeitem row |
| `<dui-tree-item>` | `content` | Row layout container — `display: flex; align-items: center`. Contains indicator, label slot, and end slot. |
| `<dui-tree-item>` | `indicator` | Expand/collapse chevron (branches only) |
| `<dui-tree-item>` | `group` | The child group container (`role="group"`) |

### Data Attributes (on `part="root"`)

| Attribute | When present |
|-----------|-------------|
| `data-expanded` | Branch is expanded |
| `data-selected` | Item is selected |
| `data-disabled` | Item is disabled |
| `data-branch` | Item has children (is a branch) |
| `data-leaf` | Item has no children (is a leaf) |
| `data-level` | Nesting depth (1-based). e.g. `data-level="2"` |
| `data-focus` | Item has keyboard focus |

### ARIA Mapping (per W3C APG)

| Element | ARIA | Source |
|---------|------|--------|
| `<dui-tree>` root | `role="tree"` | Static |
| `<dui-tree>` root | `aria-label` or `aria-labelledby` | Consumer provides via attribute |
| `<dui-tree>` root | `aria-multiselectable="true"` | When `selectionMode="multiple"` |
| `<dui-tree-item>` root | `role="treeitem"` | Static |
| `<dui-tree-item>` root | `aria-expanded="true/false"` | Branches only; reflects expanded state |
| `<dui-tree-item>` root | `aria-selected="true/false"` | When `selectionMode !== "none"` |
| `<dui-tree-item>` root | `aria-disabled="true"` | When disabled |
| `<dui-tree-item>` root | `aria-level` | Nesting depth (1-based) |
| `<dui-tree-item>` root | `aria-setsize` | Number of siblings at this level |
| `<dui-tree-item>` root | `aria-posinset` | Position among siblings (1-based) |
| `<dui-tree-item>` group | `role="group"` | Container for child treeitems |

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

Focus management uses **roving tabindex**: one treeitem has `tabindex="0"`, all others have `tabindex="-1"`.

### Internal render structure (`<dui-tree-item>`)

```
[part="root"]                      ← role="treeitem", data-level, data-branch|data-leaf, etc.
  [part="content"]                  ← display: flex; align-items: center
    [part="indicator"]              ← chevron (branches only)
    <slot name="label">            ← label content
    <span style="flex: 1"></span>  ← spacer pushes end slot right
    <slot name="end">              ← trailing content (icons, badges)
  [part="group"]                    ← role="group", hidden when collapsed
    <slot>                          ← child <dui-tree-item> elements
```

### CSS custom properties

| Property | Default | Description |
|----------|---------|-------------|
| `--dui-tree-level` | (set per item) | The 1-based nesting depth of the item. Set automatically by the primitive on each `<dui-tree-item>`. Use for indentation, font-size, or any level-dependent styling. |

The primitive **does not apply indentation**. Consumers control it:

```css
/* Indent via padding */
dui-tree-item::part(content) {
  padding-inline-start: calc(var(--dui-tree-level) * 1.5rem);
}

/* Or use a different amount */
dui-tree-item::part(content) {
  padding-inline-start: calc(var(--dui-tree-level) * 24px);
}

/* Or no indentation at all */
```

### Structural CSS (primitive provides)

- `:host` → `display: block`
- `[part="root"]` → `role="tree"` container, no aesthetic styles
- `[part="content"]` → `display: flex; align-items: center` (layout for indicator + label + end)
- `[part="group"]` → `display: none` when collapsed, `display: block` when expanded
- `[part="indicator"]` → no aesthetic styles (consumer styles the chevron)
- **No indentation** — consumer uses `--dui-tree-level` to apply their own

---

## Phase 2 — Enhancements (future)

These features are **not in v1** but the architecture should not preclude them.

### Async loading
- `loading` property on `<dui-tree-item>` to show a spinner while children load
- `dui-load-children` event fired when a branch is first expanded and has no children
- Consumers handle the event, fetch data, and append `<dui-tree-item>` elements

### Drag and drop
- Reordering items within the tree
- Moving items between branches
- Drop indicators (before, after, inside)
- Integration with the platform Drag and Drop API

### Virtualization
- Only render visible items for large trees (1000+ nodes)
- Requires measuring row heights and managing a scroll viewport

### Checkbox selection (mixed/tri-state)
- Parent checkboxes show indeterminate state when only some children are selected
- `selectionMode="checkbox"` with visible checkbox in each row

### Inline editing
- Double-click or F2 to edit item labels in-place
- `dui-rename` event with old/new values

### Context menu
- Right-click or Shift+F10 to open a context menu on an item
- Integration with `<dui-menu>`

### Filtering / search
- Filter tree items by text, collapsing branches with no matching descendants

---

## Implementation Notes

### Coordination model

Follows the same Lit Context pattern as Accordion:

- `<dui-tree>` provides a `treeContext` with expanded/selected state + callbacks
- `<dui-tree-item>` consumes context, calls `ctx.toggle(value)`, `ctx.select(value)`, etc.
- State lives in `<dui-tree>`, items are stateless renderers

### Nesting depth

`<dui-tree-item>` calculates its own level by walking up the DOM:

```ts
get #level(): number {
  let level = 1;
  let el = this.parentElement;
  while (el) {
    if (el instanceof DuiTreeItemPrimitive) level++;
    if (el instanceof DuiTreePrimitive) break;
    el = el.parentElement;
  }
  return level;
}
```

### Visible items for keyboard navigation

`<dui-tree>` builds a flat list of currently visible treeitems (expanded branches contribute their children to the list). This list is rebuilt when expanded state changes and is used for arrow key navigation.

### Branch detection

A `<dui-tree-item>` is a branch if it contains slotted `<dui-tree-item>` children. Detected via `slotchange` event on the default slot. This determines whether to render `[part="indicator"]` and set `aria-expanded`.

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
        <span slot="end">⚠️</span>
      </dui-tree-item>
    </dui-tree-item>
  </dui-tree-item>
  <dui-tree-item value="package.json">
    <span slot="label">📄 package.json</span>
  </dui-tree-item>
  <dui-tree-item value="README.md">
    <span slot="label">📄 README.md</span>
  </dui-tree-item>
</dui-tree>
```

### Styling (indentation + aesthetics)

```css
/* Indentation — consumer controls via --dui-tree-level */
dui-tree-item::part(content) {
  padding-inline-start: calc(var(--dui-tree-level) * 1.5rem);
}

/* Row aesthetics */
dui-tree-item::part(root) {
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
}

dui-tree-item::part(root):hover {
  background: #f3f4f6;
}

dui-tree-item::part(root)[data-selected] {
  background: #dbeafe;
}

dui-tree-item::part(root)[data-disabled] {
  opacity: 0.5;
  cursor: default;
}

/* Chevron rotation */
dui-tree-item::part(indicator) {
  transition: transform 200ms ease;
}

dui-tree-item::part(root)[data-expanded] dui-tree-item::part(indicator) {
  transform: rotate(90deg);
}
```
