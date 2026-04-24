/** Ported from original DUI: deep-future-app/app/client/components/dui/tooltip */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-tooltip-popup>` — The tooltip popup content container.
 *
 * @slot - Tooltip content.
 */
export declare class DuiTooltipPopupPrimitive extends LitElement {
    #private;
    static tagName: "dui-tooltip-popup";
    static styles: any[];
    /** Whether to show an arrow pointing to the trigger. */
    accessor showArrow: boolean;
    updated(): void;
    render(): TemplateResult;
}
