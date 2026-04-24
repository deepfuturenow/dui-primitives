import { LitElement } from "lit";
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
export declare class DuiIconPrimitive extends LitElement {
    static tagName: "dui-icon";
    static styles: any[];
    render(): any;
}
