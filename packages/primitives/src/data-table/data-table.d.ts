/** Ported from original DUI: deep-future-app/app/client/components/dui/data-table */
import { LitElement, type PropertyValues, type TemplateResult } from "lit";
export type ColumnDef<T> = {
    /** Unique key identifying the column (usually a key of T). */
    key: string;
    /** Column header label. */
    header: string;
    /** Whether this column is sortable. */
    sortable?: boolean;
    /** Fixed column width (CSS value). */
    width?: string;
    /** Custom render function for cell content. */
    render?: (value: unknown, row: T) => TemplateResult | string | number;
};
export type SortDirection = "asc" | "desc";
export type SortState = {
    column: string;
    direction: SortDirection;
} | null;
export type PageState = {
    page: number;
    pageSize: number;
    totalRows: number;
    totalPages: number;
};
export declare const sortChangeEvent: (detail: {
    column: string;
    direction: SortDirection;
}) => CustomEvent<{
    column: string;
    direction: SortDirection;
}>;
export declare const pageChangeEvent: (detail: PageState) => CustomEvent<PageState>;
/**
 * `<dui-data-table>` — A sortable, paginated data table.
 *
 * Accepts column definitions and row data, with optional sorting and
 * pagination. Cells can be customized via column `render` functions.
 *
 * @fires sort-change - Fired when a sortable column header is clicked. Detail: SortState
 * @fires page-change - Fired when the page changes. Detail: PageState
 */
export declare class DuiDataTablePrimitive<T extends Record<string, unknown> = Record<string, unknown>> extends LitElement {
    #private;
    static tagName: "dui-data-table";
    static styles: any[];
    /** Column definitions describing each visible column. */
    accessor columns: ColumnDef<T>[];
    /** The full data array. Sorting and pagination are applied internally. */
    accessor data: T[];
    /** Number of rows per page. Set to 0 to disable pagination. */
    accessor pageSize: number;
    /** Key function to derive a unique identifier from each row. */
    accessor rowKey: ((row: T) => string) | undefined;
    /** Text shown when the data array is empty. */
    accessor emptyText: string;
    willUpdate(changed: PropertyValues): void;
    render(): TemplateResult;
}
