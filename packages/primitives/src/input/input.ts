/** Ported from original DUI: deep-future-app/app/client/components/dui/input */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";

export const inputChangeEvent = customEvent<{ value: string }>("input-change", {
  bubbles: true,
  composed: true,
});

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
  }

  [part="input"] {
    box-sizing: border-box;
    width: 100%;
    outline: none;
  }

  [part="input"]:disabled {
    cursor: not-allowed;
  }
`;

/**
 * `<dui-input>` — A native input element that integrates with dui-field.
 *
 * Automatically works with Field for accessible labeling and validation.
 *
 * @csspart input - The native input element.
 * @fires input-change - Fired when value changes. Detail: { value: string }
 */
export class DuiInputPrimitive extends LitElement {
  static tagName = "dui-input" as const;
  static formAssociated = true;

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles = [base, styles];

  #internals!: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  /** Input type (text, email, password, etc.) */
  @property({ type: String })
  accessor type: string = "text";

  /** Current input value. */
  @property({ type: String })
  accessor value = "";

  /** Placeholder text. */
  @property({ type: String })
  accessor placeholder = "";

  /** Whether the input is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Whether the input is required. */
  @property({ type: Boolean })
  accessor required = false;

  /** Whether the input is read-only. */
  @property({ type: Boolean })
  accessor readonly = false;

  /** Minimum length for text inputs. */
  @property({ type: Number, attribute: "minlength" })
  accessor minLength: number | undefined = undefined;

  /** Maximum length for text inputs. */
  @property({ type: Number, attribute: "maxlength" })
  accessor maxLength: number | undefined = undefined;

  /** Pattern for validation. */
  @property({ type: String })
  accessor pattern: string | undefined = undefined;

  /** Name attribute for form submission. */
  @property({ type: String })
  accessor name = "";

  /** Autocomplete hint for the browser. */
  @property({ type: String })
  accessor autocomplete: string | undefined = undefined;

  /** Whether the input should receive focus on mount. */
  @property({ type: Boolean })
  override accessor autofocus = false;

  override firstUpdated(): void {
    this.#syncValidity();
    if (this.autofocus) {
      this.focus();
    }
  }

  override updated(): void {
    this.#syncValidity();
  }

  #onInput = (event: InputEvent): void => {
    const target = event.target as HTMLInputElement;
    this.value = target.value;

    this.#syncFormValue();
    this.#syncValidity();

    this.dispatchEvent(inputChangeEvent({ value: this.value }));
  };

  override willUpdate(): void {
    this.#syncFormValue();
  }

  #syncFormValue(): void {
    this.#internals.setFormValue(this.value);
  }

  #syncValidity(): void {
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      this.#internals.setValidity(
        input.validity,
        input.validationMessage,
        input,
      );
    }
  }

  override render(): TemplateResult {
    return html`
      <input
        part="input"
        type="${this.type}"
        .value="${live(this.value)}"
        placeholder="${this.placeholder}"
        ?disabled="${this.disabled}"
        ?required="${this.required}"
        ?readonly="${this.readonly}"
        minlength="${ifDefined(this.minLength)}"
        maxlength="${ifDefined(this.maxLength)}"
        pattern="${ifDefined(this.pattern)}"
        name="${this.name}"
        autocomplete="${ifDefined(this.autocomplete)}"
        @input="${this.#onInput}"
      />
    `;
  }
}
