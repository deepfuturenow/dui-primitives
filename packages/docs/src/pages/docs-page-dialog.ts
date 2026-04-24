import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-dialog")
export class DocsPageDialog extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const btnStyle = `padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: #f5f5f5; cursor: pointer; font-size: 14px;`;

    return html`
      <h1>Dialog</h1>
      <p class="subtitle">A modal dialog with focus trapping and backdrop. Uses compound components: dialog, trigger, popup, close.</p>

      <prim-demo label="Basic dialog">
        <dui-dialog>
          <dui-dialog-trigger>
            <dui-button style="${btnStyle}">Open Dialog</dui-button>
          </dui-dialog-trigger>
          <dui-dialog-popup style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 24px;
            min-width: 320px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            z-index: 1000;
          ">
            <h2 style="margin: 0 0 8px; font-size: 18px;">Dialog Title</h2>
            <p style="color: #666; font-size: 14px;">This dialog traps focus. Press Escape to close.</p>
            <div style="margin-top: 16px; display: flex; gap: 8px; justify-content: flex-end;">
              <dui-dialog-close>
                <dui-button style="${btnStyle}">Close</dui-button>
              </dui-dialog-close>
            </div>
          </dui-dialog-popup>
        </dui-dialog>
      </prim-demo>

      <prim-demo label="Accessibility">
        <ul style="font-size: 14px; line-height: 1.8; color: #555;">
          <li>Focus is trapped inside the dialog when open</li>
          <li>Escape key closes the dialog</li>
          <li>Focus returns to the trigger when closed</li>
          <li>Uses <code>role="dialog"</code> and <code>aria-modal</code></li>
        </ul>
      </prim-demo>
    `;
  }
}
