import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-separator>` — A visual divider between content sections.
 *
 * @csspart root - The separator element.
 */
export declare class DuiSeparatorPrimitive extends LitElement {
    static tagName: "dui-separator";
    static styles: any[];
    accessor orientation: "horizontal" | "vertical";
    render(): TemplateResult;
}
