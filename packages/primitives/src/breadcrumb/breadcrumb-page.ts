/** Ported from original DUI: deep-future-app/app/client/components/dui/breadcrumb */

import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "@dui/core/base";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: inline-flex;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
  }
`;

/**
 * `<dui-breadcrumb-page>` — Current page indicator (not clickable).
 *
 * @slot - The current page label text.
 * @csspart root - The `<span>` element with `aria-current="page"`.
 */
export class DuiBreadcrumbPagePrimitive extends LitElement {
  static tagName = "dui-breadcrumb-page" as const;

  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`
      <span
        role="link"
        aria-disabled="true"
        aria-current="page"
        part="root"
      >
        <slot></slot>
      </span>
    `;
  }
}
