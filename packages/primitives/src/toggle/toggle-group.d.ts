import { LitElement, type TemplateResult } from "lit";
import { type ToggleGroupContext } from "./toggle-group-context.ts";
export declare const valueChangeEvent: (detail: {
    value: string[];
}) => CustomEvent<{
    value: string[];
}>;
/**
 * `<dui-toggle-group>` — Groups toggle buttons with shared single/multi selection.
 *
 * @slot - `dui-toggle` children.
 * @csspart root - The group container.
 * @fires value-change - Fired when selection changes. Detail: { value: string[] }
 */
export declare class DuiToggleGroupPrimitive extends LitElement {
    #private;
    static tagName: "dui-toggle-group";
    static styles: any[];
    accessor value: string[] | undefined;
    accessor defaultValue: string[];
    accessor type: "single" | "multiple";
    accessor orientation: "horizontal" | "vertical";
    accessor disabled: boolean;
    accessor loop: boolean;
    accessor _ctx: ToggleGroupContext;
    connectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
