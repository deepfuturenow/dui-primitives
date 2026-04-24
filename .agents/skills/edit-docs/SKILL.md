---
name: edit-docs
description: Wire a primitive into the DUI primitives docs site, or modify existing doc pages. Use when the user asks to add something to the docs, edit a demo page, update the docs site, or says "add to docs", "show in docs", "edit docs", "update the docs page", etc.
---

# Edit Docs

Wire a DUI primitive into the docs site, or modify existing pages.

## Overview

The primitives docs site (`packages/docs`) uses a shell with sidebar navigation, hash routing, and per-primitive demo pages.

### Architecture

```
packages/docs/
├── src/
│   ├── primitive-registry.ts    # Primitive metadata: properties, events, slots, parts
│   ├── register-primitives.ts   # Registers all primitives as custom elements
│   ├── docs-app.ts              # Shell: top bar + sidebar + content area
│   ├── docs-demo.ts             # <prim-demo> container for examples
│   ├── index.ts                 # Entry point: imports
│   └── pages/
│       ├── docs-page-{name}.ts  # Per-primitive demo pages
│       └── ...
├── serve.ts                     # Dev server + esbuild + llms.txt generation
└── static/
    └── index.html               # Just <docs-app>
```

## Prerequisites

Before making changes, read:

- `packages/docs/src/docs-app.ts` — to understand the nav structure and routing
- An existing page for reference (e.g., `packages/docs/src/pages/docs-page-button.ts`)

---

## Adding a Primitive to Docs

### Files to modify

| File | Change |
|------|--------|
| `src/primitive-registry.ts` | Add `PrimitiveMeta` entry |
| `src/register-primitives.ts` | Add import + `reg()` call |
| `src/docs-app.ts` | Add slug to `NAV_GROUPS` (if not already present) |
| `src/index.ts` | Import the demo page |
| `src/pages/docs-page-{name}.ts` | **Create** — demo page |
| `serve.ts` | Verify export entries in `workspacePackages` |

### Step 1 — Add to primitive registry

In `packages/docs/src/primitive-registry.ts`, add a `PrimitiveMeta` entry:

```typescript
{
  tagName: "dui-{name}",
  name: "{Name}",
  description: "One-line description.",
  importPath: "@dui/primitives/{name}",
  properties: [
    { name: "disabled", type: "boolean", default: "false", description: "..." },
  ],
  events: [
    { name: "value-change", detail: "{ value: string }", description: "..." },
  ],
  slots: [
    { name: "default", description: "..." },
  ],
  cssParts: [
    { name: "root", description: "The root element" },
  ],
},
```

For compound primitives (accordion + accordion-item), add separate entries. Sub-components set `parent: "dui-accordion"` to hide from nav.

### Step 2 — Register the primitive

In `packages/docs/src/register-primitives.ts`, add import and registration:

```typescript
import { Dui{Name}Primitive } from "@dui/primitives/{name}";

// In the registration block:
reg(Dui{Name}Primitive);
```

### Step 3 — Add to sidebar nav

In `packages/docs/src/primitive-registry.ts`, add the slug to the appropriate group in `NAV_GROUPS`:

```typescript
{
  label: "Components",
  slugs: [
    "accordion", ..., "{name}",  // add alphabetically
  ],
},
```

### Step 4 — Create the demo page

Create `packages/docs/src/pages/docs-page-{name}.ts`:

```typescript
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-{name}")
export class DocsPage{Name} extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <h1>{Name}</h1>
      <p class="subtitle">{One-line description}.</p>

      <prim-demo label="Basic usage">
        <dui-{name} style="...minimal inline CSS...">
          Content
        </dui-{name}>
      </prim-demo>

      <prim-demo label="States">
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <dui-{name}>Default</dui-{name}>
          <dui-{name} disabled>Disabled</dui-{name}>
        </div>
      </prim-demo>

      <prim-demo label="Keyboard navigation">
        <p style="font-size: 13px; color: #666; margin-top: 0;">
          Describe the keyboard interactions.
        </p>
      </prim-demo>
    `;
  }
}
```

**Key patterns:**
- `createRenderRoot() { return this; }` — light DOM rendering
- `<prim-demo label="...">` — wraps each demo section
- **Minimal inline CSS** — just enough to see the primitive's behavior (borders, padding)
- No design tokens — use plain CSS values
- Show behavior: states, keyboard navigation, accessibility
- Emphasize what the primitive *does*, not how it looks

### Step 5 — Import the page

In `packages/docs/src/index.ts`, add:

```typescript
import "./pages/docs-page-{name}.ts";
```

### Step 6 — Verify serve.ts

Verify the primitive's exports exist in `workspacePackages` in `serve.ts`. The `@dui/primitives` entry reads exports from `deno.json` dynamically, so if you already added the export to `packages/primitives/deno.json`, no `serve.ts` change is needed.

### Step 7 — Verify

1. `deno check` from the repo root
2. Start dev server: `deno task dev`
3. Navigate to `http://localhost:4041#{name}`
4. Verify: sidebar link appears, page renders with demos
5. Check `llms.txt` includes the new primitive (auto-generated at startup)

---

## Editing an Existing Page

To modify a demo page:

1. Find the page: `packages/docs/src/pages/docs-page-{name}.ts`
2. Edit the demos inside the `<prim-demo>` wrappers
3. Dev server hot-reloads — save and check the browser

To update API documentation (properties, events, slots):

1. Edit the entry in `primitive-registry.ts`
2. `llms.txt` regenerates on next server start

---

## Validation checklist

- [ ] Registry entry has all properties, events, slots, CSS parts
- [ ] Primitive registered in `register-primitives.ts`
- [ ] Slug added to `NAV_GROUPS`
- [ ] Page uses light DOM (`createRenderRoot() { return this; }`)
- [ ] Page uses `<prim-demo>` for demo sections
- [ ] Demos use minimal inline CSS (no design tokens)
- [ ] Demos show key behavior: states, interaction, accessibility
- [ ] Page imported in `index.ts`
- [ ] `deno check` passes
