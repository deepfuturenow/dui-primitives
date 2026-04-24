/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
const styles = css `
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
    static tagName = "dui-sidebar-group";
    static styles = [base, styles];
    render() {
        return html `
      <slot name="label"></slot>
      <slot></slot>
    `;
    }
}
