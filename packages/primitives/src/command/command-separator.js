/** Ported from original DUI: deep-future-app/app/client/components/dui/command */
import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
const styles = css `
  :host {
    display: block;
  }
`;
export class DuiCommandSeparatorPrimitive extends LitElement {
    static tagName = "dui-command-separator";
    static styles = [base, styles];
    render() {
        return html `<div class="Separator" role="separator"></div>`;
    }
}
