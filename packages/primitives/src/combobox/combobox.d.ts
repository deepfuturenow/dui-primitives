/** Ported from original DUI: deep-future-app/app/client/components/dui/combobox */
import { LitElement, type TemplateResult } from "lit";
export type SelectOption = {
    label: string;
    value: string;
};
export type ComboboxValueChangeDetail = {
    value: string;
    option: SelectOption;
};
export type ComboboxValuesChangeDetail = {
    value: string;
    selected: boolean;
    values: Set<string>;
};
export declare const valueChangeEvent: (detail: ComboboxValueChangeDetail) => CustomEvent<ComboboxValueChangeDetail>;
export declare const valuesChangeEvent: (detail: ComboboxValuesChangeDetail) => CustomEvent<ComboboxValuesChangeDetail>;
/**
 * `<dui-combobox>` — A searchable dropdown for selecting from a list of options.
 * Supports single-select and multi-select (chip) modes.
 *
 * @fires value-change - Single-select: fired when selection changes.
 *   Detail: { value: string, option: SelectOption }
 * @fires values-change - Multi-select: fired when a value is toggled.
 *   Detail: { value: string, selected: boolean, values: Set<string> }
 */
export declare class DuiComboboxPrimitive extends LitElement {
    #private;
    static tagName: "dui-combobox";
    static formAssociated: boolean;
    static styles: any[];
    constructor();
    /** The available options. */
    accessor options: SelectOption[];
    /** Currently selected value (single-select mode). */
    accessor value: string;
    /** Currently selected values (multi-select mode). */
    accessor values: Set<string>;
    /** Enable multi-select mode with chips. */
    accessor multiple: boolean;
    /** Placeholder text for the input. */
    accessor placeholder: string;
    /** Whether the combobox is disabled. */
    accessor disabled: boolean;
    /** Name for form submission. */
    accessor name: string;
    willUpdate(): void;
    render(): TemplateResult;
}
