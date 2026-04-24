/** Ported from original DUI: deep-future-app/app/client/components/dui/popover */

import { css, html, LitElement, type TemplateResult } from "lit";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { popoverContext } from "./popover-context.ts";

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
 * `<dui-popover-trigger>` — Click-to-toggle trigger for the popover.
 *
 * @slot - Content that triggers the popover (usually a button).
 */
export class DuiPopoverTriggerPrimitive extends LitElement {
  static tagName = "dui-popover-trigger" as const;
  static override styles = [base, hostStyles, componentStyles];

  #ctx = new ContextConsumer(this, {
    context: popoverContext,
    subscribe: true,
  });

  #handleClick = (e: MouseEvent): void => {
    e.stopPropagation();
    this.#updateTriggerEl();
    this.#ctx.value?.togglePopover();
  };

  #updateTriggerEl(): void {
    const slot = this.shadowRoot?.querySelector("slot");
    const el = (slot?.assignedElements()?.[0] as HTMLElement) ?? this;
    this.#ctx.value?.setTriggerEl(el);
  }

  /** Mirror open state onto the slotted element so its theme can style it. */
  #syncOpenAttr(): void {
    const slot = this.shadowRoot?.querySelector("slot");
    const el = slot?.assignedElements()?.[0] as HTMLElement | undefined;
    if (!el) return;
    const isOpen = this.#ctx.value?.open ?? false;
    if (isOpen) {
      el.setAttribute("data-open", "");
    } else {
      el.removeAttribute("data-open");
    }
  }

  protected override updated(): void {
    this.#syncOpenAttr();
  }

  override render(): TemplateResult {
    const isOpen = this.#ctx.value?.open ?? false;
    const popupId = this.#ctx.value?.popupId ?? "";
    const triggerId = this.#ctx.value?.triggerId ?? "";

    return html`
      <span
        class="Trigger"
        part="trigger"
        id="${triggerId}"
        aria-haspopup="dialog"
        aria-expanded="${isOpen}"
        aria-controls="${isOpen ? popupId : ""}"
        ?data-popup-open="${isOpen}"
        @click="${this.#handleClick}"
      >
        <slot></slot>
      </span>
    `;
  }
}
