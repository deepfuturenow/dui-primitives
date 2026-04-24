/** Ported from original DUI: deep-future-app/app/client/components/dui/tooltip */

import { css, html, LitElement, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import {
  type TooltipContext,
  tooltipContext,
  type TooltipSide,
} from "./tooltip-context.ts";

export type TooltipOpenChangeDetail = { open: boolean };

export const openChangeEvent = customEvent<TooltipOpenChangeDetail>(
  "open-change",
  { bubbles: true, composed: true },
);

const hostStyles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-tooltip>` — A tooltip root that provides context for trigger and popup.
 *
 * @slot - Default slot for dui-tooltip-trigger and dui-tooltip-popup.
 * @fires open-change - Dispatched when the tooltip opens or closes.
 */
export class DuiTooltipPrimitive extends LitElement {
  static tagName = "dui-tooltip" as const;
  static override styles = [base, hostStyles];

  /** Controlled open state. */
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  /** Default open state for uncontrolled usage. */
  @property({ type: Boolean, attribute: "default-open" })
  accessor defaultOpen = false;

  /** Which side of the trigger the tooltip appears on. */
  @property({ reflect: true })
  accessor side: TooltipSide = "top";

  /** Offset from the trigger in pixels. */
  @property({ type: Number, attribute: "side-offset" })
  accessor sideOffset = 6;

  /** Delay before opening in milliseconds. */
  @property({ type: Number })
  accessor delay = 500;

  /** Delay before closing in milliseconds. */
  @property({ type: Number, attribute: "close-delay" })
  accessor closeDelay = 0;

  /** Disable the tooltip. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @state()
  accessor #internalOpen = false;

  @state()
  accessor #triggerEl: HTMLElement | undefined;

  #openTimeout: ReturnType<typeof setTimeout> | undefined;
  #closeTimeout: ReturnType<typeof setTimeout> | undefined;

  #triggerId = `tooltip-trigger-${crypto.randomUUID().slice(0, 8)}`;
  #popupId = `tooltip-popup-${crypto.randomUUID().slice(0, 8)}`;

  @provide({ context: tooltipContext })
  @state()
  accessor _ctx: TooltipContext = {
    open: false,
    triggerId: this.#triggerId,
    popupId: this.#popupId,
    side: "top",
    sideOffset: 6,
    disabled: false,
    triggerEl: undefined,
    openTooltip: () => this.#scheduleOpen(),
    closeTooltip: () => this.#scheduleClose(),
    setTriggerEl: (el) => this.#setTriggerEl(el),
  };

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.defaultOpen && !this.disabled) {
      this.#internalOpen = true;
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#clearTimeouts();
  }

  protected override willUpdate(changed: PropertyValues): void {
    const isOpen = this.open || this.#internalOpen;

    if (
      changed.has("open") ||
      changed.has("side") ||
      changed.has("sideOffset") ||
      changed.has("disabled") ||
      this._ctx.open !== isOpen ||
      this._ctx.triggerEl !== this.#triggerEl
    ) {
      this._ctx = {
        ...this._ctx,
        open: isOpen,
        side: this.side,
        sideOffset: this.sideOffset,
        disabled: this.disabled,
        triggerEl: this.#triggerEl,
      };
    }
  }

  #clearTimeouts(): void {
    if (this.#openTimeout) {
      clearTimeout(this.#openTimeout);
      this.#openTimeout = undefined;
    }
    if (this.#closeTimeout) {
      clearTimeout(this.#closeTimeout);
      this.#closeTimeout = undefined;
    }
  }

  #scheduleOpen(): void {
    if (this.disabled) return;

    this.#clearTimeouts();

    if (this.delay <= 0) {
      this.#doOpen();
    } else {
      this.#openTimeout = setTimeout(() => this.#doOpen(), this.delay);
    }
  }

  #scheduleClose(): void {
    this.#clearTimeouts();

    if (this.closeDelay <= 0) {
      this.#doClose();
    } else {
      this.#closeTimeout = setTimeout(() => this.#doClose(), this.closeDelay);
    }
  }

  #doOpen(): void {
    if (this.#internalOpen) return;
    this.#internalOpen = true;
    this.dispatchEvent(openChangeEvent({ open: true }));
  }

  #doClose(): void {
    if (!this.#internalOpen) return;
    this.#internalOpen = false;
    this.dispatchEvent(openChangeEvent({ open: false }));
  }

  #setTriggerEl(el: HTMLElement | undefined): void {
    this.#triggerEl = el;
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
