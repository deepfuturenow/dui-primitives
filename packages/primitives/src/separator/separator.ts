import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
  }

  :host([orientation="vertical"]) {
    display: inline-block;
    align-self: stretch;
    height: 100%;
  }

  [part="root"] {
    border: none;
    margin: 0;
    padding: 0;
  }
`;

/**
 * `<dui-separator>` — A visual divider between content sections.
 *
 * @csspart root - The separator element.
 */
export class DuiSeparatorPrimitive extends LitElement {
  static tagName = "dui-separator" as const;

  static override styles = [base, styles];

  @property({ reflect: true })
  accessor orientation: "horizontal" | "vertical" = "horizontal";

  override render(): TemplateResult {
    return html`
      <div
        part="root"
        role="separator"
        aria-orientation="${this.orientation}"
      ></div>
    `;
  }
}
