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
 * `<dui-breadcrumb-link>` — Styled wrapper for a clickable breadcrumb link.
 * Consumer slots in their own `<a>` element.
 *
 * @slot - An `<a>` element for navigation.
 * @csspart root - The wrapper `<span>` element.
 */
export class DuiBreadcrumbLinkPrimitive extends LitElement {
    static tagName = "dui-breadcrumb-link";
    static styles = [base, styles];
    render() {
        return html `
      <span part="root">
        <slot></slot>
      </span>
    `;
    }
}
