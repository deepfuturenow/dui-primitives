/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import { type SidebarContext, sidebarContext } from "./sidebar-context.ts";

export type SidebarOpenChangeDetail = { open: boolean };

export const openChangeEvent = customEvent<SidebarOpenChangeDetail>(
  "open-change",
  { bubbles: true, composed: true },
);

const styles = css`
  :host {
    display: flex;
    width: 100%;
    height: 100%;
  }
`;

/**
 * `<dui-sidebar-provider>` — Root state manager for the sidebar compound component.
 *
 * Manages open/close state, mobile detection, and provides context to all
 * sidebar sub-components. Wraps the entire layout (sidebar + main content).
 *
 * @slot - Default slot for sidebar and content areas.
 * @fires open-change - Fired when the sidebar opens or closes. Detail: { open: boolean }
 */
export class DuiSidebarProviderPrimitive extends LitElement {
  static tagName = "dui-sidebar-provider" as const;
  static override styles = [base, styles];

  /** Controls the sidebar open state (controlled mode). */
  @property({ type: Boolean })
  accessor open: boolean | undefined = undefined;

  /** Initial open state for uncontrolled mode. Defaults to true. */
  @property({ type: Boolean, attribute: "default-open" })
  accessor defaultOpen = true;

  /** Which side the sidebar appears on. */
  @property({ reflect: true })
  accessor side: "left" | "right" = "left";

  /** Visual variant of the sidebar. */
  @property({ reflect: true })
  accessor variant: string = "";

  /** How the sidebar collapses. */
  @property({ reflect: true })
  accessor collapsible: "offcanvas" | "icon" | "none" = "offcanvas";

  @state()
  accessor #internalOpen = true;

  @state()
  accessor #openMobile = false;

  @state()
  accessor #isMobile = false;

  #mediaQuery: MediaQueryList | undefined;
  #boundOnMediaChange: ((e: MediaQueryListEvent) => void) | undefined;
  #boundOnKeyDown: ((e: KeyboardEvent) => void) | undefined;

  get #isOpen(): boolean {
    return this.open ?? this.#internalOpen;
  }

  #setOpen = (value: boolean): void => {
    if (this.#isMobile) {
      this.#openMobile = value;
    } else {
      if (this.open === undefined) {
        this.#internalOpen = value;
      }
      this.dispatchEvent(openChangeEvent({ open: value }));
    }
  };

  #toggleSidebar = (): void => {
    if (this.#isMobile) {
      this.#openMobile = !this.#openMobile;
    } else {
      this.#setOpen(!this.#isOpen);
    }
  };

  #onMediaChange = (e: MediaQueryListEvent): void => {
    this.#isMobile = !e.matches;
    if (!this.#isMobile) {
      this.#openMobile = false;
    }
  };

  #onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.#toggleSidebar();
    }
  };

  @provide({ context: sidebarContext })
  @state()
  accessor _ctx: SidebarContext = this.#buildContext();

  #buildContext(): SidebarContext {
    return {
      state: this.#isOpen ? "expanded" : "collapsed",
      open: this.#isOpen,
      openMobile: this.#openMobile,
      isMobile: this.#isMobile,
      side: this.side,
      variant: this.variant,
      collapsible: this.collapsible,
      setOpen: this.#setOpen,
      toggleSidebar: this.#toggleSidebar,
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (this.open === undefined) {
      this.#internalOpen = this.defaultOpen;
    }

    this.#mediaQuery = matchMedia("(min-width: 768px)");
    this.#isMobile = !this.#mediaQuery.matches;

    this.#boundOnMediaChange = this.#onMediaChange.bind(this);
    this.#mediaQuery.addEventListener("change", this.#boundOnMediaChange);

    this.#boundOnKeyDown = this.#onKeyDown.bind(this);
    document.addEventListener("keydown", this.#boundOnKeyDown);

    this._ctx = this.#buildContext();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.#mediaQuery && this.#boundOnMediaChange) {
      this.#mediaQuery.removeEventListener("change", this.#boundOnMediaChange);
    }
    if (this.#boundOnKeyDown) {
      document.removeEventListener("keydown", this.#boundOnKeyDown);
    }
  }

  override willUpdate(): void {
    this._ctx = this.#buildContext();
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
