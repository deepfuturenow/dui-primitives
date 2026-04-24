/** Ported from original DUI: deep-future-app/app/client/components/dui/toolbar */
import { LitElement, type TemplateResult } from "lit";
export declare class DuiToolbarPrimitive extends LitElement {
    static tagName: "dui-toolbar";
    static styles: any[];
    /** Adds horizontal and vertical padding. */
    accessor inset: boolean;
    /** Reduces left inset padding when a button is the first item. */
    accessor hasButtonLeft: boolean;
    /** Reduces right inset padding when a button is the last item. */
    accessor hasButtonRight: boolean;
    render(): TemplateResult;
}
