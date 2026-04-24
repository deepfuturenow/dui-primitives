/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */

import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "../core/base.ts";

const styles = css`
  :host {
    display: flex;
    flex-direction: column;
  }
`;

/**
 * `<dui-sidebar-footer>` — Bottom section of the sidebar.
 *
 * @slot - Default slot for footer content (user info, settings, etc.).
 */
export class DuiSidebarFooterPrimitive extends LitElement {
  static tagName = "dui-sidebar-footer" as const;
  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
