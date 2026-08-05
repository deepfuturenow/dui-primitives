import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "../core/base.ts";



/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: inline-block;
    /* Opt-in truncation bound. Defaults to none, so badges size to their
      content as before. Set --badge-max-width to clamp the width; the label
      then truncates its text with an ellipsis. */
    max-width: var(--badge-max-width, none);
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    max-width: 100%;
  }

  [part="label"] {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/**
 * `<dui-badge>` — A badge/chip component for status indicators and labels.
 *
 * Set the `--badge-max-width` custom property to truncate long content with an
 * ellipsis; unset, the badge sizes to its content.
 *
 * @slot - Badge content — text and/or icons.
 * @csspart root - The badge span element.
 * @csspart label - The truncating text wrapper around the slotted content.
 */
export class DuiBadgePrimitive extends LitElement {
  static tagName = "dui-badge" as const;

  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`
      <span part="root">
        <span part="label"><slot></slot></span>
      </span>
    `;
  }
}
