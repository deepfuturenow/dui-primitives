/** Ported from original DUI: deep-future-app/app/client/components/dui/alert-dialog */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-alert-dialog-popup>` — The popup overlay for the alert dialog.
 *
 * Renders a backdrop and a centered dialog popup with focus trapping.
 * Handles open/close animations via `data-starting-style` / `data-ending-style`.
 * Does NOT close on backdrop click — requires explicit user action.
 *
 * Title and description are provided via named slots and rendered as
 * semantic `<h2>` and `<p>` elements with ARIA linkage.
 *
 * @slot title - Title text for the alert dialog (rendered as `<h2>`).
 * @slot description - Description text for the alert dialog (rendered as `<p>`).
 * @slot - Default slot for dialog content (actions, etc.).
 * @csspart backdrop - The overlay backdrop behind the dialog.
 * @csspart popup - The dialog popup container.
 * @csspart title - The heading element wrapping the title slot.
 * @csspart description - The paragraph element wrapping the description slot.
 */
export declare class DuiAlertDialogPopupPrimitive extends LitElement {
    #private;
    static tagName: "dui-alert-dialog-popup";
    static styles: any[];
    /** Keep the popup in the DOM when closed. */
    accessor keepMounted: boolean;
    /** CSS selector within the popup to focus when the dialog opens. */
    accessor initialFocus: string | undefined;
    /** CSS selector in the document to focus when the dialog closes. */
    accessor finalFocus: string | undefined;
    updated(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
