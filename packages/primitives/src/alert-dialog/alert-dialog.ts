/** Ported from original DUI: deep-future-app/app/client/components/dui/alert-dialog */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import {
  type AlertDialogContext,
  alertDialogContext,
} from "./alert-dialog-context.ts";

export type AlertDialogOpenChangeDetail = { open: boolean };

export const openChangeEvent = customEvent<AlertDialogOpenChangeDetail>(
  "open-change",
  { bubbles: true, composed: true },
);

const hostStyles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-alert-dialog>` — Root element for the alert dialog compound component.
 *
 * Manages open/close state and provides context to child elements.
 * Does not render visible DOM — uses `display: contents`.
 *
 * Unlike `<dui-dialog>`, alert dialogs do NOT close on backdrop click,
 * requiring explicit user action to dismiss.
 *
 * @slot - Default slot for trigger, popup, and other alert dialog parts.
 * @fires open-change - Fired when the dialog opens or closes. Detail: { open: boolean }
 */
export class DuiAlertDialogPrimitive extends LitElement {
  static tagName = "dui-alert-dialog" as const;
  static override styles = [base, hostStyles];

  /** Controls the dialog open state (controlled mode). */
  @property({ type: Boolean, reflect: true })
  accessor open: boolean | undefined = undefined;

  /** Initial open state for uncontrolled mode. */
  @property({ type: Boolean, attribute: "default-open" })
  accessor defaultOpen = false;

  @state()
  accessor #internalOpen = false;

  #instanceId = crypto.randomUUID().slice(0, 8);
  #dialogId = `dui-alert-dialog-${this.#instanceId}`;
  #triggerId = `dui-alert-trigger-${this.#instanceId}`;
  #titleId = `dui-alert-title-${this.#instanceId}`;
  #descriptionId = `dui-alert-desc-${this.#instanceId}`;

  get #isOpen(): boolean {
    return this.open ?? this.#internalOpen;
  }

  #openDialog = (): void => {
    if (this.open === undefined) {
      this.#internalOpen = true;
    }
    this.dispatchEvent(openChangeEvent({ open: true }));
  };

  #closeDialog = (): void => {
    if (this.open === undefined) {
      this.#internalOpen = false;
    }
    this.dispatchEvent(openChangeEvent({ open: false }));
  };

  @provide({ context: alertDialogContext })
  @state()
  accessor _ctx: AlertDialogContext = this.#buildContext();

  #buildContext(): AlertDialogContext {
    return {
      open: this.#isOpen,
      dialogId: this.#dialogId,
      triggerId: this.#triggerId,
      titleId: this.#titleId,
      descriptionId: this.#descriptionId,
      openDialog: this.#openDialog,
      closeDialog: this.#closeDialog,
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.open === undefined && this.defaultOpen) {
      this.#internalOpen = true;
    }
    this._ctx = this.#buildContext();
  }

  override willUpdate(): void {
    this._ctx = this.#buildContext();
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
