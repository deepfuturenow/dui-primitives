/** Ported from original DUI: deep-future-app/app/client/components/dui/tooltip */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { tooltipContext } from "./tooltip-context.ts";

const hostStyles = css`
  :host {
    display: contents;
  }
`;

const componentStyles = css`
  .Trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: inherit;
  }

  .Trigger[data-disabled] {
    cursor: not-allowed;
  }
`;

/**
 * `<dui-tooltip-trigger>` — The element that triggers the tooltip on hover/focus.
 *
 * @slot - Content that triggers the tooltip.
 */
export class DuiTooltipTriggerPrimitive extends LitElement {
  static tagName = "dui-tooltip-trigger" as const;
  static override styles = [base, hostStyles, componentStyles];

  /** Disable the trigger. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  #ctx = new ContextConsumer(this, {
    context: tooltipContext,
    subscribe: true,
  });

  #handleMouseEnter = (): void => {
    if (this.#isDisabled) return;
    this.#updateTriggerEl();
    this.#ctx.value?.openTooltip();
  };

  #handleMouseLeave = (): void => {
    this.#ctx.value?.closeTooltip();
  };

  #handleFocus = (): void => {
    if (this.#isDisabled) return;
    this.#updateTriggerEl();
    this.#ctx.value?.openTooltip();
  };

  #handleBlur = (): void => {
    this.#ctx.value?.closeTooltip();
  };

  #handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && this.#ctx.value?.open) {
      this.#ctx.value?.closeTooltip();
    }
  };

  #updateTriggerEl(): void {
    const trigger =
      (this.shadowRoot?.querySelector('[part="trigger"]') as HTMLElement) ??
      this;
    this.#ctx.value?.setTriggerEl(trigger);
  }

  get #isDisabled(): boolean {
    return this.disabled || (this.#ctx.value?.disabled ?? false);
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
        role="button"
        tabindex="0"
        aria-describedby="${isOpen ? popupId : ""}"
        ?data-popup-open="${isOpen}"
        ?data-disabled="${this.#isDisabled}"
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
