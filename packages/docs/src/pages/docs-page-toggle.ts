import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-toggle")
export class DocsPageToggle extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <style>
        .toggle-demo dui-toggle::part(root) {
          border: 1px solid #d4d4d8;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 14px;
          background: #fff;
          color: #18181b;
        }
        .toggle-demo dui-toggle::part(root):hover {
          background: #f4f4f5;
        }
        .toggle-demo dui-toggle[data-pressed]::part(root) {
          background: #18181b;
          color: #fff;
          border-color: #18181b;
        }
        .toggle-demo dui-toggle[data-disabled]::part(root) {
          opacity: 0.4;
        }
      </style>

      <h1>Toggle</h1>
      <p class="subtitle">A two-state toggle button. Works standalone or inside a toggle group.</p>

      <prim-demo label="Basic usage">
        <div class="toggle-demo" style="display: flex; gap: 12px; flex-wrap: wrap;">
          <dui-toggle>Bold</dui-toggle>
          <dui-toggle default-pressed>Italic (on)</dui-toggle>
          <dui-toggle disabled>Disabled</dui-toggle>
        </div>
      </prim-demo>

      <prim-demo label="With an icon slot">
        <div class="toggle-demo">
          <dui-toggle default-pressed>
            <span slot="icon" aria-hidden="true">★</span>
            Favorite
          </dui-toggle>
        </div>
      </prim-demo>

      <prim-demo label="Keyboard & accessibility">
        <p style="font-size: 13px; color: #666; margin-top: 0;">
          Rendered as a native <code>&lt;button&gt;</code> with <code>aria-pressed</code>.
          Focusable with <kbd>Tab</kbd>; toggled with <kbd>Space</kbd> / <kbd>Enter</kbd>.
          Emits <code>pressed-change</code> when used standalone.
        </p>
      </prim-demo>
    `;
  }
}
