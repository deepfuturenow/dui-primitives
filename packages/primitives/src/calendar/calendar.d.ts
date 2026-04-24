import { LitElement, type TemplateResult } from "lit";
export declare const valueChangeEvent: (detail: {
    value: string;
}) => CustomEvent<{
    value: string;
}>;
/**
 * `<dui-calendar>` — A date picker calendar grid.
 *
 * @csspart root - The outer container.
 * @csspart header - Month navigation header.
 * @csspart heading - The month/year heading text.
 * @csspart prev - Previous month button.
 * @csspart next - Next month button.
 * @csspart grid - The day grid container.
 * @csspart weekday - Weekday column header.
 * @csspart day - Individual day button.
 * @fires value-change - Fired when a date is selected. Detail: { value: string }
 */
export declare class DuiCalendarPrimitive extends LitElement {
    #private;
    static tagName: "dui-calendar";
    static styles: any[];
    accessor value: string | undefined;
    accessor defaultValue: string | undefined;
    accessor min: string | undefined;
    accessor max: string | undefined;
    accessor locale: string;
    accessor disabled: boolean;
    accessor readOnly: boolean;
    connectedCallback(): void;
    render(): TemplateResult;
}
