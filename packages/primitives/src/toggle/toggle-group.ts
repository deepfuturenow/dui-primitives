import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import {
  type ToggleGroupContext,
  toggleGroupContext,
} from "./toggle-group-context.ts";

export const valueChangeEvent = customEvent<{ value: string[] }>(
  "value-change",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: inline-flex;
  }

  [part="root"] {
    display: inline-flex;
  }

  :host([orientation="vertical"]) [part="root"] {
    flex-direction: column;
  }
`;

/**
 * `<dui-toggle-group>` — Groups toggle buttons with shared single/multi selection.
 *
 * @slot - `dui-toggle` children.
 * @csspart root - The group container.
 * @fires value-change - Fired when selection changes. Detail: { value: string[] }
 */
export class DuiToggleGroupPrimitive extends LitElement {
  static tagName = "dui-toggle-group" as const;

  static override styles = [base, styles];

  @property({ type: Array })
  accessor value: string[] | undefined = undefined;

  @property({ type: Array, attribute: "default-value" })
  accessor defaultValue: string[] = [];

  @property({ reflect: true })
  accessor type: "single" | "multiple" = "single";

  @property({ reflect: true })
  accessor orientation: "horizontal" | "vertical" = "horizontal";

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: Boolean })
  accessor loop = true;

  @state()
  accessor #internalValue: string[] = [];

  get #currentValue(): string[] {
    return this.value ?? this.#internalValue;
  }

  #toggle = (itemValue: string): void => {
    if (this.disabled) return;

    const current = this.#currentValue;
    let next: string[];

    if (this.type === "single") {
      next = current.includes(itemValue) ? [] : [itemValue];
    } else {
      next = current.includes(itemValue)
        ? current.filter((v) => v !== itemValue)
        : [...current, itemValue];
    }

    if (this.value === undefined) {
      this.#internalValue = next;
    }

    this.dispatchEvent(valueChangeEvent({ value: next }));
  };

  @provide({ context: toggleGroupContext })
  @state()
  accessor _ctx: ToggleGroupContext = this.#buildContext();

  #buildContext(): ToggleGroupContext {
    return {
      value: this.#currentValue,
      disabled: this.disabled,
      type: this.type,
      toggle: this.#toggle,
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.value === undefined && this.defaultValue.length > 0) {
      this.#internalValue = [...this.defaultValue];
    }
    this._ctx = this.#buildContext();
  }

  override willUpdate(): void {
    this._ctx = this.#buildContext();
  }

  #onKeyDown = (e: KeyboardEvent): void => {
    const isHorizontal = this.orientation === "horizontal";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

    if (e.key !== nextKey && e.key !== prevKey) return;

    e.preventDefault();

    const toggles = [
      ...this.querySelectorAll("dui-toggle"),
    ] as HTMLElement[];
    const focusable = toggles.filter(
      (t) => !t.hasAttribute("disabled"),
    );
    if (focusable.length === 0) return;

    const active = this.shadowRoot?.activeElement ??
      document.activeElement;
    const currentToggle = toggles.find(
      (t) => t === active || t.shadowRoot?.activeElement === active || t.contains(active as Node),
    );
    const currentIndex = currentToggle
      ? focusable.indexOf(currentToggle)
      : -1;

    let nextIndex: number;
    if (e.key === nextKey) {
      nextIndex = currentIndex + 1;
      if (nextIndex >= focusable.length) {
        nextIndex = this.loop ? 0 : focusable.length - 1;
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = this.loop ? focusable.length - 1 : 0;
      }
    }

    focusable[nextIndex]?.focus();
  };

  override render(): TemplateResult {
    return html`
      <div
        part="root"
        role="group"
        aria-orientation="${this.orientation}"
        @keydown="${this.#onKeyDown}"
      >
        <slot></slot>
      </div>
    `;
  }
}
