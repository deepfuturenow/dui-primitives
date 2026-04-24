import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-button")
export class DocsPageButton extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    // Minimal inline styles — just enough to see the primitive's behavior
    const btnStyle = `
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #f5f5f5;
      cursor: pointer;
      font-size: 14px;
    `;

    return html`
      <h1>Button</h1>
      <p class="subtitle">A clickable button. Renders as &lt;a&gt; when href is provided.</p>

      <prim-demo label="Basic buttons">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <dui-button style="${btnStyle}">Click me</dui-button>
          <dui-button style="${btnStyle}" disabled>Disabled</dui-button>
          <dui-button style="${btnStyle}" href="https://example.com" target="_blank">Link button</dui-button>
        </div>
      </prim-demo>

      <prim-demo label="Button types (form behavior)">
        <form @submit=${(e: Event) => { e.preventDefault(); alert("Form submitted!"); }}>
          <div style="display: flex; gap: 12px; align-items: center;">
            <dui-button style="${btnStyle}" type="submit">Submit</dui-button>
            <dui-button style="${btnStyle}" type="reset">Reset</dui-button>
            <dui-button style="${btnStyle}" type="button">Button (no submit)</dui-button>
          </div>
        </form>
      </prim-demo>

      <prim-demo label="Keyboard navigation">
        <p style="font-size: 13px; color: #666; margin-top: 0;">Tab between buttons. Press Enter or Space to activate.</p>
        <div style="display: flex; gap: 12px;">
          <dui-button style="${btnStyle}">First</dui-button>
          <dui-button style="${btnStyle}">Second</dui-button>
          <dui-button style="${btnStyle}">Third</dui-button>
        </div>
      </prim-demo>
    `;
  }
}
