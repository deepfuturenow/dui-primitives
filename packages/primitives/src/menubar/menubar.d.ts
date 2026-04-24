import { LitElement, type TemplateResult } from "lit";
import { type MenubarContext } from "./menubar-context.ts";
/**
 * `<dui-menubar>` — A horizontal bar of menus with coordinated open/close.
 *
 * Contains `<dui-menu>` children. When one menu is open, hovering another
 * menu trigger opens it and closes the previous one.
 *
 * @slot - `dui-menu` children.
 * @csspart root - The menubar container.
 */
export declare class DuiMenubarPrimitive extends LitElement {
    #private;
    static tagName: "dui-menubar";
    static styles: any[];
    accessor loop: boolean;
    accessor orientation: "horizontal" | "vertical";
    accessor _ctx: MenubarContext;
    willUpdate(): void;
    render(): TemplateResult;
}
