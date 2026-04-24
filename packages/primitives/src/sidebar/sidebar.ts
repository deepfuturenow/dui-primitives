/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "../core/base.ts";
import { sidebarContext } from "./sidebar-context.ts";

const styles = css`
  :host {
    display: block;
    flex-shrink: 0;
    height: 100%;
  }

  .DesktopOuter {
    position: relative;
    height: 100%;
    overflow: hidden;
    transition-property: width;
  }

  .DesktopInner {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }

  :host([data-side="left"]) .DesktopInner {
    left: 0;
  }

  :host([data-side="right"]) .DesktopInner {
    right: 0;
  }

  :host([data-collapsible="offcanvas"][data-state="collapsed"][data-side="left"])
    .DesktopInner {
    left: calc(-1 * var(--sidebar-width));
  }

  :host([data-collapsible="offcanvas"][data-state="collapsed"][data-side="right"])
    .DesktopInner {
    right: calc(-1 * var(--sidebar-width));
  }

  :host([data-variant="floating"]) .DesktopInner,
  :host([data-variant="inset"]) .DesktopInner {
    top: 0;
    bottom: 0;
  }

  :host([data-collapsible="icon"][data-state="collapsed"]) .DesktopInner {
    overflow: hidden;
  }

  .Backdrop {
    position: fixed;
    inset: 0;
    z-index: 999;
    transition-property: opacity;
  }

  .MobilePanel {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    transition-property: transform;
  }

  :host([data-side="left"]) .MobilePanel {
    left: 0;
  }

  :host([data-side="right"]) .MobilePanel {
    right: 0;
  }

  .MobilePanel[data-starting-style] {
    transform: translateX(var(--mobile-start-x));
  }

  .MobilePanel[data-ending-style] {
    transform: translateX(var(--mobile-end-x));
  }
`;

/**
 * `<dui-sidebar>` — Main sidebar container.
 *
 * Consumes sidebar context and renders the appropriate desktop or mobile layout.
 * Desktop uses a width-transitioning wrapper; mobile uses a backdrop + sliding panel.
 *
 * @slot - Default slot for sidebar content (header, content, footer, etc.).
 * @csspart desktop-outer - The outer desktop wrapper that transitions width.
 * @csspart desktop-inner - The inner desktop container with content.
 * @csspart backdrop - The mobile backdrop overlay.
 * @csspart mobile-panel - The sliding mobile panel.
 */
export class DuiSidebarPrimitive extends LitElement {
  static tagName = "dui-sidebar" as const;
  static override styles = [base, styles];

  @state()
  accessor #mounted = false;

  @state()
  accessor #startingStyle = false;

  @state()
  accessor #endingStyle = false;

  #ctx = new ContextConsumer(this, {
    context: sidebarContext,
    subscribe: true,
  });

  override willUpdate(): void {
    const ctx = this.#ctx.value;
    if (!ctx) return;

    this.dataset.state = ctx.state;
    this.dataset.side = ctx.side;
    this.dataset.variant = ctx.variant;
    this.dataset.collapsible = ctx.collapsible;

    // Handle mobile panel animation
    if (ctx.isMobile) {
      if (ctx.openMobile && !this.#mounted) {
        this.#animateOpen();
      } else if (!ctx.openMobile && this.#mounted && !this.#endingStyle) {
        this.#animateClose();
      }
    }
  }

  async #animateOpen(): Promise<void> {
    this.#mounted = true;
    this.#startingStyle = true;

    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r()))
    );

    this.#startingStyle = false;
  }

  #animateClose(): void {
    this.#endingStyle = true;

    const panel = this.shadowRoot?.querySelector(".MobilePanel");
    if (!panel) {
      this.#finishClose();
      return;
    }

    let called = false;
    const done = (): void => {
      if (called) return;
      called = true;
      panel.removeEventListener("transitionend", onEnd);
      clearTimeout(timer);
      this.#finishClose();
    };
    const onEnd = (): void => {
      done();
    };
    panel.addEventListener("transitionend", onEnd);
    const timer = setTimeout(done, 250);
  }

  #finishClose(): void {
    this.#endingStyle = false;
    this.#mounted = false;
  }

  #onBackdropClick = (): void => {
    this.#ctx.value?.setOpen(false);
  };

  #onMobileKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      e.preventDefault();
      this.#ctx.value?.setOpen(false);
    }
  };

  override render(): TemplateResult {
    const ctx = this.#ctx.value;
    if (!ctx) return html``;

    const side = ctx.side;
    const startX = side === "left" ? "-100%" : "100%";

    if (ctx.isMobile) {
      if (!this.#mounted) return html``;

      return html`
        <div
          class="Backdrop"
          part="backdrop"
          ?data-starting-style=${this.#startingStyle}
          ?data-ending-style=${this.#endingStyle}
          @click=${this.#onBackdropClick}
        ></div>
        <div
          class="MobilePanel"
          part="mobile-panel"
          role="dialog"
          tabindex="-1"
          style="--mobile-start-x: ${startX}; --mobile-end-x: ${startX}"
          ?data-starting-style=${this.#startingStyle}
          ?data-ending-style=${this.#endingStyle}
          @keydown=${this.#onMobileKeyDown}
        >
          <slot></slot>
        </div>
      `;
    }

    if (ctx.collapsible === "none") {
      return html`
        <div class="DesktopOuter" part="desktop-outer">
          <div class="DesktopInner" part="desktop-inner">
            <slot></slot>
          </div>
        </div>
      `;
    }

    return html`
      <div class="DesktopOuter" part="desktop-outer">
        <div class="DesktopInner" part="desktop-inner">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
