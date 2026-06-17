import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-popover")
export class DocsPagePopover extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const btnStyle = `padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: #f5f5f5; cursor: pointer; font-size: 14px;`;
    const popupStyle = `background: white; border: 1px solid #ccc; border-radius: 6px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 14px; min-width: 200px;`;

    return html`
      <h1>Popover</h1>
      <p class="subtitle">A floating panel anchored to a trigger element. Uses Floating UI for positioning.</p>

      <prim-demo label="Basic popover">
        <dui-popover>
          <dui-popover-trigger>
            <dui-button style="${btnStyle}">Open popover</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup style="${popupStyle}">
            <p style="margin: 0 0 8px 0; font-weight: 600;">Popover title</p>
            <p style="margin: 0; color: #666;">This is the popover content. Click outside or press Escape to close.</p>
          </dui-popover-popup>
        </dui-popover>
      </prim-demo>

      <prim-demo label="Placement">
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <dui-popover side="bottom">
            <dui-popover-trigger>
              <dui-button style="${btnStyle}">Bottom (default)</dui-button>
            </dui-popover-trigger>
            <dui-popover-popup style="${popupStyle}">
              <p style="margin: 0;">Placed on the bottom</p>
            </dui-popover-popup>
          </dui-popover>

          <dui-popover side="top">
            <dui-popover-trigger>
              <dui-button style="${btnStyle}">Top</dui-button>
            </dui-popover-trigger>
            <dui-popover-popup style="${popupStyle}">
              <p style="margin: 0;">Placed on top</p>
            </dui-popover-popup>
          </dui-popover>

          <dui-popover side="right">
            <dui-popover-trigger>
              <dui-button style="${btnStyle}">Right</dui-button>
            </dui-popover-trigger>
            <dui-popover-popup style="${popupStyle}">
              <p style="margin: 0;">Placed on the right</p>
            </dui-popover-popup>
          </dui-popover>

          <dui-popover side="left">
            <dui-popover-trigger>
              <dui-button style="${btnStyle}">Left</dui-button>
            </dui-popover-trigger>
            <dui-popover-popup style="${popupStyle}">
              <p style="margin: 0;">Placed on the left</p>
            </dui-popover-popup>
          </dui-popover>
        </div>
      </prim-demo>

      <prim-demo label="No arrow">
        <dui-popover>
          <dui-popover-trigger>
            <dui-button style="${btnStyle}">No arrow</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup style="${popupStyle}" .showArrow=${false}>
            <p style="margin: 0;">This popover has no arrow.</p>
          </dui-popover-popup>
        </dui-popover>
      </prim-demo>

      <prim-demo label="Close on content click">
        <dui-popover>
          <dui-popover-trigger>
            <dui-button style="${btnStyle}">Click items to close</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup style="${popupStyle}" close-on-click>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="padding: 6px 8px; border-radius: 4px; cursor: pointer;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='transparent'">Option 1</div>
              <div style="padding: 6px 8px; border-radius: 4px; cursor: pointer;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='transparent'">Option 2</div>
              <div style="padding: 6px 8px; border-radius: 4px; cursor: pointer;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='transparent'">Option 3</div>
            </div>
          </dui-popover-popup>
        </dui-popover>
      </prim-demo>

      <prim-demo label="With close button">
        <dui-popover>
          <dui-popover-trigger>
            <dui-button style="${btnStyle}">With close button</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup style="${popupStyle}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: 600;">Settings</span>
              <dui-popover-close>
                <button style="background: none; border: none; cursor: pointer; font-size: 18px; color: #999; padding: 0 4px;">✕</button>
              </dui-popover-close>
            </div>
            <p style="margin: 0; color: #666;">Popover with an explicit close button.</p>
          </dui-popover-popup>
        </dui-popover>
      </prim-demo>

      <prim-demo label="Accessibility">
        <p style="font-size: 13px; color: #666; margin-top: 0;">
          Click or press Enter/Space on the trigger to toggle.
          Press <code>Escape</code> to close. Uses <code>role="dialog"</code>
          with <code>aria-expanded</code> on the trigger.
        </p>
      </prim-demo>
    `;
  }
}
