/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { LitElement, type TemplateResult } from "lit";
import { type SidebarContext } from "./sidebar-context.ts";
export type SidebarOpenChangeDetail = {
    open: boolean;
};
export declare const openChangeEvent: (detail: SidebarOpenChangeDetail) => CustomEvent<SidebarOpenChangeDetail>;
/**
 * `<dui-sidebar-provider>` — Root state manager for the sidebar compound component.
 *
 * Manages open/close state, mobile detection, and provides context to all
 * sidebar sub-components. Wraps the entire layout (sidebar + main content).
 *
 * @slot - Default slot for sidebar and content areas.
 * @fires open-change - Fired when the sidebar opens or closes. Detail: { open: boolean }
 */
export declare class DuiSidebarProviderPrimitive extends LitElement {
    #private;
    static tagName: "dui-sidebar-provider";
    static styles: any[];
    /** Controls the sidebar open state (controlled mode). */
    accessor open: boolean | undefined;
    /** Initial open state for uncontrolled mode. Defaults to true. */
    accessor defaultOpen: boolean;
    /** Which side the sidebar appears on. */
    accessor side: "left" | "right";
    /** Visual variant of the sidebar. */
    accessor variant: string;
    /** How the sidebar collapses. */
    accessor collapsible: "offcanvas" | "icon" | "none";
    accessor _ctx: SidebarContext;
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
