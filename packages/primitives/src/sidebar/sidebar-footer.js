/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
const styles = css `
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
    static tagName = "dui-sidebar-footer";
    static styles = [base, styles];
    render() {
        return html `<slot></slot>`;
    }
}
