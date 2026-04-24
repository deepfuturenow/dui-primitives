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

  :host([data-hidden]) .Empty {
    display: none;
  }

  .Empty {
    text-align: center;
  }
`;

export class DuiCommandEmptyPrimitive extends LitElement {
  static tagName = "dui-command-empty" as const;
  static override styles = [base, styles];

  @consume({ context: commandContext, subscribe: true })
  accessor _ctx!: CommandContext;

  override willUpdate(): void {
    const shouldShow =
      this._ctx?.search !== "" && this._ctx?.getVisibleCount() === 0;
    if (shouldShow) {
      this.removeAttribute("data-hidden");
    } else {
      this.setAttribute("data-hidden", "");
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="Empty" role="status">
        <slot></slot>
      </div>
    `;
  }
}
