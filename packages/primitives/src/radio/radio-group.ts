/** Ported from original DUI: deep-future-app/app/client/components/dui/radio */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "../core/base.ts";
import {
  type RadioGroupContext,
  radioGroupContext,
} from "./radio-group-context.ts";
import { customEvent } from "../core/event.ts";

export const valueChangeEvent = customEvent<{ value: string }>("value-change", {
  bubbles: true,
  composed: true,
});

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  [part="root"][data-disabled] {
    opacity: 0.5;
  }
`;

/**
 * `<dui-radio-group>` — Groups multiple radio buttons with shared state.
 *
 * Only one radio can be selected at a time within a group. Supports
 * controlled and uncontrolled usage.
 *
 * @slot - Default slot for `<dui-radio>` children.
 * @csspart root - The group container element.
 * @fires value-change - Fired when the selected value changes. Detail: { value: string }
 */
export class DuiRadioGroupPrimitive extends LitElement {
  static tagName = "dui-radio-group" as const;

  static override styles = [base, styles];

  /** The name attribute for form submission. */
  @property()
  accessor name: string | undefined = undefined;

  /** Selected value (controlled). */
  @property()
  accessor value: string | undefined = undefined;

  /** Initial selected value for uncontrolled usage. */
  @property({ attribute: "default-value" })
  accessor defaultValue: string | undefined = undefined;

  /** Whether all radios in the group are disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Whether all radios in the group are read-only. */
  @property({ type: Boolean, reflect: true, attribute: "read-only" })
  accessor readOnly = false;

  /** Whether a selection is required. */
  @property({ type: Boolean, reflect: true })
  accessor required = false;

  @state()
  accessor #internalValue: string | undefined = undefined;

  #getSelectedValue = (): string | undefined =>
    this.value ?? this.#internalValue;

  #select = (val: string): void => {
    if (this.disabled || this.readOnly) return;

    if (this.value === undefined) {
      this.#internalValue = val;
    }

    this.dispatchEvent(valueChangeEvent({ value: val }));
  };

  @provide({ context: radioGroupContext })
  @state()
  accessor _ctx: RadioGroupContext = this.#buildContext();

  #buildContext(): RadioGroupContext {
    return {
      name: this.name,
      value: this.#getSelectedValue(),
      disabled: this.disabled,
      readOnly: this.readOnly,
      required: this.required,
      select: this.#select,
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.value === undefined && this.defaultValue !== undefined) {
      this.#internalValue = this.defaultValue;
    }
    this._ctx = this.#buildContext();
  }

  override willUpdate(): void {
    this._ctx = this.#buildContext();
  }

  override render(): TemplateResult {
    return html`
      <div
        part="root"
        role="radiogroup"
        ?data-disabled="${this.disabled}"
        ?data-readonly="${this.readOnly}"
        ?data-required="${this.required}"
      >
        <slot></slot>
      </div>
    `;
  }
}
