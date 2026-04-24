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
 * `<dui-stepper>` — A numeric input with increment/decrement buttons.
 *
 * Simple component for stepping values up and down via buttons, keyboard,
 * or manual text entry. No labels, icons, scrubbing, or other extras.
 *
 * @csspart root - The outer container.
 * @csspart input - The text input element.
 * @csspart decrement - The decrement button.
 * @csspart increment - The increment button.
 * @fires value-change - Fired when value changes. Detail: { value: number }
 * @fires value-committed - Fired on blur or Enter. Detail: { value: number }
 */
export declare class DuiStepperPrimitive extends LitElement {
    #private;
    static tagName: "dui-stepper";
    static shadowRootOptions: ShadowRootInit;
    static styles: any[];
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
    connectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
