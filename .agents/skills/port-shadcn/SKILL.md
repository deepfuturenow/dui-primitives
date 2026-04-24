---
name: port-shadcn
description: Port a ShadCN/ui component into a DUI primitive. Use when the user asks to convert, port, or rewrite a ShadCN component, or wants a DUI version of a ShadCN component. Triggers include "port shadcn", "ShadCN to DUI", "convert ShadCN", or any request pairing ShadCN with DUI/Lit.
---

# ShadCN → DUI Primitive Port

Port a ShadCN/ui React component into a DUI primitive — unstyled, accessible, structural and behavioral only.

## Overview

ShadCN/ui components are React components styled with Tailwind CSS and built on Radix UI primitives. Porting to DUI primitives means:

1. React → Lit (class-based web component)
2. **Discard all Tailwind/aesthetic CSS** — primitives are unstyled
3. Extract structural CSS only (display, position, overflow, cursor)
4. `cva()` variants → reflected attributes (no styling logic)
5. No `@customElement` — consumers register manually via `customElements.define()`

Since DUI primitives are unstyled, the ShadCN Tailwind classes are used only as a reference for understanding the component's structure — not translated into tokens.

---

## Step 1 — Fetch the ShadCN source

Fetch the component docs page before writing any code:

```
https://ui.shadcn.com/docs/components/{component}
```

Extract:
- The React source code
- Which Radix primitives are used (if any) — these inform the behavioral patterns
- `cva()` variant definitions — to understand what properties consumers will need
- The component's anatomy and composition pattern

---

## Step 2 — Analyze the component

From the source, identify:

1. **Props** → become `@property({ reflect: true }) accessor` (only behavioral ones: `disabled`, `checked`, `open`, etc.)
2. **Composition** — single element or compound? (Radix `Root` + `Trigger` + `Content` → Lit Context)
3. **Accessibility** — ARIA roles, keyboard interactions from Radix
4. **Data attributes** — what state is reflected for CSS targeting

**Do NOT port:** variant/size/appearance props. Those are a design-system concern. The primitive only exposes behavioral properties. Consumers who build a design system on top will add their own variant system.

---

## Step 3 — Extract structural CSS

From the ShadCN Tailwind classes, identify only structural patterns:

### Keep (structural)

| Tailwind class | Structural CSS |
|---------------|---------------|
| `flex`, `inline-flex` | `display: flex` / `inline-flex` |
| `items-center` | `align-items: center` |
| `justify-center` | `justify-content: center` |
| `relative`, `absolute`, `fixed` | `position: ...` |
| `overflow-hidden` | `overflow: hidden` |
| `cursor-pointer` | `cursor: pointer` |
| `select-none` | `user-select: none` |
| `appearance-none` | `appearance: none` |
| `whitespace-nowrap` | `white-space: nowrap` |
| `shrink-0` | `flex-shrink: 0` |

### Discard (aesthetic — consumer's responsibility)

All of these: `bg-*`, `text-*`, `border-*`, `rounded-*`, `shadow-*`, `p-*`, `m-*`, `gap-*`, `h-*`, `w-*`, `font-*`, `text-sm`, `tracking-*`, `leading-*`, `ring-*`, `transition-*`, `duration-*`, `opacity-*`.

---

## Step 4 — React → Lit translation

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

---

## Step 5 — Data attributes for consumer styling

Expose component state via data attributes on internal elements. This is the styling API consumers use:

