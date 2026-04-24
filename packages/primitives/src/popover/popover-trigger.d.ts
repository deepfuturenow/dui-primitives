/** Ported from original DUI: deep-future-app/app/client/components/dui/popover */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-popover-trigger>` — Click-to-toggle trigger for the popover.
 *
 * @slot - Content that triggers the popover (usually a button).
 */
export declare class DuiPopoverTriggerPrimitive extends LitElement {
    #private;
    static tagName: "dui-popover-trigger";
    static styles: any[];
    protected updated(): void;
    render(): TemplateResult;
}
