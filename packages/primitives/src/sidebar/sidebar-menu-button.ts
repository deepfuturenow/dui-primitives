/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { sidebarContext } from "./sidebar-context.ts";


const styles = css`
  :host {
    display: block;
  }

  .Row {
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .Button {
    box-sizing: border-box;
    display: flex;
    flex: 1;
    min-width: 0;
    align-items: center;
    height: 100%;
    border: none;
    border-radius: 0;
    background: transparent;
    text-align: left;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    font: inherit;
    color: inherit;
    padding: 0;
  }

  .Button:focus-visible {
    outline: none;
  }

  .Label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .Suffix {
    flex-shrink: 0;
  }

  .Row[data-icon-collapsed] {
    justify-content: center;
  }

  .Row[data-icon-collapsed] .Label,
  .Row[data-icon-collapsed] .Suffix {
    display: none;
  }

  :host([disabled]) .Button {
    pointer-events: none;
  }
`;



/**
 * `<dui-sidebar-menu-button>` — Interactive button or link within a sidebar menu.
 *
 * Renders as a `<button>` by default, or an `<a>` when `href` is set.
 * Supports icon-collapsed mode where only the icon is visible, with an
 * optional tooltip.
 *
 * @slot icon - Icon slot, shown before the label.
 * @slot - Default slot for label text.
 * @slot suffix - Suffix slot, shown after the label.
 * @fires spa-navigate - Fired on normal link clicks. Detail: { href: string }
 */
export class DuiSidebarMenuButtonPrimitive extends LitElement {
  static tagName = "dui-sidebar-menu-button" as const;
  static override styles = [base, styles];

  /** Whether the button is in active/selected state. */
  @property({ type: Boolean, reflect: true })
  accessor active = false;

  /** Whether the button is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Tooltip text shown when sidebar is icon-collapsed. */
  @property()
  accessor tooltip: string = "";

  /** When set, renders as an anchor tag instead of a button. */
  @property()
  accessor href: string | undefined = undefined;

  #ctx = new ContextConsumer(this, {
    context: sidebarContext,
    subscribe: true,
  });

  get #isIconCollapsed(): boolean {
    const ctx = this.#ctx.value;
    return ctx?.collapsible === "icon" && ctx?.state === "collapsed";
  }

  #onLinkClick = (event: MouseEvent): void => {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    if (
      this.href &&
      !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    ) {
      event.preventDefault();
      this.dispatchEvent(
        new CustomEvent("spa-navigate", {
          detail: { href: this.href },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  #renderButton(): TemplateResult {
    return html`
      <button
        class="Button"
        ?disabled=${this.disabled}
        ?data-active=${this.active}
      >
        <slot name="icon"></slot>
        <span class="Label"><slot></slot></span>
        <span class="Suffix"><slot name="suffix"></slot></span>
      </button>
    `;
  }

  #renderLink(): TemplateResult {
    return html`
      <a
        class="Button"
        href=${this.href ?? nothing}
        aria-disabled=${this.disabled || nothing}
        ?data-active=${this.active}
        @click=${this.#onLinkClick}
      >
        <slot name="icon"></slot>
        <span class="Label"><slot></slot></span>
        <span class="Suffix"><slot name="suffix"></slot></span>
      </a>
    `;
  }

  #renderContent(): TemplateResult {
    const iconCollapsed = this.#isIconCollapsed;

    return html`
      <div
        class="Row"
        ?data-icon-collapsed=${iconCollapsed}
        ?data-active=${this.active}
      >
        ${this.href !== undefined ? this.#renderLink() : this.#renderButton()}
      </div>
    `;
  }

  override render(): TemplateResult {
    const iconCollapsed = this.#isIconCollapsed;

    if (iconCollapsed && this.tooltip) {
      return html`
        <dui-tooltip>
          <dui-tooltip-trigger>
            ${this.#renderContent()}
          </dui-tooltip-trigger>
          <dui-tooltip-popup side="right">
            ${this.tooltip}
          </dui-tooltip-popup>
        </dui-tooltip>
      `;
    }

    return this.#renderContent();
  }
}
