/** Ported from original DUI: deep-future-app/app/client/components/dui/tooltip */
import { LitElement, type PropertyValues, type TemplateResult } from "lit";
import { type TooltipContext, type TooltipSide } from "./tooltip-context.ts";
export type TooltipOpenChangeDetail = {
    open: boolean;
};
export declare const openChangeEvent: (detail: TooltipOpenChangeDetail) => CustomEvent<TooltipOpenChangeDetail>;
/**
 * `<dui-tooltip>` — A tooltip root that provides context for trigger and popup.
 *
 * @slot - Default slot for dui-tooltip-trigger and dui-tooltip-popup.
 * @fires open-change - Dispatched when the tooltip opens or closes.
 */
export declare class DuiTooltipPrimitive extends LitElement {
    #private;
    static tagName: "dui-tooltip";
    static styles: any[];
    /** Controlled open state. */
    accessor open: boolean;
    /** Default open state for uncontrolled usage. */
    accessor defaultOpen: boolean;
    /** Which side of the trigger the tooltip appears on. */
    accessor side: TooltipSide;
    /** Offset from the trigger in pixels. */
    accessor sideOffset: number;
    /** Delay before opening in milliseconds. */
    accessor delay: number;
    /** Delay before closing in milliseconds. */
    accessor closeDelay: number;
    /** Disable the tooltip. */
    accessor disabled: boolean;
    accessor _ctx: TooltipContext;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected willUpdate(changed: PropertyValues): void;
    render(): TemplateResult;
}
