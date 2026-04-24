/** Ported from original DUI: deep-future-app/app/client/components/dui/scroll-area */
import { LitElement, type PropertyValues, type TemplateResult } from "lit";
type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
/**
 * `<dui-scroll-area>` — A scroll container with custom styled scrollbar.
 *
 * Hides the native scrollbar and renders a custom track + thumb with
 * auto-hide behavior. Supports vertical, horizontal, or both orientations.
 *
 * @slot - Default slot for scrollable content.
 *
 * @cssprop [--scroll-area-max-height] - Max-height constraint.
 * @cssprop [--scroll-area-thumb-color] - Scrollbar thumb color.
 * @cssprop [--scroll-fade-size] - Distance over which the top fade goes from transparent to opaque (default: 1.5rem).
 */
export declare class DuiScrollAreaPrimitive extends LitElement {
    #private;
    static tagName: "dui-scroll-area";
    static styles: any[];
    /** Scroll direction(s). */
    accessor orientation: ScrollAreaOrientation;
    /** Show a fade overlay at the top when scrolled. */
    accessor fade: boolean;
    /** Optional max-height constraint (CSS value). */
    accessor maxHeight: string | undefined;
    protected willUpdate(changed: PropertyValues): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(): void;
    /** Scroll the viewport to the bottom. */
    scrollToBottom(): Promise<void>;
    /** Whether the viewport is scrolled to the top. */
    get isAtTop(): boolean;
    /** Whether the viewport is scrolled to the bottom. */
    get isAtBottom(): boolean;
    render(): TemplateResult;
}
export {};
