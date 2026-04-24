/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { css, html, LitElement } from "lit";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { sidebarContext } from "./sidebar-context.ts";
const styles = css `
  :host {
    display: inline-block;
  }
`;
// Inline panel-left SVG
const panelLeftSvg = html `<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect width="18" height="18" x="3" y="3" rx="2" />
  <path d="M9 3v18" />
</svg>`;
/**
 * `<dui-sidebar-trigger>` — Toggle button for the sidebar.
 *
 * Consumes sidebar context and calls `toggleSidebar()` on click.
 * Renders a ghost button with a default panel icon.
 *
 * @slot - Override the default icon.
 */
export class DuiSidebarTriggerPrimitive extends LitElement {
    static tagName = "dui-sidebar-trigger";
    static styles = [base, styles];
    #ctx = new ContextConsumer(this, {
        context: sidebarContext,
        subscribe: true,
    });
    #onClick = () => {
        this.#ctx.value?.toggleSidebar();
    };
    render() {
        return html `
      <dui-button appearance="ghost" size="sm" @click=${this.#onClick}>
        <slot>
          <dui-icon>${panelLeftSvg}</dui-icon>
        </slot>
      </dui-button>
    `;
    }
}
