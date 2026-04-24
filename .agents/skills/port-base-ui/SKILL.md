---
name: port-base-ui
description: Port a Base UI React component into a DUI primitive. Use when the user asks to convert, port, or rewrite a Base UI component, or wants a DUI version of a Base UI component. Triggers include "port base-ui", "Base UI to DUI", "convert Base UI", or any request pairing Base UI with DUI/Lit.
---

# Base UI → DUI Primitive Port

Port a Base UI (`@base-ui/react`) component into a DUI primitive — unstyled, accessible, structural and behavioral only.

## Overview

Base UI is an unstyled React component library with composable "parts" (e.g. `Switch.Root`, `Switch.Thumb`). Porting to DUI primitives means:

1. React parts → single Lit `LitElement` class (simple) or Lit Context compound (complex)
2. CSS Modules demo → extract **structural CSS only** (layout, positioning, overflow)
3. `data-*` attributes → preserved on internal elements as the styling API for consumers
4. No `@customElement` — consumers register manually via `customElements.define()`

Since DUI primitives are unstyled, **all aesthetic CSS from Base UI is discarded**. We extract only the structural and behavioral patterns.

## References

- An existing primitive for reference (e.g., `packages/primitives/src/button/button.ts`, `packages/primitives/src/switch/switch.ts`)
- For compound primitives: `packages/primitives/src/accordion/` (Lit Context pattern)

---

## Step 1 — Fetch the Base UI docs

Fetch the component documentation before writing code:

```
https://base-ui.com/react/components/{component}.md
```

Also fetch if needed:
- `https://base-ui.com/llms.txt` — component index
- `https://base-ui.com/react/handbook/styling.md`
- `https://base-ui.com/react/handbook/animation.md`

Extract:
1. **Anatomy** — composable parts (Root, Trigger, Panel, Thumb, etc.)
2. **Props per part** — public props, callback props
3. **Data attributes** — `data-checked`, `data-disabled`, `data-open`, etc.
4. **CSS variables** — `--accordion-panel-height`, etc.
5. **Accessibility** — ARIA roles, keyboard interactions

---

## Step 2 — Extract structural CSS

From Base UI's CSS Modules demo, extract **only structural properties**:

| Keep (structural) | Discard (aesthetic) |
|-------------------|---------------------|
| `display`, `position` | `color`, `background` |
| `align-items`, `justify-content` | `padding`, `margin`, `gap` |
| `box-sizing` | `border`, `border-radius` |
| `cursor`, `user-select` | `font-*`, `letter-spacing` |
| `overflow` | `box-shadow` |
| `-webkit-tap-highlight-color` | `transition` (duration, timing) |
| `appearance: none` | `opacity` (for visual states) |
| `transition-property` (list only) | All color/spacing values |

The primitive provides behavior and structure. Consumers add all visual styling via `::part()` and CSS custom properties.

---

## Step 3 — Map Base UI patterns to DUI

### Data attributes on internal elements

Base UI uses `data-*` attributes for CSS targeting. **Preserve these** — they are the consumer's styling API:

