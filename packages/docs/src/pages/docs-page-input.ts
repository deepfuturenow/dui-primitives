import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-input")
export class DocsPageInput extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const inputStyle = `display: block; width: 300px;`;

    return html`
      <h1>Input</h1>
      <p class="subtitle">A text input with form participation via ElementInternals.</p>

      <prim-demo label="Basic input">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <dui-input placeholder="Type something..." style="${inputStyle}"></dui-input>
          <dui-input value="Pre-filled value" style="${inputStyle}"></dui-input>
          <dui-input placeholder="Disabled" disabled style="${inputStyle}; opacity: 0.5;"></dui-input>
        </div>
      </prim-demo>

      <prim-demo label="Input types">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <dui-input type="email" placeholder="email@example.com" style="${inputStyle}"></dui-input>
          <dui-input type="password" placeholder="Password" style="${inputStyle}"></dui-input>
          <dui-input type="number" placeholder="0" style="${inputStyle}"></dui-input>
        </div>
      </prim-demo>
    `;
  }
}
