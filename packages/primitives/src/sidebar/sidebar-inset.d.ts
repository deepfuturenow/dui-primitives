/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-sidebar-inset>` — Content wrapper adjacent to the sidebar.
 *
 * Fills the remaining space next to the sidebar. Provides a container
 * query context for responsive content.
 *
 * @slot - Default slot for main page content.
 */
export declare class DuiSidebarInsetPrimitive extends LitElement {
    static tagName: "dui-sidebar-inset";
    static styles: any[];
    render(): TemplateResult;
}
