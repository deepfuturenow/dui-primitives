import {
  css,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import { type TreeContext, treeContext } from "./tree-context.ts";

/**
 * Fired when a `has-children` branch is first expanded with no actual
 * `<dui-tree-item>` children slotted yet. Consumers respond by fetching data
 * and appending child items. Bubbles + composes so it can be heard at the
 * `<dui-tree>` root.
 */
export const loadChildrenEvent = customEvent<{ value: string }>(
  "dui-load-children",
  { bubbles: true, composed: true },
);

const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    outline: none;
  }

  [part="content"] {
    display: flex;
    align-items: center;
  }

  [part="indicator"] {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
  }

  .spacer {
    flex: 1;
    min-width: 0;
  }

  [part="group"][hidden] {
    display: none;
  }
`;

/**
 * `<dui-tree-item>` — A node in a `<dui-tree>`.
 *
 * Becomes a branch automatically when it contains child `<dui-tree-item>`
 * elements (detected via `slotchange` on the default slot), or when the
 * `has-children` attribute is set (for async / lazy loading).
 *
 * @slot label - The visible label/content for this node.
 * @slot end - Trailing content (status icons, badges, actions).
 * @slot - Child `<dui-tree-item>` elements (makes this item a branch).
 *
 * @csspart root - The treeitem row (`role="treeitem"`, receives tabindex).
 * @csspart content - Row layout (display: flex). Style backgrounds here, NOT on root.
 * @csspart indicator - Expand/collapse target. Always rendered (even on leaves)
 *                     so leaf and branch labels align at the same nesting level.
 *                     Use `[data-branch]` on the host to add chevron content.
 * @csspart group - Child group container (`role="group"`, hidden when collapsed).
 *
 * @cssprop --dui-tree-level - 1-based nesting depth, set automatically.
 *
 * @fires dui-load-children - First expand of a `has-children` branch with no
 *   children. Detail: `{ value: string }`.
 *
 * Host data-attributes (reflected for consumer styling):
 * `data-expanded`, `data-selected`, `data-disabled`,
 * `data-branch`, `data-leaf`, `data-focus`, `data-loading`, `data-level`.
 */
export class DuiTreeItemPrimitive extends LitElement {
  static tagName = "dui-tree-item" as const;
  static override styles = [base, styles];

  /** Unique identifier for this item. Required. */
  @property()
  accessor value = "";

  /** Disables this item and its descendants. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /**
   * Marks this item as a branch even when no children are slotted yet. Used
   * for async loading: render the chevron, fire `dui-load-children` on first
   * expand, then append children when the data arrives.
   */
  @property({ type: Boolean, attribute: "has-children", reflect: true })
  accessor hasChildren = false;

  /**
   * Set to `true` while loading children asynchronously. Reflects to host as
   * `aria-busy="true"` and `data-loading`. Consumer styles a spinner.
   */
  @property({ type: Boolean, reflect: true })
  accessor loading = false;

  @consume({ context: treeContext, subscribe: true })
  @state()
  accessor _ctx!: TreeContext;

  @state()
  accessor #hasSlottedChildren = false;

  // Tracks whether we've already fired dui-load-children for this expansion.
  // Reset when the branch collapses so re-expanding can re-fire if children
  // are still empty (e.g. previous load failed).
  #hasFiredLoad = false;

  /**
   * Public: whether this item is treated as a branch — either has slotted
   * `<dui-tree-item>` children OR has `has-children` set for lazy loading.
   * Used by the parent tree for keyboard nav and ARIA.
   */
  get isBranch(): boolean {
    return this.#hasSlottedChildren || this.hasChildren;
  }

  // ─── Computed state ───────────────────────────────────────────────────────

  get #level(): number {
    let level = 1;
    let el: Element | null = this.parentElement;
    while (el) {
      if (el.tagName === "DUI-TREE-ITEM") level++;
      if (el.tagName === "DUI-TREE") break;
      el = el.parentElement;
    }
    return level;
  }

  get #isExpanded(): boolean {
    return this._ctx?.expandedValues.includes(this.value) ?? false;
  }

  get #isSelected(): boolean {
    return this._ctx?.selectedValues.includes(this.value) ?? false;
  }

  /**
   * Disabled if: own `disabled` attr, tree-level disabled, OR any ancestor
   * tree-item has the `disabled` attribute. The parent tree's MutationObserver
   * triggers a re-render when an ancestor's `disabled` attr changes.
   */
  get #isDisabled(): boolean {
    if (this.disabled) return true;
    if (this._ctx?.disabled) return true;
    let el: Element | null = this.parentElement;
    while (el) {
      if (el.tagName === "DUI-TREE") break;
      if (
        el.tagName === "DUI-TREE-ITEM" &&
        (el as HTMLElement).hasAttribute("disabled")
      ) {
        return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  get #isFocused(): boolean {
    return this._ctx?.focusedValue === this.value;
  }

  get #siblings(): Element[] {
    return Array.from(this.parentElement?.children ?? []).filter(
      (el) => el.tagName === "DUI-TREE-ITEM",
    );
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  protected override willUpdate(_changed: PropertyValues): void {
    // Async-loading: when a `has-children` branch is first expanded with no
    // actual children slotted yet, fire `dui-load-children` (once per
    // expand-cycle, reset on collapse).
    if (this.isBranch && this.#isExpanded) {
      const empty = !this.#hasSlottedChildren;
      if (empty && !this.#hasFiredLoad) {
        this.#hasFiredLoad = true;
        this.dispatchEvent(loadChildrenEvent({ value: this.value }));
      }
    } else if (!this.#isExpanded) {
      this.#hasFiredLoad = false;
    }
  }

  protected override updated(): void {
    // CSS custom property for level (inherits through shadow boundary)
    this.style.setProperty("--dui-tree-level", String(this.#level));

    // Reflect state attrs to the HOST element. The spec also puts these on
    // [part="root"], but consumers should style based on host attrs because:
    //   - [part="root"] contains the children group → :hover bleeds
    //   - Cleanest pattern is `[data-x]::part(content)` (host attr + part)
    this.#reflect("data-expanded", this.#isExpanded && this.isBranch);
    this.#reflect("data-selected", this.#isSelected);
    this.#reflect("data-disabled", this.#isDisabled);
    this.#reflect("data-branch", this.isBranch);
    this.#reflect("data-leaf", !this.isBranch);
    this.#reflect("data-focus", this.#isFocused);
    this.#reflect("data-loading", this.loading);
    this.setAttribute("data-level", String(this.#level));

    // aria-busy when loading
    if (this.loading) {
      this.setAttribute("aria-busy", "true");
    } else {
      this.removeAttribute("aria-busy");
    }
  }

  #reflect(name: string, on: boolean): void {
    if (on) {
      if (!this.hasAttribute(name)) this.setAttribute(name, "");
    } else if (this.hasAttribute(name)) {
      this.removeAttribute(name);
    }
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  #onSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const has = slot
      .assignedElements()
      .some((el) => el.tagName === "DUI-TREE-ITEM");
    if (has !== this.#hasSlottedChildren) {
      this.#hasSlottedChildren = has;
    }
  };

  /**
   * Row click. Stops propagation so a click on a nested item doesn't bubble
   * to ancestor items' click handlers (which would also activate them).
   */
  #onRowClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (this.#isDisabled) return;
    this._ctx?.activate(this.value, this.isBranch);
  };

  /**
   * Indicator click. Branches: stop propagation + toggle expand. Leaves:
   * let it bubble to the row handler (treat as row click).
   */
  #onIndicatorClick = (e: MouseEvent): void => {
    if (!this.isBranch) return;
    e.stopPropagation();
    if (this.#isDisabled) return;
    this._ctx?.toggleExpand(this.value);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const isBranch = this.isBranch;
    const isExpanded = this.#isExpanded && isBranch;
    const isDisabled = this.#isDisabled;
    const isSelected = this.#isSelected;
    const isFocused = this.#isFocused;
    const isLoading = this.loading;
    const level = this.#level;
    const siblings = this.#siblings;
    const selectionMode = this._ctx?.selectionMode ?? "none";

    return html`
      <div
        part="root"
        role="treeitem"
        tabindex=${isFocused ? 0 : -1}
        aria-level=${level}
        aria-setsize=${siblings.length}
        aria-posinset=${siblings.indexOf(this) + 1}
        aria-expanded=${isBranch ? String(isExpanded) : nothing}
        aria-selected=${selectionMode !== "none" ? String(isSelected) : nothing}
        aria-disabled=${isDisabled ? "true" : nothing}
        aria-busy=${isLoading ? "true" : nothing}
        data-level=${level}
        ?data-expanded=${isExpanded}
        ?data-selected=${isSelected}
        ?data-disabled=${isDisabled}
        ?data-branch=${isBranch}
        ?data-leaf=${!isBranch}
        ?data-focus=${isFocused}
        ?data-loading=${isLoading}
        @click=${this.#onRowClick}
      >
        <div part="content">
          <span
            part="indicator"
            ?data-branch=${isBranch}
            ?data-leaf=${!isBranch}
            ?data-loading=${isLoading}
            @click=${this.#onIndicatorClick}
          ></span>
          <slot name="label"></slot>
          <span class="spacer"></span>
          <slot name="end"></slot>
        </div>
        <div
          part="group"
          role=${isBranch ? "group" : nothing}
          ?hidden=${!isBranch || !isExpanded}
        >
          <slot @slotchange=${this.#onSlotChange}></slot>
        </div>
      </div>
    `;
  }
}
