/** Ported from original DUI: deep-future-app/app/client/components/dui/checkbox */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { checkboxGroupContext } from "./checkbox-group-context.ts";

export const checkedChangeEvent = customEvent<{
  checked: boolean;
  indeterminate: boolean;
}>("checked-change", { bubbles: true, composed: true });

/** Structural styles only — layout and behavioral CSS. */
const styles = css`
  :host {
    display: inline-flex;
    align-items: start;
    cursor: pointer;
    text-align: start;
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
    padding: 0;
    margin-block-end: 0;
    margin-inline: 0;
    border: none;
    outline: 0;
    cursor: pointer;
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
  }

  [part="indicator"][data-unchecked] {
    display: none;
  }

`;

const checkIcon = html`
  <svg
    class="Icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
`;

const indeterminateIcon = html`
  <svg
    class="Icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
`;

/**
 * `<dui-checkbox>` — A checkbox input with optional indeterminate state.
 *
 * Supports controlled and uncontrolled usage, group context integration,
 * and field context for form validation states.
 *
 * @csspart root - The checkbox box element.
 * @csspart indicator - The check/indeterminate indicator.
 *
 * @fires checked-change - Fired when checked state changes. Detail: { checked, indeterminate }
 */
export class DuiCheckboxPrimitive extends LitElement {
  static tagName = "dui-checkbox" as const;
  static formAssociated = true;

  static override styles = [base, styles];

  #internals!: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  /** Whether the checkbox is checked (controlled). */
  @property({ type: Boolean, reflect: true })
  accessor checked: boolean | undefined = undefined;

  /** Initial checked state for uncontrolled usage. */
  @property({ type: Boolean, attribute: "default-checked" })
  accessor defaultChecked = false;

  /** Whether the checkbox is in an indeterminate (mixed) state. */
  @property({ type: Boolean, reflect: true })
  accessor indeterminate = false;

  /** Whether the checkbox is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Whether the checkbox is read-only. */
  @property({ type: Boolean, reflect: true, attribute: "read-only" })
  accessor readOnly = false;

  /** Whether the checkbox is required for form submission. */
  @property({ type: Boolean, reflect: true })
  accessor required = false;

  /** The name attribute for form submission. */
  @property()
  accessor name: string | undefined = undefined;

  /** The value attribute for form submission. */
  @property()
  accessor value: string | undefined = undefined;

  /** When true, acts as a parent (select-all) checkbox within a group. */
  @property({ type: Boolean })
  accessor parent = false;

  @state()
  accessor #internalChecked = false;

  #groupCtx = new ContextConsumer(this, {
    context: checkboxGroupContext,
    subscribe: true,
  });

  get #isChecked(): boolean {
    const ctx = this.#groupCtx.value;
    if (ctx && this.value !== undefined) {
      if (this.parent) {
        return (
          ctx.allValues.length > 0 &&
          ctx.allValues.every((v) => ctx.checkedValues.includes(v))
        );
      }
      return ctx.checkedValues.includes(this.value);
    }
    return this.checked ?? this.#internalChecked;
  }

  get #isIndeterminate(): boolean {
    const ctx = this.#groupCtx.value;
    if (ctx && this.parent && this.value !== undefined) {
      const count = ctx.allValues.filter((v) =>
        ctx.checkedValues.includes(v)
      ).length;
      return count > 0 && count < ctx.allValues.length;
    }
    return this.indeterminate;
  }

  get #isDisabled(): boolean {
    return (
      this.disabled ||
      (this.#groupCtx.value?.disabled ?? false)
    );
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.checked === undefined && this.defaultChecked) {
      this.#internalChecked = true;
    }
    this.addEventListener("click", this.#handleHostClick);
  }

  override willUpdate(): void {
    this.#syncFormValue();
  }

  #syncFormValue(): void {
    if (this.#isChecked) {
      this.#internals.setFormValue(this.value ?? "on");
    } else {
      this.#internals.setFormValue(null);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.#handleHostClick);
  }

  #handleHostClick = (_e: Event): void => {
    this.#handleClick();
  };

  #handleClick = (): void => {
    if (this.#isDisabled || this.readOnly) return;

    const ctx = this.#groupCtx.value;

    // Within a group: delegate to context
    if (ctx && this.value !== undefined) {
      if (this.parent) {
        ctx.toggleAll(!this.#isChecked);
      } else {
        ctx.toggle(this.value);
      }
      return;
    }

    // Standalone behavior
    const newChecked = !this.#isChecked;

    if (this.checked === undefined) {
      this.#internalChecked = newChecked;
      this.indeterminate = false;
    }

    this.dispatchEvent(
      checkedChangeEvent({
        checked: newChecked,
        indeterminate: false,
      }),
    );
  };

  #handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === " ") {
      e.preventDefault();
      this.#handleClick();
    }
  };

  override render(): TemplateResult {
    const isChecked = this.#isChecked;
    const isIndeterminate = this.#isIndeterminate;
    const isDisabled = this.#isDisabled;
    const showIndicator = isChecked || isIndeterminate;

    return html`
      <span
        part="root"
        role="checkbox"
        aria-checked="${isIndeterminate ? "mixed" : String(isChecked)}"
        aria-disabled="${isDisabled ? "true" : nothing}"
        aria-readonly="${this.readOnly ? "true" : nothing}"
        aria-required="${this.required ? "true" : nothing}"
        tabindex="${isDisabled ? nothing : "0"}"
        ?data-checked="${isChecked && !isIndeterminate}"
        ?data-unchecked="${!isChecked && !isIndeterminate}"
        ?data-indeterminate="${isIndeterminate}"
        ?data-disabled="${isDisabled}"
        ?data-readonly="${this.readOnly}"
        ?data-required="${this.required}"
        @keydown="${this.#handleKeyDown}"
      >
        <span
          part="indicator"
          ?data-checked="${isChecked && !isIndeterminate}"
          ?data-unchecked="${!isChecked && !isIndeterminate}"
          ?data-indeterminate="${isIndeterminate}"
        >
          ${showIndicator
            ? isIndeterminate
              ? indeterminateIcon
              : checkIcon
            : nothing}
        </span>
      </span>
      <slot></slot>
    `;
  }
}
