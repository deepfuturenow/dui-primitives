import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-switch")
export class DocsPageSwitch extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <h1>Switch</h1>
      <p class="subtitle">A toggle switch with form participation.</p>

      <prim-demo label="Basic switches">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <dui-switch style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">Notifications</dui-switch>
          <dui-switch checked style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">Dark mode (on)</dui-switch>
          <dui-switch disabled style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; opacity: 0.5;">Disabled</dui-switch>
        </div>
      </prim-demo>
    `;
  }
}
