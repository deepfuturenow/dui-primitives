/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-sidebar-content>` — Scrollable content section of the sidebar.
 *
 * Wraps its slot in a scroll area to provide overflow scrolling.
 *
 * @slot - Default slot for sidebar groups, menus, etc.
 */
export declare class DuiSidebarContentPrimitive extends LitElement {
    static tagName: "dui-sidebar-content";
    static styles: any[];
    render(): TemplateResult;
}
