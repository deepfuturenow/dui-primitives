/** Ported from original DUI: deep-future-app/app/client/components/dui/dialog */

import { css, html, LitElement, type TemplateResult } from "lit";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { dialogContext } from "./dialog-context.ts";

const hostStyles = css`
  :host {
    display: contents;
  }
`;

const componentStyles = css`
  .Trigger {
    display: contents;
  }
`;

/**
 * `<dui-dialog-trigger>` — Behavioral wrapper that opens the dialog.
 *
 * Wraps slotted content and opens the dialog on click.
 *
 * @slot - Content that triggers the dialog (usually a `<dui-button>`).
 */
export class DuiDialogTriggerPrimitive extends LitElement {
  static tagName = "dui-dialog-trigger" as const;
  static override styles = [base, hostStyles, componentStyles];

  #ctx = new ContextConsumer(this, {
    context: dialogContext,
    subscribe: true,
  });

  #handleClick = (): void => {
    this.#ctx.value?.openDialog();
  };

  override render(): TemplateResult {
    const isOpen = this.#ctx.value?.open ?? false;
    const triggerId = this.#ctx.value?.triggerId ?? "";
    const dialogId = this.#ctx.value?.dialogId ?? "";

    return html`
      <span
        class="Trigger"
        part="trigger"
        id="${triggerId}"
        aria-haspopup="dialog"
        aria-expanded="${isOpen}"
        aria-controls="${isOpen ? dialogId : ""}"
        ?data-popup-open="${isOpen}"
        @click="${this.#handleClick}"
      >
        <slot></slot>
      </span>
    `;
  }
}
