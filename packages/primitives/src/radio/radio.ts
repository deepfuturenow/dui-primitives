/** Ported from original DUI: deep-future-app/app/client/components/dui/radio */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "../core/base.ts";
import { radioGroupContext } from "./radio-group-context.ts";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  :host([disabled]) {
    cursor: not-allowed;
  }

  [part="root"] {
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    outline: 0;
    padding: 0;
    margin: 0;
    border: none;
    user-select: none;
  }

  [part="root"][data-disabled] {
    cursor: not-allowed;
  }

  [part="root"][data-readonly] {
    cursor: default;
  }

  [part="indicator"] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  [part="indicator"][data-unchecked] {
    display: none;
  }

`;

/**
 * `<dui-radio>` — A radio button input.
 *
 * Must be used within a `<dui-radio-group>`. Only one radio can be
 * selected at a time within a group.
 *
 * @slot - Label content.
 * @csspart root - The radio container.
 * @csspart indicator - The selected state indicator.
 * @cssprop --radio-size - Size of the radio button.
 */
export class DuiRadioPrimitive extends LitElement {
  static tagName = "dui-radio" as const;
  static formAssociated = true;

  static override styles = [base, styles];

  #internals!: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  /** The value attribute for this radio option. */
  @property()
  accessor value: string = "";

  /** Whether the radio is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Whether the radio is read-only. */
  @property({ type: Boolean, reflect: true, attribute: "read-only" })
  accessor readOnly = false;

  #groupCtx = new ContextConsumer(this, {
    context: radioGroupContext,
    subscribe: true,
  });

  get #isChecked(): boolean {
    return this.#groupCtx.value?.value === this.value;
  }

  get #isDisabled(): boolean {
    return (
      this.disabled ||
      (this.#groupCtx.value?.disabled ?? false)
    );
  }

  get #isReadOnly(): boolean {
    return this.readOnly || (this.#groupCtx.value?.readOnly ?? false);
  }

  get #isRequired(): boolean {
    return this.#groupCtx.value?.required ?? false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.#handleHostClick);
  }

  override willUpdate(): void {
    this.#syncFormValue();
  }

  #syncFormValue(): void {
    if (this.#isChecked) {
      this.#internals.setFormValue(this.value);
    } else {
      this.#internals.setFormValue(null);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.#handleHostClick);
  }

  #handleHostClick = (e: Event): void => {
    if ((e.target as Element).closest("[part='root']")) return;
    this.#handleClick(e);
  };

  #handleClick = (_e: Event): void => {
    if (this.#isDisabled || this.#isReadOnly) return;

    const ctx = this.#groupCtx.value;
    if (ctx) {
      ctx.select(this.value);
    }
  };

  #handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === " ") {
      e.preventDefault();
      this.#handleClick(e);
    }
  };

  override render(): TemplateResult {
    const isChecked = this.#isChecked;
    const isDisabled = this.#isDisabled;
    const isReadOnly = this.#isReadOnly;
    const isRequired = this.#isRequired;

    return html`
      <span
        part="root"
        role="radio"
        aria-checked="${String(isChecked)}"
        aria-disabled="${isDisabled ? "true" : nothing}"
        aria-readonly="${isReadOnly ? "true" : nothing}"
        aria-required="${isRequired ? "true" : nothing}"
        tabindex="${isDisabled ? nothing : "0"}"
        ?data-checked="${isChecked}"
        ?data-unchecked="${!isChecked}"
        ?data-disabled="${isDisabled}"
        ?data-readonly="${isReadOnly}"
        ?data-required="${isRequired}"
        @click="${this.#handleClick}"
        @keydown="${this.#handleKeyDown}"
      >
        <span
          part="indicator"
          ?data-checked="${isChecked}"
          ?data-unchecked="${!isChecked}"
        >
          ${isChecked ? html`<span part="dot"></span>` : nothing}
        </span>
      </span>
      <slot></slot>
    `;
  }
}
