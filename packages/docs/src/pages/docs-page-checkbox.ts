import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-checkbox")
export class DocsPageCheckbox extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <h1>Checkbox</h1>
      <p class="subtitle">A tri-state checkbox with form participation via ElementInternals.</p>

      <prim-demo label="Basic checkboxes">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <dui-checkbox style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">Accept terms</dui-checkbox>
          <dui-checkbox checked style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">Pre-checked</dui-checkbox>
          <dui-checkbox disabled style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; opacity: 0.5;">Disabled</dui-checkbox>
        </div>
      </prim-demo>

      <prim-demo label="Indeterminate state">
        <dui-checkbox indeterminate style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">Select all (indeterminate)</dui-checkbox>
      </prim-demo>
    `;
  }
}
