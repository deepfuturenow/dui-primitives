import { LitElement, type TemplateResult } from "lit";
export declare const valueChangeEvent: (detail: {
    value: number;
}) => CustomEvent<{
    value: number;
}>;
export declare const valueCommittedEvent: (detail: {
    value: number;
}) => CustomEvent<{
    value: number;
}>;
/**
 * `<dui-number-field>` — A numeric input with optional label, icon,
 * unit suffix, drag-to-scrub behavior, and precision formatting.
 *
 * For simple step-up/step-down with buttons, use `<dui-stepper>` instead.
 *
 * @csspart root - The outer container.
 * @csspart label - Label text element.
 * @csspart icon - Icon slot wrapper.
 * @csspart input - The text input element.
 * @csspart unit - Unit suffix element.
 * @fires value-change - Fired when value changes. Detail: { value: number }
 * @fires value-committed - Fired on pointerup (end of drag), blur, or Enter. Detail: { value: number }
 */
export declare class DuiNumberFieldPrimitive extends LitElement {
    #private;
    static tagName: "dui-number-field";
    static formAssociated: boolean;
    static shadowRootOptions: ShadowRootInit;
    static styles: any[];
    constructor();
    accessor value: number | undefined;
    accessor defaultValue: number | undefined;
    accessor min: number | undefined;
    accessor max: number | undefined;
    accessor step: number;
    accessor largeStep: number;
    accessor disabled: boolean;
    accessor readOnly: boolean;
    accessor required: boolean;
    accessor name: string | undefined;
    accessor label: string;
    accessor labelPosition: string;
    accessor iconPosition: string;
    accessor unit: string;
    accessor precision: number | undefined;
    accessor scrubLabel: boolean;
    accessor scrubValue: boolean;
    accessor scrubField: boolean;
    accessor clickLabel: boolean;
    accessor clickValue: boolean;
    accessor clickField: boolean;
    connectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
