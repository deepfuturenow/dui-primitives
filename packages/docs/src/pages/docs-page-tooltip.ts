import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-tooltip")
export class DocsPageTooltip extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const btnStyle = `padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: #f5f5f5; cursor: pointer; font-size: 14px;`;
    const tooltipStyle = `background: #333; color: white; padding: 6px 12px; border-radius: 4px; font-size: 13px; white-space: nowrap;`;

    return html`
      <h1>Tooltip</h1>
      <p class="subtitle">A popup tooltip triggered on hover/focus. Uses Floating UI for positioning.</p>

      <prim-demo label="Basic tooltip">
        <div style="display: flex; gap: 16px;">
          <dui-tooltip>
            <dui-tooltip-trigger>
              <dui-button style="${btnStyle}">Hover me</dui-button>
            </dui-tooltip-trigger>
            <dui-tooltip-popup style="${tooltipStyle}">Hello from tooltip!</dui-tooltip-popup>
          </dui-tooltip>

          <dui-tooltip placement="right">
            <dui-tooltip-trigger>
              <dui-button style="${btnStyle}">Right placement</dui-button>
            </dui-tooltip-trigger>
            <dui-tooltip-popup style="${tooltipStyle}">Placed on the right</dui-tooltip-popup>
          </dui-tooltip>
        </div>
      </prim-demo>

      <prim-demo label="Accessibility">
        <p style="font-size: 13px; color: #666; margin-top: 0;">
          Tab to focus the trigger — tooltip appears on focus and hover.
          Uses <code>role="tooltip"</code> and <code>aria-describedby</code>.
        </p>
      </prim-demo>
    `;
  }
}
