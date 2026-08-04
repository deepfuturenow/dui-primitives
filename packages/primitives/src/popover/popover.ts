/** Ported from original DUI: deep-future-app/app/client/components/dui/popover */

import { css, html, LitElement, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import {
  type PopoverContext,
  popoverContext,
  type PopoverSide,
} from "./popover-context.ts";

export type PopoverOpenChangeDetail = { open: boolean };

export const openChangeEvent = customEvent<PopoverOpenChangeDetail>(
  "open-change",
  { bubbles: true, composed: true },
);

const hostStyles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-popover>` — A popover root that provides context for trigger and popup.
 *
 * @slot - Default slot for dui-popover-trigger and dui-popover-popup.
 * @fires open-change - Dispatched when the popover opens or closes.
 */
export class DuiPopoverPrimitive extends LitElement {
  static tagName = "dui-popover" as const;
  static override styles = [base, hostStyles];

  /** Controlled open state. */
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  /** Default open state for uncontrolled usage. */
  @property({ type: Boolean, attribute: "default-open" })
  accessor defaultOpen = false;

  /** Which side of the trigger the popover appears on. */
  @property({ reflect: true })
  accessor side: PopoverSide = "bottom";

  /** Offset from the trigger in pixels. */
  @property({ type: Number, attribute: "side-offset" })
  accessor sideOffset = 8;

  @state()
  accessor #internalOpen = false;

  @state()
  accessor #triggerEl: HTMLElement | undefined;

  get #isOpen(): boolean {
    return this.open || this.#internalOpen;
  }

  #triggerId = `popover-trigger-${crypto.randomUUID().slice(0, 8)}`;
  #popupId = `popover-popup-${crypto.randomUUID().slice(0, 8)}`;

  @provide({ context: popoverContext })
  @state()
  accessor _ctx: PopoverContext = {
    open: false,
    triggerId: this.#triggerId,
    popupId: this.#popupId,
    side: "bottom",
    sideOffset: 8,
    triggerEl: undefined,
    openPopover: () => this.#doOpen(),
    closePopover: () => this.#doClose(),
    togglePopover: () => this.#doToggle(),
    setTriggerEl: (el) => this.#setTriggerEl(el),
  };

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.defaultOpen) {
      this.#internalOpen = true;
    }
    // SPIKE: no document keydown listener — `popover="auto"` closes on Esc
    // natively and syncs back via the popup's `toggle` event.
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (
      changed.has("open") ||
      changed.has("side") ||
      changed.has("sideOffset") ||
      this._ctx.open !== this.#isOpen ||
      this._ctx.triggerEl !== this.#triggerEl
    ) {
      this._ctx = {
        ...this._ctx,
        open: this.#isOpen,
        side: this.side,
        sideOffset: this.sideOffset,
        triggerEl: this.#triggerEl,
      };
    }
  }

  /**
   * SPIKE: timestamp of the last close. With `popover="auto"`, clicking the
   * trigger while open causes the platform to light-dismiss the popover on
   * pointerdown; the trigger's own click would then re-open it in the same
   * gesture. Both signals funnel through this root, so we swallow an open that
   * lands immediately after a close. (The fully race-free fix is native
   * `command`/`commandfor` invokers on the trigger — see the spike writeup.)
   */
  #lastCloseAt = 0;

  #doOpen(): void {
    if (this.#internalOpen) return;
    this.#internalOpen = true;
    this.dispatchEvent(openChangeEvent({ open: true }));
  }

  #doClose(): void {
    if (!this.#internalOpen) return;
    this.#internalOpen = false;
    this.#lastCloseAt = performance.now();
    this.dispatchEvent(openChangeEvent({ open: false }));
  }

  #doToggle(): void {
    if (this.#isOpen) {
      this.#doClose();
    } else {
      if (performance.now() - this.#lastCloseAt < 150) return;
      this.#doOpen();
    }
  }

  #setTriggerEl(el: HTMLElement | undefined): void {
    this.#triggerEl = el;
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
