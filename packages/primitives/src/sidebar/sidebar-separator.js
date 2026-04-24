/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
const styles = css `
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
    static tagName = "dui-sidebar-separator";
    static styles = [base, styles];
    render() {
        return html `<div class="Separator" role="separator"></div>`;
    }
}
