/** Ported from original DUI: deep-future-app/app/client/components/dui/command */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { type CommandContext, commandContext } from "./command-context.ts";

let groupIdCounter = 0;
const nextGroupId = () => `dui-command-group-${++groupIdCounter}`;

const styles = css`
  :host {
    display: block;
  }

  :host([data-hidden]) .Group {
    display: none;
  }

  .Group {
    overflow: hidden;
  }
`;

export class DuiCommandGroupPrimitive extends LitElement {
  static tagName = "dui-command-group" as const;
  static override styles = [base, styles];

  /** Heading text for this group. */
  @property({ type: String })
  accessor heading = "";

  @consume({ context: commandContext, subscribe: true })
  accessor _ctx!: CommandContext;

  #groupId = nextGroupId();

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-group-id", this.#groupId);
    this._ctx?.registerGroup(this.#groupId);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ctx?.unregisterGroup(this.#groupId);
  }

  override willUpdate(): void {
    // Hide group when no visible items
    if (this._ctx?.shouldFilter) {
      const visibleCount = this._ctx.getGroupVisibleCount(this.#groupId);
      if (visibleCount === 0 && this._ctx.search !== "") {
        this.setAttribute("data-hidden", "");
      } else {
        this.removeAttribute("data-hidden");
      }
    } else {
      this.removeAttribute("data-hidden");
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="Group" role="group" aria-label="${this.heading || nothing}">
        ${this.heading
          ? html`<div class="Heading" aria-hidden="true">${this.heading}</div>`
          : nothing}
        <slot></slot>
      </div>
    `;
  }
}
