import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-accordion")
export class DocsPageAccordion extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const itemStyle = `display: block; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 4px;`;

    return html`
      <h1>Accordion</h1>
      <p class="subtitle">Vertically stacked sections with expandable/collapsible panels. Follows the APG Accordion pattern.</p>

      <prim-demo label="Single expand (default)">
        <dui-accordion .defaultValue=${["item-1"]} style="display: block; max-width: 500px;">
          <dui-accordion-item value="item-1" style="${itemStyle}">
            <div slot="trigger" style="padding: 12px 16px; cursor: pointer; font-size: 14px; font-weight: 500;">Section 1</div>
            <div slot="content" style="padding: 0 16px 12px; font-size: 14px; color: #555;">Content for section 1. Only one section is open at a time by default.</div>
          </dui-accordion-item>
          <dui-accordion-item value="item-2" style="${itemStyle}">
            <div slot="trigger" style="padding: 12px 16px; cursor: pointer; font-size: 14px; font-weight: 500;">Section 2</div>
            <div slot="content" style="padding: 0 16px 12px; font-size: 14px; color: #555;">Content for section 2.</div>
          </dui-accordion-item>
          <dui-accordion-item value="item-3" style="${itemStyle}">
            <div slot="trigger" style="padding: 12px 16px; cursor: pointer; font-size: 14px; font-weight: 500;">Section 3</div>
            <div slot="content" style="padding: 0 16px 12px; font-size: 14px; color: #555;">Content for section 3.</div>
          </dui-accordion-item>
        </dui-accordion>
      </prim-demo>

      <prim-demo label="Multiple expand">
        <dui-accordion multiple style="display: block; max-width: 500px;">
          <dui-accordion-item value="a" style="${itemStyle}">
            <div slot="trigger" style="padding: 12px 16px; cursor: pointer; font-size: 14px; font-weight: 500;">Item A</div>
            <div slot="content" style="padding: 0 16px 12px; font-size: 14px; color: #555;">Multiple items can be open simultaneously.</div>
          </dui-accordion-item>
          <dui-accordion-item value="b" style="${itemStyle}">
            <div slot="trigger" style="padding: 12px 16px; cursor: pointer; font-size: 14px; font-weight: 500;">Item B</div>
            <div slot="content" style="padding: 0 16px 12px; font-size: 14px; color: #555;">Try opening multiple at once.</div>
          </dui-accordion-item>
        </dui-accordion>
      </prim-demo>
    `;
  }
}
