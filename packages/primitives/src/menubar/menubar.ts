import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "@dui/core/base";
import {
  type MenubarContext,
  menubarContext,
} from "./menubar-context.ts";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    align-items: center;
  }

  :host([orientation="vertical"]) [part="root"] {
    flex-direction: column;
    align-items: stretch;
  }
`;

/**
 * `<dui-menubar>` — A horizontal bar of menus with coordinated open/close.
 *
 * Contains `<dui-menu>` children. When one menu is open, hovering another
 * menu trigger opens it and closes the previous one.
 *
 * @slot - `dui-menu` children.
 * @csspart root - The menubar container.
 */
export class DuiMenubarPrimitive extends LitElement {
  static tagName = "dui-menubar" as const;

  static override styles = [base, styles];

  @property({ type: Boolean })
  accessor loop = true;

  @property({ reflect: true })
  accessor orientation: "horizontal" | "vertical" = "horizontal";

  @state()
  accessor #activeMenuId: string | null = null;

  #getMenus(): HTMLElement[] {
    return [...this.querySelectorAll("dui-menu")] as HTMLElement[];
  }

  #openMenu = (id: string): void => {
    this.#activeMenuId = id;
  };

  #closeAll = (): void => {
    this.#activeMenuId = null;
  };

  #navigateToMenu = (direction: "next" | "prev"): void => {
    const menus = this.#getMenus();
    if (menus.length === 0) return;

    const currentIndex = menus.findIndex(
      (m) => m.getAttribute("data-menubar-id") === this.#activeMenuId,
    );

    let nextIndex: number;
    if (direction === "next") {
      nextIndex = currentIndex + 1;
      if (nextIndex >= menus.length) {
        nextIndex = this.loop ? 0 : menus.length - 1;
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = this.loop ? menus.length - 1 : 0;
      }
    }

    const nextMenu = menus[nextIndex];
    if (!nextMenu) return;

    const nextId = nextMenu.getAttribute("data-menubar-id");
    if (nextId) {
      this.#activeMenuId = nextId;
    }

    // Focus the trigger of the next menu
    const trigger = nextMenu.querySelector('[slot="trigger"]') as HTMLElement;
    trigger?.focus();
  };

  @provide({ context: menubarContext })
  @state()
  accessor _ctx: MenubarContext = this.#buildContext();

  #buildContext(): MenubarContext {
    return {
      activeMenuId: this.#activeMenuId,
      openMenu: this.#openMenu,
      closeAll: this.#closeAll,
      navigateToMenu: this.#navigateToMenu,
    };
  }

  override willUpdate(): void {
    this._ctx = this.#buildContext();
  }

  #onKeyDown = (e: KeyboardEvent): void => {
    const isHorizontal = this.orientation === "horizontal";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

    if (e.key === nextKey) {
      e.preventDefault();
      this.#navigateToMenu("next");
    } else if (e.key === prevKey) {
      e.preventDefault();
      this.#navigateToMenu("prev");
    }
  };

  override render(): TemplateResult {
    return html`
      <div
        part="root"
        role="menubar"
        aria-orientation="${this.orientation}"
        @keydown="${this.#onKeyDown}"
      >
        <slot></slot>
      </div>
    `;
  }
}
