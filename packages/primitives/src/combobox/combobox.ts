/** Ported from original DUI: deep-future-app/app/client/components/dui/combobox */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { live } from "lit/directives/live.js";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import { FloatingTopLayerController } from "../core/floating-top-layer-controller.ts";
import { ReopenGuard } from "../core/floating-popup-utils.ts";

export type SelectOption = {
  label: string;
  value: string;
};

export type ComboboxValueChangeDetail = {
  value: string;
  option: SelectOption;
};

export type ComboboxValuesChangeDetail = {
  value: string;
  selected: boolean;
  values: Set<string>;
};

export const valueChangeEvent = customEvent<ComboboxValueChangeDetail>(
  "value-change",
  { bubbles: true, composed: true },
);

export const valuesChangeEvent = customEvent<ComboboxValuesChangeDetail>(
  "values-change",
  { bubbles: true, composed: true },
);

const hostStyles = css`
  :host {
    display: block;
  }
`;

const componentStyles = css`
  /* ---- Input area (structural) ---- */

  .Chips {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    cursor: text;
  }

  .Chips[data-disabled] {
    cursor: not-allowed;
  }

  .InputWrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .Input {
    box-sizing: border-box;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    min-width: 4rem;
    flex: 1;
  }

  .Input:disabled {
    cursor: not-allowed;
  }

  .Arrow {
    position: absolute;
    pointer-events: none;
    flex-shrink: 0;
  }

  .Chip {
    display: inline-flex;
    align-items: center;
    cursor: default;
    max-width: 100%;
    overflow: hidden;
  }

  .ChipLabel {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ChipRemove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    flex-shrink: 0;
  }

  /* ---- Popup (native top-layer [popover]) ---- */

  .Popup {
    /* Reset UA [popover] defaults; the inner dui-scroll-area owns scrolling. */
    position: fixed;
    inset: auto;
    margin: 0;
    border: none;
    /* The UA sheet supplies 0.25em of padding. Reset it: the scroll-area is
      capped at --dui-available-height, so padding here is added on top and
      pushes the popup that much past the viewport edge. */
    padding: 0;
    overflow: visible;
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

  .ItemIndicator {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ItemText {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/**
 * `<dui-combobox>` — A searchable dropdown for selecting from a list of options.
 * Supports single-select and multi-select (chip) modes.
 *
 * @fires value-change - Single-select: fired when selection changes.
 *   Detail: { value: string, option: SelectOption }
 * @fires values-change - Multi-select: fired when a value is toggled.
 *   Detail: { value: string, selected: boolean, values: Set<string> }
 * @csspart chips - The chip container shown in multi-select mode.
 * @csspart input-wrapper - The single-select input container.
 * @csspart popup - The floating list container.
 * @csspart list - The scrolling list inside the popup.
 * @csspart item - An option row.
 * @csspart item-selected - Present on selected options. An attribute selector cannot
 *   follow `::part()`, so state rides in the part name rather than `[data-selected]`.
 * @csspart item-highlighted - Present on the keyboard-highlighted option.
 * @csspart item-text - The option label.
 * @csspart item-indicator - The check mark slot on each option.
 * @csspart empty - The "No results" row.
 * @cssprop [--dui-available-height] - Space between the input and the viewport
 *   edge, published on every reposition. The popup caps itself against this, so
 *   it shrinks on short viewports instead of overflowing. Falls back to `240px`
 *   before the first position is computed; set it yourself to impose a smaller cap.
 */
export class DuiComboboxPrimitive extends LitElement {
  static tagName = "dui-combobox" as const;
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

  /** Currently selected value (single-select mode). */
  @property({ type: String })
  accessor value = "";

  /** Currently selected values (multi-select mode). */
  @property({ attribute: false })
  accessor values: Set<string> = new Set();

  /** Enable multi-select mode with chips. */
  @property({ type: Boolean, reflect: true })
  accessor multiple = false;

  /** Placeholder text for the input. */
  @property({ type: String })
  accessor placeholder = "Search...";

  /** Whether the combobox is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Name for form submission. */
  @property({ type: String })
  accessor name = "";

  override willUpdate(): void {
    this.#syncFormValue();
  }

  #syncFormValue(): void {
    if (this.multiple) {
      const formData = new FormData();
      for (const v of this.values) {
        formData.append(this.name || "values", v);
      }
      this.#internals.setFormValue(formData);
    } else {
      this.#internals.setFormValue(this.value || null);
    }
  }

  @state()
  accessor #highlightedIndex = -1;

  @state()
  accessor #inputValue = "";

  #popup = new FloatingTopLayerController(this, {
    getAnchor: () =>
      this.multiple
        ? this.shadowRoot?.querySelector<HTMLElement>(".Chips")
        : this.shadowRoot?.querySelector<HTMLElement>(".InputWrapper"),
    getPopover: () => this.shadowRoot?.querySelector<HTMLElement>(".Popup"),
    matchWidth: true,
    onOpen: () => {
      this.#highlightedIndex = -1;
      // Clear the query so a browse-open (click/keyboard) shows ALL options
      // rather than filtering by the selected label. Skip when the open was
      // triggered by typing — that must keep the just-entered character.
      if (!this.multiple && !this.#openingViaInput) {
        this.#inputValue = "";
        const input = this.shadowRoot?.querySelector<HTMLInputElement>(
          ".Input",
        );
        if (input) input.value = "";
      }
    },
    onClose: () => {
      this.#highlightedIndex = -1;
      this.#reopenGuard.noteClose();
      if (!this.multiple) {
        const selected = this.options.find((o) => o.value === this.value);
        this.#inputValue = selected?.label ?? "";
      }
    },
  });

  #reopenGuard = new ReopenGuard();
  #openingViaInput = false;

  #inputId = `combobox-input-${crypto.randomUUID().slice(0, 8)}`;
  #listId = `combobox-list-${crypto.randomUUID().slice(0, 8)}`;

  /** Filtered options based on current input text. */
  get #filteredOptions(): SelectOption[] {
    const query = this.#inputValue.toLowerCase();
    const opts = this.options;

    if (!query) return opts;
    return opts.filter((opt) => opt.label.toLowerCase().includes(query));
  }

  // ---- Input handling ----

  #onInput = (event: InputEvent): void => {
    const target = event.target as HTMLInputElement;
    this.#inputValue = target.value;
    if (!this.#popup.isOpen && !this.disabled) {
      // Opening because the user typed — don't let onOpen clear the query.
      this.#openingViaInput = true;
      this.#popup.open();
      this.#openingViaInput = false;
    }
    this.#highlightedIndex = -1;
  };

  /**
   * Open on click (pointerup), NOT focus. `focus` fires during pointerdown, so
   * opening there means the same click's `popover="auto"` light-dismiss (which
   * pairs the outside pointerdown with its pointerup) tears the popup back down
   * — a text input can't be a native popover invoker to opt out. Opening on the
   * click event lands after pointerup, past the dismiss gesture. The guard stops
   * a click that lands right after a light-dismiss from immediately reopening,
   * so clicking the field while open closes it instead of re-flashing.
   */
  #onOpenClick = (): void => {
    const input = this.shadowRoot?.querySelector<HTMLInputElement>(".Input");
    input?.focus();
    if (
      !this.#popup.isOpen && !this.disabled && this.#reopenGuard.allowOpen()
    ) {
      this.#popup.open();
    }
  };

  #onInputKeyDown = (event: KeyboardEvent): void => {
    const filtered = this.#filteredOptions;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!this.#popup.isOpen) {
          if (!this.disabled) this.#popup.open();
        } else {
          this.#highlightedIndex = Math.min(
            this.#highlightedIndex + 1,
            filtered.length - 1,
          );
        }
        break;

      case "ArrowUp":
        event.preventDefault();
        if (!this.#popup.isOpen) {
          if (!this.disabled) this.#popup.open();
        } else {
          this.#highlightedIndex = Math.max(this.#highlightedIndex - 1, 0);
        }
        break;

      case "Enter": {
        event.preventDefault();
        if (this.#popup.isOpen) {
          const index = this.#highlightedIndex >= 0
            ? this.#highlightedIndex
            : 0;
          const option = filtered[index];
          if (option) {
            this.#selectOption(option);
          }
        } else if (!this.disabled) {
          this.#popup.open();
        }
        break;
      }

      case "Escape":
        if (this.#popup.isOpen) {
          event.preventDefault();
          this.#inputValue = "";
          this.#popup.close();
        }
        break;

      case "Tab":
        if (this.#popup.isOpen) {
          this.#popup.close();
        }
        break;

      case "Home":
        if (this.#popup.isOpen) {
          event.preventDefault();
          this.#highlightedIndex = 0;
        }
        break;

      case "End":
        if (this.#popup.isOpen) {
          event.preventDefault();
          this.#highlightedIndex = filtered.length - 1;
        }
        break;

      case "Backspace":
        if (this.multiple && this.#inputValue === "" && this.values.size > 0) {
          const lastValue = Array.from(this.values).at(-1);
          if (lastValue) {
            this.#removeValue(lastValue);
          }
        }
        break;
    }
  };

  // ---- Selection ----

  #selectOption(option: SelectOption): void {
    if (this.multiple) {
      const newValues = new Set(this.values);
      const selected = !newValues.has(option.value);
      if (selected) {
        newValues.add(option.value);
      } else {
        newValues.delete(option.value);
      }
      this.values = newValues;
      this.#inputValue = "";
      this.#highlightedIndex = -1;

      this.dispatchEvent(
        valuesChangeEvent({
          value: option.value,
          selected,
          values: newValues,
        }),
      );

      const input = this.shadowRoot?.querySelector<HTMLInputElement>(".Input");
      input?.focus();
    } else {
      this.value = option.value;
      this.#inputValue = option.label;
      this.dispatchEvent(valueChangeEvent({ value: option.value, option }));

      this.#popup.close();
    }
  }

  #removeValue(value: string): void {
    const newValues = new Set(this.values);
    newValues.delete(value);
    this.values = newValues;

    this.dispatchEvent(
      valuesChangeEvent({ value, selected: false, values: newValues }),
    );
  }

  #onItemClick = (option: SelectOption): void => {
    this.#selectOption(option);
  };

  #onListMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
  };

  #onListMouseMove = (): void => {
    if (this.#highlightedIndex !== -1) {
      this.#highlightedIndex = -1;
    }
  };

  // ---- Render ----

  #renderChip = (value: string): TemplateResult => {
    const option = this.options.find((o) => o.value === value);
    const label = option?.label ?? value;

    return html`
      <span class="Chip">
        <span class="ChipLabel">${label}</span>
        <button
          class="ChipRemove"
          type="button"
          tabindex="-1"
          @mousedown="${(e: MouseEvent) => e.preventDefault()}"
          @click="${(e: MouseEvent) => {
            e.stopPropagation();
            this.#removeValue(value);
          }}"
        >
          <dui-icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </dui-icon>
        </button>
      </span>
    `;
  };

  /**
   * State has to ride in the part *name*: an attribute selector cannot follow
   * `::part()`, so `::part(item)[data-selected]` is not a valid selector. The
   * `data-*` attributes stay for stylesheets injected into this shadow root
   * (where `.Item[data-selected]` works); `::part(item-selected)` is the
   * equivalent for consumers styling from outside.
   */
  #itemPart = (isSelected: boolean, isHighlighted: boolean): string =>
    [
      "item",
      isSelected && "item-selected",
      isHighlighted && "item-highlighted",
    ].filter(Boolean).join(" ");

  #renderItem = (option: SelectOption, index: number): TemplateResult => {
    const isSelected = this.multiple
      ? this.values.has(option.value)
      : option.value === this.value;
    const isHighlighted = index === this.#highlightedIndex;

    return html`
      <div
        class="Item"
        part="${this.#itemPart(isSelected, isHighlighted)}"
        role="option"
        id="${this.#listId}-option-${index}"
        aria-selected="${isSelected}"
        ?data-selected="${isSelected}"
        ?data-highlighted="${isHighlighted}"
        @click="${() => this.#onItemClick(option)}"
      >
        <span class="ItemText" part="item-text">${option.label}</span>
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
      </div>
    `;
  };

  #renderPopup(): TemplateResult {
    const filtered = this.#filteredOptions;
    const isEmpty = filtered.length === 0;

    return html`
      <div
        class="Popup"
        part="popup"
        popover="auto"
        @toggle="${this.#popup.handleToggle}"
      >
        <dui-scroll-area>
          <div
            class="List"
            part="list"
            id="${this.#listId}"
            role="listbox"
            aria-labelledby="${this.#inputId}"
            ?data-empty="${isEmpty}"
            @mousedown="${this.#onListMouseDown}"
            @mousemove="${this.#onListMouseMove}"
          >
            ${repeat(filtered, (option) => option.value, this.#renderItem)}
            ${isEmpty
              ? html`
                <div class="Empty" part="empty">No results</div>
              `
              : nothing}
          </div>
        </dui-scroll-area>
      </div>
    `;
  }

  override render(): TemplateResult {
    const inputHtml = html`
      <input
        class="Input"
        id="${this.#inputId}"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-haspopup="listbox"
        aria-expanded="${this.#popup.isOpen}"
        aria-controls="${this.#listId}"
        aria-activedescendant="${this.#highlightedIndex >= 0
          ? `${this.#listId}-option-${this.#highlightedIndex}`
          : nothing}"
        .value="${live(this.#inputValue)}"
        .placeholder="${this.placeholder}"
        ?disabled="${this.disabled}"
        @input="${this.#onInput}"
        @keydown="${this.#onInputKeyDown}"
      />
    `;

    if (this.multiple) {
      return html`
        <div
          class="Chips"
          part="chips"
          ?data-disabled="${this.disabled}"
          @click="${this.#onOpenClick}"
        >
          ${repeat(Array.from(this.values), (v) => v, this.#renderChip)}
          ${inputHtml}
          <dui-icon class="Arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></dui-icon>
        </div>
        ${this.#renderPopup()}
      `;
    }

    return html`
      <div
        class="InputWrapper"
        part="input-wrapper"
        @click="${this.#onOpenClick}"
      >
        ${inputHtml}
        <dui-icon class="Arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></dui-icon>
      </div>
      ${this.#renderPopup()}
    `;
  }
}
