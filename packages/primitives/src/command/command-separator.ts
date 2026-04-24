/** Ported from original DUI: deep-future-app/app/client/components/dui/command */

import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "@dui/core/base";

const styles = css`
  :host {
    display: block;
  }
`;

export class DuiCommandSeparatorPrimitive extends LitElement {
  static tagName = "dui-command-separator" as const;
  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`<div class="Separator" role="separator"></div>`;
  }
}
