/** Ported from original DUI: deep-future-app/app/client/components/dui/dialog */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-dialog-close>` — A close button wrapper for the dialog.
 *
 * Wraps slotted content and closes the dialog on click.
 *
 * @slot - Content that closes the dialog (usually a button).
 */
export declare class DuiDialogClosePrimitive extends LitElement {
    #private;
    static tagName: "dui-dialog-close";
    static styles: any[];
    render(): TemplateResult;
}
