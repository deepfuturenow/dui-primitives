/** Ported from original DUI: deep-future-app/app/client/components/dui/alert-dialog */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-alert-dialog-trigger>` — Behavioral wrapper that opens the alert dialog.
 *
 * Wraps slotted content and opens the alert dialog on click.
 *
 * @slot - Content that triggers the alert dialog (usually a `<dui-button>`).
 */
export declare class DuiAlertDialogTriggerPrimitive extends LitElement {
    #private;
    static tagName: "dui-alert-dialog-trigger";
    static styles: any[];
    render(): TemplateResult;
}
