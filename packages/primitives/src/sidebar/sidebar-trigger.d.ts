/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-sidebar-trigger>` — Toggle button for the sidebar.
 *
 * Consumes sidebar context and calls `toggleSidebar()` on click.
 * Renders a ghost button with a default panel icon.
 *
 * @slot - Override the default icon.
 */
export declare class DuiSidebarTriggerPrimitive extends LitElement {
    #private;
    static tagName: "dui-sidebar-trigger";
    static styles: any[];
    render(): TemplateResult;
}
