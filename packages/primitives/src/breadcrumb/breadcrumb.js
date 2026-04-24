/** Ported from original DUI: deep-future-app/app/client/components/dui/breadcrumb */
import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;
/**
 * `<dui-breadcrumb>` — Root navigation wrapper for breadcrumb trails.
 * Renders a `<nav>` with an internal `<ol>` for semantic structure.
 *
 * @slot - Breadcrumb items and separators.
 * @csspart root - The `<ol>` element.
 */
export class DuiBreadcrumbPrimitive extends LitElement {
    static tagName = "dui-breadcrumb";
    static styles = [base, styles];
    render() {
        return html `
      <nav aria-label="breadcrumb">
        <ol part="root">
          <slot></slot>
        </ol>
      </nav>
    `;
    }
}
