/** Ported from original DUI: deep-future-app/app/client/components/dui/dialog */
import { LitElement, type PropertyValues, type TemplateResult } from "lit";
/**
 * `<dui-dialog-popup>` — The popup overlay for the dialog.
 *
 * Renders a backdrop and a centered dialog popup with focus trapping.
 * Handles open/close animations via `data-starting-style` / `data-ending-style`.
 * Closes on backdrop click (unlike `<dui-alert-dialog-popup>`).
 *
 * Title and description are provided via named slots and rendered as
 * semantic `<h2>` and `<p>` elements with ARIA linkage.
 *
 * @slot title - Title text for the dialog (rendered as `<h2>`).
 * @slot description - Description text for the dialog (rendered as `<p>`).
 * @slot - Default slot for dialog content (actions, form fields, etc.).
 * @csspart backdrop - The overlay backdrop behind the dialog.
 * @csspart popup - The dialog popup container.
 * @csspart title - The heading element wrapping the title slot.
 * @csspart description - The paragraph element wrapping the description slot.
 */
export declare class DuiDialogPopupPrimitive extends LitElement {
    #private;
    static tagName: "dui-dialog-popup";
    static styles: any[];
    /** Keep the popup in the DOM when closed. */
    accessor keepMounted: boolean;
    /** CSS selector within the popup to focus when the dialog opens. */
    accessor initialFocus: string | undefined;
    /** CSS selector in the document to focus when the dialog closes. */
    accessor finalFocus: string | undefined;
    /** Width of the popup (CSS value, e.g. "32rem" or "600px"). Defaults to 24rem. */
    accessor width: string | undefined;
    updated(): void;
    willUpdate(changed: PropertyValues): void;
    render(): TemplateResult;
}
