import {
  css,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import {
  type SelectionMode,
  type TreeContext,
  treeContext,
} from "./tree-context.ts";
import { DuiTreeItemPrimitive } from "./tree-item.ts";

export const expandedChangeEvent = customEvent<{ values: string[] }>(
  "dui-expanded-change",
  { bubbles: true, composed: true },
);

export const selectionChangeEvent = customEvent<{ values: string[] }>(
  "dui-selection-change",
  { bubbles: true, composed: true },
);

export const actionEvent = customEvent<{ value: string }>(
  "dui-action",
  { bubbles: true, composed: true },
);

const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    outline: none;
  }
`;

/**
 * `<dui-tree>` — A hierarchical tree view with keyboard navigation and
 * optional single or multiple selection. Follows the W3C APG Treeview pattern.
 *
 * Sets `role="tree"` directly on the host so consumer-provided `aria-label` /
 * `aria-labelledby` attributes apply naturally.
 *
 * @slot - `<dui-tree-item>` children.
 * @csspart root - The tree layout container.
 *
 * @fires dui-expanded-change - Branches expanded or collapsed. `{ values: string[] }`
 * @fires dui-selection-change - Selection changed. `{ values: string[] }`
 * @fires dui-action - Leaf activated in non-selectable tree. `{ value: string }`
 */
export class DuiTreePrimitive extends LitElement {
  static tagName = "dui-tree" as const;
  static override styles = [base, styles];

  // ─── Properties ───────────────────────────────────────────────────────────

  /** Controlled expanded branches. */
  @property({ type: Array })
  accessor expandedValues: string[] | undefined = undefined;

  /** Initial expanded branches (uncontrolled). */
  @property({ type: Array, attribute: "default-expanded-values" })
  accessor defaultExpandedValues: string[] = [];

  /** Selection behavior. */
  @property({ attribute: "selection-mode", reflect: true })
  accessor selectionMode: SelectionMode = "none";

  /** Controlled selected items. */
  @property({ type: Array })
  accessor selectedValues: string[] | undefined = undefined;

  /** Initial selected items (uncontrolled). */
  @property({ type: Array, attribute: "default-selected-values" })
  accessor defaultSelectedValues: string[] = [];

  /** Disables the entire tree. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  // ─── Internal state ───────────────────────────────────────────────────────

  @state()
  accessor #internalExpanded: string[] = [];

  @state()
  accessor #internalSelected: string[] = [];

  @state()
  accessor #focusedValue: string | null = null;

  // Type-ahead buffer
  #typeAheadBuffer = "";
  #typeAheadTimeout: ReturnType<typeof setTimeout> | null = null;

  // Watches descendant tree-items for `disabled` attr changes (so descendants
  // re-evaluate their inherited disabled state) and for childList changes (so
  // initial-focus init catches late-added items, e.g. async-loaded children).
  #observer: MutationObserver | null = null;

  // ─── State accessors (controlled vs uncontrolled) ─────────────────────────

  #getExpanded = (): readonly string[] =>
    this.expandedValues ?? this.#internalExpanded;

  #getSelected = (): readonly string[] =>
    this.selectedValues ?? this.#internalSelected;

  // ─── Mutations exposed via context ────────────────────────────────────────

  #toggleExpand = (value: string): void => {
    const current = [...this.#getExpanded()];
    const idx = current.indexOf(value);
    const next = idx >= 0
      ? current.filter((v) => v !== value)
      : [...current, value];

    if (this.expandedValues === undefined) {
      this.#internalExpanded = next;
    }
    this.dispatchEvent(expandedChangeEvent({ values: next }));
  };

  #toggleSelect = (value: string): void => {
    const current = [...this.#getSelected()];
    const idx = current.indexOf(value);
    let next: string[];

    if (this.selectionMode === "single") {
      next = idx >= 0 ? [] : [value];
    } else {
      next = idx >= 0
        ? current.filter((v) => v !== value)
        : [...current, value];
    }

    if (this.selectedValues === undefined) {
      this.#internalSelected = next;
    }
    this.dispatchEvent(selectionChangeEvent({ values: next }));
  };

  /**
   * Activate an item:
   * - selectionMode != "none" → toggle selection (works for branches AND leaves).
   *   Branches are still expandable via the indicator or Arrow keys.
   * - selectionMode == "none" + branch → toggle expand.
   * - selectionMode == "none" + leaf → fire `dui-action`.
   */
  #activate = (value: string, isBranch: boolean): void => {
    if (this.disabled) return;
    if (this.selectionMode !== "none") {
      this.#toggleSelect(value);
    } else if (isBranch) {
      this.#toggleExpand(value);
    } else {
      this.dispatchEvent(actionEvent({ value }));
    }
  };

  #setFocused = (value: string): void => {
    if (this.#focusedValue !== value) this.#focusedValue = value;
  };

  // ─── Context provision ────────────────────────────────────────────────────

  @provide({ context: treeContext })
  @state()
  accessor _ctx: TreeContext = this.#buildContext();

  #buildContext(): TreeContext {
    return {
      expandedValues: this.#getExpanded(),
      selectedValues: this.#getSelected(),
      selectionMode: this.selectionMode,
      disabled: this.disabled,
      focusedValue: this.#focusedValue,
      toggleExpand: this.#toggleExpand,
      activate: this.#activate,
      setFocused: this.#setFocused,
    };
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  override connectedCallback(): void {
    super.connectedCallback();

    // role="tree" on the HOST so consumer aria-label/labelledby apply naturally
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "tree");
    }

    if (
      this.expandedValues === undefined &&
      this.defaultExpandedValues.length > 0
    ) {
      this.#internalExpanded = [...this.defaultExpandedValues];
    }
    if (
      this.selectedValues === undefined &&
      this.defaultSelectedValues.length > 0
    ) {
      this.#internalSelected = [...this.defaultSelectedValues];
    }

    this._ctx = this.#buildContext();

    // Observe descendant changes:
    //   - childList: catches items added after first render (async loading,
    //     dynamic mutation) so initial-focus / context propagates to them.
    //   - attributes (disabled): an item's disabled state affects its descendants'
    //     inherited disabled state. Descendants only re-evaluate when their
    //     context updates, so we trigger a render here.
    this.#observer = new MutationObserver(() => this.requestUpdate());
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled"],
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#observer?.disconnect();
    this.#observer = null;
    if (this.#typeAheadTimeout) clearTimeout(this.#typeAheadTimeout);
    this.#typeAheadTimeout = null;
    this.#typeAheadBuffer = "";
  }

  override willUpdate(changed: PropertyValues): void {
    if (this.selectionMode === "multiple") {
      this.setAttribute("aria-multiselectable", "true");
    } else {
      this.removeAttribute("aria-multiselectable");
    }

    // Normalize selection when selectionMode tightens. Only mutates internal
    // state — controlled (`selectedValues` set) is the consumer's problem.
    if (changed.has("selectionMode") && this.selectedValues === undefined) {
      const current = this.#internalSelected;
      if (this.selectionMode === "none" && current.length > 0) {
        this.#internalSelected = [];
      } else if (this.selectionMode === "single" && current.length > 1) {
        this.#internalSelected = [current[0]];
      }
    }

    this._ctx = this.#buildContext();
  }

  protected override updated(): void {
    // Initialize roving tabindex stop on the first non-disabled visible item.
    // Runs every render but is a no-op once a value is set; re-runs after
    // mutations (via the observer) until items exist.
    if (this.#focusedValue === null) {
      const first = this.#getVisibleItems().find((i) => !i.disabled);
      if (first) this.#focusedValue = first.value;
    }
  }

  // ─── Item discovery (light DOM, document order) ───────────────────────────

  #getAllItems(): DuiTreeItemPrimitive[] {
    return [
      ...this.querySelectorAll("dui-tree-item"),
    ] as DuiTreeItemPrimitive[];
  }

  #getItem(value: string): DuiTreeItemPrimitive | undefined {
    return this.#getAllItems().find((i) => i.value === value);
  }

  #getVisibleItems(): DuiTreeItemPrimitive[] {
    return this.#getAllItems().filter((i) => this.#isVisible(i));
  }

  #isVisible(item: DuiTreeItemPrimitive): boolean {
    let el: Element | null = item.parentElement;
    while (el) {
      if (el === this) return true;
      if (
        el instanceof DuiTreeItemPrimitive &&
        !this.#getExpanded().includes(el.value)
      ) {
        return false;
      }
      el = el.parentElement;
    }
    return false;
  }

  #getParentItem(item: DuiTreeItemPrimitive): DuiTreeItemPrimitive | null {
    let el: Element | null = item.parentElement;
    while (el) {
      if (el === this) return null;
      if (el instanceof DuiTreeItemPrimitive) return el;
      el = el.parentElement;
    }
    return null;
  }

  // ─── Focus management ─────────────────────────────────────────────────────

  #focusItem(item: DuiTreeItemPrimitive): void {
    this.#focusedValue = item.value;
    // Direct focus on the inner [part="root"] (same pattern as accordion).
    const inner = item.shadowRoot?.querySelector<HTMLElement>(
      "[part='root']",
    );
    inner?.focus();
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  #findItemFromEvent(e: Event): DuiTreeItemPrimitive | null {
    return (
      e.composedPath().find(
        (el): el is DuiTreeItemPrimitive =>
          el instanceof DuiTreeItemPrimitive,
      ) ?? null
    );
  }

  #onFocusIn = (e: FocusEvent): void => {
    const item = this.#findItemFromEvent(e);
    if (item) this.#setFocused(item.value);
  };

  #onKeyDown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    const item = this.#findItemFromEvent(e);
    if (!item) return;

    const visible = this.#getVisibleItems();
    const idx = visible.indexOf(item);

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        if (idx < visible.length - 1) this.#focusItem(visible[idx + 1]);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (idx > 0) this.#focusItem(visible[idx - 1]);
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        if (!item.isBranch) break;
        if (!this.#getExpanded().includes(item.value)) {
          this.#toggleExpand(item.value);
        } else if (idx < visible.length - 1) {
          // Already open → move to first visible child
          this.#focusItem(visible[idx + 1]);
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (item.isBranch && this.#getExpanded().includes(item.value)) {
          this.#toggleExpand(item.value);
        } else {
          const parent = this.#getParentItem(item);
          if (parent) this.#focusItem(parent);
        }
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (!item.disabled) this.#activate(item.value, item.isBranch);
        break;
      }
      case "Home": {
        e.preventDefault();
        if (visible[0]) this.#focusItem(visible[0]);
        break;
      }
      case "End": {
        e.preventDefault();
        const last = visible[visible.length - 1];
        if (last) this.#focusItem(last);
        break;
      }
      case "*": {
        e.preventDefault();
        this.#expandSiblings(item);
        break;
      }
      default: {
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          this.#typeAhead(item, e.key);
        }
      }
    }
  };

  #expandSiblings(item: DuiTreeItemPrimitive): void {
    const siblings = Array.from(item.parentElement?.children ?? []).filter(
      (el): el is DuiTreeItemPrimitive =>
        el instanceof DuiTreeItemPrimitive && el.isBranch && !el.disabled,
    );

    const current = this.#getExpanded();
    const toAdd = siblings
      .map((s) => s.value)
      .filter((v) => !current.includes(v));
    if (toAdd.length === 0) return;

    const next = [...current, ...toAdd];
    if (this.expandedValues === undefined) {
      this.#internalExpanded = next;
    }
    this.dispatchEvent(expandedChangeEvent({ values: next }));
  }

  #typeAhead(from: DuiTreeItemPrimitive, char: string): void {
    this.#typeAheadBuffer += char.toLowerCase();
    if (this.#typeAheadTimeout) clearTimeout(this.#typeAheadTimeout);
    this.#typeAheadTimeout = setTimeout(() => {
      this.#typeAheadBuffer = "";
      this.#typeAheadTimeout = null;
    }, 500);

    const visible = this.#getVisibleItems();
    const fromIdx = visible.indexOf(from);
    const ordered = [
      ...visible.slice(fromIdx + 1),
      ...visible.slice(0, fromIdx + 1),
    ];

    const match = ordered.find((it) => {
      const label = it
        .querySelector("[slot='label']")
        ?.textContent?.trim()
        .toLowerCase() ?? "";
      return label.startsWith(this.#typeAheadBuffer);
    });
    if (match) this.#focusItem(match);
  }

  override render(): TemplateResult {
    return html`
      <div
        part="root"
        ?data-disabled=${this.disabled}
        @keydown=${this.#onKeyDown}
        @focusin=${this.#onFocusIn}
      >
        <slot></slot>
      </div>
    `;
  }
}
