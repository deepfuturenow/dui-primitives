/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */

import { css, html, LitElement, type TemplateResult } from "lit";
import { ContextConsumer } from "@lit/context";
import { base } from "../core/base.ts";
import { sidebarContext } from "./sidebar-context.ts";

const styles = css`
  :host {
    display: inline-block;
    cursor: pointer;
  }
`;

/**
 * `<dui-sidebar-trigger>` — Toggle wrapper for the sidebar.
 *
 * Consumes sidebar context and calls `toggleSidebar()` on click.
 * Renders whatever the user slots in — a button, icon, text, etc.
 * Adds click handling, `aria-expanded`, and keyboard support for
 * non-button slotted elements.
 *
 * @slot - The trigger content (button, icon, text, etc.)
 */
export class DuiSidebarTriggerPrimitive extends LitElement {
  static tagName = "dui-sidebar-trigger" as const;
  static override styles = [base, styles];

  #ctx = new ContextConsumer(this, {
    context: sidebarContext,
    subscribe: true,
  });

  override connectedCallback(): void {
    super.connectedCallback();

    // Make the host itself keyboard-accessible if it isn't already
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "button");
    }
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }

    this.addEventListener("click", this.#onClick);
    this.addEventListener("keydown", this.#onKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.#onClick);
    this.removeEventListener("keydown", this.#onKeyDown);
  }

  #onClick = (): void => {
    this.#ctx.value?.toggleSidebar();
  };

  #onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.#ctx.value?.toggleSidebar();
    }
  };

  override willUpdate(): void {
    const ctx = this.#ctx.value;
    if (ctx) {
      const expanded = ctx.isMobile ? ctx.openMobile : ctx.open;
      this.setAttribute("aria-expanded", String(expanded));
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
