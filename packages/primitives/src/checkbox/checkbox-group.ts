/** Ported from original DUI: deep-future-app/app/client/components/dui/checkbox */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import {
  type CheckboxGroupContext,
  checkboxGroupContext,
} from "./checkbox-group-context.ts";

export const valueChangeEvent = customEvent<string[]>("value-change", {
  bubbles: true,
  composed: true,
});

/** Structural styles only — layout and behavioral CSS. */
const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
`;

/**
 * `<dui-checkbox-group>` — Groups multiple checkboxes with shared state.
 *
 * Manages a shared array of checked values. Supports controlled and
 * uncontrolled usage, and an `allValues` prop for parent checkbox
 * (select-all) patterns.
 *
 * @slot - Default slot for `<dui-checkbox>` children.
 * @csspart root - The group container element.
 *
 * @fires value-change - Fired when the set of checked values changes. Detail: string[]
 */
export class DuiCheckboxGroupPrimitive extends LitElement {
  static tagName = "dui-checkbox-group" as const;

  static override styles = [base, styles];

  /** Checked values (controlled). */
  @property({ attribute: false })
  accessor value: string[] | undefined = undefined;

  /** Initial checked values for uncontrolled usage. */
  @property({ attribute: false })
  accessor defaultValue: string[] = [];

  /**
   * All possible checkbox values in the group.
   * Required when using a parent (select-all) checkbox.
   */
  @property({ attribute: false })
  accessor allValues: string[] = [];

  /** Whether all checkboxes in the group are disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @state()
  accessor #internalValues: string[] = [];

  #getCheckedValues = (): readonly string[] =>
    this.value ?? this.#internalValues;

  #toggle = (val: string): void => {
    const current = this.#getCheckedValues();

    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];

    if (this.value === undefined) {
      this.#internalValues = next;
    }

    this.dispatchEvent(valueChangeEvent(next));
  };

  #toggleAll = (checked: boolean): void => {
    const next = checked ? [...this.allValues] : [];

    if (this.value === undefined) {
      this.#internalValues = next;
    }

    this.dispatchEvent(valueChangeEvent(next));
  };

  @provide({ context: checkboxGroupContext })
  @state()
  accessor _ctx: CheckboxGroupContext = this.#buildContext();

  #buildContext(): CheckboxGroupContext {
    return {
      checkedValues: this.#getCheckedValues(),
      allValues: this.allValues,
      disabled: this.disabled,
      toggle: this.#toggle,
      toggleAll: this.#toggleAll,
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.value === undefined && this.defaultValue.length > 0) {
      this.#internalValues = [...this.defaultValue];
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
        role="group"
        ?data-disabled="${this.disabled}"
      >
        <slot></slot>
      </div>
    `;
  }
}
