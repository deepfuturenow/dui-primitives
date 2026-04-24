/** Ported from original DUI: deep-future-app/app/client/components/dui/command */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "../core/base.ts";
import { type CommandContext, commandContext } from "./command-context.ts";

const styles = css`
  :host {
    display: block;
  }

  .InputWrapper {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .SearchIcon {
    flex-shrink: 0;
  }

  .Input {
    display: flex;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
  }
`;

export class DuiCommandInputPrimitive extends LitElement {
  static tagName = "dui-command-input" as const;
  static override styles = [base, styles];

  /** Placeholder text for the search input. */
  @property({ type: String })
  accessor placeholder = "Search...";

  @consume({ context: commandContext, subscribe: true })
  accessor _ctx!: CommandContext;

  #prevSearch: string | undefined = undefined;

  #handleInput = (event: InputEvent): void => {
    const input = event.target as HTMLInputElement;
    this._ctx?.setSearch(input.value);
  };

  #handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }
  };

  override willUpdate(): void {
    // Sync input value when search is cleared externally
    if (
      this.#prevSearch !== undefined &&
      this._ctx?.search === "" &&
      this.#prevSearch !== ""
    ) {
      const input =
        this.shadowRoot?.querySelector<HTMLInputElement>(".Input");
      if (input) input.value = "";
    }
    this.#prevSearch = this._ctx?.search;
  }

  override render(): TemplateResult {
    return html`
      <div class="InputWrapper">
        <svg
          class="SearchIcon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          class="Input"
          type="text"
          role="combobox"
          autocomplete="off"
          aria-expanded="true"
          aria-controls="${this._ctx?.listId ?? nothing}"
          aria-activedescendant="${this._ctx?.selectedItemId ?? nothing}"
          .placeholder="${this.placeholder}"
          @input="${this.#handleInput}"
          @keydown="${this.#handleKeyDown}"
        />
      </div>
    `;
  }
}
