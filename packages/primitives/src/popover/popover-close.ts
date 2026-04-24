/** Ported from original DUI: deep-future-app/app/client/components/dui/popover */

import { css, html, LitElement, type TemplateResult } from "lit";
import { ContextConsumer } from "@lit/context";
import { base } from "../core/base.ts";
import { popoverContext } from "./popover-context.ts";

const hostStyles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-popover-close>` — A close button wrapper for the popover.
 *
 * @slot - Content that closes the popover (usually a button or icon).
 */
export class DuiPopoverClosePrimitive extends LitElement {
  static tagName = "dui-popover-close" as const;
  static override styles = [base, hostStyles];

  #ctx = new ContextConsumer(this, {
    context: popoverContext,
    subscribe: true,
  });

  #handleClick = (): void => {
    this.#ctx.value?.closePopover();
  };

  override render(): TemplateResult {
    return html`
      <span @click="${this.#handleClick}">
        <slot></slot>
      </span>
    `;
  }
}
