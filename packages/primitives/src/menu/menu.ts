/** Ported from original DUI: deep-future-app/app/client/components/dui/menu */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "../core/base.ts";
import { FloatingTopLayerController } from "../core/floating-top-layer-controller.ts";
import { ReopenGuard } from "../core/floating-popup-utils.ts";
import { DuiMenuItemPrimitive } from "./menu-item.ts";

const hostStyles = css`
  :host {
    display: block;
  }
`;

const componentStyles = css`
  .Trigger {
    display: contents;
    cursor: pointer;
  }

  .Popup {
    /* Reset UA [popover] defaults so Floating UI's left/top win. */
    position: fixed;
    inset: auto;
    margin: 0;
    border: none;
    /* The UA [popover] sheet supplies 0.25em of padding. Reset it: the inner
      dui-scroll-area is capped at the same --dui-available-height as the
      popup, so any padding here is added on top and pushes the popup that
      much past the viewport edge — and makes the popup scroll a few px too,
      fighting the scroll-area. */
    padding: 0;
    /* The inner dui-scroll-area owns scrolling. These two are the fallback for
      when dui-scroll-area is not registered: the un-upgraded element stays
      display:inline and ignores max-height, so without them a long menu would
      overflow the popup entirely. */
    max-height: var(--dui-available-height, 240px);
    overflow-y: auto;
    overscroll-behavior: contain;
    opacity: 0;
    transition-property: opacity, transform, overlay, display;
    transition-behavior: allow-discrete;
  }

  dui-scroll-area {
    max-height: var(--dui-available-height, 240px);
    height: auto;
  }

  .Popup:popover-open {
    opacity: 1;
  }

  @starting-style {
    .Popup:popover-open {
      opacity: 0;
    }
  }
`;

/**
 * `<dui-menu>` — A popup menu triggered by a slotted element.
 *
 * @slot trigger - The element that opens the menu on click.
 * @slot default - `dui-menu-item` children rendered inside the popup.
 * @csspart popup - The floating menu container.
 * @csspart menu - The scrolling list inside the popup.
 * @cssprop [--dui-available-height] - Space between the trigger and the viewport
 *   edge, published on every reposition. The popup caps itself against this, so
 *   it shrinks on short viewports instead of overflowing. Falls back to `240px`
 *   before the first position is computed; set it yourself to impose a smaller cap.
 */
export class DuiMenuPrimitive extends LitElement {
  static tagName = "dui-menu" as const;
  static override styles = [base, hostStyles, componentStyles];

  /** Sets `min-width` on the popup panel (e.g. `"200px"`). Defaults to `"var(--space-28)".` */
  @property({ attribute: "popup-min-width" })
  accessor popupMinWidth: string = "var(--space-28)";

  @state()
  accessor #highlightedIndex = -1;

