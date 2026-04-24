/** Ported from original DUI: deep-future-app/app/client/components/dui/radio */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-radio>` — A radio button input.
 *
 * Must be used within a `<dui-radio-group>`. Only one radio can be
 * selected at a time within a group.
 *
 * @slot - Label content.
 * @csspart root - The radio container.
 * @csspart indicator - The selected state indicator.
 * @cssprop --radio-size - Size of the radio button.
 */
export declare class DuiRadioPrimitive extends LitElement {
    #private;
    static tagName: "dui-radio";
    static formAssociated: boolean;
    static styles: any[];
    constructor();
    /** The value attribute for this radio option. */
    accessor value: string;
    /** Whether the radio is disabled. */
    accessor disabled: boolean;
    /** Whether the radio is read-only. */
    accessor readOnly: boolean;
    connectedCallback(): void;
    willUpdate(): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
}
