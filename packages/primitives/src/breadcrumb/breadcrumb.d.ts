/** Ported from original DUI: deep-future-app/app/client/components/dui/breadcrumb */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-breadcrumb>` — Root navigation wrapper for breadcrumb trails.
 * Renders a `<nav>` with an internal `<ol>` for semantic structure.
 *
 * @slot - Breadcrumb items and separators.
 * @csspart root - The `<ol>` element.
 */
export declare class DuiBreadcrumbPrimitive extends LitElement {
    static tagName: "dui-breadcrumb";
    static styles: any[];
    render(): TemplateResult;
}
