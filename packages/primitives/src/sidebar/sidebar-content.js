/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
const styles = css `
  :host {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
`;
/**
 * `<dui-sidebar-content>` — Scrollable content section of the sidebar.
 *
 * Wraps its slot in a scroll area to provide overflow scrolling.
 *
 * @slot - Default slot for sidebar groups, menus, etc.
 */
export class DuiSidebarContentPrimitive extends LitElement {
    static tagName = "dui-sidebar-content";
    static styles = [base, styles];
    render() {
        return html `
      <dui-scroll-area>
        <slot></slot>
      </dui-scroll-area>
    `;
    }
}
