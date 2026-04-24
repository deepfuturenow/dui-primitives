/** Ported from original DUI: deep-future-app/app/client/components/dui/breadcrumb */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-breadcrumb-page>` — Current page indicator (not clickable).
 *
 * @slot - The current page label text.
 * @csspart root - The `<span>` element with `aria-current="page"`.
 */
export declare class DuiBreadcrumbPagePrimitive extends LitElement {
    static tagName: "dui-breadcrumb-page";
    static styles: any[];
    render(): TemplateResult;
}
