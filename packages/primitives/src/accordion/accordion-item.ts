/** Ported from original DUI: deep-future-app/app/client/components/dui/accordion */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import {
  type AccordionContext,
  accordionContext,
} from "./accordion-context.ts";

export const openChangeEvent = customEvent<{ value: string; open: boolean }>(
  "open-change",
  { bubbles: true, composed: true },
);

const styles = css`
  :host {
    display: block;
  }

  [part="trigger"] {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
    border: none;
    background: none;
    text-align: left;
    outline: none;
    box-sizing: border-box;
  }

  [part="trigger"][data-disabled] {
    cursor: default;
  }

  [part="panel"] {
    overflow: hidden;
    contain: content;
    transition-property: height;
  }
`;

export class DuiAccordionItemPrimitive extends LitElement {
  static tagName = "dui-accordion-item" as const;
  static override styles = [base, styles];

  @property({ type: String })
  accessor value = "";

  @property({ type: Boolean })
  accessor disabled = false;

  @consume({ context: accordionContext, subscribe: true })
  accessor _ctx!: AccordionContext;

  @state()
  accessor #starting = false;

  @state()
  accessor #ending = false;

  @state()
  accessor #panelHeight = "0";

  @state()
  accessor #visible = false;

  #prevOpen: boolean | undefined = undefined;
  #animGen = 0;

  get #open(): boolean {
    return this._ctx?.openValues.includes(this.value) ?? false;
  }

  get #isDisabled(): boolean {
    return this.disabled || this._ctx?.disabled;
  }

  get #triggerId(): string {
    return `dui-trigger-${this.value}`;
  }

  get #panelId(): string {
    return `dui-panel-${this.value}`;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._ctx?.registerItem(this.value, this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ctx?.unregisterItem(this.value);
  }

  override willUpdate(): void {
    const isOpen = this.#open;

    if (this.#prevOpen === undefined) {
      this.#visible = isOpen;
      this.#panelHeight = isOpen ? "auto" : "0";
    } else if (this.#prevOpen !== isOpen) {
      if (isOpen) {
        this.#startOpenAnimation();
      } else {
        this.#startCloseAnimation();
      }
      this.dispatchEvent(
        openChangeEvent({ value: this.value, open: isOpen }),
      );
    }

    this.#prevOpen = isOpen;
  }

  #startOpenAnimation(): void {
    const gen = ++this.#animGen;
    this.#ending = false;
    this.#visible = true;
    this.#starting = true;
    this.#panelHeight = "0";

    requestAnimationFrame(() => {
      if (this.#animGen !== gen) return;
      const panel = this.shadowRoot?.querySelector(
        "[part='panel']",
      ) as HTMLElement | null;
      if (panel) {
        this.#panelHeight = `${panel.scrollHeight}px`;
      }
      this.#starting = false;
    });
  }

  #startCloseAnimation(): void {
    const gen = ++this.#animGen;
    this.#starting = false;
    const panel = this.shadowRoot?.querySelector(
      "[part='panel']",
    ) as HTMLElement | null;
    if (panel) {
      this.#panelHeight = `${panel.scrollHeight}px`;
    }

    requestAnimationFrame(() => {
      if (this.#animGen !== gen) return;
      this.#ending = true;
      this.#panelHeight = "0";
    });
  }

  #onTransitionEnd = (event: TransitionEvent): void => {
    if (event.propertyName !== "height") return;

    if (this.#ending) {
      this.#ending = false;
      if (!this._ctx?.keepMounted) {
        this.#visible = false;
      }
    } else if (this.#open) {
      this.#panelHeight = "auto";
    }
  };

  #onClick = (): void => {
    if (this.#isDisabled) return;
    this._ctx.toggle(this.value);
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (this.#isDisabled) return;

    const isVertical = this._ctx.orientation === "vertical";
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
    const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";

    switch (event.key) {
      case nextKey:
        event.preventDefault();
        this._ctx.focusItem(this.value, "next");
        break;
      case prevKey:
        event.preventDefault();
        this._ctx.focusItem(this.value, "prev");
        break;
      case "Home":
        event.preventDefault();
        this._ctx.focusItem(this.value, "first");
        break;
      case "End":
        event.preventDefault();
        this._ctx.focusItem(this.value, "last");
        break;
    }
  };

  override render(): TemplateResult {
    const shouldRender = this.#visible || this._ctx?.keepMounted;

    return html`
      <div
        part="item"
        ?data-open=${this.#open}
        ?data-disabled=${this.#isDisabled}
      >
        <h3 part="header">
          <button
            part="trigger"
            id=${this.#triggerId}
            aria-expanded=${this.#open}
            aria-controls=${this.#panelId}
            ?data-open=${this.#open}
            ?data-disabled=${this.#isDisabled}
            @click=${this.#onClick}
            @keydown=${this.#onKeyDown}
          >
            <slot name="trigger"></slot>
          </button>
        </h3>
        ${shouldRender
          ? html`
              <div
                part="panel"
                id=${this.#panelId}
                role="region"
                aria-labelledby=${this.#triggerId}
                style="height: ${this.#panelHeight}"
                ?data-open=${this.#open && !this.#starting}
                ?data-starting-style=${this.#starting}
                ?data-ending-style=${this.#ending}
                ?hidden=${!this.#visible && !this.#ending}
                @transitionend=${this.#onTransitionEnd}
              >
                <div part="content">
                  <slot></slot>
                </div>
              </div>
            `
          : nothing}
      </div>
    `;
  }
}
