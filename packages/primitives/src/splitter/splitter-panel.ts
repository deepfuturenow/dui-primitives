import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "../core/base.ts";
import {
  type SplitterContext,
  splitterContext,
} from "./splitter-context.ts";

const styles = css`
  :host {
    display: block;
    flex: 0 0 auto;
    /* Required so flex children with intrinsic content can shrink below their content size. */
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }

  [part="root"] {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
`;

/**
 * `<dui-splitter-panel>` — A single resizable panel inside a `<dui-splitter>`.
 *
 * @slot - Panel content.
 * @csspart root - The panel content wrapper.
 */
export class DuiSplitterPanelPrimitive extends LitElement {
  static tagName = "dui-splitter-panel" as const;
  static override styles = [base, styles];

  @property({ type: String, attribute: "panel-id" })
  accessor panelId = "";

  @property({ type: Number, attribute: "default-size" })
  accessor defaultSize: number | undefined = undefined;

  @property({ type: Number, attribute: "min-size" })
  accessor minSize = 0;

  @property({ type: Number, attribute: "max-size" })
  accessor maxSize = 100;

  /**
   * If true, the panel auto-flips to a collapsed state (`data-collapsed`,
   * `collapse-change` event, revivable via `expandPanel(id)`) when its
   * size reaches ~0 via drag or keyboard nudge. Requires `min-size="0"`
   * for drag-to-collapse to be reachable.
   */
  @property({ type: Boolean })
  accessor collapsible = false;

  @property({ type: Number })
  accessor order: number | undefined = undefined;

  @consume({ context: splitterContext, subscribe: true })
  accessor _ctx!: SplitterContext;

  #registered = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#register();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.#registered && this.panelId) {
      this._ctx?.unregisterPanel(this.panelId);
      this.#registered = false;
    }
  }

  override willUpdate(changedProps: Map<string, unknown>): void {
    // Re-register when meta-bearing props change. The first registration
    // happens in connectedCallback once panelId is set.
    if (
      this.#registered &&
      (changedProps.has("panelId") ||
        changedProps.has("defaultSize") ||
        changedProps.has("minSize") ||
        changedProps.has("maxSize") ||
        changedProps.has("collapsible") ||
        changedProps.has("order"))
    ) {
      // panelId change requires removing the old registration.
      const prev = changedProps.get("panelId");
      if (typeof prev === "string" && prev && prev !== this.panelId) {
        this._ctx?.unregisterPanel(prev);
      }
      this.#register();
    }
  }

  #register(): void {
    if (!this.panelId || !this._ctx) return;
    this._ctx.registerPanel({
      id: this.panelId,
      minSize: this.minSize,
      maxSize: this.maxSize,
      defaultSize: this.defaultSize,
      collapsible: this.collapsible,
      order: this.order,
      el: this,
    });
    this.#registered = true;
  }

  override render(): TemplateResult {
    const size = this._ctx?.getPanelSize(this.panelId) ?? 0;
    const orientation = this._ctx?.orientation ?? "horizontal";
    const collapsed = this._ctx?.isPanelCollapsed(this.panelId) ?? false;

    // Apply size as flex-basis on the host. Using `style` attribute on host
    // via inline style on the host element is not possible from inside
    // shadow DOM — set it directly on `this`.
    if (this.isConnected) {
      this.style.flexBasis = `${size}%`;
      this.toggleAttribute("data-collapsed", collapsed);
    }

    return html`
      <div
        part="root"
        data-orientation=${orientation}
        data-panel-id=${this.panelId}
        ?data-collapsed=${collapsed}
      >
        <slot></slot>
      </div>
    `;
  }
}
