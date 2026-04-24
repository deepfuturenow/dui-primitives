/** Ported from original DUI: deep-future-app/app/client/components/dui/preview-card */

import { css, html, LitElement, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import {
  type PreviewCardContext,
  previewCardContext,
  type PreviewCardSide,
} from "./preview-card-context.ts";

export type PreviewCardOpenChangeDetail = { open: boolean };

export const openChangeEvent = customEvent<PreviewCardOpenChangeDetail>(
  "open-change",
  { bubbles: true, composed: true },
);

const hostStyles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-preview-card>` — A preview card root that provides context for trigger and popup.
 *
 * @slot - Default slot for dui-preview-card-trigger and dui-preview-card-popup.
 * @fires open-change - Dispatched when the preview card opens or closes.
 */
export class DuiPreviewCardPrimitive extends LitElement {
  static tagName = "dui-preview-card" as const;
  static override styles = [base, hostStyles];

  /** Controlled open state. */
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  /** Default open state for uncontrolled usage. */
  @property({ type: Boolean, attribute: "default-open" })
  accessor defaultOpen = false;

  /** Which side of the trigger the preview card appears on. */
  @property({ reflect: true })
  accessor side: PreviewCardSide = "top";

  /** Offset from the trigger in pixels. */
  @property({ type: Number, attribute: "side-offset" })
  accessor sideOffset = 8;

  /** Delay before opening in milliseconds. */
  @property({ type: Number })
  accessor delay = 400;

  /** Delay before closing in milliseconds. */
  @property({ type: Number, attribute: "close-delay" })
  accessor closeDelay = 300;

  @state()
  accessor #internalOpen = false;

  @state()
  accessor #triggerEl: HTMLElement | undefined;

  #openTimeout: ReturnType<typeof setTimeout> | undefined;
  #closeTimeout: ReturnType<typeof setTimeout> | undefined;

  #triggerId = `preview-card-trigger-${crypto.randomUUID().slice(0, 8)}`;
  #popupId = `preview-card-popup-${crypto.randomUUID().slice(0, 8)}`;

  @provide({ context: previewCardContext })
  @state()
  accessor _ctx: PreviewCardContext = {
    open: false,
    triggerId: this.#triggerId,
    popupId: this.#popupId,
    side: "top",
    sideOffset: 8,
    triggerEl: undefined,
    openPreviewCard: () => this.#scheduleOpen(),
    closePreviewCard: () => this.#scheduleClose(),
    setTriggerEl: (el) => this.#setTriggerEl(el),
  };

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.defaultOpen) {
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
      this._ctx.open !== isOpen ||
      this._ctx.triggerEl !== this.#triggerEl
    ) {
      this._ctx = {
        ...this._ctx,
        open: isOpen,
        side: this.side,
        sideOffset: this.sideOffset,
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
