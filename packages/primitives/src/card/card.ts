/** Ported from ShadCN/ui: https://ui.shadcn.com/docs/components/card */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "../core/base.ts";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  [part="header"]:not([hidden]) {
    display: flex;
    align-items: start;
  }

  [part="header-text"] {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  [part="action"] {
    height: 0;
    overflow: visible;
    display: flex;
    align-items: start;
  }

  [part="footer"]:not([hidden]) {
    display: flex;
    align-items: center;
  }
`;

/**
 * `<dui-card>` — A container for grouped content with header, body,
 * and footer sections.
 *
 * Uses flex-column + gap for vertical rhythm. The card owns all internal
 * spacing; consumers slot content into named regions.
 *
 * @slot - Main card content (body).
 * @slot title - Card heading text.
 * @slot description - Helper text below the title.
 * @slot action - Top-right header action (button, badge, etc.).
 * @slot footer - Footer content (buttons, links, etc.).
 *
 * @csspart root - The outer card container.
 * @csspart header - The header section (title + description + action).
 * @csspart header-text - The vertical stack holding title and description.
 * @csspart content - The wrapper around the default slot.
 * @csspart footer - The footer section.
 */
export class DuiCardPrimitive extends LitElement {
  static tagName = "dui-card" as const;

  static override styles = [base, styles];

  /** Card size — controls internal spacing via `--card-*` tokens. */
  @property({ reflect: true })
  accessor size: string = "";

  @state() accessor #hasHeader = false;
  @state() accessor #hasFooter = false;

  #titleFilled = false;
  #descFilled = false;
  #actionFilled = false;

  #onHeaderSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const filled = slot.assignedElements().length > 0;
    if (slot.name === "title") this.#titleFilled = filled;
    else if (slot.name === "description") this.#descFilled = filled;
    else if (slot.name === "action") this.#actionFilled = filled;
    this.#hasHeader = this.#titleFilled || this.#descFilled ||
      this.#actionFilled;
  };

  #onFooterSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this.#hasFooter = slot.assignedElements().length > 0;
  };

  override render(): TemplateResult {
    return html`
      <div part="root">
        <div part="header" ?hidden=${!this.#hasHeader}>
          <div part="header-text">
            <slot name="title" @slotchange=${this.#onHeaderSlotChange}></slot>
            <slot
              name="description"
              @slotchange=${this.#onHeaderSlotChange}
            ></slot>
          </div>
          <div part="action">
            <slot name="action" @slotchange=${this.#onHeaderSlotChange}></slot>
          </div>
        </div>
        <div part="content">
          <slot></slot>
        </div>
        <div part="footer" ?hidden=${!this.#hasFooter}>
          <slot name="footer" @slotchange=${this.#onFooterSlotChange}></slot>
        </div>
      </div>
    `;
  }
}
