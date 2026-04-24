/** Ported from original DUI: deep-future-app/app/client/components/dui/tooltip */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "../core/base.ts";
import { tooltipContext } from "./tooltip-context.ts";
import { FloatingPortalController } from "../core/floating-portal-controller.ts";
import {
  type FloatingPopupSide,
  renderArrow,
} from "../core/floating-popup-utils.ts";

const hostStyles = css`
  :host {
    display: contents;
  }

  .slot-wrapper {
    display: none;
  }
`;

/** Structural styles injected into the portal positioner. */
const portalPopupStyles = [
  css`
    .Popup {
      box-sizing: border-box;
      pointer-events: auto;
      transform-origin: var(--transform-origin, center);
      opacity: 1;
      transform: scale(1);
      transition-property: opacity, transform;
    }

    .Popup[data-starting-style],
    .Popup[data-ending-style] {
      opacity: 0;
      transform: scale(0.96);
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
  `,
];

/**
 * `<dui-tooltip-popup>` — The tooltip popup content container.
 *
 * @slot - Tooltip content.
 */
export class DuiTooltipPopupPrimitive extends LitElement {
  static tagName = "dui-tooltip-popup" as const;
  static override styles = [base, hostStyles];

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

  #portal = new FloatingPortalController(this, {
    getAnchor: () => this.#ctx.value?.triggerEl,
    matchWidth: false,
    placement: "top",
    offset: 6,
    styles: portalPopupStyles,
    contentContainer: ".Content",
    onPosition: ({ placement }) => {
      const actualSide = placement.split("-")[0] as FloatingPopupSide;
      if (actualSide !== this.#side) {
        this.#side = actualSide;
      }
    },
    renderPopup: (portal) => {
      const popupId = this.#ctx.value?.popupId ?? "";
      return html`
        <div
          class="Popup"
          id="${popupId}"
          role="tooltip"
          ?data-starting-style="${portal.isStarting}"
          ?data-ending-style="${portal.isEnding}"
          data-side="${this.#side}"
        >
          <div class="Content"></div>
          ${this.showArrow ? renderArrow(this.#side) : ""}
        </div>
      `;
    },
  });

  override updated(): void {
    const isOpen = this.#ctx.value?.open ?? false;

    if (isOpen && !this.#wasOpen) {
      this.#updatePlacement();
      this.#portal.open();
    } else if (!isOpen && this.#wasOpen) {
      this.#portal.close();
    }

    this.#wasOpen = isOpen;
  }

  #updatePlacement(): void {
    const side = this.#ctx.value?.side ?? "top";
    this.#portal.placement = side;
    this.#portal.offset = this.#ctx.value?.sideOffset ?? 6;
  }

  override render(): TemplateResult {
    return html`<div class="slot-wrapper"><slot></slot></div>`;
  }
}
