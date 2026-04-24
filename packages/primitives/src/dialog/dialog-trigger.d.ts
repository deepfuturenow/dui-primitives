/** Ported from original DUI: deep-future-app/app/client/components/dui/dialog */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-dialog-trigger>` — Behavioral wrapper that opens the dialog.
 *
 * Wraps slotted content and opens the dialog on click.
 *
 * @slot - Content that triggers the dialog (usually a `<dui-button>`).
 */
export declare class DuiDialogTriggerPrimitive extends LitElement {
    #private;
    static tagName: "dui-dialog-trigger";
    static styles: any[];
    render(): TemplateResult;
}
