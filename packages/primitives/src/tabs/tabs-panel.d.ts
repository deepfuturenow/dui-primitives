/** Ported from original DUI: deep-future-app/app/client/components/dui/tabs */
import { LitElement, type TemplateResult } from "lit";
import { type TabsContext } from "./tabs-context.ts";
/**
 * Content panel for a tab. Shown when the matching tab is active.
 */
export declare class DuiTabsPanelPrimitive extends LitElement {
    #private;
    static tagName: "dui-tabs-panel";
    static styles: any[];
    /** Panel value — must match the corresponding tab's value. */
    accessor value: string;
    /** Keep panel in DOM when not active. */
    accessor keepMounted: boolean;
    accessor _ctx: TabsContext;
    willUpdate(): void;
    render(): TemplateResult;
}
