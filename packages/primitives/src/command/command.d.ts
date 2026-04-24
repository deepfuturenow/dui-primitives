/** Ported from original DUI: deep-future-app/app/client/components/dui/command */
import { LitElement, type TemplateResult } from "lit";
import { type CommandContext } from "./command-context.ts";
export type FilterFn = (value: string, search: string, keywords?: readonly string[]) => number;
export declare const selectEvent: (detail: string) => CustomEvent<string>;
export declare const searchChangeEvent: (detail: string) => CustomEvent<string>;
export declare const escapeEvent: (detail: void) => CustomEvent<void>;
export declare class DuiCommandPrimitive extends LitElement {
    #private;
    static tagName: "dui-command";
    static styles: any[];
    /** Whether keyboard navigation wraps from last to first and vice versa. */
    accessor loop: boolean;
    /** Whether items should be filtered based on search text. */
    accessor shouldFilter: boolean;
    /** Controlled value — the currently selected item value. */
    accessor value: string | undefined;
    /** Custom filter function. */
    accessor filter: FilterFn | undefined;
    accessor _ctx: CommandContext;
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
