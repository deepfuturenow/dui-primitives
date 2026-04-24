/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
const styles = css `
  .Menu {
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;
/**
 * `<dui-sidebar-menu>` — Navigation list within a sidebar group.
 *
 * Renders a semantic `<ul>` for menu items.
 *
 * @slot - Default slot for `<dui-sidebar-menu-item>` elements.
 */
export class DuiSidebarMenuPrimitive extends LitElement {
    static tagName = "dui-sidebar-menu";
    static styles = [base, styles];
    render() {
        return html `
      <ul class="Menu" role="list">
        <slot></slot>
      </ul>
    `;
    }
}
