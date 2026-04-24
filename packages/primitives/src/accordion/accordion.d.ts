/** Ported from original DUI: deep-future-app/app/client/components/dui/accordion */
import { LitElement, type TemplateResult } from "lit";
import { type AccordionContext } from "./accordion-context.ts";
export declare const valueChangeEvent: (detail: string[]) => CustomEvent<string[]>;
export declare class DuiAccordionPrimitive extends LitElement {
    #private;
    static tagName: "dui-accordion";
    static styles: any[];
    accessor value: string[] | undefined;
    accessor defaultValue: string[];
    accessor disabled: boolean;
    accessor multiple: boolean;
    accessor loopFocus: boolean;
    accessor orientation: "vertical" | "horizontal";
    accessor keepMounted: boolean;
    accessor _ctx: AccordionContext;
    connectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
