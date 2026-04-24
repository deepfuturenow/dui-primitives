/** Ported from original DUI: deep-future-app/app/client/components/dui/input */
import { LitElement, type TemplateResult } from "lit";
export declare const inputChangeEvent: (detail: {
    value: string;
}) => CustomEvent<{
    value: string;
}>;
/**
 * `<dui-input>` — A native input element that integrates with dui-field.
 *
 * Automatically works with Field for accessible labeling and validation.
 *
 * @csspart input - The native input element.
 * @fires input-change - Fired when value changes. Detail: { value: string }
 */
export declare class DuiInputPrimitive extends LitElement {
    #private;
    static tagName: "dui-input";
    static formAssociated: boolean;
    static shadowRootOptions: ShadowRootInit;
    static styles: any[];
    constructor();
    /** Input type (text, email, password, etc.) */
    accessor type: string;
    /** Current input value. */
    accessor value: string;
    /** Placeholder text. */
    accessor placeholder: string;
    /** Whether the input is disabled. */
    accessor disabled: boolean;
    /** Whether the input is required. */
    accessor required: boolean;
    /** Whether the input is read-only. */
    accessor readonly: boolean;
    /** Minimum length for text inputs. */
    accessor minLength: number | undefined;
    /** Maximum length for text inputs. */
    accessor maxLength: number | undefined;
    /** Pattern for validation. */
    accessor pattern: string | undefined;
    /** Name attribute for form submission. */
    accessor name: string;
    /** Autocomplete hint for the browser. */
    accessor autocomplete: string | undefined;
    /** Whether the input should receive focus on mount. */
    accessor autofocus: boolean;
    firstUpdated(): void;
    updated(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
