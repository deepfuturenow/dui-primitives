/** Ported from original DUI: deep-future-app/app/client/components/dui/command */
import { LitElement, type TemplateResult } from "lit";
import { type CommandContext } from "./command-context.ts";
export declare class DuiCommandGroupPrimitive extends LitElement {
    #private;
    static tagName: "dui-command-group";
    static styles: any[];
    /** Heading text for this group. */
    accessor heading: string;
    accessor _ctx: CommandContext;
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
