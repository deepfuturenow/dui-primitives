/** Ported from original DUI: deep-future-app/app/client/components/dui/alert-dialog */
export type AlertDialogContext = {
    readonly open: boolean;
    readonly dialogId: string;
    readonly triggerId: string;
    readonly titleId: string;
    readonly descriptionId: string;
    readonly openDialog: () => void;
    readonly closeDialog: () => void;
};
export declare const alertDialogContext: any;
