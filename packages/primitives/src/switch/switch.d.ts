import { LitElement, type TemplateResult } from "lit";
export declare const checkedChangeEvent: (detail: {
    checked: boolean;
}) => CustomEvent<{
    checked: boolean;
}>;
/**
 * `<dui-switch>` — A toggle switch for binary on/off settings.
 *
 * @csspart root - The switch track container.
 * @csspart thumb - The movable thumb indicator.
 * @fires checked-change - Fired when toggled. Detail: { checked: boolean }
 */
export declare class DuiSwitchPrimitive extends LitElement {
    #private;
    static tagName: "dui-switch";
    static formAssociated: boolean;
    static styles: any[];
    constructor();
    accessor checked: boolean | undefined;
    accessor defaultChecked: boolean;
    accessor disabled: boolean;
    accessor readOnly: boolean;
    accessor required: boolean;
    accessor name: string | undefined;
    accessor value: string;
    accessor uncheckedValue: string;
    connectedCallback(): void;
    willUpdate(): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
}
