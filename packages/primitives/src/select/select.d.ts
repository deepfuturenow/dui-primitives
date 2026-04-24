/** Ported from original DUI: deep-future-app/app/client/components/dui/select */
import { LitElement, type TemplateResult } from "lit";
export type SelectOption = {
    label: string;
    value: string;
    disabled?: boolean;
};
export type SelectValueChangeDetail = {
    value: string;
    option: SelectOption;
};
export declare const valueChangeEvent: (detail: SelectValueChangeDetail) => CustomEvent<SelectValueChangeDetail>;
/**
 * `<dui-select>` — A dropdown select for choosing from a list of options.
 *
 * @csspart trigger - The trigger button.
 * @csspart value - The displayed value text.
 * @fires value-change - Fired when the selected value changes.
 *   Detail: { value: string, option: SelectOption }
 */
export declare class DuiSelectPrimitive extends LitElement {
    #private;
    static tagName: "dui-select";
    static formAssociated: boolean;
    static styles: any[];
    constructor();
    /** The available options. */
    accessor options: SelectOption[];
    /** Currently selected value. */
    accessor value: string;
    /** Placeholder text shown when no value is selected. */
    accessor placeholder: string;
    /** Whether the select is disabled. */
    accessor disabled: boolean;
    /** Position the popup so the selected item overlays the trigger (macOS-style). */
    accessor alignItemToTrigger: boolean;
    /** Name for form submission. */
    accessor name: string;
    willUpdate(): void;
    render(): TemplateResult;
}
