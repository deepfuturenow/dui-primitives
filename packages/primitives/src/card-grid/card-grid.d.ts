import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-card-grid>` — A responsive grid layout for cards and panels.
 *
 * Distributes children into equal-width columns that collapse at narrow
 * container widths. Use `columns` to set the maximum column count.
 *
 * @slot - Grid children (cards, panels, or any block content).
 * @csspart root - The grid container element.
 */
export declare class DuiCardGridPrimitive extends LitElement {
    static tagName: "dui-card-grid";
    static styles: any[];
    /** Maximum number of columns (1–4). Responsive breakpoints reduce this automatically. */
    accessor columns: string;
    render(): TemplateResult;
}
