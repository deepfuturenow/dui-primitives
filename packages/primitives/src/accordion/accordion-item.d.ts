/** Ported from original DUI: deep-future-app/app/client/components/dui/accordion */
import { LitElement, type TemplateResult } from "lit";
import { type AccordionContext } from "./accordion-context.ts";
export declare const openChangeEvent: (detail: {
    value: string;
    open: boolean;
}) => CustomEvent<{
    value: string;
    open: boolean;
}>;
export declare class DuiAccordionItemPrimitive extends LitElement {
    #private;
    static tagName: "dui-accordion-item";
    static styles: any[];
    accessor value: string;
    accessor disabled: boolean;
    accessor _ctx: AccordionContext;
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
