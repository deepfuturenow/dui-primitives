/** Ported from original DUI: deep-future-app/app/client/components/dui/collapsible */
import { LitElement, type TemplateResult } from "lit";
export declare const openChangeEvent: (detail: {
    open: boolean;
}) => CustomEvent<{
    open: boolean;
}>;
export declare class DuiCollapsiblePrimitive extends LitElement {
    #private;
    static tagName: "dui-collapsible";
    static styles: any[];
    /** Controlled open state. When set, the component is fully controlled. */
    accessor open: boolean;
    /** Uncontrolled initial open state. Only used on first render. */
    accessor defaultOpen: boolean;
    accessor disabled: boolean;
    /** Keep panel content mounted when closed. */
    accessor keepMounted: boolean;
    connectedCallback(): void;
    willUpdate(changed: Map<string, unknown>): void;
    render(): TemplateResult;
}
