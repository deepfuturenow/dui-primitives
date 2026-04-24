/** Ported from original DUI: deep-future-app/app/client/components/dui/tabs */
import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
const styles = css `
  :host {
    display: block;
    position: absolute;
    z-index: -1;
    left: 0;
    top: 50%;
    translate: var(--active-tab-left, 0) -50%;
    width: var(--active-tab-width, 0);
    pointer-events: none;
    transition-property: translate, width;
  }
`;
/**
 * Animated visual indicator that highlights the active tab.
 * Place inside dui-tabs-list.
 */
export class DuiTabsIndicatorPrimitive extends LitElement {
    static tagName = "dui-tabs-indicator";
    static styles = [base, styles];
    render() {
        return html `<span part="indicator"></span>`;
    }
}
