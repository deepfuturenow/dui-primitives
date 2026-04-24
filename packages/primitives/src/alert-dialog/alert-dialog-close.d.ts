/** Ported from original DUI: deep-future-app/app/client/components/dui/alert-dialog */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-alert-dialog-close>` — A close button wrapper for the alert dialog.
 *
 * Wraps slotted content and closes the alert dialog on click.
 *
 * @slot - Content that closes the alert dialog (usually a button).
 */
export declare class DuiAlertDialogClosePrimitive extends LitElement {
    #private;
    static tagName: "dui-alert-dialog-close";
    static styles: any[];
    render(): TemplateResult;
}
