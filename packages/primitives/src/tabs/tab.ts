/** Ported from original DUI: deep-future-app/app/client/components/dui/tabs */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { type TabsContext, tabsContext } from "./tabs-context.ts";

const styles = css`
  :host {
    display: block;
  }

  [part="tab"] {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    margin: 0;
    outline: 0;
    background: none;
    appearance: none;
    font-family: inherit;
    user-select: none;
    white-space: nowrap;
    word-break: keep-all;
    cursor: pointer;
  }

  [part="tab"][data-disabled] {
    cursor: not-allowed;
  }
`;

/**
 * Individual tab trigger button.
 */
export class DuiTabPrimitive extends LitElement {
  static tagName = "dui-tab" as const;
  static override styles = [base, styles];

  /** Tab value used to match with the corresponding panel. */
  @property()
  accessor value = "";

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @consume({ context: tabsContext, subscribe: true })
  accessor _ctx!: TabsContext;

  get #isActive(): boolean {
    return this._ctx?.value === this.value;
  }

  #handleClick = (): void => {
    if (this.disabled) return;
    this._ctx?.select(this.value);
  };

  #handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._ctx?.select(this.value);
    }
  };

  override render(): TemplateResult {
    const isActive = this.#isActive;

    return html`
      <button
        part="tab"
        role="tab"
        aria-selected=${isActive}
        ?data-active=${isActive}
        ?data-disabled=${this.disabled}
        ?disabled=${this.disabled}
        tabindex=${isActive ? 0 : -1}
        @click=${this.#handleClick}
        @keydown=${this.#handleKeyDown}
      >
        <slot></slot>
      </button>
    `;
  }
}
