/** Ported from original DUI: deep-future-app/app/client/components/dui/command */
import { css, html, LitElement } from "lit";
import { base } from "@dui/core/base";
const styles = css `
  :host {
    display: inline-flex;
    margin-left: auto;
  }
`;
export class DuiCommandShortcutPrimitive extends LitElement {
    static tagName = "dui-command-shortcut";
    static styles = [base, styles];
    render() {
        return html `<span class="Shortcut"><slot></slot></span>`;
    }
}
