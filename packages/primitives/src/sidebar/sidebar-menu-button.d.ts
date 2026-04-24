/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-sidebar-menu-button>` — Interactive button or link within a sidebar menu.
 *
 * Renders as a `<button>` by default, or an `<a>` when `href` is set.
 * Supports icon-collapsed mode where only the icon is visible, with an
 * optional tooltip.
 *
 * @slot icon - Icon slot, shown before the label.
 * @slot - Default slot for label text.
 * @slot suffix - Suffix slot, shown after the label.
 * @fires spa-navigate - Fired on normal link clicks. Detail: { href: string }
 */
export declare class DuiSidebarMenuButtonPrimitive extends LitElement {
    #private;
    static tagName: "dui-sidebar-menu-button";
    static styles: any[];
    /** Whether the button is in active/selected state. */
    accessor active: boolean;
    /** Whether the button is disabled. */
    accessor disabled: boolean;
    /** Tooltip text shown when sidebar is icon-collapsed. */
    accessor tooltip: string;
    /** When set, renders as an anchor tag instead of a button. */
    accessor href: string | undefined;
    render(): TemplateResult;
}
