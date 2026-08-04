/**
 * Ported from original DUI: deep-future-app/app/client/components/dui/popover
 *
 * SPIKE (Phase 1): renders the popup IN PLACE (its own shadow root) as a native
 * top-layer `[popover]` element instead of teleporting it to `document.body`.
 * See `FloatingTopLayerController` for the rationale and the list of hacks this
 * deletes. Floating UI is still responsible for positioning.
 */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "../core/base.ts";
import { popoverContext } from "./popover-context.ts";
import { FloatingTopLayerController } from "../core/floating-top-layer-controller.ts";
import {
  type FloatingPopupSide,
  renderArrow,
} from "../core/floating-popup-utils.ts";

const hostStyles = css`
  :host {
    display: contents;
  }
`;

/**
 * Structural styles for the top-layer popup. Enter/exit animation is now
 * declarative: `@starting-style` handles the entry, and `transition-behavior:
 * allow-discrete` (+ animating `overlay`) keeps the element in the top layer
 * through the exit transition — including platform light-dismiss, which the
 * old JS `data-starting-style`/`data-ending-style` lifecycle could not.
 */
const popupStyles = css`
  .Popup {
    /* Reset the UA [popover] defaults so Floating UI's left/top win. */
    position: fixed;
    inset: auto;
    margin: 0;
    box-sizing: border-box;
    transform-origin: var(--transform-origin, center);
    opacity: 0;
    transform: scale(0.96);
    transition-property: opacity, transform, overlay, display;
    transition-behavior: allow-discrete;
  }

  .Popup:popover-open {
    opacity: 1;
    transform: scale(1);
  }

  @starting-style {
    .Popup:popover-open {
      opacity: 0;
      transform: scale(0.96);
    }
  }

  .Popup[data-side="top"] {
    --transform-origin: bottom center;
  }

  .Popup[data-side="bottom"] {
    --transform-origin: top center;
  }

  .Arrow {
    position: absolute;
    width: 10px;
    height: 6px;
  }

  .Arrow[data-side="top"] {
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
  }

  .Arrow[data-side="bottom"] {
    top: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
  }
`;

/**
 * `<dui-popover-popup>` — The popover popup content container.
 *
 * @slot - Popover content.
 */
export class DuiPopoverPopupPrimitive extends LitElement {
  static tagName = "dui-popover-popup" as const;
  static override styles = [base, hostStyles, popupStyles];

  /** Whether to show an arrow pointing to the trigger. */
  @property({ type: Boolean, attribute: "show-arrow" })
  accessor showArrow = true;

  /** Close the popover when content inside the popup is clicked. */
  @property({ type: Boolean, attribute: "close-on-click" })
  accessor closeOnClick = false;

  @state()
  accessor #side: FloatingPopupSide = "bottom";

  #ctx = new ContextConsumer(this, {
    context: popoverContext,
    subscribe: true,
  });

  #wasOpen = false;

  #floating = new FloatingTopLayerController(this, {
    getAnchor: () => this.#ctx.value?.triggerEl,
    getPopover: () => this.shadowRoot?.querySelector<HTMLElement>(".Popup"),
    placement: "bottom",
    offset: 8,
    onLightDismiss: () => {
      // Outside-click / Esc dismissed the popover natively — sync it back.
      this.#ctx.value?.closePopover();
    },
    onPosition: ({ placement }) => {
      const actualSide = placement.split("-")[0] as FloatingPopupSide;
      if (actualSide !== this.#side) {
        this.#side = actualSide;
      }
    },
  });

  #handleContentClick = (): void => {
    if (this.closeOnClick) {
      this.#ctx.value?.closePopover();
    }
  };

  override updated(): void {
    const isOpen = this.#ctx.value?.open ?? false;

    if (isOpen && !this.#wasOpen) {
      this.#floating.placement = this.#ctx.value?.side ?? "bottom";
      this.#floating.offset = this.#ctx.value?.sideOffset ?? 8;
      this.#floating.open();
    } else if (!isOpen && this.#wasOpen) {
      this.#floating.close();
    }

    this.#wasOpen = isOpen;
  }

  override render(): TemplateResult {
    const popupId = this.#ctx.value?.popupId ?? "";
    return html`
      <div
        class="Popup"
        popover="auto"
        id="${popupId}"
        role="dialog"
        data-side="${this.#side}"
        @toggle="${this.#floating.handleToggle}"
        @click="${this.#handleContentClick}"
      >
        <slot></slot>
        ${this.showArrow ? renderArrow(this.#side) : ""}
      </div>
    `;
  }
}
