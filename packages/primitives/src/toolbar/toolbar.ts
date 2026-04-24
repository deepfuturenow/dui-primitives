/** Ported from original DUI: deep-future-app/app/client/components/dui/toolbar */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "../core/base.ts";

const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    box-sizing: border-box;
  }

  [part="left"] {
    justify-self: start;
    display: flex;
    align-items: center;
  }

  [part="center"] {
    justify-self: center;
    grid-column: 2;
    display: flex;
    align-items: center;
  }

  [part="right"] {
    justify-self: end;
    grid-column: 3;
    display: flex;
    align-items: center;
  }
`;

export class DuiToolbarPrimitive extends LitElement {
  static tagName = "dui-toolbar" as const;
  static override styles = [base, styles];

  /** Adds horizontal and vertical padding. */
  @property({ type: Boolean, reflect: true })
  accessor inset = false;

  /** Reduces left inset padding when a button is the first item. */
  @property({ type: Boolean, reflect: true, attribute: "has-button-left" })
  accessor hasButtonLeft = false;

  /** Reduces right inset padding when a button is the last item. */
  @property({ type: Boolean, reflect: true, attribute: "has-button-right" })
  accessor hasButtonRight = false;

  override render(): TemplateResult {
    return html`
      <nav part="root" role="toolbar">
        <div part="left">
          <slot name="left"></slot>
        </div>
        <div part="center">
          <slot name="center"></slot>
        </div>
        <div part="right">
          <slot name="right"></slot>
        </div>
      </nav>
    `;
  }
}