```typescript
override render(): TemplateResult {
  return html`
    <span
      part="root"
      role="switch"
      aria-checked=${this.#checked}
      ?data-checked=${this.#checked}
      ?data-unchecked=${!this.#checked}
      ?data-disabled=${this.#isDisabled}
      tabindex="${isDisabled ? nothing : "0"}"
      @click=${this.#handleClick}
      @keydown=${this.#handleKeyDown}
    >
      <span
        part="thumb"
        ?data-checked=${this.#checked}
        ?data-unchecked=${!this.#checked}
      ></span>
    </span>
  `;
}
```

Consumers style these in their own CSS:

```css
dui-switch::part(root)[data-checked] {
  background: var(--brand-color);
}
```

### Reflected properties

Expose properties as reflected attributes where they affect visual state:

```typescript
@property({ type: Boolean, reflect: true })
accessor disabled = false;
```

Do NOT add variant/appearance/size properties — those are a design-system concern, not a primitive concern. Only reflect properties that affect behavior or accessibility.

### React → Lit mapping

| React | Lit |
|-------|-----|
| `useState(x)` | `@state() accessor #x` |
| `useRef()` | `@query() accessor #el` |
| `useEffect(fn, [])` | `protected override firstUpdated()` |
| `useEffect(fn, [dep])` | `protected override updated(changed)` |
| `useEffect` cleanup | `override disconnectedCallback()` |
| `useContext` | `@consume({ context, subscribe: true })` |
| `forwardRef` | Not needed — element IS the ref |
| `className` | `class` in template |
| `onClick` | `@click` in template |
| `children` | `<slot></slot>` |
| `{condition && <X/>}` | `${condition ? html\`<x></x>\` : nothing}` |
| `onCheckedChange` | `customEvent("checked-change", ...)` |
| `onValueChange` | `customEvent("value-change", ...)` |
| `<Component.Portal>` | Not needed in shadow DOM (or use floating portal) |

### Controlled/uncontrolled

Support both patterns. Provide `defaultChecked` for initial value and `checked` for controlled:

```typescript
@property({ type: Boolean, reflect: true })
accessor checked: boolean | undefined = undefined;

@property({ type: Boolean, attribute: "default-checked" })
accessor defaultChecked = false;

@state() accessor #internalChecked = false;

get #checked(): boolean {
  return this.checked ?? this.#internalChecked;
}
```

---

## Step 4 — Compound primitives

For multi-part Base UI components (Accordion, Tabs, Menu), decide the coordination pattern:

| Children need... | Pattern | Example |
|------------------|---------|---------|
| Simple data only | **Data-driven** — `.items` property, rendered in shadow DOM | Select options |
| Open-ended HTML | **Lit Context** — light DOM children, context coordination | Accordion items |

### Lit Context pattern

```typescript
// {name}-context.ts
import { createContext } from "@lit/context";

export type {Name}Context = {
  readonly openValues: string[];
  readonly disabled: boolean;
  readonly toggle: (value: string) => void;
};

export const {name}Context = createContext<{Name}Context>("dui-{name}");
```

Parent provides via `@provide`, children consume via `@consume` with `subscribe: true`.

**Key principles:**
- No imperative coordination — no `querySelectorAll`, no `this.closest()`
- Immutable context updates — spread, never mutate
- Actions via context callbacks — children call `ctx.toggle()` directly
- Public events still dispatched for consumers

---

## Step 5 — Animation

Base UI uses `data-starting-style` and `data-ending-style` for enter/exit animations. Preserve these on internal elements:

```typescript
@state() accessor #starting = false;
@state() accessor #ending = false;

async #animateOpen(): Promise<void> {
  this.#starting = true;
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  this.#starting = false;
}

#animateClose(): void {
  this.#ending = true;
  const el = this.shadowRoot?.querySelector("[part='panel']");
  el?.addEventListener("transitionend", () => {
    this.#ending = false;
    this.#open = false;
  }, { once: true });
}
```

Thread to internal elements:

```typescript
<div part="panel"
  ?data-starting-style=${this.#starting}
  ?data-ending-style=${this.#ending}>
```

Consumers write their own transition CSS targeting these attributes.

---

## Step 6 — Accessibility

### Focus management

- **Components wrapping native `<button>`:** Use `delegatesFocus`:
  ```typescript
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  ```
- **Non-native focusable elements** (e.g., `<span role="switch">`): Add `tabindex="0"` and remove when disabled:
  ```typescript
  tabindex="${isDisabled ? nothing : "0"}"
  ```

### Conditional ARIA attributes

Use Lit's `nothing` sentinel — don't render `aria-disabled="false"`:

```typescript
aria-disabled="${this.disabled ? "true" : nothing}"
```

### Form participation

For controls that participate in native `<form>` submission (switch, checkbox, slider, etc.), use `ElementInternals`:

```typescript
static formAssociated = true;

#internals!: ElementInternals;

constructor() {
  super();
  this.#internals = this.attachInternals();
}
```

---

## Step 7 — Create the files

Use the `/create-primitive` skill's file structure. Create:

1. **Primitive class** — `packages/primitives/src/{name}/{name}.ts` (structural CSS only)
2. **Index** — `packages/primitives/src/{name}/index.ts` (re-exports)
3. **Context** — `packages/primitives/src/{name}/{name}-context.ts` (if compound)
4. **Config update** — `packages/primitives/deno.json`

Add a provenance comment at the top:

```typescript
/** Ported from Base UI: https://base-ui.com/react/components/{component} */
```

---

## Step 8 — Add to docs, verify

Use `/edit-docs` to wire into the docs site. Run `deno check` from the repo root.

---

## Validation checklist

### Component structure
- [ ] Provenance comment: `/** Ported from Base UI: ... */`
- [ ] Class name uses `Primitive` suffix (`Dui{Name}Primitive`)
- [ ] Extends `LitElement` — not a custom base class
- [ ] `static tagName` with `as const` — no `@customElement`
- [ ] `static override styles = [base, styles]`
- [ ] `part="root"` on root element, other `part` attributes match Base UI anatomy
- [ ] **Structural CSS only** — no colors, fonts, spacing, border-radius, shadows
- [ ] Only behavioral properties reflected (`disabled`, `checked`, `open`) — no `variant`/`size`/`appearance`
- [ ] All decorated properties use `accessor` keyword
- [ ] All internal state uses `@state() accessor #name` (native private)
- [ ] All private methods use `#private` syntax
- [ ] All lifecycle overrides use the `override` keyword
- [ ] Events use `customEvent()` factory with `bubbles: true, composed: true`
- [ ] JSDoc with `@slot`, `@csspart`, `@fires` as needed

### Data attributes & styling API
- [ ] `data-*` attributes on internal elements match Base UI originals
- [ ] Consumers can style all visual aspects via `::part()` + data attributes
- [ ] No aesthetic opinions baked in — no hover colors, focus rings, disabled opacity

### Accessibility
- [ ] ARIA attributes correct (role, aria-checked, aria-expanded, etc.)
- [ ] `nothing` sentinel used for conditional ARIA attributes
- [ ] `delegatesFocus` set when wrapping native `<button>`
- [ ] `tabindex` managed for non-native focusable elements (removed when disabled)
- [ ] Form participation via `ElementInternals` for form controls
- [ ] Keyboard interactions match Base UI docs

### Behavior
- [ ] Controlled/uncontrolled patterns supported where applicable
- [ ] Animation uses `data-starting-style` / `data-ending-style` on internal elements
- [ ] Compound primitives use Lit Context (not imperative coordination)
- [ ] Context updates are immutable (spread, not mutation)

### Wiring
- [ ] `index.ts` re-exports all classes
- [ ] `deno.json` export added
- [ ] Registered in `packages/docs/src/register-primitives.ts`
- [ ] `deno check` passes
