# Testing plan — `dui-tree` (and primitives generally)

This document is a starter plan for adding tests to `@dui/primitives`. There are currently **zero tests** in the package; this proposes a path from there to comprehensive coverage, using `dui-tree` as the pilot.

It's written for someone new to testing. Read top-to-bottom.

---

## What testing actually means here

Three different kinds of "test", each catches different bugs:

1. **Pure logic tests** — give a function some input, assert the output. No DOM, no browser.
2. **Component DOM tests** — instantiate a custom element, render it to a fake DOM, click things, assert what changed in the DOM.
3. **Browser tests** — real browser, real focus, real layout, real screen reader API.

Each catches different kinds of bug. For a complex primitive like `dui-tree` you eventually want all three. For a simple primitive (`badge`, `avatar`) you only need #2.

The good news: in a Lit + custom-elements codebase, the boundary between "logic" and "DOM" is fuzzy because so much state lives in attributes / slots. You'll end up writing mostly #2.

---

## Three things to decide first

### 1. Where do tests run? (browser vs. node-like)

| Environment | Pros | Cons | When to use |
|---|---|---|---|
| **Real browser** (Playwright via `@web/test-runner`) | Real focus events, real layout, real Shadow DOM, real `getBoundingClientRect`, real intersection observers. The closest thing to production. | Slower (browser launch). More setup. | For anything touching focus, layout, scroll, hover, drag. → Most of `dui-tree`. |
| **JSDOM** (npm: `jsdom`) | Fast. Runs anywhere. Mature ecosystem. | No real layout (`getBoundingClientRect` is faked). Focus/keyboard events partially supported. Some Web APIs missing. | For data/state logic that doesn't care about layout. |
| **happy-dom** (npm: `happy-dom`) | Faster than JSDOM. Better Shadow DOM support. | Less mature. Some Web APIs still missing. | Same as JSDOM but a bit better for Web Components. |
| **Deno test + DOM polyfill** (`@b-fuze/deno-dom` etc.) | Native to your toolchain. | The DOM polyfills are weak — slot composition, custom elements, focus, all suspect. | Skip for now. |

**Recommendation:** Start with **`@web/test-runner` + Playwright**. It's the official Lit recommendation and mirrors how Lit's own primitives are tested.

The trade-off: it's not Deno-native. You'll run it via `npm` / `bun` in the docs package. That's fine — tests aren't part of the published package, they just need to pass locally and in CI.

### 2. What library to write tests with?

Lit publishes `@open-wc/testing` (a wrapper around Mocha + Chai that adds custom-element helpers). The key helper is `fixture()`:

```ts
import { fixture, html, expect } from "@open-wc/testing";

const el = await fixture(html`
  <dui-tree>
    <dui-tree-item value="a"><span slot="label">A</span></dui-tree-item>
  </dui-tree>
`);
expect(el).to.have.attribute("role", "tree");
```

