/** Ported from original DUI: deep-future-app/app/client/components/dui/breadcrumb */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-breadcrumb-item>` — List item wrapper for a single breadcrumb entry.
 *
 * @slot - A breadcrumb link, page, or ellipsis.
 * @csspart root - The `<li>` element.
 */
export declare class DuiBreadcrumbItemPrimitive extends LitElement {
    static tagName: "dui-breadcrumb-item";
    static styles: any[];
    render(): TemplateResult;
}
