/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */

import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "../core/base.ts";

const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
`;

/**
 * `<dui-sidebar-group>` — Section container within the sidebar.
 *
 * Groups related menu items with an optional label.
 *
 * @slot label - Optional group label (use `<dui-sidebar-group-label>`).
 * @slot - Default slot for group content (menus, items, etc.).
 */
export class DuiSidebarGroupPrimitive extends LitElement {
  static tagName = "dui-sidebar-group" as const;
  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`
      <slot name="label"></slot>
      <slot></slot>
    `;
  }
}
