import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "../core/base.ts";



/** Structural styles only — layout CSS. */
const styles = css`
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
  static tagName = "dui-badge" as const;

  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`
      <span part="root">
        <slot></slot>
      </span>
    `;
  }
}