`fixture()` mounts the element in the DOM, waits for it to be `updateComplete` (Lit's render-cycle signal), and returns the mounted node.

### 3. Test file location

Two conventions:

- **Co-located**: `src/tree/tree.test.ts` next to `tree.ts`.
- **Separate folder**: `test/tree.test.ts`.

Co-located is what most modern Lit packages do. Use that.

---

## Bootstrap recipe

Concrete steps to get the **first test** running, picking the simplest defaults:

### 1. Add a `package.json` to `packages/primitives`

(The package is currently Deno-only; tests will live alongside as an npm-runnable workspace.)

```jsonc
{
  "name": "@dui/primitives-tests",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "wtr \"src/**/*.test.ts\" --node-resolve"
  },
  "devDependencies": {
    "@web/test-runner": "^0.19.0",
    "@web/test-runner-playwright": "^0.11.0",
    "@open-wc/testing": "^4.0.0",
    "@esm-bundle/chai": "^4.3.4",
    "typescript": "^5.5.0"
  }
}
```

### 2. Add a `web-test-runner.config.mjs`

```js
import { playwrightLauncher } from "@web/test-runner-playwright";
import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  files: "src/**/*.test.ts",
  nodeResolve: true,
  browsers: [playwrightLauncher({ product: "chromium" })],
  plugins: [esbuildPlugin({ ts: true, target: "es2022" })],
};
```

### 3. Write your first test

`packages/primitives/src/tree/tree.test.ts`:

```ts
import { fixture, html, expect } from "@open-wc/testing";
import "./tree.ts";
import "./tree-item.ts";

describe("dui-tree", () => {
  it("renders with role='tree' on the host", async () => {
    const el = await fixture(html`<dui-tree aria-label="Demo"></dui-tree>`);
    expect(el.getAttribute("role")).to.equal("tree");
    expect(el.getAttribute("aria-label")).to.equal("Demo");
  });
});
```

### 4. Run

```bash
cd packages/primitives
npm install
npm test
```

You should see one passing test in a real Chromium window. That's the loop.

---

## Test coverage plan for `dui-tree`

Group tests by **behavior**, not by file. Each `describe` block tells the story of one thing the primitive does.

### Rendering & ARIA (~6 tests)

- Renders `role="tree"` on the host; passes through `aria-label`.
- Renders `aria-multiselectable="true"` only when `selectionMode="multiple"`.
- Each `<dui-tree-item>` gets `role="treeitem"`, `aria-level`, `aria-setsize`, `aria-posinset`.
- Branch items get `aria-expanded`; leaves do NOT.
- `aria-selected` only present when `selectionMode !== "none"`.
- Disabled item gets `aria-disabled="true"`.

### Branch detection (~3 tests)

- Item with no children → `data-leaf` on host; `aria-expanded` absent.
- Item with `<dui-tree-item>` children → `data-branch` on host; `aria-expanded="false"`.
- Item with `has-children` attribute → treated as branch even with no slotted children.

### Expand/collapse (~5 tests)

- Click on a branch row toggles expansion (`selectionMode="none"`).
- Click on the indicator toggles expansion regardless of selection mode.
- `default-expanded-values` controls initial state.
- `expandedValues` (controlled) — setting from outside reflects in the DOM.
- `dui-expanded-change` fires with the new array.

### Selection (~5 tests)

- `selectionMode="single"` — click selects, click again deselects.
- `selectionMode="single"` — clicking a different item replaces selection.
- `selectionMode="multiple"` — click toggles in/out of selection.
- `selectionMode="none"` — click on a leaf fires `dui-action`, NOT `dui-selection-change`.
- Switching mode from `"multiple"` (with 3 selected) to `"single"` trims to first.
- Switching mode to `"none"` clears selection.

### Disabled propagation (~4 tests)

- Tree-level `disabled`: every item gets `data-disabled`.
- Item with `disabled`: that item gets `data-disabled`.
- Disabling a branch item also disables descendants (`data-disabled` on each).
- Toggling `disabled` on an ancestor at runtime updates descendants (MutationObserver).

### Keyboard navigation (~10 tests)

- `ArrowDown` / `ArrowUp` move the roving tabindex through visible items.
- `ArrowRight` on closed branch expands; on open branch moves to first child; on leaf does nothing.
- `ArrowLeft` on open branch collapses; on closed branch / leaf moves to parent.
- `Home` / `End` jump to first / last visible.
- `Enter` / `Space` activate (selection or action).
- `*` expands all sibling branches.
- Type-ahead jumps to next item with matching label.
- Disabled items are still focusable but don't activate.

### Async loading (~3 tests)

- `has-children` branch fires `dui-load-children` on first expand.
- Re-collapse + re-expand re-fires if children still empty.
- Once children are appended, no further events on subsequent expands.

### Events (~3 tests)

- All three `dui-*` events bubble + compose (caught at `document.body`).
- `dui-load-children` bubbles from `<dui-tree-item>` up to `<dui-tree>`.

### Cleanup (~2 tests)

- Disconnecting the tree clears the type-ahead timeout (no late assertions firing).
- `MutationObserver` is disconnected on tree teardown.

**Total: ~40 tests for `dui-tree`.** Reasonable coverage for the most complex primitive in the package.

---

## Patterns and pitfalls

### Always `await el.updateComplete`

After mutating a property or attribute, Lit's render is **async**. You must wait:

```ts
el.expandedValues = ["a"];
await el.updateComplete;          // wait for the next render
expect(el.querySelector("[data-expanded]")).to.exist;
```

### Querying inside Shadow DOM

`querySelector` only sees light DOM. To reach the shadow:

```ts
const root = el.shadowRoot.querySelector("[part='root']");
```

For `dui-tree-item` specifically, child items live in the **light** DOM of their parent item, but `[part="root"]` of each item lives in shadow.

### Synthetic keyboard events

Real keyboard events in tests use `dispatchEvent`:

```ts
el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
await el.updateComplete;
```

But the focus has to land on the right element first:

```ts
const root = item.shadowRoot.querySelector("[part='root']");
root.focus();
```

In a real browser this just works. In JSDOM it can be flaky.

### Helper utilities

Build a few helpers up front and reuse:

```ts
async function makeTree(opts = {}) { /* ... fixture ... */ }
function visibleItems(tree) { return tree.querySelectorAll("dui-tree-item"); }
function rootOf(item) { return item.shadowRoot.querySelector("[part='root']"); }
```

---

## Phasing

If you want to do this incrementally:

1. **Phase A: Bootstrap (1–2 hrs).** Get `@web/test-runner` running with one passing test. The wiring is the hardest part — once it's working, more tests are cheap.
2. **Phase B: Tree pilot (1 day).** Write the ~40 tests above for `dui-tree`. This validates the test setup is robust enough for complex components.
3. **Phase C: Backfill the basics (1 day).** Cover `button`, `checkbox`, `switch`, `tabs`, `accordion`, `radio`, `toggle`. ~5–10 tests each.
4. **Phase D: CI (a few hours).** Hook `npm test` into your existing CI pipeline. Fail PRs that break tests.
5. **Phase E: Coverage targets (ongoing).** Set a minimum coverage threshold (e.g. 70% of primitives have at least one test, then ratchet up).

---

## When not to test

A few things are genuinely hard to test in any environment:

- **Visual styling.** That `[data-expanded]` rotates the chevron 90° is a CSS thing. Snapshot the rendered HTML, not the visual output. Visual regression is a separate beast (Playwright screenshots, Chromatic, etc.).
- **Focus visible state across browsers.** Different browsers paint focus rings differently. Test focus identity (which element has focus), not focus appearance.
- **Real screen readers.** Manual audit territory. NVDA / VoiceOver / JAWS each have quirks. Don't try to automate this.

---

## tl;dr — what to do this week

If you only do one thing: get `@web/test-runner` running with the one-test bootstrap above. Once green, the rest is mechanical.

```
cd packages/primitives
npm init -y    # or copy the package.json above
npm install --save-dev @web/test-runner @web/test-runner-playwright \
                       @open-wc/testing typescript
# write tree.test.ts with the single rendering test
npm test
```

Once that passes, every subsequent test is just another `it(...)` block.
