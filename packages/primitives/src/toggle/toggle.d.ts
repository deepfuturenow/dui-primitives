import { LitElement, type TemplateResult } from "lit";
import { type ToggleGroupContext } from "./toggle-group-context.ts";
export declare const pressedChangeEvent: (detail: {
    pressed: boolean;
}) => CustomEvent<{
    pressed: boolean;
}>;
/**
 * `<dui-toggle>` — A two-state toggle button. Works standalone or inside a toggle group.
 *
 * @slot - Toggle content (text and/or icons).
 * @slot icon - Optional leading icon.
 * @csspart root - The button element.
 * @fires pressed-change - Fired when toggled. Detail: { pressed: boolean }
 */
export declare class DuiTogglePrimitive extends LitElement {
    #private;
    static tagName: "dui-toggle";
    static shadowRootOptions: ShadowRootInit;
    static styles: any[];
    accessor pressed: boolean | undefined;
    accessor defaultPressed: boolean;
    accessor disabled: boolean;
    accessor value: string | undefined;
    accessor _groupCtx: ToggleGroupContext;
    connectedCallback(): void;
    render(): TemplateResult;
}
