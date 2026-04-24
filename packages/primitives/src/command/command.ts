/** Ported from original DUI: deep-future-app/app/client/components/dui/command */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import {
  type CommandContext,
  type CommandItemEntry,
  commandContext,
} from "./command-context.ts";
import { commandScore } from "./command-score.ts";

export type FilterFn = (
  value: string,
  search: string,
  keywords?: readonly string[],
) => number;

export const selectEvent = customEvent<string>("select", {
  bubbles: true,
  composed: true,
});

export const searchChangeEvent = customEvent<string>("search-change", {
  bubbles: true,
  composed: true,
});

export const escapeEvent = customEvent<void>("escape", {
  bubbles: true,
  composed: true,
});

let idCounter = 0;
const nextId = () => `dui-command-${++idCounter}`;

const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

export class DuiCommandPrimitive extends LitElement {
  static tagName = "dui-command" as const;
  static override styles = [base, styles];

  /** Whether keyboard navigation wraps from last to first and vice versa. */
  @property({ type: Boolean })
  accessor loop = false;

  /** Whether items should be filtered based on search text. */
  @property({ type: Boolean, attribute: "should-filter" })
  accessor shouldFilter = true;

  /** Controlled value — the currently selected item value. */
  @property({ type: String })
  accessor value: string | undefined = undefined;

  /** Custom filter function. */
  @property({ attribute: false })
  accessor filter: FilterFn | undefined = undefined;

  @state()
  accessor #search = "";

  @state()
  accessor #selectedItemId: string | undefined = undefined;

  #items = new Map<string, CommandItemEntry>();
  #itemOrder: string[] = [];
  #groups = new Set<string>();
  #scoresMap = new Map<string, number>();
  #listId = nextId();

  #recomputeScores(): void {
    this.#scoresMap.clear();
    for (const [id, entry] of this.#items) {
      const score = this.filter
        ? this.filter(entry.value, this.#search, entry.keywords)
        : commandScore(
            this.#search,
            entry.value,
            entry.textContent,
            entry.keywords,
          );
      this.#scoresMap.set(id, score);
    }
  }

