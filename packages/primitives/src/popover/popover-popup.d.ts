/** Ported from original DUI: deep-future-app/app/client/components/dui/popover */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-popover-popup>` — The popover popup content container.
 *
 * @slot - Popover content.
 */
export declare class DuiPopoverPopupPrimitive extends LitElement {
    #private;
    static tagName: "dui-popover-popup";
    static styles: any[];
    /** Whether to show an arrow pointing to the trigger. */
    accessor showArrow: boolean;
    /** Close the popover when content inside the popup is clicked. */
    accessor closeOnClick: boolean;
    /** Check if an event path includes this popup's portal positioner. */
    containsEventTarget(path: EventTarget[]): boolean;
    updated(): void;
    render(): TemplateResult;
}
