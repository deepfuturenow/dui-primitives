/** Ported from original DUI: deep-future-app/app/client/components/dui/menu */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "../core/base.ts";

const hostStyles = css`
  :host {
    display: block;
  }

  :host([disabled]) {
    pointer-events: none;
  }
`;

const componentStyles = css`
  .Item {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
`;

/**
 * `<dui-menu-item>` — An item within a `dui-menu`.
 *
 * @slot default - Item content (text, icons, etc.).
 */
export class DuiMenuItemPrimitive extends LitElement {
  static tagName = "dui-menu-item" as const;
  static override styles = [base, hostStyles, componentStyles];

  /** Whether the item is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "menuitem");
    this.setAttribute("tabindex", "-1");
  }

  override render(): TemplateResult {
    return html`
      <div class="Item" part="root" aria-disabled="${this.disabled}">
        <slot></slot>
      </div>
    `;
  }
}
