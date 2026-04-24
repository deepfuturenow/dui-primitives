/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */

import { css, html, LitElement, type TemplateResult } from "lit";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { sidebarContext } from "./sidebar-context.ts";

const styles = css`
  :host {
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :host([data-icon-collapsed]) {
    opacity: 0;
  }
`;

/**
 * `<dui-sidebar-group-label>` — Heading for a sidebar group.
 *
 * Automatically hides (with opacity transition) when the sidebar is
 * in icon-collapsed mode.
 *
 * @slot - Label text.
 */
export class DuiSidebarGroupLabelPrimitive extends LitElement {
  static tagName = "dui-sidebar-group-label" as const;
  static override styles = [base, styles];

  #ctx = new ContextConsumer(this, {
    context: sidebarContext,
    subscribe: true,
  });

  get #isIconCollapsed(): boolean {
    const ctx = this.#ctx.value;
    return ctx?.collapsible === "icon" && ctx?.state === "collapsed";
  }

  override updated(): void {
    if (this.#isIconCollapsed) {
      this.setAttribute("data-icon-collapsed", "");
    } else {
      this.removeAttribute("data-icon-collapsed");
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
