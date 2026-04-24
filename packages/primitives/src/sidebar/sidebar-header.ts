/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */

import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "@dui/core/base";

const styles = css`
  :host {
    display: flex;
    flex-direction: column;
  }
`;

/**
 * `<dui-sidebar-header>` — Top section of the sidebar.
 *
 * @slot - Default slot for header content (logo, title, etc.).
 */
export class DuiSidebarHeaderPrimitive extends LitElement {
  static tagName = "dui-sidebar-header" as const;
  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
