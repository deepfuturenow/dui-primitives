/** Ported from original DUI: deep-future-app/app/client/components/dui/menu */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-menu>` — A popup menu triggered by a slotted element.
 *
 * @slot trigger - The element that opens the menu on click.
 * @slot default - `dui-menu-item` children rendered inside the popup.
 */
export declare class DuiMenuPrimitive extends LitElement {
    #private;
    static tagName: "dui-menu";
    static styles: any[];
    /** Sets `min-width` on the popup panel (e.g. `"200px"`). Defaults to `"var(--space-28)".` */
    accessor popupMinWidth: string;
    protected updated(): void;
    render(): TemplateResult;
}
