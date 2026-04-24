import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";

export const valueChangeEvent = customEvent<{ value: number }>(
  "value-change",
  { bubbles: true, composed: true },
);

export const valueCommittedEvent = customEvent<{ value: number }>(
  "value-committed",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
  }

  [part="input"] {
    box-sizing: border-box;
    outline: none;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    text-align: center;
    min-width: 0;
  }

  [part="input"]:disabled {
    cursor: not-allowed;
  }

  [part="decrement"],
  [part="increment"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    flex-shrink: 0;
  }

  [part="decrement"]:disabled,
  [part="increment"]:disabled {
    cursor: not-allowed;
  }

  .HiddenInput {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    margin: 0;
    width: 0;
    height: 0;
  }
`;

/**
 * `<dui-stepper>` — A numeric input with increment/decrement buttons.
 *
 * Simple component for stepping values up and down via buttons, keyboard,
 * or manual text entry. No labels, icons, scrubbing, or other extras.
 *
 * @csspart root - The outer container.
 * @csspart input - The text input element.
 * @csspart decrement - The decrement button.
 * @csspart increment - The increment button.
 * @fires value-change - Fired when value changes. Detail: { value: number }
 * @fires value-committed - Fired on blur or Enter. Detail: { value: number }
 */
export class DuiStepperPrimitive extends LitElement {
  static tagName = "dui-stepper" as const;

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles = [base, styles];

  @property({ type: Number })
  accessor value: number | undefined = undefined;

  @property({ type: Number, attribute: "default-value" })
  accessor defaultValue: number | undefined = undefined;

  @property({ type: Number })
  accessor min: number | undefined = undefined;

  @property({ type: Number })
  accessor max: number | undefined = undefined;

  @property({ type: Number })
  accessor step = 1;

  @property({ type: Number, attribute: "large-step" })
  accessor largeStep = 10;

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: Boolean, reflect: true, attribute: "read-only" })
  accessor readOnly = false;

  @property({ type: Boolean })
  accessor required = false;

  @property()
  accessor name: string | undefined = undefined;

  // ── Internal state ─────────────────────────────────────────────────

  @state()
  accessor #internalValue: number | undefined = undefined;

  @state()
  accessor #inputText = "";

  // ── Computed getters ───────────────────────────────────────────────

  get #currentValue(): number | undefined {
    return this.value ?? this.#internalValue;
  }



  get #canDecrement(): boolean {
    const v = this.#currentValue;
    if (v === undefined) return true;
    return this.min === undefined || v > this.min;
  }

  get #canIncrement(): boolean {
    const v = this.#currentValue;
    if (v === undefined) return true;
    return this.max === undefined || v < this.max;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.value === undefined && this.defaultValue !== undefined) {
      this.#internalValue = this.#clamp(this.defaultValue);
    }
    this.#syncInputText();
  }

  override willUpdate(): void {
    this.#syncInputText();
  }

  // ── Value helpers ──────────────────────────────────────────────────

  #syncInputText(): void {
    const v = this.#currentValue;
    this.#inputText = v !== undefined ? String(v) : "";
  }

  #clamp(val: number): number {
    if (this.min !== undefined) val = Math.max(this.min, val);
    if (this.max !== undefined) val = Math.min(this.max, val);
    return val;
  }

  #setValue(val: number): void {
    const clamped = this.#clamp(val);

    if (this.value === undefined) {
      this.#internalValue = clamped;
    }

    this.dispatchEvent(valueChangeEvent({ value: clamped }));
  }

  #increment = (amount: number): void => {
    if (this.disabled || this.readOnly) return;
    const current = this.#currentValue ?? this.min ?? 0;
    this.#setValue(current + amount);
  };

  #decrement = (amount: number): void => {
    if (this.disabled || this.readOnly) return;
    const current = this.#currentValue ?? this.max ?? 0;
    this.#setValue(current - amount);
  };

  #commitInput(): void {
    const parsed = parseFloat(this.#inputText);
    if (Number.isNaN(parsed)) {
      this.#syncInputText();
    } else {
      this.#setValue(parsed);
    }
    const v = this.#currentValue;
    if (v !== undefined) {
      this.dispatchEvent(valueCommittedEvent({ value: v }));
    }
  }

  // ── Event handlers ─────────────────────────────────────────────────

  #onInput = (e: InputEvent): void => {
    this.#inputText = (e.target as HTMLInputElement).value;
  };

  #onBlur = (): void => {
    this.#commitInput();
  };

  #onKeyDown = (e: KeyboardEvent): void => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        this.#increment(e.shiftKey ? this.largeStep : this.step);
        this.#syncInputText();
        break;
      case "ArrowDown":
        e.preventDefault();
        this.#decrement(e.shiftKey ? this.largeStep : this.step);
        this.#syncInputText();
        break;
      case "Home":
        if (this.min !== undefined) {
          e.preventDefault();
          this.#setValue(this.min);
        }
        break;
      case "End":
        if (this.max !== undefined) {
          e.preventDefault();
          this.#setValue(this.max);
        }
        break;
      case "Enter":
        this.#commitInput();
        break;
    }
  };

  #onDecrementClick = (): void => {
    this.#decrement(this.step);
    const v = this.#currentValue;
    if (v !== undefined) {
      this.dispatchEvent(valueCommittedEvent({ value: v }));
    }
  };

  #onIncrementClick = (): void => {
    this.#increment(this.step);
    const v = this.#currentValue;
    if (v !== undefined) {
      this.dispatchEvent(valueCommittedEvent({ value: v }));
    }
  };

  // ── Render ─────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const currentValue = this.#currentValue;

    return html`
      <div
        part="root"
        ?data-disabled="${this.disabled}"
      >
        <button
          part="decrement"
          type="button"
          tabindex="-1"
          aria-label="Decrease"
          ?disabled="${this.disabled || this.readOnly || !this.#canDecrement}"
          @click="${this.#onDecrementClick}"
        >
          <slot name="decrement">&minus;</slot>
        </button>
        <input
          part="input"
          type="text"
          inputmode="decimal"
          .value="${live(this.#inputText)}"
          ?disabled="${this.disabled}"
          ?readonly="${this.readOnly}"
          ?required="${this.required}"
          @input="${this.#onInput}"
          @keydown="${this.#onKeyDown}"
          @blur="${this.#onBlur}"
        />
        <button
          part="increment"
          type="button"
          tabindex="-1"
          aria-label="Increase"
          ?disabled="${this.disabled || this.readOnly || !this.#canIncrement}"
          @click="${this.#onIncrementClick}"
        >
          <slot name="increment">+</slot>
        </button>
        ${this.name
          ? html`<input
              type="hidden"
              name="${this.name}"
              .value="${String(currentValue ?? "")}"
            />`
          : nothing}
      </div>
    `;
  }
}
