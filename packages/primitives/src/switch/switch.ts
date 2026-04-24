import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";

export const checkedChangeEvent = customEvent<{ checked: boolean }>(
  "checked-change",
  { bubbles: true, composed: true },
);

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
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    padding: 0;
    margin-block-end: 0;
    margin-inline: 0;
    border: none;
    cursor: pointer;
    user-select: none;
  }

  [part="thumb"] {
    position: absolute;
    left: var(--switch-thumb-offset, 0.125rem);
  }

  [part="root"][data-checked] [part="thumb"] {
    transform: translateX(var(--switch-checked-offset, 0));
  }

`;

/**
 * `<dui-switch>` — A toggle switch for binary on/off settings.
 *
 * @csspart root - The switch track container.
 * @csspart thumb - The movable thumb indicator.
 * @fires checked-change - Fired when toggled. Detail: { checked: boolean }
 */
export class DuiSwitchPrimitive extends LitElement {
  static tagName = "dui-switch" as const;
  static formAssociated = true;

  static override styles = [base, styles];

  #internals!: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: Boolean, reflect: true })
  accessor checked: boolean | undefined = undefined;

  @property({ type: Boolean, attribute: "default-checked" })
  accessor defaultChecked = false;

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: Boolean, reflect: true, attribute: "read-only" })
  accessor readOnly = false;

  @property({ type: Boolean, reflect: true })
  accessor required = false;

  @property()
  accessor name: string | undefined = undefined;

  @property()
  accessor value = "on";

  @property({ attribute: "unchecked-value" })
  accessor uncheckedValue = "";

  @state()
  accessor #internalChecked = false;

  get #isChecked(): boolean {
    return this.checked ?? this.#internalChecked;
  }

  get #isDisabled(): boolean {
    return this.disabled;
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
    const formValue = this.#isChecked ? this.value : this.uncheckedValue;
    this.#internals.setFormValue(formValue || null);
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

    const newChecked = !this.#isChecked;

    if (this.checked === undefined) {
      this.#internalChecked = newChecked;
    }

    this.dispatchEvent(checkedChangeEvent({ checked: newChecked }));
  };

  #handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this.#handleClick();
    }
  };

  override render(): TemplateResult {
    const isChecked = this.#isChecked;
    const isDisabled = this.#isDisabled;

    return html`
      <span
        part="root"
        role="switch"
        aria-checked="${String(isChecked)}"
        aria-disabled="${isDisabled ? "true" : nothing}"
        aria-readonly="${this.readOnly ? "true" : nothing}"
        aria-required="${this.required ? "true" : nothing}"
        tabindex="${isDisabled ? nothing : "0"}"
        ?data-checked="${isChecked}"
        ?data-unchecked="${!isChecked}"
        ?data-disabled="${isDisabled}"
        ?data-readonly="${this.readOnly}"
        ?data-required="${this.required}"
        @keydown="${this.#handleKeyDown}"
      >
        <span part="thumb"></span>
      </span>
      <slot></slot>
    `;
  }
}
