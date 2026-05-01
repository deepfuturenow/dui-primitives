import { css, html, LitElement, type TemplateResult } from "lit";
import { ContextConsumer } from "@lit/context";
import { base } from "../core/base.ts";
import { toastItemContext } from "./toast-context.ts";

const hostStyles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-toast-action>` — Action button wrapper for a toast.
 *
 * Wraps slotted content (typically a `<button>` or `<dui-button>`). Clicking
 * the slotted content dismisses the parent toast with reason `"action"`.
 *
 * If you need to run async work before dismissal, attach your own click handler
 * to the slotted button and call `event.stopPropagation()` to suppress the
 * automatic dismiss; then dismiss programmatically when ready.
 *
 * @slot - Content that triggers the action (typically a button).
 */
export class DuiToastActionPrimitive extends LitElement {
  static tagName = "dui-toast-action" as const;
  static override styles = [base, hostStyles];

  #ctx = new ContextConsumer(this, {
    context: toastItemContext,
    subscribe: true,
  });

  #handleClick = (): void => {
    this.#ctx.value?.dismiss("action");
  };

  override render(): TemplateResult {
    return html`
      <span part="action" @click=${this.#handleClick}>
        <slot></slot>
      </span>
    `;
  }
}
