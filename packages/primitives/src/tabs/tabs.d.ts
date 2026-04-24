/** Ported from original DUI: deep-future-app/app/client/components/dui/tabs */
import { LitElement, type TemplateResult } from "lit";
import { type TabsContext } from "./tabs-context.ts";
export declare const valueChangeEvent: (detail: string) => CustomEvent<string>;
/**
 * A tabbed interface component with animated indicator and keyboard navigation.
 */
export declare class DuiTabsPrimitive extends LitElement {
    #private;
    static tagName: "dui-tabs";
    static styles: any[];
    /** Controlled active tab value. */
    accessor value: string | undefined;
    /** Initial active tab value (uncontrolled mode). */
    accessor defaultValue: string | undefined;
    /** Layout orientation. */
    accessor orientation: "horizontal" | "vertical";
    /** Whether tab list appears above or below content. */
    accessor controls: "header" | "footer";
    accessor _ctx: TabsContext;
    connectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
