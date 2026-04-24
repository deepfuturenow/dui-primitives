/** Ported from original DUI: deep-future-app/app/client/components/dui/command */
import { LitElement, type TemplateResult } from "lit";
import { type CommandContext } from "./command-context.ts";
export declare class DuiCommandInputPrimitive extends LitElement {
    #private;
    static tagName: "dui-command-input";
    static styles: any[];
    /** Placeholder text for the search input. */
    accessor placeholder: string;
    accessor _ctx: CommandContext;
    willUpdate(): void;
    render(): TemplateResult;
}
