import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-progress>` — A progress bar indicating completion status.
 *
 * Set `value` to a number for determinate progress, or leave `null` for indeterminate.
 *
 * @csspart root - The outer container.
 * @csspart track - The progress track.
 * @csspart indicator - The filled indicator.
 */
export declare class DuiProgressPrimitive extends LitElement {
    #private;
    static tagName: "dui-progress";
    static styles: any[];
    accessor value: number | null;
    accessor min: number;
    accessor max: number;
    render(): TemplateResult;
}
