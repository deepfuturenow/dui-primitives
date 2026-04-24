# Accessibility

ARIA patterns, keyboard interactions, and focus management conventions used across dui components.

---

## ARIA by component type

| Component type | Role | Key ARIA attributes |
|----------------|------|---------------------|
| Button | implicit (native `<button>`) | `aria-disabled` |
| Switch | `role="switch"` | `aria-checked`, `aria-disabled`, `aria-readonly`, `aria-required`, `aria-invalid` |
| Checkbox | `role="checkbox"` | `aria-checked` (supports `"mixed"`), `aria-disabled`, `aria-required` |
| Dialog | `role="dialog"` | `aria-modal`, `aria-labelledby`, `aria-describedby` |
| Alert dialog | `role="alertdialog"` | `aria-modal`, `aria-labelledby`, `aria-describedby` |
| Menu | `role="menu"` on container | `aria-expanded` on trigger, `role="menuitem"` on items |
| Tabs | `role="tablist"` on container | `role="tab"` on tabs, `role="tabpanel"` on panels, `aria-selected` |
| Accordion | implicit | `aria-expanded` on triggers, `aria-controls` linking trigger → panel |

Use Lit's `nothing` sentinel for conditional ARIA attributes — don't render `aria-disabled="false"`:

```typescript
aria-disabled="${this.disabled ? "true" : nothing}"
```

---

## Keyboard interactions

| Component type | Keys | Behavior |
|----------------|------|----------|
| Button | `Enter`, `Space` | Activate (native `<button>` handles this) |
| Switch | `Space`, `Enter` | Toggle checked state |
| Checkbox | `Space` | Toggle checked state |
| Dialog | `Escape` | Close dialog |
| Menu | `Enter`/`Space` open, `Arrow` navigate, `Escape` close | Standard menu keyboard pattern |
| Tabs | `Arrow Left`/`Right` navigate, `Enter`/`Space` select | Horizontal tab navigation |
| Accordion | `Enter`/`Space` toggle, `Arrow` navigate between headers | Vertical accordion navigation |

Handle keyboard events on the focusable element with `@keydown`:

```typescript
// From DuiSwitch
#handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    this.#handleClick();
  }
};
```

Always call `e.preventDefault()` to suppress default browser behavior (e.g., Space scrolling the page).

---

## Focus management

### `delegatesFocus`

For components that wrap a native focusable element (like `<button>`), use `delegatesFocus` so that focusing the host automatically delegates to the internal element:

```typescript
// From DuiButton
static override shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true,
};
```

This means clicking the host or calling `.focus()` on it focuses the inner `<button>`.

### `tabindex` on non-native elements

When the root element is a non-focusable element like `<span>` (e.g., DuiSwitch), add `tabindex="0"` to make it keyboard-focusable. Remove it when disabled:

```typescript
// From DuiSwitch
tabindex="${isDisabled ? nothing : "0"}"
```

### Focus trapping for modals

Dialogs and alert dialogs should trap focus within the overlay while open. When the dialog opens, move focus to the first focusable element (or the dialog itself). When it closes, return focus to the element that triggered it.

---

## Disabled patterns

Two approaches, depending on whether the component should remain focusable:

### Native `disabled` (default)

Uses the native `disabled` attribute. The element is removed from tab order and cannot be activated:

```typescript
// From DuiButton — standard disabled
<button
  ?disabled="${this.disabled && !this.focusableWhenDisabled}"
  aria-disabled="${ariaDisabled || nothing}"
>
```

### `aria-disabled` + `focusableWhenDisabled`

Keeps the element in the tab order (for discoverability by screen readers) but prevents activation. Use when disabled buttons need to remain focusable — for example, to show a tooltip explaining why the action is unavailable:

```typescript
// From DuiButton — focusable when disabled
@property({ type: Boolean, attribute: "focusable-when-disabled" })
accessor focusableWhenDisabled = false;

// In render:
const ariaDisabled = this.disabled && this.focusableWhenDisabled;

<button
  ?disabled="${this.disabled && !this.focusableWhenDisabled}"
  aria-disabled="${ariaDisabled || nothing}"
  @click="${this.#handleClick}"
>

// Click handler prevents activation:
#handleClick = (e: MouseEvent): void => {
  if (this.disabled) {
    e.preventDefault();
    e.stopPropagation();
  }
};
```

### Disabled via FieldContext

Form controls inherit `disabled` from their parent `<dui-field>` through `FieldContext`:

```typescript
get #isDisabled(): boolean {
  return this.disabled || (this.#fieldCtx?.disabled ?? false);
}
```

---

## FieldContext integration

`FieldContext` (defined in `packages/components/src/field/field-context.ts`) provides accessible labeling and state to form controls. The parent `<dui-field>` provides the context; child controls consume it.

### Context shape

```typescript
type FieldContext = {
  readonly fieldId: string;
  readonly labelId: string;       // for aria-labelledby
  readonly controlId: string;     // id to set on the control element
  readonly descriptionId: string; // for aria-describedby
  readonly errorId: string;       // for aria-describedby (error state)
  readonly disabled: boolean;     // propagates to controls
  readonly invalid: boolean;      // propagates to controls
  readonly dirty: boolean;
  readonly touched: boolean;
  readonly filled: boolean;
  readonly focused: boolean;
  readonly markTouched: () => void;
  readonly markDirty: () => void;
  readonly setFocused: (focused: boolean) => void;
  readonly setFilled: (filled: boolean) => void;
};
```

### Consuming in a control

```typescript
import { consume } from "@lit/context";
import { type FieldContext, fieldContext } from "../field/field-context.ts";

@consume({ context: fieldContext, subscribe: true })
@state()
accessor #fieldCtx!: FieldContext;
```

Use definite assignment (`!`), not `| undefined`. Access with optional chaining: `this.#fieldCtx?.disabled`.

### Wiring IDs into ARIA attributes

The control sets `id` from `controlId` so the label's `for` attribute connects. Description and error IDs wire into `aria-describedby`:

```typescript
// From DuiSwitch — setting the control ID
id="${controlId || nothing}"
aria-invalid="${isInvalid ? "true" : nothing}"
```

### State propagation

Controls read `disabled` and `invalid` from the context and merge with their own props. They report state changes back via context callbacks:

```typescript
// Read state
get #isDisabled(): boolean {
  return this.disabled || (this.#fieldCtx?.disabled ?? false);
}

// Report interactions
this.#fieldCtx?.markDirty();
this.#fieldCtx?.markTouched();
```

---

## Hidden form inputs

For custom controls that need to participate in native `<form>` submission (e.g., switch, checkbox), render a hidden `<input>` inside shadow DOM:

```typescript
// From DuiSwitch
<input
  type="checkbox"
  name="${this.name ?? nothing}"
  value="${isChecked ? this.value : this.uncheckedValue}"
  .checked="${isChecked}"
  ?disabled="${isDisabled}"
  ?required="${this.required}"
  class="HiddenInput"
  aria-hidden="true"
  tabindex="-1"
/>
```

The hidden input is visually invisible (`opacity: 0`, `position: absolute`, zero dimensions) but participates in form data. Key points:

- `aria-hidden="true"` — screen readers should ignore the hidden input and interact with the custom control instead
- `tabindex="-1"` — prevents the hidden input from receiving focus
- `.checked` — uses Lit's property binding to sync checked state
- `name` — only set when provided, so unnamed controls don't pollute form data

---

## See also

- [Creating Components](./creating-components.md) — component conventions including event and lifecycle patterns
- [Porting Guide](./porting.md) — how to port from ShadCN/Base UI, including React → Lit mapping
