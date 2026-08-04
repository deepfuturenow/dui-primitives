/** Ported from original DUI: deep-future-app/app/client/components/dui/tooltip */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "../core/base.ts";
import { tooltipContext } from "./tooltip-context.ts";
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
 * Structural styles for the top-layer tooltip. A tooltip is `popover="manual"`:
 * it must NOT join the `auto` one-at-a-time group (hovering a tooltip would
 * otherwise dismiss an open menu/popover), so open/close stays fully driven by
 * the tooltip root's hover/focus timers.
 */
const popupStyles = css`
  .Popup {
    /* Reset UA [popover] defaults; overflow:visible lets the arrow escape. */
    position: fixed;
    inset: auto;
    margin: 0;
    border: none;
    overflow: visible;
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
 * `<dui-tooltip-popup>` — The tooltip popup content container.
 *
 * @slot - Tooltip content.
 */
export class DuiTooltipPopupPrimitive extends LitElement {
  static tagName = "dui-tooltip-popup" as const;
  static override styles = [base, hostStyles, popupStyles];

  /** Whether to show an arrow pointing to the trigger. */
  @property({ type: Boolean, attribute: "show-arrow" })
  accessor showArrow = true;

  @state()
  accessor #side: FloatingPopupSide = "top";

  #ctx = new ContextConsumer(this, {
    context: tooltipContext,
    subscribe: true,
  });

  #wasOpen = false;

  #floating = new FloatingTopLayerController(this, {
    getAnchor: () => this.#ctx.value?.triggerEl,
    getPopover: () => this.shadowRoot?.querySelector<HTMLElement>(".Popup"),
    matchWidth: false,
    placement: "top",
    offset: 6,
    onPosition: ({ placement }) => {
      const actualSide = placement.split("-")[0] as FloatingPopupSide;
      if (actualSide !== this.#side) {
        this.#side = actualSide;
      }
    },
  });

  override updated(): void {
    const isOpen = this.#ctx.value?.open ?? false;

    if (isOpen && !this.#wasOpen) {
      this.#floating.placement = this.#ctx.value?.side ?? "top";
      this.#floating.offset = this.#ctx.value?.sideOffset ?? 6;
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
        popover="manual"
        id="${popupId}"
        role="tooltip"
        data-side="${this.#side}"
      >
        <slot></slot>
        ${this.showArrow ? renderArrow(this.#side) : ""}
      </div>
    `;
  }
}
