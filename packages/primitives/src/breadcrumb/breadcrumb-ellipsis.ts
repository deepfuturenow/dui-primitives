/** Ported from original DUI: deep-future-app/app/client/components/dui/breadcrumb */

import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "../core/base.ts";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  [part="root"] {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/**
 * `<dui-breadcrumb-ellipsis>` — Collapsed breadcrumb indicator.
 * Defaults to "\u2026" but can be overridden via slot (e.g., an icon).
 *
 * @slot - Custom ellipsis content. Defaults to "\u2026".
 * @csspart root - The `<span>` element (presentational, aria-hidden).
 */
export class DuiBreadcrumbEllipsisPrimitive extends LitElement {
  static tagName = "dui-breadcrumb-ellipsis" as const;

  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`
      <span
        role="presentation"
        aria-hidden="true"
        part="root"
      >
        <slot>&hellip;</slot>
      </span>
    `;
  }
}
