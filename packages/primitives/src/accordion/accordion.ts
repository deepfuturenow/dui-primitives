/** Ported from original DUI: deep-future-app/app/client/components/dui/accordion */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import {
  type AccordionContext,
  accordionContext,
} from "./accordion-context.ts";

export const valueChangeEvent = customEvent<string[]>("value-change", {
  bubbles: true,
  composed: true,
});

const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
  }
`;

export class DuiAccordionPrimitive extends LitElement {
  static tagName = "dui-accordion" as const;
  static override styles = [base, styles];

  @property({ type: Array })
  accessor value: string[] | undefined = undefined;

  @property({ type: Array, attribute: "default-value" })
  accessor defaultValue: string[] = [];

  @property({ type: Boolean })
  accessor disabled = false;

  @property({ type: Boolean })
  accessor multiple = false;

  @property({ type: Boolean, attribute: "loop-focus" })
  accessor loopFocus = true;

  @property({ type: String })
  accessor orientation: "vertical" | "horizontal" = "vertical";

  @property({ type: Boolean, attribute: "keep-mounted" })
  accessor keepMounted = false;

  @state()
  accessor #internalOpenValues: string[] = [];

  #itemRegistry = new Map<string, HTMLElement>();
  #itemOrder: string[] = [];

  #getOpenValues = (): readonly string[] =>
    this.value ?? this.#internalOpenValues;

  #toggle = (value: string): void => {
    const current = [...this.#getOpenValues()];
    const index = current.indexOf(value);

    let next: string[];
    if (index >= 0) {
      next = current.filter((v) => v !== value);
    } else if (this.multiple) {
      next = [...current, value];
    } else {
      next = [value];
    }

    if (this.value === undefined) {
      this.#internalOpenValues = next;
    }

    this.dispatchEvent(valueChangeEvent(next));
  };

  #registerItem = (value: string, el: HTMLElement): void => {
    this.#itemRegistry.set(value, el);
    if (!this.#itemOrder.includes(value)) {
      this.#itemOrder.push(value);
    }
  };

  #unregisterItem = (value: string): void => {
    this.#itemRegistry.delete(value);
    this.#itemOrder = this.#itemOrder.filter((v) => v !== value);
  };

  #focusItem = (
    value: string,
    direction: "next" | "prev" | "first" | "last",
  ): void => {
    const currentIndex = this.#itemOrder.indexOf(value);
    if (currentIndex === -1) return;

    const len = this.#itemOrder.length;
    let targetIndex: number | undefined;

    switch (direction) {
      case "next":
        if (currentIndex < len - 1) {
          targetIndex = currentIndex + 1;
        } else if (this.loopFocus) {
          targetIndex = 0;
        }
        break;
      case "prev":
        if (currentIndex > 0) {
          targetIndex = currentIndex - 1;
        } else if (this.loopFocus) {
          targetIndex = len - 1;
        }
        break;
      case "first":
        targetIndex = 0;
        break;
      case "last":
        targetIndex = len - 1;
        break;
    }

    if (targetIndex !== undefined) {
      const targetValue = this.#itemOrder[targetIndex];
      const targetEl = this.#itemRegistry.get(targetValue);
      const trigger = targetEl?.shadowRoot?.querySelector(
        "[part='trigger']",
      ) as HTMLElement | null;
      trigger?.focus();
    }
  };

  @provide({ context: accordionContext })
  @state()
  accessor _ctx: AccordionContext = this.#buildContext();

  #buildContext(): AccordionContext {
    return {
      openValues: this.#getOpenValues(),
      disabled: this.disabled,
      orientation: this.orientation,
      loopFocus: this.loopFocus,
      keepMounted: this.keepMounted,
      toggle: this.#toggle,
      registerItem: this.#registerItem,
      unregisterItem: this.#unregisterItem,
      focusItem: this.#focusItem,
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.value === undefined && this.defaultValue.length > 0) {
      this.#internalOpenValues = [...this.defaultValue];
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
        data-orientation=${this.orientation}
        ?data-disabled=${this.disabled}
      >
        <slot></slot>
      </div>
    `;
  }
}
