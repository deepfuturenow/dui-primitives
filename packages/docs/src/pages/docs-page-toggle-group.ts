import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-toggle-group")
export class DocsPageToggleGroup extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <style>
        .tg-demo dui-toggle::part(root) {
          border: 1px solid #d4d4d8;
          padding: 6px 12px;
          font-size: 14px;
          background: #fff;
          color: #18181b;
        }
        .tg-demo dui-toggle::part(root):hover {
          background: #f4f4f5;
        }
        .tg-demo dui-toggle[data-pressed]::part(root) {
          background: #18181b;
          color: #fff;
          border-color: #18181b;
        }
        .tg-demo dui-toggle[data-disabled]::part(root) {
          opacity: 0.4;
        }
        /* Segmented look: collapse borders between adjacent items. */
        .tg-demo dui-toggle-group[orientation="horizontal"] dui-toggle:not(:first-child)::part(root) {
          margin-left: -1px;
        }
        .tg-demo dui-toggle-group[orientation="horizontal"] dui-toggle:first-child::part(root) {
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
        }
        .tg-demo dui-toggle-group[orientation="horizontal"] dui-toggle:last-child::part(root) {
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
        }
        .constrained {
          max-width: 320px;
          border: 1px dashed #f43f5e;
          padding: 12px;
          border-radius: 6px;
        }
        .constrained-label {
          font-size: 12px;
          color: #f43f5e;
          margin: 0 0 8px;
        }
      </style>

      <h1>Toggle Group</h1>
      <p class="subtitle">Groups toggle buttons with shared single or multiple selection.</p>

      <prim-demo label="Single selection (default)">
        <div class="tg-demo">
          <dui-toggle-group default-value='["center"]'>
            <dui-toggle value="left">Left</dui-toggle>
            <dui-toggle value="center">Center</dui-toggle>
            <dui-toggle value="right">Right</dui-toggle>
          </dui-toggle-group>
        </div>
      </prim-demo>

      <prim-demo label="Multiple selection">
        <div class="tg-demo">
          <dui-toggle-group type="multiple" default-value='["bold","underline"]'>
            <dui-toggle value="bold">Bold</dui-toggle>
            <dui-toggle value="italic">Italic</dui-toggle>
            <dui-toggle value="underline">Underline</dui-toggle>
          </dui-toggle-group>
        </div>
      </prim-demo>

      <prim-demo label="Vertical orientation">
        <div class="tg-demo">
          <dui-toggle-group orientation="vertical" default-value='["list"]'>
            <dui-toggle value="list">List</dui-toggle>
            <dui-toggle value="grid">Grid</dui-toggle>
            <dui-toggle value="gallery">Gallery</dui-toggle>
          </dui-toggle-group>
        </div>
      </prim-demo>

      <prim-demo label="Many items in a constrained container">
        <p class="constrained-label">
          The dashed box is 320px wide. Watch what happens when the items don't fit.
        </p>
        <div class="tg-demo constrained">
          <dui-toggle-group type="multiple">
            <dui-toggle value="mon">Mon</dui-toggle>
            <dui-toggle value="tue">Tue</dui-toggle>
            <dui-toggle value="wed">Wed</dui-toggle>
            <dui-toggle value="thu">Thu</dui-toggle>
            <dui-toggle value="fri">Fri</dui-toggle>
            <dui-toggle value="sat">Sat</dui-toggle>
            <dui-toggle value="sun">Sun</dui-toggle>
          </dui-toggle-group>
        </div>
      </prim-demo>

      <prim-demo label="Disabled group">
        <div class="tg-demo">
          <dui-toggle-group disabled default-value='["center"]'>
            <dui-toggle value="left">Left</dui-toggle>
            <dui-toggle value="center">Center</dui-toggle>
            <dui-toggle value="right">Right</dui-toggle>
          </dui-toggle-group>
        </div>
      </prim-demo>

      <prim-demo label="Keyboard & accessibility">
        <p style="font-size: 13px; color: #666; margin-top: 0;">
          Container is <code>role="group"</code> with <code>aria-orientation</code>.
          Arrow keys move focus between items (<kbd>←</kbd>/<kbd>→</kbd> horizontal,
          <kbd>↑</kbd>/<kbd>↓</kbd> vertical); focus loops at the ends when
          <code>loop</code> is set. Emits <code>value-change</code> with the selected values.
        </p>
      </prim-demo>
    `;
  }
}
