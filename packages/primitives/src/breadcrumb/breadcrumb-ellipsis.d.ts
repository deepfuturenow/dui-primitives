/** Ported from original DUI: deep-future-app/app/client/components/dui/breadcrumb */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-breadcrumb-ellipsis>` — Collapsed breadcrumb indicator.
 * Defaults to "\u2026" but can be overridden via slot (e.g., an icon).
 *
 * @slot - Custom ellipsis content. Defaults to "\u2026".
 * @csspart root - The `<span>` element (presentational, aria-hidden).
 */
export declare class DuiBreadcrumbEllipsisPrimitive extends LitElement {
    static tagName: "dui-breadcrumb-ellipsis";
    static styles: any[];
    render(): TemplateResult;
}
