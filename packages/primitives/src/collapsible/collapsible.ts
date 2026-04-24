/** Ported from original DUI: deep-future-app/app/client/components/dui/collapsible */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";

export const openChangeEvent = customEvent<{ open: boolean }>(
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

  slot[name="trigger"] {
    flex: 1;
    min-width: 0;
  }

  [part="panel"] {
    overflow: hidden;
    contain: content;
    transition-property: height;
  }
`;

export class DuiCollapsiblePrimitive extends LitElement {
  static tagName = "dui-collapsible" as const;
  static override styles = [base, styles];

  /** Controlled open state. When set, the component is fully controlled. */
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  /** Uncontrolled initial open state. Only used on first render. */
  @property({ type: Boolean, attribute: "default-open" })
  accessor defaultOpen = false;

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Keep panel content mounted when closed. */
  @property({ type: Boolean, attribute: "keep-mounted" })
  accessor keepMounted = false;

  @state()
  accessor #starting = false;

  @state()
  accessor #ending = false;

  @state()
  accessor #panelHeight = "0";

  @state()
  accessor #visible = false;

  @state()
  accessor #internalOpen = false;

  #prevOpen: boolean | undefined = undefined;
  #animGen = 0;
  #controlled = false;

  get #isOpen(): boolean {
    return this.#controlled ? this.open : this.#internalOpen;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Check if `open` attribute was explicitly set (controlled mode)
    this.#controlled = this.hasAttribute("open");
    if (!this.#controlled && this.defaultOpen) {
      this.#internalOpen = true;
    }
  }

  override willUpdate(changed: Map<string, unknown>): void {
    // If `open` property is set after initial render, switch to controlled mode
    if (changed.has("open") && this.#prevOpen !== undefined) {
      this.#controlled = true;
    }

    const isOpen = this.#isOpen;

    if (this.#prevOpen === undefined) {
      this.#visible = isOpen;
      this.#panelHeight = isOpen ? "auto" : "0";
    } else if (this.#prevOpen !== isOpen) {
      if (isOpen) {
        this.#startOpenAnimation();
      } else {
        this.#startCloseAnimation();
      }
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
      if (!this.keepMounted) {
        this.#visible = false;
      }
    } else if (this.#isOpen) {
      this.#panelHeight = "auto";
    }
  };

  #onClick = (): void => {
    if (this.disabled) return;

    const nextOpen = !this.#isOpen;

    if (!this.#controlled) {
      this.#internalOpen = nextOpen;
    }

    this.dispatchEvent(openChangeEvent({ open: nextOpen }));
  };

  override render(): TemplateResult {
    const isOpen = this.#isOpen;
    const shouldRender = this.#visible || this.keepMounted;

    return html`
      <button
        part="trigger"
        aria-expanded=${isOpen}
        ?data-open=${isOpen}
        ?data-disabled=${this.disabled}
        ?disabled=${this.disabled}
        @click=${this.#onClick}
      >
        <slot name="trigger"></slot>
      </button>
      ${shouldRender
        ? html`
            <div
              part="panel"
              role="region"
              style="height: ${this.#panelHeight}"
              ?data-open=${isOpen && !this.#starting}
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
    `;
  }
}
