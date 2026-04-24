/** Ported from original DUI: deep-future-app/app/client/components/dui/tooltip */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-tooltip-trigger>` — The element that triggers the tooltip on hover/focus.
 *
 * @slot - Content that triggers the tooltip.
 */
export declare class DuiTooltipTriggerPrimitive extends LitElement {
    #private;
    static tagName: "dui-tooltip-trigger";
    static styles: any[];
    /** Disable the trigger. */
    accessor disabled: boolean;
    render(): TemplateResult;
}
