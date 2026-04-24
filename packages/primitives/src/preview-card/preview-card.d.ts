/** Ported from original DUI: deep-future-app/app/client/components/dui/preview-card */
import { LitElement, type PropertyValues, type TemplateResult } from "lit";
import { type PreviewCardContext, type PreviewCardSide } from "./preview-card-context.ts";
export type PreviewCardOpenChangeDetail = {
    open: boolean;
};
export declare const openChangeEvent: (detail: PreviewCardOpenChangeDetail) => CustomEvent<PreviewCardOpenChangeDetail>;
/**
 * `<dui-preview-card>` — A preview card root that provides context for trigger and popup.
 *
 * @slot - Default slot for dui-preview-card-trigger and dui-preview-card-popup.
 * @fires open-change - Dispatched when the preview card opens or closes.
 */
export declare class DuiPreviewCardPrimitive extends LitElement {
    #private;
    static tagName: "dui-preview-card";
    static styles: any[];
    /** Controlled open state. */
    accessor open: boolean;
    /** Default open state for uncontrolled usage. */
    accessor defaultOpen: boolean;
    /** Which side of the trigger the preview card appears on. */
    accessor side: PreviewCardSide;
    /** Offset from the trigger in pixels. */
    accessor sideOffset: number;
    /** Delay before opening in milliseconds. */
    accessor delay: number;
    /** Delay before closing in milliseconds. */
    accessor closeDelay: number;
    accessor _ctx: PreviewCardContext;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected willUpdate(changed: PropertyValues): void;
    render(): TemplateResult;
}
