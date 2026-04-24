import { LitElement, type TemplateResult } from "lit";
/** Fired when the action (left) button is clicked. */
export declare const actionEvent: (detail: {}) => CustomEvent<{}>;
/**
 * `<dui-split-button>` — A button with an attached dropdown menu trigger.
 *
 * The action zone (left) performs a primary action. The menu trigger (right)
 * opens a dropdown of `dui-menu-item` children for secondary actions.
 *
 * @slot - Action button label / content.
 * @slot icon - Custom icon for the dropdown trigger (defaults to chevron-down).
 * @slot menu - `dui-menu-item` elements rendered inside the dropdown popup.
 * @csspart root - The outer container wrapping both zones.
 * @csspart action - The left action button element.
 * @csspart divider - The vertical separator between action and trigger.
 * @csspart trigger - The right dropdown trigger button element.
 * @fires dui-action - Fired when the action button is clicked. Detail: {}
 */
export declare class DuiSplitButtonPrimitive extends LitElement {
    #private;
    static tagName: "dui-split-button";
    static styles: any[];
    /** Visual variant — mapped to theme styles (e.g. neutral, primary, danger). */
    accessor variant: string;
    /** Visual appearance — mapped to theme styles (e.g. filled, outline, ghost). */
    accessor appearance: string;
    /** Size — mapped to theme styles (e.g. xs, sm, md, lg). */
    accessor size: string;
    /** Sets `min-width` on the popup panel (e.g. `"200px"`). Defaults to `"var(--space-28)"`. */
    accessor popupMinWidth: string;
    /** Whether the entire split button is disabled. */
    accessor disabled: boolean;
    protected updated(): void;
    render(): TemplateResult;
}
