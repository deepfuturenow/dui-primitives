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
 * `<dui-toast-close>` — Close button wrapper for a toast.
 *
 * Wraps slotted content. Clicking the slotted content dismisses the parent
 * toast with reason `"close"`.
 *
 * @slot - Content that closes the toast (typically a button or icon).
 */
export class DuiToastClosePrimitive extends LitElement {
  static tagName = "dui-toast-close" as const;
  static override styles = [base, hostStyles];

  #ctx = new ContextConsumer(this, {
    context: toastItemContext,
    subscribe: true,
  });

  #handleClick = (): void => {
    this.#ctx.value?.dismiss("close");
  };

  override render(): TemplateResult {
    return html`
      <span part="close" @click=${this.#handleClick}>
        <slot></slot>
      </span>
    `;
  }
}
