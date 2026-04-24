/** Ported from original DUI: deep-future-app/app/client/components/dui/breadcrumb */

import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "@dui/core/base";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: flex;
  }

  [part="root"] {
    display: flex;
    align-items: center;
  }
`;

/**
 * `<dui-breadcrumb-separator>` — Visual separator between breadcrumb items.
 * Defaults to "/" but can be overridden via slot (e.g., a chevron icon).
 *
 * @slot - Custom separator content. Defaults to "/".
 * @csspart root - The `<li>` element (presentational, aria-hidden).
 */
export class DuiBreadcrumbSeparatorPrimitive extends LitElement {
  static tagName = "dui-breadcrumb-separator" as const;

  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`
      <li
        role="presentation"
        aria-hidden="true"
        part="root"
      >
        <slot>/</slot>
      </li>
    `;
  }
}
