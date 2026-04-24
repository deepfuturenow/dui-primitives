# DUI Primitives

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@deepfuture/dui-core.svg)](https://www.npmjs.com/package/@deepfuture/dui-core)

Unstyled, accessible [Lit](https://lit.dev) web components. Structure and behavior only — zero visual opinions.

DUI Primitives gives you the hard parts for free: keyboard navigation, focus management, ARIA patterns, form participation, and compound component coordination. You bring the CSS.

Think [Radix Primitives](https://www.radix-ui.com/primitives), but as web components that work in any framework — or no framework at all.

## Why

Building a custom design system shouldn't mean reimplementing accordion keyboard navigation, dialog focus trapping, or combobox typeahead from scratch. Primitives handle all of that, then get out of the way.

- **Unstyled** — structural CSS only (display, position, overflow). No colors, no spacing, no border-radius.
- **Accessible** — follows WAI-ARIA APG patterns. Keyboard navigation, screen reader support, focus management built in.
- **Framework-agnostic** — standard web components. Works in React, Vue, Svelte, Angular, or plain HTML.
- **Extensible** — plain classes with `static styles`. Extend with your own CSS to build any aesthetic.
- **Composable** — compound components (dialog + trigger + popup + close) coordinate via Lit Context. No prop drilling.
- **Form-ready** — inputs, checkboxes, selects, and switches participate in native `<form>` via `ElementInternals`.

## Install

```bash
npm install @deepfuture/dui-core @deepfuture/dui-primitives
```

## Quick Start

Primitives are classes, not self-registering elements. You register them yourself:

```typescript
import { DuiDialogPrimitive, DuiDialogTriggerPrimitive, DuiDialogPopupPrimitive, DuiDialogClosePrimitive } from "@deepfuture/dui-primitives/dialog";
import { DuiButtonPrimitive } from "@deepfuture/dui-primitives/button";

// Register as custom elements
customElements.define("dui-button", DuiButtonPrimitive);
customElements.define("dui-dialog", DuiDialogPrimitive);
customElements.define("dui-dialog-trigger", DuiDialogTriggerPrimitive);
customElements.define("dui-dialog-popup", DuiDialogPopupPrimitive);
customElements.define("dui-dialog-close", DuiDialogClosePrimitive);
```

```html
<dui-dialog>
  <dui-dialog-trigger>
    <dui-button>Open</dui-button>
  </dui-dialog-trigger>
  <dui-dialog-popup>
    <h2>Dialog title</h2>
    <p>Focus is trapped. Press Escape to close.</p>
    <dui-dialog-close>
      <dui-button>Close</dui-button>
    </dui-dialog-close>
  </dui-dialog-popup>
</dui-dialog>
```

That gives you a fully functional dialog with focus trapping, escape-to-close, and focus restoration — but no visual styling beyond layout. Add your own:

```css
dui-button::part(root) {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
}

dui-dialog-popup::part(root) {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}
```

## Extending Primitives

The real power is extending primitives to build your own design system:

```typescript
import { css } from "lit";
import { DuiSwitchPrimitive } from "@deepfuture/dui-primitives/switch";

class MySwitch extends DuiSwitchPrimitive {
  static override styles = [
    ...DuiSwitchPrimitive.styles,
    css`
      [part="root"] {
        width: 44px;
        height: 24px;
        border-radius: 12px;
        background: #ddd;
        transition: background 150ms ease;
      }
      [part="root"][data-checked] {
        background: #4f46e5;
      }
      [part="thumb"] {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        transition: transform 150ms ease;
      }
    `,
  ];
}

customElements.define("my-switch", MySwitch);
```

All behavior — keyboard toggle, form participation, ARIA attributes, checked state — comes from the primitive. Your subclass only adds aesthetics.

## Components

43 component groups, 85+ elements total.

| Category | Primitives |
|----------|-----------|
| **Actions** | Button, Split Button, Toggle, Toggle Group, Toolbar |
| **Forms** | Input, Textarea, Select, Combobox, Checkbox, Checkbox Group, Radio, Radio Group, Switch, Slider, Number Field, Stepper, Dropzone, Field, Fieldset |
| **Data Display** | Badge, Avatar, Calendar, Data Table, Progress, Spinner, Separator, Trunc, Card, Card Grid |
| **Overlays** | Dialog, Alert Dialog, Popover, Tooltip, Menu, Menubar, Preview Card, Command |
| **Disclosure** | Accordion, Collapsible, Tabs |
| **Navigation** | Breadcrumb, Sidebar (13 sub-components) |
| **Layout** | Scroll Area, Portal |
| **Utility** | Icon |

## Styling Surface

Every primitive exposes CSS parts for styling:

```css
/* ::part(root) is available on every component */
dui-button::part(root) { ... }

/* Complex components expose additional parts */
dui-switch::part(track) { ... }
dui-switch::part(thumb) { ... }
dui-slider::part(track) { ... }
dui-slider::part(thumb) { ... }
dui-checkbox::part(control) { ... }

/* State is reflected as data attributes */
dui-button::part(root):hover { ... }
dui-switch::part(root)[data-checked] { ... }
dui-checkbox::part(root)[data-checked] { ... }
dui-accordion-item::part(root)[data-open] { ... }
```

Slot-based composition for content projection:

```html
<dui-accordion-item value="item-1">
  <div slot="trigger">Click to expand</div>
  <div slot="content">Panel content here</div>
</dui-accordion-item>
```

## Packages

| Package | Description |
|---------|------------|
| [`@deepfuture/dui-core`](https://www.npmjs.com/package/@deepfuture/dui-core) | Base class, event factory, popup coordinator, floating UI utilities |
| [`@deepfuture/dui-primitives`](https://www.npmjs.com/package/@deepfuture/dui-primitives) | All unstyled component primitives |

### What's in core?

- **`base`** — shared CSS reset applied to all primitive shadow DOMs
- **`customEvent()`** — typed event factory for component events
- **`popup-coordinator`** — singleton that manages popup stacking and light-dismiss
- **`floating-popup-utils`** / **`floating-portal-controller`** — [Floating UI](https://floating-ui.com/) integration for positioned overlays
- **`dom`** — shadow-DOM-aware DOM utilities

## Building a Design System on Primitives

DUI Primitives is the foundation layer. The [DUI design system](https://github.com/deepfuturenow/dui) is built on top of it, adding:

- **Design tokens** — CSS custom properties for colors, spacing, typography, radii
- **Component styles** — aesthetic CSS composed onto each primitive via `applyTheme()`
- **Variants** — `variant="primary"`, `appearance="outline"`, `size="sm"`, etc.
- **Templates** — pre-composed UI patterns (feed items, stat cards, dashboards)

You can do the same — or build something completely different. The primitives don't care what your design system looks like.

## Development

```bash
# Dev server (primitives docs)
deno task dev

# Build for npm
deno task build

# Version bump
deno task version patch

# Publish
deno task publish          # dry run
deno task publish:live     # real publish
```

## License

[MIT](LICENSE)
