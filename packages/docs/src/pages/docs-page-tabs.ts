import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-tabs")
export class DocsPageTabs extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <h1>Tabs</h1>
      <p class="subtitle">Tabbed content with keyboard navigation and ARIA tabs pattern.</p>

      <prim-demo label="Basic tabs">
        <dui-tabs defaultValue="tab1" style="display: block;">
          <dui-tabs-list style="display: flex; gap: 0; border-bottom: 1px solid #ddd; margin-bottom: 16px;">
            <dui-tab value="tab1" style="padding: 8px 16px; border: none; background: none; cursor: pointer; font-size: 14px; border-bottom: 2px solid transparent;">Tab 1</dui-tab>
            <dui-tab value="tab2" style="padding: 8px 16px; border: none; background: none; cursor: pointer; font-size: 14px; border-bottom: 2px solid transparent;">Tab 2</dui-tab>
            <dui-tab value="tab3" style="padding: 8px 16px; border: none; background: none; cursor: pointer; font-size: 14px; border-bottom: 2px solid transparent;">Tab 3</dui-tab>
          </dui-tabs-list>
          <dui-tabs-panel value="tab1" style="padding: 8px 0;">Content for Tab 1. Try arrow keys to navigate between tabs.</dui-tabs-panel>
          <dui-tabs-panel value="tab2" style="padding: 8px 0;">Content for Tab 2.</dui-tabs-panel>
          <dui-tabs-panel value="tab3" style="padding: 8px 0;">Content for Tab 3.</dui-tabs-panel>
        </dui-tabs>
      </prim-demo>

      <prim-demo label="Keyboard navigation">
        <p style="font-size: 13px; color: #666; margin-top: 0;">
          Focus a tab, then use Arrow Left/Right to move between tabs. 
          Home/End jump to first/last tab.
        </p>
      </prim-demo>
    `;
  }
}
