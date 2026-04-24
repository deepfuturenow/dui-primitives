/** Ported from original DUI: deep-future-app/app/client/components/dui/breadcrumb */
import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: inline-flex;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
  }
`;
/**
 * `<dui-breadcrumb-item>` — List item wrapper for a single breadcrumb entry.
 *
 * @slot - A breadcrumb link, page, or ellipsis.
 * @csspart root - The `<li>` element.
 */
export class DuiBreadcrumbItemPrimitive extends LitElement {
    static tagName = "dui-breadcrumb-item";
    static styles = [base, styles];
    render() {
        return html `
      <li part="root">
        <slot></slot>
      </li>
    `;
    }
}
