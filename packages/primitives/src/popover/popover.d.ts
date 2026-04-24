/** Ported from original DUI: deep-future-app/app/client/components/dui/popover */
import { LitElement, type PropertyValues, type TemplateResult } from "lit";
import { type PopoverContext, type PopoverSide } from "./popover-context.ts";
export type PopoverOpenChangeDetail = {
    open: boolean;
};
export declare const openChangeEvent: (detail: PopoverOpenChangeDetail) => CustomEvent<PopoverOpenChangeDetail>;
/**
 * `<dui-popover>` — A popover root that provides context for trigger and popup.
 *
 * @slot - Default slot for dui-popover-trigger and dui-popover-popup.
 * @fires open-change - Dispatched when the popover opens or closes.
 */
export declare class DuiPopoverPrimitive extends LitElement {
    #private;
    static tagName: "dui-popover";
    static styles: any[];
    /** Controlled open state. */
    accessor open: boolean;
    /** Default open state for uncontrolled usage. */
    accessor defaultOpen: boolean;
    /** Which side of the trigger the popover appears on. */
    accessor side: PopoverSide;
    /** Offset from the trigger in pixels. */
    accessor sideOffset: number;
    accessor _ctx: PopoverContext;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected willUpdate(changed: PropertyValues): void;
    render(): TemplateResult;
}
