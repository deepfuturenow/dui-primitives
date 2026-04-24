import { css, html, LitElement } from "lit";
import { base } from "../core/base.ts";

const styles = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--icon-size, 1em);
    height: var(--icon-size, 1em);
    color: var(--icon-color, currentColor);
  }

  ::slotted(svg) {
    width: 100%;
    height: 100%;
  }
`;

/**
 * `<dui-icon>` — Slot-based SVG icon container.
 *
 * Consumers provide their own SVG via the default slot. The icon inherits
 * `currentColor` and sizes itself via `--icon-size`.
 *
 * @slot - SVG element to display.
 * @cssprop [--icon-size=1em] - Icon dimensions.
 * @cssprop [--icon-color=currentColor] - Icon color.
 */
export class DuiIconPrimitive extends LitElement {
  static tagName = "dui-icon" as const;
  static override styles = [base, styles];

  override render() {
    return html`<slot></slot>`;
  }
}
