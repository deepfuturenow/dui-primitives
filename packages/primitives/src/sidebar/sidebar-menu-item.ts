/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */

import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "../core/base.ts";

const styles = css`
  :host {
    display: list-item;
  }
`;

/**
 * `<dui-sidebar-menu-item>` — Individual navigation item in a sidebar menu.
 *
 * @slot - Default slot for a `<dui-sidebar-menu-button>` or other content.
 */
export class DuiSidebarMenuItemPrimitive extends LitElement {
  static tagName = "dui-sidebar-menu-item" as const;
  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
