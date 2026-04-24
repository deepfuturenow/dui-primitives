import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import {
  type ToggleGroupContext,
  toggleGroupContext,
} from "./toggle-group-context.ts";

export const pressedChangeEvent = customEvent<{ pressed: boolean }>(
  "pressed-change",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: inline-block;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--toggle-gap, 0);
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
  }

  [part="root"]:disabled {
    cursor: not-allowed;
  }
`;

/**
 * `<dui-toggle>` — A two-state toggle button. Works standalone or inside a toggle group.
 *
 * @slot - Toggle content (text and/or icons).
 * @slot icon - Optional leading icon.
 * @csspart root - The button element.
 * @fires pressed-change - Fired when toggled. Detail: { pressed: boolean }
 */
export class DuiTogglePrimitive extends LitElement {
  static tagName = "dui-toggle" as const;

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles = [base, styles];

  @property({ type: Boolean })
  accessor pressed: boolean | undefined = undefined;

  @property({ type: Boolean, attribute: "default-pressed" })
  accessor defaultPressed = false;

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property()
  accessor value: string | undefined = undefined;

  @state()
  accessor #internalPressed = false;

  @consume({ context: toggleGroupContext, subscribe: true })
  @state()
  accessor _groupCtx!: ToggleGroupContext;

  get #isPressed(): boolean {
    if (this._groupCtx && this.value !== undefined) {
      return this._groupCtx.value.includes(this.value);
    }
    return this.pressed ?? this.#internalPressed;
  }

  get #isDisabled(): boolean {
    return this.disabled || (this._groupCtx?.disabled ?? false);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.pressed === undefined && this.defaultPressed) {
      this.#internalPressed = true;
    }
  }

  #handleClick = (): void => {
    if (this.#isDisabled) return;

    if (this._groupCtx && this.value !== undefined) {
      this._groupCtx.toggle(this.value);
      return;
    }

    const newPressed = !this.#isPressed;

    if (this.pressed === undefined) {
      this.#internalPressed = newPressed;
    }

    this.dispatchEvent(pressedChangeEvent({ pressed: newPressed }));
  };

  override render(): TemplateResult {
    const isPressed = this.#isPressed;
    const isDisabled = this.#isDisabled;

    return html`
      <button
        part="root"
        type="button"
        aria-pressed="${String(isPressed)}"
        ?disabled="${isDisabled}"
        ?data-pressed="${isPressed}"
        ?data-disabled="${isDisabled}"
        @click="${this.#handleClick}"
      >
        <slot name="icon"></slot>
        <slot></slot>
      </button>
    `;
  }
}
