/** Ported from original DUI: deep-future-app/app/client/components/dui/alert-dialog */
import { LitElement, type TemplateResult } from "lit";
import { type AlertDialogContext } from "./alert-dialog-context.ts";
export type AlertDialogOpenChangeDetail = {
    open: boolean;
};
export declare const openChangeEvent: (detail: AlertDialogOpenChangeDetail) => CustomEvent<AlertDialogOpenChangeDetail>;
/**
 * `<dui-alert-dialog>` — Root element for the alert dialog compound component.
 *
 * Manages open/close state and provides context to child elements.
 * Does not render visible DOM — uses `display: contents`.
 *
 * Unlike `<dui-dialog>`, alert dialogs do NOT close on backdrop click,
 * requiring explicit user action to dismiss.
 *
 * @slot - Default slot for trigger, popup, and other alert dialog parts.
 * @fires open-change - Fired when the dialog opens or closes. Detail: { open: boolean }
 */
export declare class DuiAlertDialogPrimitive extends LitElement {
    #private;
    static tagName: "dui-alert-dialog";
    static styles: any[];
    /** Controls the dialog open state (controlled mode). */
    accessor open: boolean | undefined;
    /** Initial open state for uncontrolled mode. */
    accessor defaultOpen: boolean;
    accessor _ctx: AlertDialogContext;
    connectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
