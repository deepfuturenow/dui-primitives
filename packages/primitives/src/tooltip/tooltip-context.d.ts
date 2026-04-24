/** Ported from original DUI: deep-future-app/app/client/components/dui/tooltip */
export type TooltipSide = "top" | "bottom";
export type TooltipContext = {
    readonly open: boolean;
    readonly triggerId: string;
    readonly popupId: string;
    readonly side: TooltipSide;
    readonly sideOffset: number;
    readonly disabled: boolean;
    readonly openTooltip: () => void;
    readonly closeTooltip: () => void;
    readonly setTriggerEl: (el: HTMLElement | undefined) => void;
    readonly triggerEl: HTMLElement | undefined;
};
export declare const tooltipContext: any;
