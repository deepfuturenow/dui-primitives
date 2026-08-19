/** Ported from original DUI: deep-future-app/app/client/components/dui/select */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import { FloatingTopLayerController } from "../core/floating-top-layer-controller.ts";
import {
  ReopenGuard,
  resolveScrollContainer,
} from "../core/floating-popup-utils.ts";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectValueChangeDetail = {
  value: string;
  option: SelectOption;
};

export const valueChangeEvent = customEvent<SelectValueChangeDetail>(
  "value-change",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout CSS. */
const hostStyles = css`
  :host {
    display: block;
    /* Allow the select to shrink below its content's intrinsic width when it
      is a flex/grid item, so the .Value's ellipsis truncation actually
      engages instead of the trigger pushing the surrounding layout wider. */
    min-width: 0;
  }
`;

const componentStyles = css`
  .Trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
  }

  .Trigger[data-disabled] {
    cursor: not-allowed;
  }

  .Value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .Icon {
    flex-shrink: 0;
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
      display:inline and ignores max-height, so without them a long list would
      overflow the popup entirely. */
    max-height: var(--dui-available-height, 240px);
    overflow-y: auto;
    overscroll-behavior: contain;
    opacity: 0;
    transition-property: opacity, transform, overlay, display;
    transition-behavior: allow-discrete;
  }

  .Popup:popover-open {
    opacity: 1;
  }

  @starting-style {
    .Popup:popover-open {
      opacity: 0;
    }
  }

  dui-scroll-area {
    max-height: var(--dui-available-height, 240px);
    height: auto;
  }

  .Item {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .Item[data-disabled] {
    cursor: not-allowed;
  }

  .ItemIndicator {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ItemText {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

/**
 * `<dui-select>` — A dropdown select for choosing from a list of options.
 *
 * @csspart trigger - The trigger button.
 * @csspart value - The displayed value text.
 * @csspart popup - The floating listbox container.
 * @csspart listbox - The scrolling list inside the popup.
 * @csspart item - An option row.
 * @csspart item-selected - Present on the selected option. An attribute selector cannot
 *   follow `::part()`, so state rides in the part name rather than `[data-selected]`.
 * @csspart item-highlighted - Present on the keyboard-highlighted option.
 * @csspart item-disabled - Present on disabled options.
 * @csspart item-indicator - The check mark slot on each option.
 * @csspart item-text - The option label.
 * @cssprop [--dui-available-height] - Space between the trigger and the viewport
 *   edge, published on every reposition. The popup caps itself against this, so
 *   it shrinks on short viewports instead of overflowing. Falls back to `240px`
 *   before the first position is computed; set it yourself to impose a smaller cap.
 * @fires value-change - Fired when the selected value changes.
 *   Detail: { value: string, option: SelectOption }
 */
export class DuiSelectPrimitive extends LitElement {
  static tagName = "dui-select" as const;
  static formAssociated = true;
  static override styles = [base, hostStyles, componentStyles];

  #internals!: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  /** The available options. */
  @property({ attribute: false })
  accessor options: SelectOption[] = [];

  /** Currently selected value. */
  @property({ type: String })
  accessor value = "";

  /** Placeholder text shown when no value is selected. */
  @property({ type: String })
  accessor placeholder = "Select...";

  /** Whether the select is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Position the popup so the selected item overlays the trigger (macOS-style). */
  @property({
    type: Boolean,
    attribute: "align-item-to-trigger",
    reflect: true,
  })
  accessor alignItemToTrigger = true;

  /** Name for form submission. */
  @property({ type: String })
  accessor name = "";

  @state()
  accessor #highlightedIndex = -1;

  #triggerId = `select-trigger-${crypto.randomUUID().slice(0, 8)}`;
  #listboxId = `select-listbox-${crypto.randomUUID().slice(0, 8)}`;

  #reopenGuard = new ReopenGuard();

  #popup = new FloatingTopLayerController(this, {
    getAnchor: () => this.shadowRoot?.querySelector<HTMLElement>(".Trigger"),
    getPopover: () => this.shadowRoot?.querySelector<HTMLElement>(".Popup"),
    matchWidth: false,
    minMatchWidth: true,
    // Options render in this component's own shadow root now (no teleport),
    // so the selected item and size-driven vars are queried/inherited here.
    alignToInner: (): HTMLElement | null => {
      if (!this.alignItemToTrigger) return null;
      const selectedItem = this.shadowRoot?.querySelector<HTMLElement>(
        "[data-selected]",
      );
      return selectedItem?.querySelector<HTMLElement>(".ItemText") ??
        selectedItem ?? null;
    },
    alignToInnerReference: (): HTMLElement | null => {
      if (!this.alignItemToTrigger) return null;
      return this.shadowRoot?.querySelector<HTMLElement>(".Value") ?? null;
    },
    onOpen: () => {
      this.#highlightedIndex = this.#selectedIndex;
      // After the listbox renders, make sure the current selection is visible.
      this.updateComplete.then(() => this.#scrollSelectedIntoView());
    },
    onClose: () => {
      this.#highlightedIndex = -1;
      this.#reopenGuard.noteClose();
    },
  });

  override willUpdate(): void {
    this.#internals.setFormValue(this.value);
  }

  // ---- Computed ----

  get #selectedOption(): SelectOption | undefined {
    return this.options.find((o) => o.value === this.value);
  }

  get #selectedIndex(): number {
    return this.options.findIndex((o) => o.value === this.value);
  }

  get #displayValue(): string {
    return this.#selectedOption?.label ?? "";
  }

  // ---- Event handlers ----

  #onTriggerClick = (event: MouseEvent): void => {
    event.stopPropagation();
    if (this.disabled) return;

    if (this.#popup.isOpen) {
      this.#popup.close();
    } else {
      if (!this.#reopenGuard.allowOpen()) return;
      this.#popup.open();
    }
  };

  #onTriggerKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    switch (event.key) {
      case "Enter":
      case " ": {
        event.preventDefault();
        if (this.#popup.isOpen) {
          const option = this.options[this.#highlightedIndex];
          if (option && !option.disabled) {
            this.#selectOption(option);
          }
        } else {
          this.#popup.open();
        }
        break;
      }

      case "ArrowDown": {
        event.preventDefault();
        if (!this.#popup.isOpen) {
          this.#popup.open();
        } else {
          this.#highlightedIndex = this.#nextEnabledIndex(
            this.#highlightedIndex,
            1,
          );
        }
        break;
      }

      case "ArrowUp": {
        event.preventDefault();
        if (!this.#popup.isOpen) {
          this.#popup.open();
        } else {
          this.#highlightedIndex = this.#nextEnabledIndex(
            this.#highlightedIndex,
            -1,
          );
        }
        break;
      }

      case "Home": {
        if (this.#popup.isOpen) {
          event.preventDefault();
          this.#highlightedIndex = this.#nextEnabledIndex(-1, 1);
        }
        break;
      }

      case "End": {
        if (this.#popup.isOpen) {
          event.preventDefault();
          this.#highlightedIndex = this.#nextEnabledIndex(
            this.options.length,
            -1,
          );
        }
        break;
      }

      case "Escape": {
        if (this.#popup.isOpen) {
          event.preventDefault();
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

  #onListMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
  };

  #onItemClick = (option: SelectOption): void => {
    if (option.disabled) return;
    this.#selectOption(option);
  };

  #onItemMouseEnter = (index: number): void => {
    if (!this.options[index]?.disabled) {
      this.#highlightedIndex = index;
    }
  };

  // ---- Selection ----

  #selectOption(option: SelectOption): void {
    this.value = option.value;
    this.dispatchEvent(valueChangeEvent({ value: option.value, option }));
    this.#popup.close();
    this.#focusTrigger();
  }

  #nextEnabledIndex(current: number, direction: 1 | -1): number {
    const len = this.options.length;
    let next = current + direction;
    while (next >= 0 && next < len) {
      if (!this.options[next].disabled) return next;
      next += direction;
    }
    return current;
  }

  #focusTrigger(): void {
    const trigger = this.shadowRoot?.querySelector<HTMLElement>(".Trigger");
    trigger?.focus();
  }

  /**
   * Center the selected option in the popup when it opens. A no-op for lists
   * that fit (nothing to scroll); for long, scrollable lists — where the popup
   * falls back to normal below/above positioning instead of overlaying the
   * selected item on the trigger — this reveals the current selection.
   */
  #scrollSelectedIntoView(): void {
    const popup = this.shadowRoot?.querySelector<HTMLElement>(".Popup");
    const item = this.shadowRoot?.querySelector<HTMLElement>("[data-selected]");
    if (!popup || !item) return;

    const scroller = resolveScrollContainer(popup) ?? popup;
    if (scroller.scrollHeight <= scroller.clientHeight) return;

    // Measure via rects rather than `offsetTop`: if a `<dui-scroll-area>` owns
    // scrolling, the item's offsetParent is no longer the scrolling element.
    const itemRect = item.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    const itemTop = itemRect.top - scrollerRect.top + scroller.scrollTop;

    scroller.scrollTop = itemTop -
      (scroller.clientHeight - itemRect.height) / 2;
  }

  // ---- Render ----

  /**
   * State has to ride in the part *name*: an attribute selector cannot follow
   * `::part()`, so `::part(item)[data-selected]` is not a valid selector. The
   * `data-*` attributes stay for stylesheets injected into this shadow root
   * (where `.Item[data-selected]` works); `::part(item-selected)` is the
   * equivalent for consumers styling from outside.
   */
  #itemPart = (
    isSelected: boolean,
    isHighlighted: boolean,
    isDisabled: boolean,
  ): string =>
    [
      "item",
      isSelected && "item-selected",
      isHighlighted && "item-highlighted",
      isDisabled && "item-disabled",
    ].filter(Boolean).join(" ");

  #renderItem = (option: SelectOption, index: number): TemplateResult => {
    const isSelected = option.value === this.value;
    const isHighlighted = index === this.#highlightedIndex;

    return html`
      <div
        class="Item"
        part="${this.#itemPart(isSelected, isHighlighted, !!option.disabled)}"
        role="option"
        id="${this.#listboxId}-option-${index}"
        aria-selected="${isSelected}"
        ?data-selected="${isSelected}"
        ?data-highlighted="${isHighlighted}"
        ?data-disabled="${option.disabled}"
        @click="${() => this.#onItemClick(option)}"
        @mouseenter="${() => this.#onItemMouseEnter(index)}"
      >
        <span class="ItemIndicator" part="item-indicator">
          ${isSelected
            ? html`
              <dui-icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </dui-icon>
            `
            : nothing}
        </span>
        <span class="ItemText" part="item-text">${option.label}</span>
      </div>
    `;
  };

  override render(): TemplateResult {
    const hasValue = this.value !== "" && this.#selectedOption != null;

    return html`
      <div
        class="Trigger"
        part="trigger"
        id="${this.#triggerId}"
        role="combobox"
        tabindex="${this.disabled ? -1 : 0}"
        aria-haspopup="listbox"
        aria-expanded="${this.#popup.isOpen}"
        aria-controls="${this.#listboxId}"
        aria-activedescendant="${this.#highlightedIndex >= 0
          ? `${this.#listboxId}-option-${this.#highlightedIndex}`
          : nothing}"
        ?data-disabled="${this.disabled}"
        ?data-open="${this.#popup.isOpen}"
        @click="${this.#onTriggerClick}"
        @keydown="${this.#onTriggerKeyDown}"
      >
        <span
          class="Value"
          part="value"
          ?data-placeholder="${!hasValue}"
        >
          ${hasValue ? this.#displayValue : this.placeholder}
        </span>
        <span class="Icon">
          <dui-icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </dui-icon>
        </span>
      </div>

      <div
        class="Popup"
        part="popup"
        popover="auto"
        ?data-align-inner="${this.alignItemToTrigger && this.value !== ""}"
        @toggle="${this.#popup.handleToggle}"
      >
        <dui-scroll-area>
          <div
            class="Listbox"
            part="listbox"
            id="${this.#listboxId}"
            role="listbox"
            @mousedown="${this.#onListMouseDown}"
          >
            ${repeat(this.options, (option) => option.value, this.#renderItem)}
          </div>
        </dui-scroll-area>
      </div>
    `;
  }
}
