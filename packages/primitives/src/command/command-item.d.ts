/** Ported from original DUI: deep-future-app/app/client/components/dui/command */
import { LitElement, type TemplateResult } from "lit";
import { type CommandContext } from "./command-context.ts";
export declare class DuiCommandItemPrimitive extends LitElement {
    #private;
    static tagName: "dui-command-item";
    static styles: any[];
    /** The value this item represents. */
    accessor value: string;
    /** Additional search keywords. */
    accessor keywords: string[];
    /** Whether this item is disabled. */
    accessor disabled: boolean;
    accessor _ctx: CommandContext;
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(): void;
    updated(): void;
    render(): TemplateResult;
}
