import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "../core/base.ts";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
    min-width: 100%;
  }

  [part="root"] {
    display: grid;
    grid-template-columns: repeat(var(--_columns, 3), 1fr);
    box-sizing: border-box;
  }

  :host([columns="1"]) { --_columns: 1; }
  :host([columns="2"]) { --_columns: 2; }
  :host([columns="3"]) { --_columns: 3; }
  :host([columns="4"]) { --_columns: 4; }

  /* Responsive collapse: narrow viewports reduce columns */
  @media (max-width: 768px) {
    :host([columns="3"]) { --_columns: 2; }
    :host([columns="4"]) { --_columns: 2; }
  }

  @media (max-width: 480px) {
    :host([columns="2"]),
    :host([columns="3"]),
    :host([columns="4"]) {
      --_columns: 1;
    }
  }
`;

/**
 * `<dui-card-grid>` — A responsive grid layout for cards and panels.
 *
 * Distributes children into equal-width columns that collapse at narrow
 * container widths. Use `columns` to set the maximum column count.
 *
 * @slot - Grid children (cards, panels, or any block content).
 * @csspart root - The grid container element.
 */
export class DuiCardGridPrimitive extends LitElement {
  static tagName = "dui-card-grid" as const;

  static override styles = [base, styles];

  /** Maximum number of columns (1–4). Responsive breakpoints reduce this automatically. */
  @property({ reflect: true })
  accessor columns: string = "3";

  override render(): TemplateResult {
    return html`
      <div part="root">
        <slot></slot>
      </div>
    `;
  }
}
