/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-sidebar>` — Main sidebar container.
 *
 * Consumes sidebar context and renders the appropriate desktop or mobile layout.
 * Desktop uses a width-transitioning wrapper; mobile uses a backdrop + sliding panel.
 *
 * @slot - Default slot for sidebar content (header, content, footer, etc.).
 * @csspart desktop-outer - The outer desktop wrapper that transitions width.
 * @csspart desktop-inner - The inner desktop container with content.
 * @csspart backdrop - The mobile backdrop overlay.
 * @csspart mobile-panel - The sliding mobile panel.
 */
export declare class DuiSidebarPrimitive extends LitElement {
    #private;
    static tagName: "dui-sidebar";
    static styles: any[];
    willUpdate(): void;
    render(): TemplateResult;
}
