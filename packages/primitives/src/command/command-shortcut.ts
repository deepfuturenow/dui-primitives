/** Ported from original DUI: deep-future-app/app/client/components/dui/command */

import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "@dui/core/base";

const styles = css`
  :host {
    display: inline-flex;
    margin-left: auto;
  }
`;

export class DuiCommandShortcutPrimitive extends LitElement {
  static tagName = "dui-command-shortcut" as const;
  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`<span class="Shortcut"><slot></slot></span>`;
  }
}
