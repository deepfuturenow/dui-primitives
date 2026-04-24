/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */

import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "../core/base.ts";

const styles = css`
  :host {
    display: block;
  }

  .Separator {
    /* Structural only — height and color from theme */
  }
`;

/**
 * `<dui-sidebar-separator>` — Visual divider within the sidebar.
 *
 * Renders a horizontal rule with `role="separator"`.
 */
export class DuiSidebarSeparatorPrimitive extends LitElement {
  static tagName = "dui-sidebar-separator" as const;
  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`<div class="Separator" role="separator"></div>`;
  }
}
