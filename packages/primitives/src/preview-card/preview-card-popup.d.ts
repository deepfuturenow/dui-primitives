/** Ported from original DUI: deep-future-app/app/client/components/dui/preview-card */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-preview-card-popup>` — The preview card popup content container.
 *
 * @slot - Preview card content.
 */
export declare class DuiPreviewCardPopupPrimitive extends LitElement {
    #private;
    static tagName: "dui-preview-card-popup";
    static styles: any[];
    /** Whether to show an arrow pointing to the trigger. */
    accessor showArrow: boolean;
    updated(): void;
    render(): TemplateResult;
}
