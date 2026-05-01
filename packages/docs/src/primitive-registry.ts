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
  {
    tagName: "dui-tree",
    name: "Tree",
    description: "A hierarchical tree view with keyboard navigation and optional selection. Follows the W3C APG Treeview pattern.",
    importPath: "@dui/primitives/tree",
    properties: [
      { name: "expandedValues", type: "string[] | undefined", description: "Controlled expanded branches" },
      { name: "defaultExpandedValues", type: "string[]", default: "[]", description: "Initial expanded branches (uncontrolled)" },
      { name: "selectionMode", type: '"none" | "single" | "multiple"', default: '"none"', description: "Selection behavior" },
      { name: "selectedValues", type: "string[] | undefined", description: "Controlled selected items" },
      { name: "defaultSelectedValues", type: "string[]", default: "[]", description: "Initial selected items (uncontrolled)" },
      { name: "disabled", type: "boolean", default: "false", description: "Disables the entire tree" },
    ],
    events: [
      { name: "dui-expanded-change", detail: "{ values: string[] }", description: "Branches expanded or collapsed" },
      { name: "dui-selection-change", detail: "{ values: string[] }", description: "Selection changed" },
      { name: "dui-action", detail: "{ value: string }", description: "Leaf activated in non-selectable tree" },
    ],
    slots: [{ name: "default", description: "<dui-tree-item> children" }],
    cssParts: [{ name: "root", description: "The tree layout container" }],
  },
  {
    tagName: "dui-tree-item",
    name: "Tree Item",
    description: "A node in a <dui-tree>. Becomes a branch automatically when it contains child <dui-tree-item> elements.",
    importPath: "@dui/primitives/tree",
    parent: "dui-tree",
    properties: [
      { name: "value", type: "string", description: "Unique identifier for this item (required)" },
      { name: "disabled", type: "boolean", default: "false", description: "Disables this item and its descendants" },
      { name: "hasChildren", type: "boolean", default: "false", description: "Marks the item as a branch even when no children are slotted yet (for async/lazy loading)" },
      { name: "loading", type: "boolean", default: "false", description: "Loading async children. Reflects aria-busy and data-loading." },
    ],
    events: [
      { name: "dui-load-children", detail: "{ value: string }", description: "Fired (bubbles) when a has-children branch is first expanded with no slotted children" },
    ],
    slots: [
      { name: "label", description: "The visible label/content for this node" },
      { name: "end", description: "Trailing content (icons, badges, actions)" },
      { name: "default", description: "Child <dui-tree-item> elements (makes this item a branch)" },
    ],
    cssParts: [
      { name: "root", description: "The treeitem row (role=treeitem). Contains content + group." },
      { name: "content", description: "The row layout (indicator + label + end). Style hover/selected backgrounds HERE, not on root." },
      { name: "indicator", description: "Expand target. Always rendered (with data-branch or data-leaf) so leaf labels align with branch labels at the same level." },
      { name: "group", description: "Child group container (role=group), hidden when collapsed" },
    ],
  },
  {
    tagName: "dui-splitter",
    name: "Splitter",
    description: "Resizable panel group implementing the W3C Window Splitter pattern. Panels divided by draggable handles, sized by percent.",
    importPath: "@dui/primitives/splitter",
    properties: [
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Axis along which panels are laid out and handles drag" },
      { name: "value", type: "number[] | undefined", description: "Controlled sizes (percentages, length = panel count, sum = 100). When set, the component is controlled" },
      { name: "defaultValue", type: "number[]", default: "[]", description: "Uncontrolled initial sizes. If empty, panels distribute equally" },
      { name: "disabled", type: "boolean", default: "false", description: "Disable every handle" },
      { name: "keyboardStep", type: "number", default: "10", description: "Percent moved per Arrow keypress on a handle" },
      { name: "keyboardStepLarge", type: "number", default: "25", description: "Percent moved with Shift+Arrow" },
      { name: "autoSaveId", type: "string", description: "If set, persist sizes to localStorage. Ignored in controlled mode" },
    ],
    events: [
      { name: "value-change", detail: "number[]", description: "Fired after every committed size change (drag tick + keyboard step). In controlled mode, mirror this back via .value to commit" },
    ],
    slots: [{ name: "default", description: "dui-splitter-panel and dui-splitter-handle children in DOM order" }],
    cssParts: [{ name: "root", description: "The flex container element" }],
  },
  {
    tagName: "dui-splitter-panel",
    name: "Splitter Panel",
    description: "A single resizable panel inside a dui-splitter. Owns its own min/max constraints.",
    importPath: "@dui/primitives/splitter",
    parent: "dui-splitter",
    properties: [
      { name: "panelId", type: "string", description: "Stable identifier (required). Used for persistence keying and aria-controls resolution" },
      { name: "defaultSize", type: "number", description: "Initial percentage. If omitted on every panel, root distributes equally. Ignored in controlled mode" },
      { name: "minSize", type: "number", default: "0", description: "Minimum percentage during drag and keyboard" },
      { name: "maxSize", type: "number", default: "100", description: "Maximum percentage during drag and keyboard" },
      { name: "order", type: "number", description: "Stable order key when panels are conditionally rendered" },
    ],
    events: [],
    slots: [{ name: "default", description: "Panel content" }],
    cssParts: [{ name: "root", description: "The panel content wrapper. Style padding/background HERE, not on the host" }],
  },
  {
    tagName: "dui-splitter-handle",
    name: "Splitter Handle",
    description: "Draggable separator between two adjacent panels. Renders role=separator with full ARIA wiring.",
    importPath: "@dui/primitives/splitter",
    parent: "dui-splitter",
    properties: [
      { name: "disabled", type: "boolean", default: "false", description: "Disable this individual handle" },
    ],
    events: [],
    slots: [],
    cssParts: [{ name: "root", description: "The separator element (role=separator). Paint a visible line via background or a centered ::part(root)::before" }],
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
      "splitter",
      "stepper", "switch", "tabs", "textarea", "toggle", "toggle-group",
      "toolbar", "tooltip", "tree", "trunc",
    ],
  },
  {
    label: "Utilities",
    slugs: ["field", "fieldset", "portal"],
  },
];