```typescript
override render(): TemplateResult {
  return html`
    <button
      part="root"
      ?data-checked=${this.#checked}
      ?data-unchecked=${!this.#checked}
      ?data-disabled=${this.disabled}
      ?data-open=${this.#open}
    >
      <slot></slot>
    </button>
  `;
}
```

Consumers write their own variant CSS:

```css
/* Consumer adds their own design system */
my-switch::part(root) {
  width: 44px; height: 24px;
  border-radius: 12px;
  background: #ddd;
}
my-switch::part(root)[data-checked] {
  background: var(--brand);
}
```

---

## Step 6 — Compound primitives

For ShadCN components built on Radix composable parts (Dialog, Accordion, Popover, etc.), use Lit Context:

```typescript
// {name}-context.ts
import { createContext } from "@lit/context";

export interface {Name}Context {
  readonly open: boolean;
  readonly toggle: () => void;
}

export const {name}Context = createContext<{Name}Context>("dui-{name}");
```

Map Radix parts to DUI primitives:

| Radix | DUI Primitive |
|-------|--------------|
| `{Name}.Root` | `Dui{Name}Primitive` (provides context) |
| `{Name}.Trigger` | `Dui{Name}TriggerPrimitive` (consumes context) |
| `{Name}.Content` / `{Name}.Portal` | `Dui{Name}PopupPrimitive` (consumes context, floating UI) |
| `{Name}.Close` | `Dui{Name}ClosePrimitive` (consumes context) |

---

## Step 7 — Accessibility

### Focus management

- **Wrapping native `<button>`:** Use `delegatesFocus`:
  ```typescript
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  ```
- **Non-native focusable elements:** Add `tabindex="0"`, remove when disabled.

### Conditional ARIA

Use Lit's `nothing` sentinel:

```typescript
aria-disabled="${this.disabled ? "true" : nothing}"
aria-expanded="${this.#open ? "true" : "false"}"
```

### Form participation

For form controls, use `ElementInternals`:

```typescript
static formAssociated = true;
#internals!: ElementInternals;

constructor() {
  super();
  this.#internals = this.attachInternals();
}
```

### Keyboard interactions

Port the keyboard patterns from ShadCN/Radix docs. Common patterns:
- **Toggle:** Space/Enter
- **Tabs:** Arrow keys to navigate, automatic/manual activation
- **Dialog:** Escape to close, focus trap
- **Menu:** Arrow keys to navigate, Enter to select, Escape to close
- **Accordion:** Arrow keys between headers, Enter/Space to toggle

---

## Step 8 — Create the files

Use the `/create-primitive` skill's file structure:

1. **Primitive class** — `packages/primitives/src/{name}/{name}.ts`
2. **Index** — `packages/primitives/src/{name}/index.ts`
3. **Context** — `packages/primitives/src/{name}/{name}-context.ts` (if compound)
4. **Config** — `packages/primitives/deno.json` export entry

Add provenance comment:

```typescript
/** Ported from ShadCN/ui: https://ui.shadcn.com/docs/components/{component} */
```

---

## Step 9 — Add to docs, verify

Use `/edit-docs` to wire into the docs site. Run `deno check` from the repo root.

---

## Validation checklist

- [ ] Provenance comment: `/** Ported from ShadCN/ui: ... */`
- [ ] Class name uses `Primitive` suffix (`Dui{Name}Primitive`)
- [ ] **Structural CSS only** — no Tailwind classes translated, no colors/spacing/fonts
- [ ] No `variant`/`size`/`appearance` properties — only behavioral props
- [ ] No React-isms — no `className`, no JSX, no hooks
- [ ] `static tagName` with `as const` — no `@customElement`
- [ ] `static override styles = [base, styles]`
- [ ] `part="root"` on root internal element + other parts matching anatomy
- [ ] Data attributes on internal elements for consumer CSS targeting
- [ ] Properties use `accessor` keyword
- [ ] Private methods use `#private` syntax
- [ ] Events use `customEvent()` factory
- [ ] Compound primitives use Lit Context (not imperative coordination)
- [ ] Keyboard interactions match ShadCN/Radix behavior
- [ ] ARIA attributes correct
- [ ] Form participation via `ElementInternals` where needed
- [ ] `index.ts` re-exports all classes
- [ ] `deno.json` export added
- [ ] Registered in `packages/docs/src/register-primitives.ts`
- [ ] `deno check` passes
