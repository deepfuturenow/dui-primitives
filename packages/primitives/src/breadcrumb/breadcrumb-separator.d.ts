/** Ported from original DUI: deep-future-app/app/client/components/dui/breadcrumb */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-breadcrumb-separator>` — Visual separator between breadcrumb items.
 * Defaults to "/" but can be overridden via slot (e.g., a chevron icon).
 *
 * @slot - Custom separator content. Defaults to "/".
 * @csspart root - The `<li>` element (presentational, aria-hidden).
 */
export declare class DuiBreadcrumbSeparatorPrimitive extends LitElement {
    static tagName: "dui-breadcrumb-separator";
    static styles: any[];
    render(): TemplateResult;
}
