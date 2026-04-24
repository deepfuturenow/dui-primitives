/** Ported from original DUI: deep-future-app/app/client/components/dui/radio */
import { LitElement, type TemplateResult } from "lit";
import { type RadioGroupContext } from "./radio-group-context.ts";
export declare const valueChangeEvent: (detail: {
    value: string;
}) => CustomEvent<{
    value: string;
}>;
/**
 * `<dui-radio-group>` — Groups multiple radio buttons with shared state.
 *
 * Only one radio can be selected at a time within a group. Supports
 * controlled and uncontrolled usage.
 *
 * @slot - Default slot for `<dui-radio>` children.
 * @csspart root - The group container element.
 * @fires value-change - Fired when the selected value changes. Detail: { value: string }
 */
export declare class DuiRadioGroupPrimitive extends LitElement {
    #private;
    static tagName: "dui-radio-group";
    static styles: any[];
    /** The name attribute for form submission. */
    accessor name: string | undefined;
    /** Selected value (controlled). */
    accessor value: string | undefined;
    /** Initial selected value for uncontrolled usage. */
    accessor defaultValue: string | undefined;
    /** Whether all radios in the group are disabled. */
    accessor disabled: boolean;
    /** Whether all radios in the group are read-only. */
    accessor readOnly: boolean;
    /** Whether a selection is required. */
    accessor required: boolean;
    accessor _ctx: RadioGroupContext;
    connectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
