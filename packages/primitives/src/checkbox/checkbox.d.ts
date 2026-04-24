/** Ported from original DUI: deep-future-app/app/client/components/dui/checkbox */
import { LitElement, type TemplateResult } from "lit";
export declare const checkedChangeEvent: (detail: {
    checked: boolean;
    indeterminate: boolean;
}) => CustomEvent<{
    checked: boolean;
    indeterminate: boolean;
}>;
/**
 * `<dui-checkbox>` — A checkbox input with optional indeterminate state.
 *
 * Supports controlled and uncontrolled usage, group context integration,
 * and field context for form validation states.
 *
 * @csspart root - The checkbox box element.
 * @csspart indicator - The check/indeterminate indicator.
 *
 * @fires checked-change - Fired when checked state changes. Detail: { checked, indeterminate }
 */
export declare class DuiCheckboxPrimitive extends LitElement {
    #private;
    static tagName: "dui-checkbox";
    static formAssociated: boolean;
    static styles: any[];
    constructor();
    /** Whether the checkbox is checked (controlled). */
    accessor checked: boolean | undefined;
    /** Initial checked state for uncontrolled usage. */
    accessor defaultChecked: boolean;
    /** Whether the checkbox is in an indeterminate (mixed) state. */
    accessor indeterminate: boolean;
    /** Whether the checkbox is disabled. */
    accessor disabled: boolean;
    /** Whether the checkbox is read-only. */
    accessor readOnly: boolean;
    /** Whether the checkbox is required for form submission. */
    accessor required: boolean;
    /** The name attribute for form submission. */
    accessor name: string | undefined;
    /** The value attribute for form submission. */
    accessor value: string | undefined;
    /** When true, acts as a parent (select-all) checkbox within a group. */
    accessor parent: boolean;
    connectedCallback(): void;
    willUpdate(): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
}
