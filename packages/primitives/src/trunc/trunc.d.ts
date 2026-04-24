/** Ported from original DUI: deep-future-app/app/client/components/dui/trunc */
import { LitElement, type TemplateResult } from "lit";
/**
 * Text truncation with ellipsis.
 *
 * By default, truncates to a single line using `max-width` (default `20rem`).
 * Set `max-lines` to clamp to N visible lines instead.
 * Both attributes can be combined: `max-width` constrains inline size,
 * `max-lines` constrains block size.
 */
export declare class DuiTruncPrimitive extends LitElement {
    static tagName: "dui-trunc";
    static styles: any[];
    /** Maximum inline size before single-line truncation kicks in. */
    accessor maxWidth: string;
    /** Maximum number of visible lines before clamping. */
    accessor maxLines: number | undefined;
    render(): TemplateResult;
}
