# Docs Site — DUI Consumer Context

You are working on the DUI docs site, which **consumes** DUI components. You are not editing component internals.

## Key context

- This is a Lit-based multi-page site with sidebar nav, hash routing, and per-component demo pages
- The `create/` section is an interactive theme playground with block demos (calendar, chat, settings, etc.)
- Blocks live in `src/create/blocks/` — each is a self-contained `LitElement` that composes DUI components
- Demo pages live in `src/pages/docs-page-{name}.ts`
- Shell + routing: `src/docs-app.ts` + `src/docs-router.ts`
- Component metadata: `src/component-registry.ts`

## When working on blocks and demo pages

- **Use DUI components by their public API** — properties, slots, parts, CSS custom properties
- **Use the `dui` skill** for component reference (available via `/dui` or by asking about DUI components)
- **Style via design tokens** — primitives: `--background`, `--foreground`, `--accent`, `--destructive`; derived: `--surface-1`/`2`/`3`, `--text-1`/`2`/`3`, `--border`, `--border-strong`; plus `--space-*`, `--radius-*`, `--font-size-*`
- **Do not reach into shadow DOM** of DUI components
- **Blocks use `@customElement`** — this is correct for docs-site elements (only DUI library components avoid `@customElement`)
- **Blocks use hardcoded demo data** — keep it realistic but static

## Dev server

```bash
cd packages/docs && deno task dev   # serves on port 4040
```
