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
 * `<dui-sidebar-header>` — Top section of the sidebar.
 *
 * @slot - Default slot for header content (logo, title, etc.).
 */
export class DuiSidebarHeaderPrimitive extends LitElement {
    static tagName = "dui-sidebar-header";
    static styles = [base, styles];
    render() {
        return html `<slot></slot>`;
    }
}
