/** Ported from original DUI: deep-future-app/app/client/components/dui/tabs */
import { LitElement, type TemplateResult } from "lit";
import { type TabsContext } from "./tabs-context.ts";
/**
 * Container for tab triggers. Manages indicator positioning via CSS custom properties.
 */
export declare class DuiTabsListPrimitive extends LitElement {
    #private;
    static tagName: "dui-tabs-list";
    static styles: any[];
    accessor _ctx: TabsContext;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(): void;
    protected updated(): void;
    render(): TemplateResult;
}
