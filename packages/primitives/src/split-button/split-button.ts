import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import { FloatingPortalController } from "../core/floating-portal-controller.ts";
import { DuiMenuItemPrimitive } from "../menu/menu-item.ts";

/** Fired when the action (left) button is clicked. */
export const actionEvent = customEvent<{}>(
  "dui-action",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout and behavioral CSS. */
const hostStyles = css`
  :host {
    display: inline-block;
  }
`;

const componentStyles = css`
  .Root {
    display: inline-flex;
    align-items: stretch;
    box-sizing: border-box;
  }

  .Action,
  .Trigger {
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
  }

  .Action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .Divider {
    display: block;
    width: 0;
    align-self: stretch;
  }

  .Trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
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
 * `<dui-split-button>` — A button with an attached dropdown menu trigger.
 *
 * The action zone (left) performs a primary action. The menu trigger (right)
 * opens a dropdown of `dui-menu-item` children for secondary actions.
 *
 * @slot - Action button label / content.
 * @slot icon - Custom icon for the dropdown trigger (defaults to chevron-down).
 * @slot menu - `dui-menu-item` elements rendered inside the dropdown popup.
 * @csspart root - The outer container wrapping both zones.
 * @csspart action - The left action button element.
 * @csspart divider - The vertical separator between action and trigger.
 * @csspart trigger - The right dropdown trigger button element.
 * @fires dui-action - Fired when the action button is clicked. Detail: {}
 */
export class DuiSplitButtonPrimitive extends LitElement {
  static tagName = "dui-split-button" as const;

  static override styles = [base, hostStyles, componentStyles];

  /** Visual variant — mapped to theme styles (e.g. neutral, primary, danger). */
  @property({ reflect: true })
  accessor variant: string = "";

  /** Visual appearance — mapped to theme styles (e.g. filled, outline, ghost). */
  @property({ reflect: true })
  accessor appearance: string = "";

  /** Size — mapped to theme styles (e.g. xs, sm, md, lg). */
  @property({ reflect: true })
  accessor size: string = "";

  /** Sets `min-width` on the popup panel (e.g. `"200px"`). Defaults to `"var(--space-28)"`. */
  @property({ attribute: "popup-min-width" })
  accessor popupMinWidth: string = "var(--space-28)";

  /** Whether the entire split button is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @state()
  accessor #highlightedIndex = -1;

  #menuId = `split-menu-${crypto.randomUUID().slice(0, 8)}`;

  #popup = new FloatingPortalController(this, {
    getAnchor: () =>
      this.shadowRoot?.querySelector<HTMLElement>(".Root"),
    matchWidth: false,
    styles: portalPopupStyles,
    contentContainer: ".Menu",
    contentSelector: "dui-menu-item",
    onOpen: () => {
      this.#highlightedIndex = -1;
    },
    onClose: () => {
      this.#highlightedIndex = -1;
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

  // ---- Action zone handlers ----

  #onActionClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (this.disabled) return;
    this.dispatchEvent(actionEvent({}));
  };

  #onActionKeyDown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.dispatchEvent(actionEvent({}));
    }
  };

  // ---- Trigger zone handlers ----

  #onTriggerClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (this.disabled) return;
    if (this.#popup.isOpen) {
      this.#popup.close();
    } else {
      this.#popup.open();
    }
  };

  #onTriggerKeyDown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    const items = this.#items;

    switch (e.key) {
      case "Enter":
      case " ": {
        if (this.#popup.isOpen && this.#highlightedIndex >= 0) {
          e.preventDefault();
          const item = items[this.#highlightedIndex];
          if (item && !item.disabled) {
            item.click();
            this.#popup.close();
          }
        } else if (!this.#popup.isOpen) {
          e.preventDefault();
          this.#popup.open();
        }
        break;
      }

      case "ArrowDown": {
        e.preventDefault();
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
        e.preventDefault();
        if (!this.#popup.isOpen) {
          this.#popup.open();
        } else {
          let prev = this.#highlightedIndex - 1;
          while (prev >= 0 && items[prev]?.disabled) prev--;
          if (prev >= 0) this.#highlightedIndex = prev;
        }
        break;
      }

      case "Home": {
        if (this.#popup.isOpen) {
          e.preventDefault();
          const firstEnabled = items.findIndex((item) => !item.disabled);
          if (firstEnabled >= 0) this.#highlightedIndex = firstEnabled;
        }
        break;
      }

      case "End": {
        if (this.#popup.isOpen) {
          e.preventDefault();
          for (let i = items.length - 1; i >= 0; i--) {
            if (!items[i]?.disabled) {
              this.#highlightedIndex = i;
              break;
            }
          }
        }
        break;
      }

      case "Escape": {
        if (this.#popup.isOpen) {
          e.preventDefault();
          this.#popup.close();
          this.#focusTrigger();
        }
        break;
      }

      case "Tab": {
        if (this.#popup.isOpen) {
          this.#popup.close();
        }
        break;
      }
    }
  };

  // ---- Menu handlers ----

  #onItemSlotClick = (e: MouseEvent): void => {
    const item = e
      .composedPath()
      .find(
        (el) => el instanceof HTMLElement && el.matches(DuiMenuItemPrimitive.tagName),
      ) as DuiMenuItemPrimitive | undefined;
    if (item && !item.disabled) {
      this.#popup.close();
    }
  };

  #onMenuMouseMove = (): void => {
    if (this.#highlightedIndex >= 0) {
      this.#highlightedIndex = -1;
    }
  };

  #focusTrigger(): void {
    this.shadowRoot?.querySelector<HTMLElement>(".Trigger")?.focus();
  }

  override render(): TemplateResult {
    return html`
      <div class="Root" part="root">
        <button
          class="Action"
          part="action"
          type="button"
          ?disabled="${this.disabled}"
          @click="${this.#onActionClick}"
          @keydown="${this.#onActionKeyDown}"
        >
          <slot></slot>
        </button>

        <span part="divider" class="Divider"></span>

        <button
          class="Trigger"
          part="trigger"
          type="button"
          ?disabled="${this.disabled}"
          aria-haspopup="menu"
          aria-expanded="${this.#popup.isOpen}"
          aria-controls="${this.#menuId}"
          ?data-open="${this.#popup.isOpen || nothing}"
          @click="${this.#onTriggerClick}"
          @keydown="${this.#onTriggerKeyDown}"
        >
          <slot name="icon">
            <dui-icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </dui-icon>
          </slot>
        </button>
      </div>
    `;
  }
}
