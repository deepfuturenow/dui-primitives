export interface PrimitiveMeta {
  tagName: string;
  name: string;
  description: string;
  importPath: string;
  /** Tag name of the parent component. Sub-components are hidden from nav. */
  parent?: string;
  properties: { name: string; type: string; default?: string; description: string }[];
  events: { name: string; detail?: string; description: string }[];
  slots: { name: string; description: string }[];
  cssParts?: { name: string; description: string }[];
}

/**
 * Registry of all DUI primitives — drives navigation, API tables, and llms.txt.
 * TODO: Fill in complete metadata for all primitives. Starting with key examples.
 */
export const primitiveRegistry: PrimitiveMeta[] = [
  {
    tagName: "dui-accordion",
    name: "Accordion",
    description: "Vertically stacked sections with expandable/collapsible panels.",
    importPath: "@dui/primitives/accordion",
    properties: [
      { name: "value", type: "string[] | undefined", description: "Currently open item values" },
      { name: "defaultValue", type: "string[]", default: "[]", description: "Initial open items" },
      { name: "disabled", type: "boolean", default: "false", description: "Disable all items" },
      { name: "multiple", type: "boolean", default: "false", description: "Allow multiple items open" },
      { name: "loopFocus", type: "boolean", default: "true", description: "Cycle focus at ends" },
      { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Layout orientation" },
    ],
    events: [
      { name: "value-change", detail: "string[]", description: "Fired when open items change" },
    ],
    slots: [{ name: "default", description: "dui-accordion-item children" }],
  },
  {
    tagName: "dui-button",
    name: "Button",
    description: "A clickable button element. Renders as <a> when href is provided.",
    importPath: "@dui/primitives/button",
    properties: [
      { name: "disabled", type: "boolean", default: "false", description: "Disable the button" },
      { name: "type", type: '"button" | "submit" | "reset"', default: '"button"', description: "Button type" },
      { name: "href", type: "string", description: "URL — renders as <a> tag" },
      { name: "target", type: "string", description: "Link target" },
    ],
    events: [
      { name: "dui-navigate", detail: "{ href: string }", description: "Fired on navigation clicks" },
    ],
    slots: [{ name: "default", description: "Button content" }],
    cssParts: [{ name: "root", description: "The button or anchor element" }],
  },
  {
    tagName: "dui-checkbox",
    name: "Checkbox",
    description: "A tri-state checkbox with form participation.",
    importPath: "@dui/primitives/checkbox",
    properties: [
      { name: "checked", type: "boolean", default: "false", description: "Checked state" },
      { name: "indeterminate", type: "boolean", default: "false", description: "Indeterminate state" },
      { name: "disabled", type: "boolean", default: "false", description: "Disable the checkbox" },
      { name: "name", type: "string", description: "Form field name" },
      { name: "value", type: "string", default: '"on"', description: "Form value when checked" },
    ],
    events: [
      { name: "change", description: "Fired when checked state changes" },
    ],
    slots: [
      { name: "default", description: "Checkbox label" },
      { name: "indicator", description: "Custom check indicator" },
    ],
    cssParts: [
      { name: "root", description: "Outer container" },
      { name: "control", description: "The checkbox box" },
    ],
  },
  {
    tagName: "dui-dialog",
    name: "Dialog",
    description: "A modal dialog with focus trapping and backdrop.",
    importPath: "@dui/primitives/dialog",
    properties: [
      { name: "open", type: "boolean", default: "false", description: "Open state" },
      { name: "modal", type: "boolean", default: "true", description: "Modal behavior" },
    ],
    events: [
      { name: "open-change", detail: "boolean", description: "Fired when open state changes" },
    ],
    slots: [{ name: "default", description: "Dialog sub-components" }],
  },
  {
    tagName: "dui-input",
    name: "Input",
    description: "A text input with form participation.",
    importPath: "@dui/primitives/input",
    properties: [
      { name: "value", type: "string", default: '""', description: "Input value" },
      { name: "type", type: "string", default: '"text"', description: "Input type" },
      { name: "placeholder", type: "string", description: "Placeholder text" },
      { name: "disabled", type: "boolean", default: "false", description: "Disable the input" },
      { name: "name", type: "string", description: "Form field name" },
    ],
    events: [
      { name: "input", description: "Fired on each keystroke" },
      { name: "change", description: "Fired on blur after value change" },
    ],
    slots: [],
    cssParts: [
      { name: "root", description: "Container" },
      { name: "input", description: "The native input element" },
    ],
  },
  {
    tagName: "dui-switch",
    name: "Switch",
    description: "A toggle switch with form participation.",
    importPath: "@dui/primitives/switch",
    properties: [
      { name: "checked", type: "boolean", default: "false", description: "Checked state" },
      { name: "disabled", type: "boolean", default: "false", description: "Disable the switch" },
      { name: "name", type: "string", description: "Form field name" },
    ],
    events: [
      { name: "change", description: "Fired when checked state changes" },
    ],
    slots: [{ name: "default", description: "Label" }],
    cssParts: [
      { name: "root", description: "Outer container" },
      { name: "track", description: "The switch track" },
      { name: "thumb", description: "The switch thumb" },
    ],
  },
  {
    tagName: "dui-tabs",
    name: "Tabs",
    description: "Tabbed content with keyboard navigation and ARIA tabs pattern.",
    importPath: "@dui/primitives/tabs",
    properties: [
      { name: "value", type: "string | undefined", description: "Currently active tab" },
      { name: "defaultValue", type: "string", description: "Initial active tab" },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout orientation" },
    ],
    events: [
      { name: "value-change", detail: "string", description: "Fired when active tab changes" },
    ],
    slots: [{ name: "default", description: "dui-tabs-list and dui-tabs-panel children" }],
  },
  {
    tagName: "dui-tooltip",
    name: "Tooltip",
    description: "A popup tooltip triggered on hover/focus.",
    importPath: "@dui/primitives/tooltip",
    properties: [
      { name: "open", type: "boolean", default: "false", description: "Open state" },
      { name: "placement", type: "string", default: '"top"', description: "Popup placement" },
      { name: "delay", type: "number", default: "300", description: "Show delay (ms)" },
    ],
    events: [
      { name: "open-change", detail: "boolean", description: "Fired when tooltip opens/closes" },
    ],
    slots: [{ name: "default", description: "Trigger and popup sub-components" }],
  },
];

/**
 * Sidebar navigation groups for the primitives docs.
 */
export const NAV_GROUPS: { label: string; slugs: string[] }[] = [
  {
    label: "Components",
    slugs: [
      "accordion", "alert-dialog", "avatar", "badge", "breadcrumb",
      "button", "calendar", "card", "card-grid", "checkbox", "collapsible",
      "combobox", "command", "data-table", "dialog", "dropzone",
      "icon", "input", "menu", "menubar", "number-field", "popover",
      "preview-card", "progress", "radio", "scroll-area", "select",
      "separator", "sidebar", "slider", "spinner", "split-button",
      "stepper", "switch", "tabs", "textarea", "toggle", "toggle-group",
      "toolbar", "tooltip", "trunc",
    ],
  },
  {
    label: "Utilities",
    slugs: ["field", "fieldset", "portal"],
  },
];
