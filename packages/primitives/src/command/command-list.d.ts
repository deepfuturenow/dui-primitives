/** Ported from original DUI: deep-future-app/app/client/components/dui/command */
import { LitElement, type TemplateResult } from "lit";
import { type CommandContext } from "./command-context.ts";
export declare class DuiCommandListPrimitive extends LitElement {
    static tagName: "dui-command-list";
    static styles: any[];
    accessor _ctx: CommandContext;
    render(): TemplateResult;
}
