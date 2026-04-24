/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
const styles = css `
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
    static tagName = "dui-sidebar-menu-item";
    static styles = [base, styles];
    render() {
        return html `<slot></slot>`;
    }
}
