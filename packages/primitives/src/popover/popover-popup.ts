/** Ported from original DUI: deep-future-app/app/client/components/dui/popover */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { popoverContext } from "./popover-context.ts";
import { FloatingPortalController } from "@dui/core/floating-portal-controller";
import {
  type FloatingPopupSide,
  renderArrow,
} from "@dui/core/floating-popup-utils";

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
 * `<dui-popover-popup>` — The popover popup content container.
 *
 * @slot - Popover content.
 */
export class DuiPopoverPopupPrimitive extends LitElement {
  static tagName = "dui-popover-popup" as const;
  static override styles = [base, hostStyles];

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

  #portal = new FloatingPortalController(this, {
    getAnchor: () => this.#ctx.value?.triggerEl,
    matchWidth: false,
    placement: "bottom",
    offset: 8,
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
          role="dialog"
          ?data-starting-style="${portal.isStarting}"
          ?data-ending-style="${portal.isEnding}"
          data-side="${this.#side}"
          @click="${this.#handleContentClick}"
        >
          <div class="Content"></div>
          ${this.showArrow ? renderArrow(this.#side) : ""}
        </div>
      `;
    },
  });

  /** Check if an event path includes this popup's portal positioner. */
  containsEventTarget(path: EventTarget[]): boolean {
    const positioner = this.#portal.positionerElement;
    return positioner !== null && path.includes(positioner);
  }

  #handleContentClick = (): void => {
    if (this.closeOnClick) {
      this.#ctx.value?.closePopover();
    }
  };

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
    const side = this.#ctx.value?.side ?? "bottom";
    this.#portal.placement = side;
    this.#portal.offset = this.#ctx.value?.sideOffset ?? 8;
  }

  override render(): TemplateResult {
    return html`<div class="slot-wrapper"><slot></slot></div>`;
  }
}
