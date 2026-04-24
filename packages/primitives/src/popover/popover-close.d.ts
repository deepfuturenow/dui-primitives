/** Ported from original DUI: deep-future-app/app/client/components/dui/popover */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-popover-close>` — A close button wrapper for the popover.
 *
 * @slot - Content that closes the popover (usually a button or icon).
 */
export declare class DuiPopoverClosePrimitive extends LitElement {
    #private;
    static tagName: "dui-popover-close";
    static styles: any[];
    render(): TemplateResult;
}