  #getScore = (itemId: string): number => {
    if (!this.shouldFilter) return 1;
    return this.#scoresMap.get(itemId) ?? 0;
  };

  #getVisibleItems(): CommandItemEntry[] {
    return this.#itemOrder
      .map((id) => this.#items.get(id)!)
      .filter((entry) => {
        if (!entry) return false;
        if (!this.shouldFilter) return true;
        return (this.#scoresMap.get(entry.id) ?? 0) > 0;
      });
  }

  #getVisibleCount = (): number => {
    return this.#getVisibleItems().length;
  };

  #getGroupVisibleCount = (groupId: string): number => {
    return this.#getVisibleItems().filter((e) => e.groupId === groupId).length;
  };

  #registerItem = (entry: CommandItemEntry): void => {
    this.#items.set(entry.id, entry);
    if (!this.#itemOrder.includes(entry.id)) {
      this.#itemOrder.push(entry.id);
    }

    // Recompute scores for new item
    const score = this.filter
      ? this.filter(entry.value, this.#search, entry.keywords)
      : commandScore(
          this.#search,
          entry.value,
          entry.textContent,
          entry.keywords,
        );
    this.#scoresMap.set(entry.id, score);

    // Auto-select first visible item if nothing selected
    if (!this.#selectedItemId) {
      const visible = this.#getVisibleItems();
      if (visible.length > 0 && !visible[0].disabled) {
        this.#selectedItemId = visible[0].id;
      }
    }

    this.requestUpdate();
  };

  #unregisterItem = (id: string): void => {
    this.#items.delete(id);
    this.#itemOrder = this.#itemOrder.filter((v) => v !== id);
    this.#scoresMap.delete(id);
    this.requestUpdate();
  };

  #updateItem = (entry: CommandItemEntry): void => {
    this.#items.set(entry.id, entry);

    const score = this.filter
      ? this.filter(entry.value, this.#search, entry.keywords)
      : commandScore(
          this.#search,
          entry.value,
          entry.textContent,
          entry.keywords,
        );
    this.#scoresMap.set(entry.id, score);

    this.requestUpdate();
  };

  #registerGroup = (groupId: string): void => {
    this.#groups.add(groupId);
  };

  #unregisterGroup = (groupId: string): void => {
    this.#groups.delete(groupId);
  };

  #setSearch = (value: string): void => {
    this.#search = value;
    this.#recomputeScores();

    // Select first visible non-disabled item
    const visible = this.#getVisibleItems();
    const firstSelectable = visible.find((e) => !e.disabled);
    this.#selectedItemId = firstSelectable?.id;

    this.dispatchEvent(searchChangeEvent(value));
  };

  #selectItem = (id: string): void => {
    this.#selectedItemId = id;
  };

  #handleItemSelect = (value: string): void => {
    this.dispatchEvent(selectEvent(value));
  };

  #handleKeyDown = (event: KeyboardEvent): void => {
    const visible = this.#getVisibleItems().filter((e) => !e.disabled);
    if (visible.length === 0) return;

    const currentIndex = visible.findIndex(
      (e) => e.id === this.#selectedItemId,
    );

    const selectByIndex = (index: number): void => {
      const item = visible[index];
      if (item) {
        this.#selectedItemId = item.id;
      }
    };

    switch (event.key) {
      case "ArrowDown":
      case "n":
      case "j": {
        // Ctrl+N and Ctrl+J for down
        if (
          event.key !== "ArrowDown" &&
          !event.ctrlKey &&
          !event.metaKey
        ) {
          return;
        }
        event.preventDefault();
        if (currentIndex < visible.length - 1) {
          selectByIndex(currentIndex + 1);
        } else if (this.loop) {
          selectByIndex(0);
        }
        break;
      }

      case "ArrowUp":
      case "p":
      case "k": {
        // Ctrl+P and Ctrl+K for up
        if (
          event.key !== "ArrowUp" &&
          !event.ctrlKey &&
          !event.metaKey
        ) {
          return;
        }
        event.preventDefault();
        if (currentIndex > 0) {
          selectByIndex(currentIndex - 1);
        } else if (this.loop) {
          selectByIndex(visible.length - 1);
        }
        break;
      }

      case "Home": {
        event.preventDefault();
        selectByIndex(0);
        break;
      }

      case "End": {
        event.preventDefault();
        selectByIndex(visible.length - 1);
        break;
      }

      case "Enter": {
        event.preventDefault();
        const selected = visible.find(
          (e) => e.id === this.#selectedItemId,
        );
        if (selected) {
          this.#handleItemSelect(selected.value);
        }
        break;
      }

      case "Escape": {
        event.preventDefault();
        this.dispatchEvent(escapeEvent());
        break;
      }
    }
  };

  @provide({ context: commandContext })
  @state()
  accessor _ctx: CommandContext = this.#buildContext();

  #buildContext(): CommandContext {
    return {
      search: this.#search,
      selectedItemId: this.#selectedItemId,
      listId: this.#listId,
      loop: this.loop,
      shouldFilter: this.shouldFilter,
      getScore: this.#getScore,
      getVisibleCount: this.#getVisibleCount,
      getGroupVisibleCount: this.#getGroupVisibleCount,
      registerItem: this.#registerItem,
      unregisterItem: this.#unregisterItem,
      updateItem: this.#updateItem,
      registerGroup: this.#registerGroup,
      unregisterGroup: this.#unregisterGroup,
      setSearch: this.#setSearch,
      selectItem: this.#selectItem,
      handleItemSelect: this.#handleItemSelect,
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("keydown", this.#handleKeyDown);
    this._ctx = this.#buildContext();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this.#handleKeyDown);
  }

  override willUpdate(): void {
    this._ctx = this.#buildContext();
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
