/** Ported from original DUI: deep-future-app/app/client/components/dui/dialog */

import { css, html, LitElement, type TemplateResult } from "lit";
import { ContextConsumer } from "@lit/context";
import { base } from "../core/base.ts";
import { dialogContext } from "./dialog-context.ts";

const hostStyles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-dialog-close>` — A close button wrapper for the dialog.
 *
 * Wraps slotted content and closes the dialog on click.
 *
 * @slot - Content that closes the dialog (usually a button).
 */
export class DuiDialogClosePrimitive extends LitElement {
  static tagName = "dui-dialog-close" as const;
  static override styles = [base, hostStyles];

  #ctx = new ContextConsumer(this, {
    context: dialogContext,
    subscribe: true,
  });

  #handleClick = (): void => {
    this.#ctx.value?.closeDialog();
  };

  override render(): TemplateResult {
    return html`
      <span @click="${this.#handleClick}">
        <slot></slot>
      </span>
    `;
  }
}