  #getTriggerElement: () => HTMLElement | undefined = () => {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(
      'slot[name="trigger"]',
    );
    return slot?.assignedElements()?.[0] as HTMLElement | undefined;
  };

  #reopenGuard = new ReopenGuard();

  #popup = new FloatingTopLayerController(this, {
    getAnchor: (): HTMLElement => this.#getTriggerElement() ?? this,
    getPopover: () => this.shadowRoot?.querySelector<HTMLElement>(".Popup"),
    matchWidth: false,
    placement: "bottom-start",
    onOpen: () => {
      this.#highlightedIndex = -1;
      this.#getTriggerElement()?.setAttribute("data-open", "");
    },
    onClose: () => {
      this.#highlightedIndex = -1;
      this.#getTriggerElement()?.removeAttribute("data-open");
      this.#reopenGuard.noteClose();
    },
  });

  #menuId = `menu-${crypto.randomUUID().slice(0, 8)}`;

  // Items stay slotted in the light DOM (no portal teleport), so query the
  // host directly. Size-driven custom properties inherit to them naturally.
  get #items(): DuiMenuItemPrimitive[] {
    return [
      ...this.querySelectorAll("dui-menu-item"),
    ] as DuiMenuItemPrimitive[];
  }

  protected override updated(): void {
    const items = this.#items;
    for (let i = 0; i < items.length; i++) {
      if (i === this.#highlightedIndex) {
        items[i]!.setAttribute("data-highlighted", "");
      } else {
        items[i]!.removeAttribute("data-highlighted");
      }
    }
  }

  #togglePopup(): void {
    if (this.#popup.isOpen) {
      this.#popup.close();
    } else {
      if (!this.#reopenGuard.allowOpen()) return;
      this.#popup.open();
    }
  }

  #onTriggerClick = (event: MouseEvent): void => {
    event.stopPropagation();
    event.preventDefault();
    this.#togglePopup();
  };

  #onItemSlotClick = (event: MouseEvent): void => {
    const item = event
      .composedPath()
      .find(
        (el) =>
          el instanceof HTMLElement && el.matches(DuiMenuItemPrimitive.tagName),
      ) as DuiMenuItemPrimitive | undefined;
    if (item && !item.disabled) {
      this.#popup.close();
    }
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    const items = this.#items;

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        if (!this.#popup.isOpen) {
          this.#popup.open();
        } else {
          let next = this.#highlightedIndex + 1;
          while (next < items.length && items[next]?.disabled) next++;
          if (next < items.length) this.#highlightedIndex = next;
        }
        break;
      }

      case "ArrowUp": {
        event.preventDefault();
        if (!this.#popup.isOpen) {
          this.#popup.open();
        } else {
          let prev = this.#highlightedIndex - 1;
          while (prev >= 0 && items[prev]?.disabled) prev--;
          if (prev >= 0) this.#highlightedIndex = prev;
        }
        break;
      }

      case "Home":
        if (this.#popup.isOpen) {
          event.preventDefault();
          const firstEnabled = items.findIndex((item) => !item.disabled);
          if (firstEnabled >= 0) this.#highlightedIndex = firstEnabled;
        }
        break;

      case "End":
        if (this.#popup.isOpen) {
          event.preventDefault();
          for (let i = items.length - 1; i >= 0; i--) {
            if (!items[i]?.disabled) {
              this.#highlightedIndex = i;
              break;
            }
          }
        }
        break;

      case "Enter":
      case " ": {
        if (this.#popup.isOpen && this.#highlightedIndex >= 0) {
          event.preventDefault();
          const item = items[this.#highlightedIndex];
          if (item && !item.disabled) {
            item.click();
            this.#popup.close();
          }
        } else if (!this.#popup.isOpen) {
          event.preventDefault();
          this.#popup.open();
        }
        break;
      }

      case "Escape":
        if (this.#popup.isOpen) {
          event.preventDefault();
          this.#popup.close();
        }
        break;

      case "Tab":
        if (this.#popup.isOpen) {
          this.#popup.close();
        }
        break;
    }
  };

  #onMenuMouseMove = (): void => {
    if (this.#highlightedIndex >= 0) {
      this.#highlightedIndex = -1;
    }
  };

  override render(): TemplateResult {
    return html`
      <div
        class="Trigger"
        aria-haspopup="menu"
        aria-expanded="${this.#popup.isOpen}"
        aria-controls="${this.#menuId}"
        @click="${this.#onTriggerClick}"
        @keydown="${this.#onKeyDown}"
      >
        <slot name="trigger"></slot>
      </div>
      <div
        class="Popup"
        part="popup"
        popover="auto"
        style="${this.popupMinWidth ? `min-width:${this.popupMinWidth}` : ""}"
        @toggle="${this.#popup.handleToggle}"
      >
        <dui-scroll-area>
          <div
            class="Menu"
            part="menu"
            id="${this.#menuId}"
            role="menu"
            @click="${this.#onItemSlotClick}"
            @mousemove="${this.#onMenuMouseMove}"
          >
            <slot></slot>
          </div>
        </dui-scroll-area>
      </div>
    `;
  }
}
