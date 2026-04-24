/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
const styles = css `
  :host {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    position: relative;
    overflow: hidden;
    container-type: size;
  }
`;
/**
 * `<dui-sidebar-inset>` — Content wrapper adjacent to the sidebar.
 *
 * Fills the remaining space next to the sidebar. Provides a container
 * query context for responsive content.
 *
 * @slot - Default slot for main page content.
 */
export class DuiSidebarInsetPrimitive extends LitElement {
    static tagName = "dui-sidebar-inset";
    static styles = [base, styles];
    render() {
        return html `<slot></slot>`;
    }
}
