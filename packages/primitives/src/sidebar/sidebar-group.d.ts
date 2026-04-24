/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-sidebar-group>` — Section container within the sidebar.
 *
 * Groups related menu items with an optional label.
 *
 * @slot label - Optional group label (use `<dui-sidebar-group-label>`).
 * @slot - Default slot for group content (menus, items, etc.).
 */
export declare class DuiSidebarGroupPrimitive extends LitElement {
    static tagName: "dui-sidebar-group";
    static styles: any[];
    render(): TemplateResult;
}
