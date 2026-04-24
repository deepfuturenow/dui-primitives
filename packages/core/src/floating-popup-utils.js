/**
 * Shared utilities for floating popup components (popover, tooltip).
 * Provides animation lifecycle helpers, arrow rendering, and a centralized
 * Floating UI positioning wrapper.
 */
import { html } from "lit";
import { autoUpdate, computePosition, flip, offset, platform, shift, size, } from "@floating-ui/dom";
/** Double-rAF to ensure CSS starting-style is applied then removed. */
export const waitForAnimationFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
/** Listen for transitionend with a fallback timeout. Guards against double-fire. */
export const onTransitionEnd = (el, callback, fallbackMs = 200) => {
    let called = false;
    const done = () => {
        if (called)
            return;
        called = true;
        el.removeEventListener("transitionend", onEnd);
        clearTimeout(timer);
        callback();
    };
    const onEnd = () => done();
    el.addEventListener("transitionend", onEnd);
    const timer = setTimeout(done, fallbackMs);
};
/** Render an arrow SVG pointing at the trigger. */
export const renderArrow = (side) => html `
  <svg class="Arrow" part="arrow" viewBox="0 0 10 6" data-side="${side}">
    <polygon class="arrow-fill" points="0,0 5,6 10,0" />
    <path class="arrow-stroke" d="M 0,0 L 5,6 L 10,0" />
  </svg>
`;
// ---------------------------------------------------------------------------
// Centralized Floating UI positioning
// ---------------------------------------------------------------------------
/**
 * Shared platform override that forces Floating UI to resolve offsets relative
 * to the viewport. Without this, popups inside `container-type: size` ancestors
 * compute incorrect positions because the container becomes the offset parent.
 */
const fixedPlatform = {
    ...platform,
    getOffsetParent: () => window,
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
export const alignInner = (options) => ({
    name: "alignInner",
    fn(state) {
        const innerEl = options.getElement();
        if (!innerEl)
            return {};
        const padding = options.padding ?? 8;
        const { rects } = state;
        const floatingEl = state.elements.floating;
        const floatingRect = floatingEl.getBoundingClientRect();
        const innerRect = innerEl.getBoundingClientRect();
        // How far the inner element's vertical center is from the floating top
        const innerOffsetY = (innerRect.top - floatingRect.top)
            + innerRect.height / 2;
        // Determine the target Y center to align against. If a reference inner
        // element is provided, use its center (text-to-text alignment).
        // Otherwise fall back to the full reference rect center.
        const refInnerEl = options.getReferenceInner?.();
        const refCenterY = refInnerEl
            ? refInnerEl.getBoundingClientRect().top + refInnerEl.getBoundingClientRect().height / 2
            : rects.reference.y + rects.reference.height / 2;
        let y = refCenterY - innerOffsetY;
        // Clamp to viewport
        const viewportH = globalThis.innerHeight;
        const floatingH = floatingRect.height;
        const minY = padding;
        const maxY = viewportH - floatingH - padding;
        const clampedY = Math.max(minY, Math.min(y, maxY));
        // If we clamped, scroll the popup so the selected item stays visible
        const scrollContainer = floatingEl.shadowRoot
            ?.querySelector(".Popup") ?? floatingEl.querySelector(".Popup");
        if (scrollContainer && clampedY !== y) {
            const scrollDelta = y - clampedY; // negative = we pushed down, positive = pushed up
            scrollContainer.scrollTop = Math.max(0, scrollContainer.scrollTop - scrollDelta);
        }
        y = clampedY;
        // Align X so inner text left edge matches reference text left edge
        const innerLeftOffset = innerRect.left - floatingRect.left;
        const x = refInnerEl
            ? refInnerEl.getBoundingClientRect().left - innerLeftOffset
            : rects.reference.x;
        return { x, y, reset: false };
    },
});
/**
 * Compute a fixed-strategy position using Floating UI with the viewport
 * override baked in.
 */
export const computeFixedPosition = (anchor, floating, options = {}) => {
    const { placement = "bottom-start", offsetPx = 4, matchWidth = false, minMatchWidth = false, padding = 8, } = options;
    const useInnerAlign = options.alignToInner?.getElement() != null;
    const middleware = useInnerAlign
        ? [alignInner(options.alignToInner)]
        : [offset(offsetPx), flip(), shift({ padding })];
    if (matchWidth) {
        middleware.push(size({
            apply({ rects, elements }) {
                Object.assign(elements.floating.style, {
                    width: `${rects.reference.width}px`,
                });
            },
        }));
    }
    else if (minMatchWidth) {
        middleware.push(size({
            apply({ rects, elements }) {
                Object.assign(elements.floating.style, {
                    minWidth: `${rects.reference.width}px`,
                });
            },
        }));
    }
    return computePosition(anchor, floating, {
        placement,
        strategy: "fixed",
        middleware,
        platform: fixedPlatform,
    });
};
/**
 * Start Floating UI `autoUpdate` + `computeFixedPosition` in one call.
 * Returns a cleanup function to stop tracking.
 */
export const startFixedAutoUpdate = (anchor, floating, options = {}) => {
    const { onPosition, ...positionOptions } = options;
    return autoUpdate(anchor, floating, () => {
        computeFixedPosition(anchor, floating, positionOptions).then((result) => {
            Object.assign(floating.style, {
                left: `${result.x}px`,
                top: `${result.y}px`,
            });
            onPosition?.(result);
        });
    });
};
