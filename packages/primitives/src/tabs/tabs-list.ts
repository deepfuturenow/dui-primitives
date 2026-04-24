/** Ported from original DUI: deep-future-app/app/client/components/dui/tabs */

import { css, html, LitElement, type TemplateResult } from "lit";
import { consume } from "@lit/context";
import { base } from "../core/base.ts";
import { type TabsContext, tabsContext } from "./tabs-context.ts";

const styles = css`
  :host {
    display: block;
  }

  [part="list"] {
    display: flex;
    position: relative;
    z-index: 0;
  }

  [part="list"][data-orientation="vertical"] {
    flex-direction: column;
  }
`;

/**
 * Container for tab triggers. Manages indicator positioning via CSS custom properties.
 */
export class DuiTabsListPrimitive extends LitElement {
  static tagName = "dui-tabs-list" as const;
  static override styles = [base, styles];

  @consume({ context: tabsContext, subscribe: true })
  accessor _ctx!: TabsContext;

  #resizeObserver: ResizeObserver | undefined;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#resizeObserver = new ResizeObserver(() => {
      this.#updateIndicatorPosition();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#resizeObserver?.disconnect();
  }

  protected override firstUpdated(): void {
    const list = this.shadowRoot?.querySelector("[part='list']");
    if (list) {
      this.#resizeObserver?.observe(list);
    }
    this.#updateIndicatorPosition();
  }

  protected override updated(): void {
    this.#updateIndicatorPosition();
  }

  #updateIndicatorPosition(): void {
    const list = this.shadowRoot?.querySelector("[part='list']") as HTMLElement;
    if (!list) return;

    const slot = this.shadowRoot?.querySelector("slot");
    const slottedElements = slot?.assignedElements() ?? [];
    const activeTab = slottedElements.find(
      (el) =>
        el.tagName === "DUI-TAB" &&
        el.getAttribute("value") === this._ctx?.value,
    ) as HTMLElement | undefined;

    if (activeTab) {
      const listRect = list.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      const left = tabRect.left - listRect.left;
      const width = tabRect.width;

      list.style.setProperty("--active-tab-left", `${left}px`);
      list.style.setProperty("--active-tab-width", `${width}px`);
    }
  }

  override render(): TemplateResult {
    const orientation = this._ctx?.orientation ?? "horizontal";

    return html`
      <div part="list" role="tablist" data-orientation=${orientation}>
        <slot></slot>
      </div>
    `;
  }
}
