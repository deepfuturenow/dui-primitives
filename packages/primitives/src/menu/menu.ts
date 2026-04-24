/** Ported from original DUI: deep-future-app/app/client/components/dui/menu */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "../core/base.ts";
import { FloatingPortalController } from "../core/floating-portal-controller.ts";
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
`;

/** Structural styles injected into the portal positioner. */
const portalPopupStyles = [
  css`
    .Popup {
      max-height: 240px;
      overflow-y: auto;
      overscroll-behavior: contain;
      opacity: 1;
      transform: translateY(0);
      transition-property: opacity, transform;
      pointer-events: auto;
    }

    .Popup[data-starting-style],
    .Popup[data-ending-style] {
      opacity: 0;
    }
  `,
];

/**
 * `<dui-menu>` — A popup menu triggered by a slotted element.
 *
 * @slot trigger - The element that opens the menu on click.
 * @slot default - `dui-menu-item` children rendered inside the popup.
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

  #popup = new FloatingPortalController(this, {
    getAnchor: (): HTMLElement => this.#getTriggerElement() ?? this,
    matchWidth: false,
    styles: portalPopupStyles,
    contentContainer: ".Menu",
    contentSelector: "dui-menu-item, dui-separator",
    onOpen: () => {
      this.#highlightedIndex = -1;
      this.#getTriggerElement()?.setAttribute("data-open", "");
    },
    onClose: () => {
      this.#highlightedIndex = -1;
      this.#getTriggerElement()?.removeAttribute("data-open");
    },
    renderPopup: (portal) => html`
      <div
        class="Popup"
        style="${this.popupMinWidth ? `min-width:${this.popupMinWidth}` : ""}"
        ?data-starting-style="${portal.isStarting}"
        ?data-ending-style="${portal.isEnding}"
      >
        <div
          class="Menu"
          id="${this.#menuId}"
          role="menu"
          @click="${this.#onItemSlotClick}"
          @mousemove="${this.#onMenuMouseMove}"
        ></div>
      </div>
    `,
  });

  #menuId = `menu-${crypto.randomUUID().slice(0, 8)}`;

  get #items(): DuiMenuItemPrimitive[] {
    const container = this.#popup.renderRoot?.querySelector(".Menu") ?? this;
    return [...container.querySelectorAll("dui-menu-item")] as DuiMenuItemPrimitive[];
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
        (el) => el instanceof HTMLElement && el.matches(DuiMenuItemPrimitive.tagName),
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
    `;
  }
}
