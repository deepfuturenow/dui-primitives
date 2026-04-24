/** Ported from original DUI: deep-future-app/app/client/components/dui/dialog */
import { LitElement, type TemplateResult } from "lit";
import { type DialogContext } from "./dialog-context.ts";
export type DialogOpenChangeDetail = {
    open: boolean;
};
export declare const openChangeEvent: (detail: DialogOpenChangeDetail) => CustomEvent<DialogOpenChangeDetail>;
/**
 * `<dui-dialog>` — Root element for the dialog compound component.
 *
 * Manages open/close state and provides context to child elements.
 * Does not render visible DOM — uses `display: contents`.
 *
 * Unlike `<dui-alert-dialog>`, this dialog closes on backdrop click,
 * following WAI-ARIA `dialog` semantics for non-critical modals.
 *
 * @slot - Default slot for trigger, popup, and other dialog parts.
 * @fires open-change - Fired when the dialog opens or closes. Detail: { open: boolean }
 */
export declare class DuiDialogPrimitive extends LitElement {
    #private;
    static tagName: "dui-dialog";
    static styles: any[];
    /** Controls the dialog open state (controlled mode). */
    accessor open: boolean | undefined;
    /** Initial open state for uncontrolled mode. */
    accessor defaultOpen: boolean;
    accessor _ctx: DialogContext;
    connectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
