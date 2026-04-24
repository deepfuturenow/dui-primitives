---
name: create-primitive
description: Scaffold a new unstyled DUI primitive with all required files. Use when the user asks to add, create, or scaffold a new primitive, or says "create primitive", "new primitive", "create dui-foo", "add a primitive", etc.
---

# Add Primitive

Scaffold a new unstyled DUI primitive with all required files.

## Overview

Every new primitive requires files in `packages/primitives/` plus configuration updates. This skill generates the boilerplate and wires everything together.

Primitives are **structural and behavioral only** — no aesthetic CSS, no design tokens, no theme integration. Consumers extend primitives and add their own styles.

### Files created

```
packages/primitives/src/{name}/
  {name}.ts              # Primitive class + structural styles
  index.ts               # Re-exports class + types
```

### Files modified

- `packages/primitives/deno.json` — add export entry

---

## Steps

### Step 1 — Gather info

Determine from the user:

1. **Component name** — kebab-case (e.g., `badge`, `avatar`, `alert-dialog`)
2. **Display type** — `block` or `inline-block` (default: `inline-block` for small components, `block` for containers)
3. **Properties** — what configurable properties the primitive needs
4. **Root element tag** — `span`, `button`, `div`, etc.
5. **Slots** — what content projection points are needed
6. **Parts** — what CSS parts to expose for consumer styling
7. **Compound?** — single element or multi-part (parent + children via Lit Context)

If the user provides a reference (shadcn, Base UI), use the `/port-shadcn` or `/port-base-ui` skill instead.

### Step 2 — Read reference files

Before writing any code, read these existing files for patterns:

- `packages/primitives/src/button/button.ts` — simple single-element primitive
- `packages/primitives/src/button/index.ts` — index pattern
- `packages/primitives/src/accordion/accordion.ts` — compound primitive with Lit Context
- `packages/primitives/src/accordion/accordion-item.ts` — child that consumes context
- `packages/primitives/deno.json` — export map pattern

### Step 3 — Create the primitive class

Create `packages/primitives/src/{name}/{name}.ts`:

```typescript
import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";

/** Structural styles only — layout and behavioral CSS. */
const styles = css`
  :host {
    display: inline-block;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
  }
`;

/**
 * `<dui-{name}>` — {Description}.
 *
 * @slot - {Slot description}.
 * @csspart root - The {name} element.
 */
export class Dui{Name}Primitive extends LitElement {
  static tagName = "dui-{name}" as const;

  static override styles = [base, styles];

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  override render(): TemplateResult {
    return html`
      <{tag} part="root">
        <slot></slot>
      </{tag}>
    `;
  }
}
```

**Key rules:**
- Class name uses `Primitive` suffix: `Dui{Name}Primitive`
- `static tagName` with `as const` — NO `@customElement` decorator
- `static override styles = [base, styles]` — `base` from `@dui/core/base`
- **Structural CSS only** — no colors, fonts, spacing values, border-radius, shadows
- `part="root"` on root internal element — this is the consumer's styling surface
- All properties use `accessor` keyword
- All internal state uses `@state() accessor #name`
- All private methods use native `#private` syntax
- Events use `customEvent()` factory from `@dui/core/event`

### Step 4 — Create the index

Create `packages/primitives/src/{name}/index.ts`:

```typescript
import { Dui{Name}Primitive } from "./{name}.ts";
export { Dui{Name}Primitive };
```

For compound primitives, re-export all sub-components:

```typescript
import { Dui{Name}Primitive } from "./{name}.ts";
import { Dui{Name}ItemPrimitive } from "./{name}-item.ts";
export { Dui{Name}Primitive, Dui{Name}ItemPrimitive };
```

### Step 5 — Update configuration

**`packages/primitives/deno.json`** — add to exports:

```json
"./{name}": "./src/{name}/index.ts"
```

### Step 6 — Register in docs

Update `packages/docs/src/register-primitives.ts` — add import and `reg()` call:

```typescript
import { Dui{Name}Primitive } from "@dui/primitives/{name}";
reg(Dui{Name}Primitive);
```

### Step 7 — Add to docs

Use the `/edit-docs` skill to create a demo page and wire it into the docs nav.

### Step 8 — Verify

Run `deno check` from the repo root to verify everything compiles.

---

## Compound primitives (Lit Context)

For multi-part primitives (accordion, dialog, tabs, etc.), use Lit Context for coordination:

### Context file

Create `packages/primitives/src/{name}/{name}-context.ts`:

```typescript
import { createContext } from "@lit/context";

export interface {Name}Context {
  readonly openValues: string[];
  readonly disabled: boolean;
  readonly toggle: (value: string) => void;
}

export const {name}Context = createContext<{Name}Context>("dui-{name}");
```

### Parent provides context

```typescript
import { provide } from "@lit/context";
import { {name}Context, type {Name}Context } from "./{name}-context.ts";

export class Dui{Name}Primitive extends LitElement {
  // ...
  @provide({ context: {name}Context })
  @state() accessor #ctx: {Name}Context = { /* initial */ };
}
```

### Children consume context

```typescript
import { consume } from "@lit/context";
import { {name}Context, type {Name}Context } from "./{name}-context.ts";

export class Dui{Name}ItemPrimitive extends LitElement {
  // ...
  @consume({ context: {name}Context, subscribe: true })
  @state() accessor #ctx!: {Name}Context;
}
```

**Key principles:**
- No imperative coordination — no `querySelectorAll`, no `this.closest()`
- Immutable context updates — spread, never mutate
- Actions via context callbacks — children call `ctx.toggle()` directly
- Public events still dispatched for consumers

---

## Validation checklist

- [ ] Class name uses `Primitive` suffix (`Dui{Name}Primitive`)
- [ ] Extends `LitElement` directly
- [ ] `static tagName` with `as const` — no `@customElement`
- [ ] `static override styles = [base, styles]`
- [ ] **Structural CSS only** — no colors, fonts, spacing, border-radius, shadows
- [ ] `part="root"` on root internal element
- [ ] Additional `part` attributes on key internal elements (track, thumb, etc.)
- [ ] Properties use `@property()` with `accessor`
- [ ] Internal state uses `@state() accessor #name` (native private)
- [ ] Private methods use `#private` syntax
- [ ] Events use `customEvent()` factory with `bubbles: true, composed: true`
- [ ] Data attributes on internal elements for CSS targeting (`data-checked`, `data-open`, etc.)
- [ ] `index.ts` re-exports all classes from the primitive group
- [ ] `deno.json` export added
- [ ] Registered in `packages/docs/src/register-primitives.ts`
- [ ] `deno check` passes
