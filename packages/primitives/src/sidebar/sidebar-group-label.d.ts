/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-sidebar-group-label>` — Heading for a sidebar group.
 *
 * Automatically hides (with opacity transition) when the sidebar is
 * in icon-collapsed mode.
 *
 * @slot - Label text.
 */
export declare class DuiSidebarGroupLabelPrimitive extends LitElement {
    #private;
    static tagName: "dui-sidebar-group-label";
    static styles: any[];
    updated(): void;
    render(): TemplateResult;
}
