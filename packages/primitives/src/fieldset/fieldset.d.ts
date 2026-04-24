import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-fieldset>` — Semantic grouping for related form fields.
 *
 * Wraps content in a native `<fieldset>` element, providing semantic
 * grouping for radio groups, checkbox groups, or logical field clusters.
 *
 * @slot legend - Legend text (e.g. `<span slot="legend">Personal Info</span>`).
 * @slot - Default slot for field children.
 * @csspart root - The native `<fieldset>` element.
 * @csspart legend - The native `<legend>` element.
 */
export declare class DuiFieldsetPrimitive extends LitElement {
    #private;
    static tagName: "dui-fieldset";
    static styles: any[];
    /** Disables all child form controls. */
    accessor disabled: boolean;
    render(): TemplateResult;
}
