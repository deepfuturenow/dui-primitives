/** Ported from original DUI: deep-future-app/app/client/components/dui/trunc */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { base } from "@dui/core/base";

const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    overflow: hidden;
  }

  :host(:not([max-lines])) [part="root"] {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :host([max-lines]) [part="root"] {
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
`;

/**
 * Text truncation with ellipsis.
 *
 * By default, truncates to a single line using `max-width` (default `20rem`).
 * Set `max-lines` to clamp to N visible lines instead.
 * Both attributes can be combined: `max-width` constrains inline size,
 * `max-lines` constrains block size.
 */
export class DuiTruncPrimitive extends LitElement {
  static tagName = "dui-trunc" as const;
  static override styles = [base, styles];

  /** Maximum inline size before single-line truncation kicks in. */
  @property({ attribute: "max-width" })
  accessor maxWidth = "20rem";

  /** Maximum number of visible lines before clamping. */
  @property({ attribute: "max-lines", type: Number, reflect: true })
  accessor maxLines: number | undefined;

  override render(): TemplateResult {
    const clamp =
      this.maxLines !== undefined
        ? Math.max(1, this.maxLines).toString()
        : undefined;

    const dynamicStyles = styleMap({
      "max-width": this.maxWidth,
      "-webkit-line-clamp": clamp,
      "line-clamp": clamp,
    });

    return html`<div part="root" style=${dynamicStyles}><slot></slot></div>`;
  }
}
