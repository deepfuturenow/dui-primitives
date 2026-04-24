import { LitElement, type TemplateResult } from "lit";
/** Fired when a button with `href` is clicked via normal (non-modifier) click. */
export declare const navigateEvent: (detail: {
    href: string;
}) => CustomEvent<{
    href: string;
}>;
/**
 * `<dui-button>` — A button component.
 *
 * Renders as a native `<button>` by default. When `href` is set, renders as a
 * native `<a>` tag instead. Normal clicks fire a `dui-navigate` event that
 * consumers handle for SPA routing.
 *
 * @slot - Button label / content.
 * @csspart root - The button or anchor element.
 * @fires dui-navigate - Fired on normal link clicks. Detail: { href: string }
 */
export declare class DuiButtonPrimitive extends LitElement {
    #private;
    static tagName: "dui-button";
    static shadowRootOptions: any;
    static styles: any[];
    accessor disabled: boolean;
    accessor focusableWhenDisabled: boolean;
    accessor type: "button" | "submit" | "reset";
    accessor href: string | undefined;
    render(): TemplateResult;
}
