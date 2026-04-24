import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: inline-block;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
  }
`;
/**
 * `<dui-badge>` — A badge/chip component for status indicators and labels.
 *
 * @slot - Badge content — text and/or icons.
 * @csspart root - The badge span element.
 */
export class DuiBadgePrimitive extends LitElement {
    static tagName = "dui-badge";
    static styles = [base, styles];
    render() {
        return html `
      <span part="root">
        <slot></slot>
      </span>
    `;
    }
}
