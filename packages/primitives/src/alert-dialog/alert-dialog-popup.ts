/** Ported from original DUI: deep-future-app/app/client/components/dui/alert-dialog */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import {
  getComposedFocusableElements,
  queryComposedAutofocus,
} from "@dui/core/dom";
import { alertDialogContext } from "./alert-dialog-context.ts";

const hostStyles = css`
  :host {
    display: contents;
  }

  :host(:not([mounted])) [part="backdrop"],
  :host(:not([mounted])) [part="popup"] {
    display: none;
  }
`;

const componentStyles = css`
  [part="backdrop"] {
    position: fixed;
    min-height: 100dvh;
    inset: 0;
    z-index: 999;
  }

  [part="popup"] {
    box-sizing: border-box;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24rem;
    max-width: calc(100vw - 3rem);
    overflow: hidden;
    z-index: 1000;
    transition-property: opacity, transform;
  }
`;

/**
 * `<dui-alert-dialog-popup>` — The popup overlay for the alert dialog.
 *
 * Renders a backdrop and a centered dialog popup with focus trapping.
 * Handles open/close animations via `data-starting-style` / `data-ending-style`.
 * Does NOT close on backdrop click — requires explicit user action.
 *
 * Title and description are provided via named slots and rendered as
 * semantic `<h2>` and `<p>` elements with ARIA linkage.
 *
 * @slot title - Title text for the alert dialog (rendered as `<h2>`).
 * @slot description - Description text for the alert dialog (rendered as `<p>`).
 * @slot - Default slot for dialog content (actions, etc.).
 * @csspart backdrop - The overlay backdrop behind the dialog.
 * @csspart popup - The dialog popup container.
 * @csspart title - The heading element wrapping the title slot.
 * @csspart description - The paragraph element wrapping the description slot.
 */
export class DuiAlertDialogPopupPrimitive extends LitElement {
  static tagName = "dui-alert-dialog-popup" as const;
  static override styles = [base, hostStyles, componentStyles];

  /** Keep the popup in the DOM when closed. */
  @property({ type: Boolean, attribute: "keep-mounted" })
  accessor keepMounted = false;

  /** CSS selector within the popup to focus when the dialog opens. */
  @property({ attribute: "initial-focus" })
  accessor initialFocus: string | undefined = undefined;

  /** CSS selector in the document to focus when the dialog closes. */
  @property({ attribute: "final-focus" })
  accessor finalFocus: string | undefined = undefined;

  @state()
  accessor #mounted = false;
  @state()
  accessor #startingStyle = false;
  @state()
  accessor #endingStyle = false;

  #previouslyFocused: HTMLElement | undefined;

  #ctx = new ContextConsumer(this, {
    context: alertDialogContext,
    subscribe: true,
  });

  override updated(): void {
    const isOpen = this.#ctx.value?.open ?? false;

    if (isOpen && !this.#mounted) {
      this.#animateOpen();
    } else if (!isOpen && this.#mounted && !this.#endingStyle) {
      this.#animateClose();
    }
  }

  async #animateOpen(): Promise<void> {
    this.#previouslyFocused =
      (document.activeElement as HTMLElement) ?? undefined;

    this.#mounted = true;
    this.#startingStyle = true;

    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r()))
    );

    this.#startingStyle = false;

    await this.updateComplete;
    this.#trapFocusIn();
  }

  #animateClose(): void {
    this.#endingStyle = true;

    const popup = this.shadowRoot?.querySelector('[part="popup"]');
    if (!popup) {
      this.#finishClose();
      return;
    }

    let called = false;
    const done = (): void => {
      if (called) return;
      called = true;
      popup.removeEventListener("transitionend", onEnd);
      clearTimeout(timer);
      this.#finishClose();
    };
    const onEnd = (e: Event): void => {
      if ((e as TransitionEvent).propertyName === "opacity") {
        done();
      }
    };
    popup.addEventListener("transitionend", onEnd);
    const timer = setTimeout(done, 200);
  }

  #finishClose(): void {
    if (!this.#endingStyle && !this.#mounted) return;
    this.#endingStyle = false;
    if (!this.keepMounted) {
      this.#mounted = false;
    }
    this.#restoreFocus();
  }

  #trapFocusIn(): void {
    const popup = this.shadowRoot?.querySelector(
      '[part="popup"]',
    ) as HTMLElement | null;
    if (!popup) return;

    if (this.initialFocus) {
      const target = popup.querySelector(
        this.initialFocus,
      ) as HTMLElement | null;
      if (target) {
        target.focus();
        return;
      }
    }

    const autoEl = queryComposedAutofocus(popup);
    if (autoEl) {
      autoEl.focus();
      return;
    }

    const focusables = getComposedFocusableElements(popup);
    if (focusables.length > 0) {
      focusables[0].focus();
      return;
    }

    popup.focus();
  }

  #restoreFocus(): void {
    if (this.finalFocus) {
      const target = document.querySelector(
        this.finalFocus,
      ) as HTMLElement | null;
      target?.focus();
      return;
    }
    this.#previouslyFocused?.focus();
    this.#previouslyFocused = undefined;
  }

  #handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      this.#ctx.value?.closeDialog();
    }

    if (e.key === "Tab") {
      this.#handleTabTrap(e);
    }
  };

  #handleTabTrap(e: KeyboardEvent): void {
    const popup = this.shadowRoot?.querySelector(
      '[part="popup"]',
    ) as HTMLElement | null;
    if (!popup) return;

    const focusables = getComposedFocusableElements(popup);
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const isFirst = first.matches(":focus");
    const isLast = last.matches(":focus");
    const popupHasFocus = !focusables.some((el) => el.matches(":focus"));

    if (e.shiftKey && (isFirst || popupHasFocus)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && isLast) {
      e.preventDefault();
      first.focus();
    }
  }

  override willUpdate(): void {
    if (this.#mounted || this.keepMounted) {
      this.setAttribute("mounted", "");
    } else {
      this.removeAttribute("mounted");
    }
  }

  override render(): TemplateResult {
    const isOpen = this.#ctx.value?.open ?? false;
    const titleId = this.#ctx.value?.titleId ?? "";
    const descriptionId = this.#ctx.value?.descriptionId ?? "";

    if (!this.#mounted && !this.keepMounted) {
      return html``;
    }

    return html`
      <div
        part="backdrop"
        ?data-open="${isOpen && !this.#endingStyle}"
        ?data-closed="${!isOpen || this.#endingStyle}"
        ?data-starting-style="${this.#startingStyle}"
        ?data-ending-style="${this.#endingStyle}"
      ></div>
      <div
        part="popup"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="${titleId}"
        aria-describedby="${descriptionId}"
        ?data-open="${isOpen && !this.#endingStyle}"
        ?data-closed="${!isOpen || this.#endingStyle}"
        ?data-starting-style="${this.#startingStyle}"
        ?data-ending-style="${this.#endingStyle}"
        tabindex="-1"
        @keydown="${this.#handleKeyDown}"
      >
        <h2 part="title" id="${titleId}"><slot name="title"></slot></h2>
        <p part="description" id="${descriptionId}"><slot name="description"></slot></p>
        <slot></slot>
      </div>
    `;
  }
}
