/** Ported from original DUI: deep-future-app/app/client/components/dui/preview-card */

import { css, html, LitElement, type TemplateResult } from "lit";
import { ContextConsumer } from "@lit/context";
import { base } from "../core/base.ts";
import { previewCardContext } from "./preview-card-context.ts";

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
 * `<dui-preview-card-trigger>` — The element that triggers the preview card on hover/focus.
 *
 * @slot - Content that triggers the preview card.
 */
export class DuiPreviewCardTriggerPrimitive extends LitElement {
  static tagName = "dui-preview-card-trigger" as const;
  static override styles = [base, hostStyles, componentStyles];

  #ctx = new ContextConsumer(this, {
    context: previewCardContext,
    subscribe: true,
  });

  #handleMouseEnter = (): void => {
    this.#updateTriggerEl();
    this.#ctx.value?.openPreviewCard();
  };

  #handleMouseLeave = (): void => {
    this.#ctx.value?.closePreviewCard();
  };

  #handleFocus = (): void => {
    this.#updateTriggerEl();
    this.#ctx.value?.openPreviewCard();
  };

  #handleBlur = (): void => {
    this.#ctx.value?.closePreviewCard();
  };

  #handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && this.#ctx.value?.open) {
      this.#ctx.value?.closePreviewCard();
    }
  };

  #updateTriggerEl(): void {
    const slot = this.shadowRoot?.querySelector("slot");
    const slotted = slot?.assignedElements({ flatten: true });
    const el = (slotted?.[0] as HTMLElement) ?? this;
    this.#ctx.value?.setTriggerEl(el);
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
        tabindex="0"
        aria-describedby="${isOpen ? popupId : ""}"
        ?data-popup-open="${isOpen}"
        @mouseenter="${this.#handleMouseEnter}"
        @mouseleave="${this.#handleMouseLeave}"
        @focus="${this.#handleFocus}"
        @blur="${this.#handleBlur}"
        @keydown="${this.#handleKeyDown}"
      >
        <slot></slot>
      </span>
    `;
  }
}
