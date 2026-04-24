/** Ported from original DUI: deep-future-app/app/client/components/dui/tabs */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "../core/base.ts";
import { type TabsContext, tabsContext } from "./tabs-context.ts";

const styles = css`
  :host {
    display: block;
  }

  .wrapper {
    display: contents;
  }

  .wrapper[hidden] {
    display: none;
  }

  [part="panel"] {
    position: relative;
    outline: 0;
  }
`;

/**
 * Content panel for a tab. Shown when the matching tab is active.
 */
export class DuiTabsPanelPrimitive extends LitElement {
  static tagName = "dui-tabs-panel" as const;
  static override styles = [base, styles];

  /** Panel value — must match the corresponding tab's value. */
  @property()
  accessor value = "";

  /** Keep panel in DOM when not active. */
  @property({ type: Boolean, attribute: "keep-mounted" })
  accessor keepMounted = false;

  @consume({ context: tabsContext, subscribe: true })
  accessor _ctx!: TabsContext;

  get #isActive(): boolean {
    return this._ctx?.value === this.value;
  }

  override willUpdate(): void {
    if (this.#isActive) {
      this.removeAttribute("data-hidden");
    } else {
      this.setAttribute("data-hidden", "");
    }
  }

  override render(): TemplateResult {
    const isActive = this.#isActive;

    return html`
      <div class="wrapper" ?hidden=${!isActive}>
        ${isActive || this.keepMounted
          ? html`<div part="panel" role="tabpanel" tabindex="0"><slot></slot></div>`
          : nothing}
      </div>
    `;
  }
}
