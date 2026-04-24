/**
 * A reactive controller that combines portal teleportation with Floating UI
 * positioning. Creates a positioner element in the document body (or a
 * provided overlay root) so that popups escape `container-type` ancestors.
 */
import { type CSSResultOrNative, type ReactiveController, type ReactiveControllerHost, type TemplateResult } from "lit";
import type { Placement } from "@floating-ui/dom";
type PortalHost = ReactiveControllerHost & HTMLElement;
export type FloatingPortalControllerOptions = {
    /** Returns the anchor element used for positioning. */
    getAnchor: () => HTMLElement | null | undefined;
    /** Whether the popup width should match the anchor width. Default: true. */
    matchWidth?: boolean;
    /** Set popup min-width to anchor width instead of fixing width. Default: false. */
    minMatchWidth?: boolean;
    /** Floating UI placement. Default: "bottom-start". */
    placement?: Placement;
    /** Offset in px between anchor and popup. Default: 4. */
    offset?: number;
    /** Styles to apply inside the positioner's shadow root via `adoptStyles()`. */
    styles?: CSSResultOrNative[];
    /**
     * CSS selector for a container element inside the rendered popup. When set,
     * the controller automatically moves the host's `childNodes` into this
     * container when the popup opens, and moves them back on teardown.
     */
    contentContainer?: string;
    /**
     * CSS selector to filter which host children get moved. When set, only
     * matching direct children (via `:scope > selector`) are moved. When unset,
     * all `childNodes` are moved. Only used when `contentContainer` is set.
     */
    contentSelector?: string;
    /** Called after the popup opens (animation started). */
    onOpen?: () => void;
    /** Called after the popup finishes closing (animation done). */
    onClose?: () => void;
    /**
     * Called after each Floating UI reposition so the consumer can react
     * to placement changes (e.g. update data-side attributes).
     */
    onPosition?: (result: {
        x: number;
        y: number;
        placement: Placement;
    }) => void;
    /**
     * Optional render callback invoked after each host update while the popup
     * is open (or closing).
     */
    renderPopup?: (portal: FloatingPortalController) => TemplateResult;
    /**
     * CSS custom property names to forward from the host's computed style
     * to the portal positioner. Portal elements live under `<body>` and
     * don't inherit properties from the original DOM tree, so any theme
     * tokens that consumers can override must be listed here.
     */
    forwardProperties?: string[];
    /**
     * Returns the overlay root element where the positioner is appended.
     * Defaults to `document.body`.
     */
    getOverlayRoot?: () => HTMLElement;
    /**
     * When set, positions the popup so the returned inner element aligns
     * with the anchor (macOS-style select). Falls back to normal
     * positioning when the callback returns null.
     */
    alignToInner?: () => HTMLElement | null;
    /**
     * Returns a sub-element inside the anchor to align against (e.g. the
     * text span). When set, inner alignment targets this element's vertical
     * center instead of the full anchor rect.
     */
    alignToInnerReference?: () => HTMLElement | null;
};
export declare class FloatingPortalController implements ReactiveController {
    #private;
    get isOpen(): boolean;
    get isAnimating(): boolean;
    get isStarting(): boolean;
    get isEnding(): boolean;
    get positionerElement(): HTMLDivElement | null;
    get renderRoot(): ShadowRoot | HTMLDivElement | null;
    set placement(value: Placement);
    set offset(value: number);
    constructor(host: PortalHost, options: FloatingPortalControllerOptions);
    hostConnected(): void;
    hostDisconnected(): void;
    hostUpdated(): void;
    open(): void;
    close(): void;
}
export {};
