/** Ported from original DUI: deep-future-app/app/client/components/dui/breadcrumb */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-breadcrumb-link>` — Styled wrapper for a clickable breadcrumb link.
 * Consumer slots in their own `<a>` element.
 *
 * @slot - An `<a>` element for navigation.
 * @csspart root - The wrapper `<span>` element.
 */
export declare class DuiBreadcrumbLinkPrimitive extends LitElement {
    static tagName: "dui-breadcrumb-link";
    static styles: any[];
    render(): TemplateResult;
}
