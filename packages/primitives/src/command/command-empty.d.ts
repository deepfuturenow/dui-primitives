/** Ported from original DUI: deep-future-app/app/client/components/dui/command */
import { LitElement, type TemplateResult } from "lit";
import { type CommandContext } from "./command-context.ts";
export declare class DuiCommandEmptyPrimitive extends LitElement {
    static tagName: "dui-command-empty";
    static styles: any[];
    accessor _ctx: CommandContext;
    willUpdate(): void;
    render(): TemplateResult;
}
