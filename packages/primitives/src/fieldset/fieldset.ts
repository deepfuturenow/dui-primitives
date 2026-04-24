import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "../core/base.ts";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    border: none;
    margin: 0;
    padding: 0;
    min-width: 0;
  }

  [part="legend"]:not([data-slotted]) { display: none; }
  [part="legend"] { padding: 0; }
`;

/**
 * `<dui-fieldset>` — Semantic grouping for related form fields.
 *
 * Wraps content in a native `<fieldset>` element, providing semantic
 * grouping for radio groups, checkbox groups, or logical field clusters.
 *
 * @slot legend - Legend text (e.g. `<span slot="legend">Personal Info</span>`).
 * @slot - Default slot for field children.
 * @csspart root - The native `<fieldset>` element.
 * @csspart legend - The native `<legend>` element.
 */
export class DuiFieldsetPrimitive extends LitElement {
  static tagName = "dui-fieldset" as const;

  static override styles = [base, styles];

  /** Disables all child form controls. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @state()
  accessor #hasLegend = false;

  #onLegendSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this.#hasLegend = slot.assignedNodes({ flatten: true }).length > 0;
  };

  override render(): TemplateResult {
    return html`
      <fieldset
        part="root"
        ?disabled="${this.disabled}"
        ?data-disabled="${this.disabled}"
      >
        <legend part="legend" ?data-slotted="${this.#hasLegend}">
          <slot name="legend" @slotchange="${this.#onLegendSlotChange}"></slot>
        </legend>
        <slot></slot>
      </fieldset>
    `;
  }
}
