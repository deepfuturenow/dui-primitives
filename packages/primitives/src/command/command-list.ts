/** Ported from original DUI: deep-future-app/app/client/components/dui/command */

import { css, html, LitElement, type TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "../core/base.ts";
import { type CommandContext, commandContext } from "./command-context.ts";


const styles = css`
  :host {
    display: block;
  }

  .List {
    overflow: hidden;
  }
`;

export class DuiCommandListPrimitive extends LitElement {
  static tagName = "dui-command-list" as const;
  static override styles = [base, styles];

  @consume({ context: commandContext, subscribe: true })
  accessor _ctx!: CommandContext;

  override render(): TemplateResult {
    return html`
      <dui-scroll-area>
        <div
          class="List"
          role="listbox"
          id="${this._ctx?.listId ?? ""}"
        >
          <slot></slot>
        </div>
      </dui-scroll-area>
    `;
  }
}
