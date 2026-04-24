/** Ported from original DUI: deep-future-app/app/client/components/dui/dialog */
export type DialogContext = {
    readonly open: boolean;
    readonly dialogId: string;
    readonly triggerId: string;
    readonly titleId: string;
    readonly descriptionId: string;
    readonly openDialog: () => void;
    readonly closeDialog: () => void;
};
export declare const dialogContext: any;
