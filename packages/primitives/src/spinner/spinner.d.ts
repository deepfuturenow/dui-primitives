/** Ported from original DUI: deep-future-app/app/client/components/dui/spinner */
import { LitElement, type TemplateResult } from "lit";
/**
 * A loading indicator with multiple animation variants and sizes.
 */
export declare class DuiSpinnerPrimitive extends LitElement {
    #private;
    static tagName: "dui-spinner";
    static styles: any[];
    /** Animation variant. */
    accessor variant: string;
    render(): TemplateResult;
}
