/** Ported from original DUI: deep-future-app/app/client/components/dui/breadcrumb */

import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "../core/base.ts";

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
 * `<dui-breadcrumb-item>` — List item wrapper for a single breadcrumb entry.
 *
 * @slot - A breadcrumb link, page, or ellipsis.
 * @csspart root - The `<li>` element.
 */
export class DuiBreadcrumbItemPrimitive extends LitElement {
  static tagName = "dui-breadcrumb-item" as const;

  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`
      <li part="root">
        <slot></slot>
      </li>
    `;
  }
}
