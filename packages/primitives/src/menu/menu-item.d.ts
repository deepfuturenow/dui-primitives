/** Ported from original DUI: deep-future-app/app/client/components/dui/menu */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-menu-item>` — An item within a `dui-menu`.
 *
 * @slot default - Item content (text, icons, etc.).
 */
export declare class DuiMenuItemPrimitive extends LitElement {
    static tagName: "dui-menu-item";
    static styles: any[];
    /** Whether the item is disabled. */
    accessor disabled: boolean;
    connectedCallback(): void;
    render(): TemplateResult;
}
