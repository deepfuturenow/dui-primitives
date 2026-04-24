/**
 * Shared utilities for floating popup components (popover, tooltip).
 * Provides animation lifecycle helpers, arrow rendering, and a centralized
 * Floating UI positioning wrapper.
 */
import { type TemplateResult } from "lit";
import { type Middleware, type Placement } from "@floating-ui/dom";
export type FloatingPopupSide = "top" | "bottom";
/** Double-rAF to ensure CSS starting-style is applied then removed. */
export declare const waitForAnimationFrame: () => Promise<void>;
/** Listen for transitionend with a fallback timeout. Guards against double-fire. */
export declare const onTransitionEnd: (el: Element, callback: () => void, fallbackMs?: number) => void;
/** Render an arrow SVG pointing at the trigger. */
export declare const renderArrow: (side: FloatingPopupSide) => TemplateResult;
export type AlignInnerOptions = {
    /** Returns the inner element to align with the reference. null = use normal positioning. */
    getElement: () => HTMLElement | null;
    /**
     * Returns a sub-element inside the reference to align against.
     * When set, the middleware aligns the vertical center of `getElement()`
     * with this element's vertical center instead of the full reference rect.
     * Use this to align text-to-text (e.g. `.ItemText` ↔ `.Value`).
     */
    getReferenceInner?: () => HTMLElement | null;
    /** Minimum px from viewport edge. Default: 8. */
    padding?: number;
};
/**
 * Custom Floating UI middleware that positions the floating element so a
 * specific inner element (e.g. the selected option) vertically aligns with
 * the reference element (e.g. the trigger). This is the macOS-style select
 * pattern. Equivalent to `@floating-ui/react`'s `inner()` middleware.
 *
 * When `getElement()` returns null, the middleware is a no-op and normal
 * positioning (offset/flip/shift) takes over.
 */
export declare const alignInner: (options: AlignInnerOptions) => Middleware;
export type ComputeFixedPositionOptions = {
    placement?: Placement;
    offsetPx?: number;
    matchWidth?: boolean;
    /** Set `min-width` to the anchor width instead of fixing `width`. */
    minMatchWidth?: boolean;
    padding?: number;
    /** When set, uses inner-alignment positioning instead of offset/flip/shift. */
    alignToInner?: AlignInnerOptions;
};
/**
 * Compute a fixed-strategy position using Floating UI with the viewport
 * override baked in.
 */
export declare const computeFixedPosition: (anchor: HTMLElement, floating: HTMLElement, options?: ComputeFixedPositionOptions) => Promise<{
    x: number;
    y: number;
    placement: Placement;
}>;
/**
 * Start Floating UI `autoUpdate` + `computeFixedPosition` in one call.
 * Returns a cleanup function to stop tracking.
 */
export declare const startFixedAutoUpdate: (anchor: HTMLElement, floating: HTMLElement, options?: ComputeFixedPositionOptions & {
    onPosition?: (result: {
        x: number;
        y: number;
        placement: Placement;
    }) => void;
}) => (() => void);
