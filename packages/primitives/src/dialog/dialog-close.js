/** Ported from original DUI: deep-future-app/app/client/components/dui/dialog */
import { css, html, LitElement } from "lit";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { dialogContext } from "./dialog-context.ts";
const hostStyles = css `
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
    static tagName = "dui-dialog-close";
    static styles = [base, hostStyles];
    #ctx = new ContextConsumer(this, {
        context: dialogContext,
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
