/** Ported from original DUI: deep-future-app/app/client/components/dui/command */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { type CommandContext, commandContext } from "./command-context.ts";

let itemIdCounter = 0;
const nextItemId = () => `dui-command-item-${++itemIdCounter}`;

const styles = css`
  :host {
    display: block;
  }

  :host([data-hidden]) .Item {
    display: none;
  }

  .Item {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    outline: none;
  }
`;

export class DuiCommandItemPrimitive extends LitElement {
  static tagName = "dui-command-item" as const;
  static override styles = [base, styles];

  /** The value this item represents. */
  @property({ type: String })
  accessor value = "";

  /** Additional search keywords. */
  @property({ type: Array, attribute: false })
  accessor keywords: string[] = [];

  /** Whether this item is disabled. */
  @property({ type: Boolean })
  accessor disabled = false;

  @consume({ context: commandContext, subscribe: true })
  accessor _ctx!: CommandContext;

  #id = nextItemId();

  // Track previous own-property values to avoid infinite update loops
  #prevValue: string | undefined = undefined;
  #prevKeywords: string[] | undefined = undefined;
  #prevDisabled: boolean | undefined = undefined;
  #registered = false;

  get #isSelected(): boolean {
    return this._ctx?.selectedItemId === this.#id;
  }

  get #isVisible(): boolean {
    if (!this._ctx) return true;
    return this._ctx.getScore(this.#id) > 0;
  }

  #getGroupId(): string | undefined {
    const groupHost = this.closest("[data-group-id]");
    return groupHost?.getAttribute("data-group-id") ?? undefined;
  }

  #buildEntry() {
    return {
      id: this.#id,
      value: this.value,
      keywords: this.keywords,
      textContent: this.textContent?.trim() ?? "",
      disabled: this.disabled,
      groupId: this.#getGroupId(),
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Defer registration to next frame so context is available
    requestAnimationFrame(() => {
      if (!this.isConnected) return;
      this._ctx?.registerItem(this.#buildEntry());
      this.#registered = true;
      this.#prevValue = this.value;
      this.#prevKeywords = this.keywords;
      this.#prevDisabled = this.disabled;
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ctx?.unregisterItem(this.#id);
    this.#registered = false;
  }

  override willUpdate(): void {
    // Only call updateItem when own properties change, not on every context update
    if (this.#registered) {
      const valueChanged = this.#prevValue !== this.value;
      const keywordsChanged = this.#prevKeywords !== this.keywords;
      const disabledChanged = this.#prevDisabled !== this.disabled;

      if (valueChanged || keywordsChanged || disabledChanged) {
        this._ctx?.updateItem(this.#buildEntry());
        this.#prevValue = this.value;
        this.#prevKeywords = this.keywords;
        this.#prevDisabled = this.disabled;
      }
    }

    // Toggle data-hidden attribute
    if (this._ctx?.shouldFilter) {
      if (!this.#isVisible) {
        this.setAttribute("data-hidden", "");
      } else {
        this.removeAttribute("data-hidden");
      }
    } else {
      this.removeAttribute("data-hidden");
    }

    // Update selected attribute
    if (this.#isSelected) {
      this.setAttribute("data-selected", "");
    } else {
      this.removeAttribute("data-selected");
    }
  }

  override updated(): void {
    // Scroll into view when selected
    if (this.#isSelected) {
      this.scrollIntoView({ block: "nearest" });
    }
  }

  #handleMouseMove = (): void => {
    if (!this.disabled && this._ctx?.selectedItemId !== this.#id) {
      this._ctx?.selectItem(this.#id);
    }
  };

  #handleClick = (): void => {
    if (!this.disabled) {
      this._ctx?.handleItemSelect(this.value);
    }
  };

  override render(): TemplateResult {
    return html`
      <div
        class="Item"
        role="option"
        id="${this.#id}"
        aria-selected="${this.#isSelected}"
        aria-disabled="${this.disabled}"
        ?data-selected="${this.#isSelected}"
        ?data-disabled="${this.disabled}"
        @mousemove="${this.#handleMouseMove}"
        @click="${this.#handleClick}"
      >
        <slot></slot>
      </div>
    `;
  }
}
