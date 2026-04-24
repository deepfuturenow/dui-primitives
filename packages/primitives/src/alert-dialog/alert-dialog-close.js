/** Ported from original DUI: deep-future-app/app/client/components/dui/alert-dialog */
import { css, html, LitElement } from "lit";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { alertDialogContext } from "./alert-dialog-context.ts";
const hostStyles = css `
  :host {
    display: contents;
  }
`;
/**
 * `<dui-alert-dialog-close>` — A close button wrapper for the alert dialog.
 *
 * Wraps slotted content and closes the alert dialog on click.
 *
 * @slot - Content that closes the alert dialog (usually a button).
 */
export class DuiAlertDialogClosePrimitive extends LitElement {
    static tagName = "dui-alert-dialog-close";
    static styles = [base, hostStyles];
    #ctx = new ContextConsumer(this, {
        context: alertDialogContext,
        subscribe: true,
    });
    #handleClick = () => {
        this.#ctx.value?.closeDialog();
    };
    render() {
        return html `
      <span @click="${this.#handleClick}">
        <slot></slot>
      </span>
    `;
    }
}
