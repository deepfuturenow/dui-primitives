/** Ported from original DUI: deep-future-app/app/client/components/dui/tabs */
import { LitElement, type TemplateResult } from "lit";
import { type TabsContext } from "./tabs-context.ts";
/**
 * Individual tab trigger button.
 */
export declare class DuiTabPrimitive extends LitElement {
    #private;
    static tagName: "dui-tab";
    static styles: any[];
    /** Tab value used to match with the corresponding panel. */
    accessor value: string;
    accessor disabled: boolean;
    accessor _ctx: TabsContext;
    render(): TemplateResult;
}
