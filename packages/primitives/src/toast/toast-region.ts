import { css, html, LitElement, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import {
  type SwipeDirection,
  type ToastDismissReason,
  type ToastPosition,
  type ToastRegionContext,
  toastRegionContext,
} from "./toast-context.ts";

export type ToastDismissDetail = {
  id: string;
  reason: ToastDismissReason;
};

interface ParsedHotkey {
  alt: boolean;
  ctrl: boolean;
  shift: boolean;
  meta: boolean;
  key: string;
}

function parseHotkey(input: string | undefined): ParsedHotkey | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (trimmed === "" || trimmed.toLowerCase() === "none") return undefined;
  const result: ParsedHotkey = {
    alt: false,
    ctrl: false,
    shift: false,
    meta: false,
    key: "",
  };
  for (const part of trimmed.split("+")) {
    const t = part.trim();
    const lower = t.toLowerCase();
    if (lower === "alt" || lower === "option") result.alt = true;
    else if (lower === "ctrl" || lower === "control") result.ctrl = true;
    else if (lower === "shift") result.shift = true;
    else if (
      lower === "meta" || lower === "cmd" || lower === "command"
    ) result.meta = true;
    else result.key = t.toLowerCase();
  }
  return result.key ? result : undefined;
}

function matchesHotkey(e: KeyboardEvent, h: ParsedHotkey): boolean {
  return e.altKey === h.alt &&
    e.ctrlKey === h.ctrl &&
    e.shiftKey === h.shift &&
    e.metaKey === h.meta &&
    e.key.toLowerCase() === h.key;
}

/** Fired on the region when any toast inside it is dismissed. */
export const toastRegionDismissEvent = customEvent<ToastDismissDetail>(
  "toast-dismiss",
  { bubbles: true, composed: true },
);

const hostStyles = css`
  :host {
    /* Region is a fixed overlay; toasts re-enable pointer events. */
    position: fixed;
    box-sizing: border-box;
    pointer-events: none;
    z-index: 9999;
    /* Consumer-overridable spacing knobs. */
    --toast-region-offset: 1rem;
    --toast-region-gap: 0.5rem;
    /* Default width hint — consumers can override. */
    --toast-region-width: 22rem;
    width: var(--toast-region-width);
    max-width: calc(100vw - 2 * var(--toast-region-offset));
  }

  :host([data-position="top-left"]) {
    top: var(--toast-region-offset);
    left: var(--toast-region-offset);
  }
  :host([data-position="top-center"]) {
    top: var(--toast-region-offset);
    left: 50%;
    transform: translateX(-50%);
  }
  :host([data-position="top-right"]) {
    top: var(--toast-region-offset);
    right: var(--toast-region-offset);
  }
  :host([data-position="bottom-left"]) {
    bottom: var(--toast-region-offset);
    left: var(--toast-region-offset);
  }
  :host([data-position="bottom-center"]) {
    bottom: var(--toast-region-offset);
    left: 50%;
    transform: translateX(-50%);
  }
  :host([data-position="bottom-right"]) {
    bottom: var(--toast-region-offset);
    right: var(--toast-region-offset);
  }

  [part="list"] {
    display: flex;
    flex-direction: column;
    gap: var(--toast-region-gap);
  }

  /* Top-anchored regions: newest is closest to the top edge. The consumer
     appends in chronological order (oldest first), so display in reverse. */
  :host([data-position^="top-"]) [part="list"] {
    flex-direction: column-reverse;
  }
`;

/**
 * `<dui-toast-region>` — Viewport and provider for a stack of `<dui-toast>` elements.
 *
 * Owns shared concerns: position, registry, height measurement, expanded state,
 * the "paused" state that gates each toast's auto-dismiss timer (paused on
 * hover, focus inside the region, or while the document is hidden), and
 * overflow tracking when the toast count exceeds `max-visible`.
 *
 * Each registered toast receives the following structural state, which the
 * consumer uses to build their visual layout (stacked, expanded, fanned, etc.):
 *
 * | Set on each toast        | Description                                          |
 * | ------------------------ | ---------------------------------------------------- |
 * | `--toast-index`          | 0 = front (newest), increases for older toasts.      |
 * | `--toasts-total`         | Total registered toast count.                        |
 * | `--toast-height`         | Measured height of THIS toast (px).                  |
 * | `--toasts-before-height` | Sum of heights of toasts in front of this one (px).  |
 * | `data-front`             | Set on the front toast only.                         |
 * | `data-overflow`          | Set on toasts past `max-visible`.                    |
 * | `data-region-expanded`   | Mirrored from the region.                            |
 * | `data-position`          | Mirrored from the region.                            |
 *
 * Renders `position: fixed` on the host. Wrap with `<dui-portal>` if the region
 * needs to escape a stacking context.
 *
 * @slot - One or more `<dui-toast>` elements.
 * @csspart list - The list container holding all toasts.
 * @fires toast-dismiss - Fired when a toast inside is dismissed. Detail: { id, reason }.
 */
export class DuiToastRegionPrimitive extends LitElement {
  static tagName = "dui-toast-region" as const;
  static override styles = [base, hostStyles];

  /** Anchor position for the region. */
  @property({ type: String, reflect: true })
  accessor position: ToastPosition = "bottom-right";

  /** Maximum number of toasts visible simultaneously. */
  @property({ type: Number, attribute: "max-visible" })
  accessor maxVisible = 3;

  /** Accessible label for the landmark region. */
  @property({ type: String, attribute: "label" })
  accessor label = "Notifications";

  /** Auto-expand on hover/focus inside the region. */
  @property({ type: Boolean, attribute: "expand-on-hover" })
  accessor expandOnHover = true;

  /** Controlled expanded state. Overrides hover/focus auto-expansion. */
  @property({ type: Boolean, reflect: true })
  accessor expanded: boolean | undefined = undefined;

  /**
   * Allowed swipe-to-dismiss directions. Comma-separated list of
   * `"left" | "right" | "up" | "down"`, or `"none"` to disable. When unset,
   * the region picks a sensible default based on `position` (outward from the
   * anchored edge).
   */
  @property({ type: String, attribute: "swipe-directions" })
  accessor swipeDirections: string | undefined = undefined;

  /** Distance (px) a swipe must travel before it commits to dismissal. */
  @property({ type: Number, attribute: "swipe-threshold" })
  accessor swipeThreshold = 50;

  /**
   * Hotkey that jumps focus into the front toast from anywhere on the page.
   * Format: `"<modifiers>+<key>"` where modifiers are any combination of
   * `alt|option`, `ctrl|control`, `shift`, `meta|cmd|command`. Example:
   * `"Alt+T"`, `"Ctrl+Shift+N"`, `"F6"`. Set to `"none"` or empty to disable.
   */
  @property({ type: String })
  accessor hotkey = "Alt+T";

  // ---- internal state ----

  /** Registry of toast elements by id, in registration (chronological) order. */
  #registry = new Map<string, HTMLElement>();
  /** Latest measured height per toast element. */
  #heights = new WeakMap<HTMLElement, number>();
  #resizeObserver: ResizeObserver | undefined;

  /** Where to send focus after the region empties (only set via hotkey). */
  #previouslyFocused: HTMLElement | undefined;
  #parsedHotkey: ParsedHotkey | undefined;

  @state()
  accessor #paused = false;

  #pointerInside = false;
  #focusInside = false;
  #documentHidden = false;
  #effectiveExpanded = false;

  // ---- pause / expanded recomputation ----

  #recomputePaused(): void {
    const next = this.#pointerInside ||
      this.#focusInside ||
      this.#documentHidden;
    if (next !== this.#paused) {
      this.#paused = next;
    }
  }

  #recomputeExpanded(): void {
    let next: boolean;
    if (this.expanded !== undefined) {
      next = this.expanded;
    } else if (this.expandOnHover) {
      next = this.#pointerInside || this.#focusInside;
    } else {
      next = false;
    }
    if (next === this.#effectiveExpanded) return;
    this.#effectiveExpanded = next;
    if (next) this.setAttribute("data-expanded", "");
    else this.removeAttribute("data-expanded");
    // Mirror to each toast for CSS targeting.
    for (const el of this.#registry.values()) {
      if (next) el.setAttribute("data-region-expanded", "");
      else el.removeAttribute("data-region-expanded");
    }
  }

  // ---- DOM event handlers ----

  #handlePointerEnter = (): void => {
    this.#pointerInside = true;
    this.#recomputePaused();
    this.#recomputeExpanded();
  };
  #handlePointerLeave = (): void => {
    this.#pointerInside = false;
    this.#recomputePaused();
    this.#recomputeExpanded();
  };
  #handleFocusIn = (): void => {
    this.#focusInside = true;
    this.#recomputePaused();
    this.#recomputeExpanded();
  };
  #handleFocusOut = (e: FocusEvent): void => {
    // Only flip if focus left the region entirely.
    const next = e.relatedTarget as Node | null;
    if (next && this.contains(next)) return;
    this.#focusInside = false;
    this.#recomputePaused();
    this.#recomputeExpanded();
  };
  #handleVisibilityChange = (): void => {
    this.#documentHidden = document.hidden;
    this.#recomputePaused();
  };

  // ---- registry ----

  #registerToast = (id: string, el: HTMLElement): void => {
    if (this.#registry.has(id)) return;
    this.#registry.set(id, el);
    this.#applyMirroredState(el);
    this.#resizeObserver?.observe(el);
    // Take an initial measurement; ResizeObserver fires async on observe,
    // but we want indices/before-heights correct on the first frame.
    this.#heights.set(el, el.getBoundingClientRect().height);
    this.#updateIndices();
    this.#updateBeforeHeights();
  };

  #unregisterToast = (id: string): void => {
    const el = this.#registry.get(id);
    if (!el) return;

    // Capture focus state BEFORE we mutate the registry so we can move focus
    // to a sibling (or restore the pre-region focus) on dismiss.
    const active = document.activeElement;
    const wasFocusedHere = active instanceof HTMLElement &&
      (active === el || el.contains(active));
    const oldIdx = wasFocusedHere
      ? [...this.#registry.values()].indexOf(el)
      : -1;

    this.#resizeObserver?.unobserve(el);
    this.#heights.delete(el);
    this.#registry.delete(id);
    this.#updateIndices();
    this.#updateBeforeHeights();

    if (wasFocusedHere) {
      const remaining = [...this.#registry.values()];
      if (remaining.length > 0) {
        // Prefer the toast that took the dismissed one's slot (same index).
        const next = remaining[oldIdx] ?? remaining[oldIdx - 1] ??
          remaining[0];
        next.focus();
      } else if (this.#previouslyFocused) {
        this.#exitRegion();
      }
    }
  };

  // ---- focus management ----

  /** Move focus to the front (newest) toast and remember the prior focus. */
  #focusFrontToast(): boolean {
    const entries = [...this.#registry.values()];
    if (entries.length === 0) return false;
    const front = entries[entries.length - 1];
    const active = document.activeElement;
    // Don't clobber #previouslyFocused if focus is already inside the region.
    if (
      active instanceof HTMLElement && !this.contains(active) &&
      active !== document.body
    ) {
      this.#previouslyFocused = active;
    }
    front.focus();
    return true;
  }

  /** Restore focus to the pre-region target (if any) and clear it. */
  #exitRegion(): void {
    const target = this.#previouslyFocused;
    this.#previouslyFocused = undefined;
    if (target && target.isConnected) {
      target.focus();
    } else if (
      document.activeElement instanceof HTMLElement &&
      this.contains(document.activeElement)
    ) {
      document.activeElement.blur();
    }
  }

  // ---- keyboard ----

  #handleDocumentKeyDown = (e: KeyboardEvent): void => {
    if (!this.#parsedHotkey) return;
    if (!matchesHotkey(e, this.#parsedHotkey)) return;
    // Only act if we have at least one toast.
    if (this.#registry.size === 0) return;
    e.preventDefault();
    this.#focusFrontToast();
  };

  #handleRegionKeyDown = (e: KeyboardEvent): void => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) return;
    const entries = [...this.#registry.values()];
    const focusedIdx = entries.findIndex(
      (el) => el === active || el.contains(active),
    );
    if (focusedIdx === -1) return;

    const isTopAnchored = this.position.startsWith("top-");

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const idx = isTopAnchored ? focusedIdx - 1 : focusedIdx + 1;
        entries[idx]?.focus();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const idx = isTopAnchored ? focusedIdx + 1 : focusedIdx - 1;
        entries[idx]?.focus();
        break;
      }
      case "Home": {
        e.preventDefault();
        const target = isTopAnchored
          ? entries[entries.length - 1]
          : entries[0];
        target?.focus();
        break;
      }
      case "End": {
        e.preventDefault();
        const target = isTopAnchored
          ? entries[0]
          : entries[entries.length - 1];
        target?.focus();
        break;
      }
      case "Escape": {
        e.preventDefault();
        this.#exitRegion();
        break;
      }
    }
  };

  /** Apply state that the region owns onto a (newly-registered) toast. */
  #applyMirroredState(el: HTMLElement): void {
    el.setAttribute("data-position", this.position);
    if (this.#effectiveExpanded) {
      el.setAttribute("data-region-expanded", "");
    }
  }

  /** Write `--toast-index`, `--toasts-total`, `data-front`, `data-overflow`. */
  #updateIndices(): void {
    const entries = [...this.#registry.values()];
    const total = entries.length;
    for (let i = 0; i < total; i++) {
      // Last-registered (newest) is the front of the stack (index 0).
      const indexFromFront = total - 1 - i;
      const el = entries[i];
      el.style.setProperty("--toast-index", String(indexFromFront));
      el.style.setProperty("--toasts-total", String(total));
      if (indexFromFront === 0) el.setAttribute("data-front", "");
      else el.removeAttribute("data-front");
      if (indexFromFront >= this.maxVisible) {
        el.setAttribute("data-overflow", "");
      } else {
        el.removeAttribute("data-overflow");
      }
    }
    const overflow = Math.max(0, total - this.maxVisible);
    this.style.setProperty("--toasts-overflow-count", String(overflow));
    if (overflow > 0) {
      this.setAttribute("data-overflow-count", String(overflow));
    } else {
      this.removeAttribute("data-overflow-count");
    }
  }

  /** Cumulative height of toasts in FRONT of each one (front toast = 0). */
  #updateBeforeHeights(): void {
    const entries = [...this.#registry.values()];
    // Front-to-back = reverse of registration order.
    let cumulative = 0;
    for (let i = entries.length - 1; i >= 0; i--) {
      const el = entries[i];
      el.style.setProperty("--toasts-before-height", `${cumulative}px`);
      const h = this.#heights.get(el) ?? 0;
      // Also expose own measured height for convenience.
      el.style.setProperty("--toast-height", `${h}px`);
      cumulative += h;
    }
    // Convenience: total stack height on the region.
    this.style.setProperty("--toasts-stack-height", `${cumulative}px`);
  }

  // ---- dismiss plumbing (region-level entry point) ----

  #dismiss = (id: string, reason: ToastDismissReason): void => {
    const el = this.#registry.get(id);
    if (!el) return;
    this.dispatchEvent(toastRegionDismissEvent({ id, reason }));
    el.dispatchEvent(
      new CustomEvent("dui-toast-request-dismiss", {
        detail: { reason },
      }),
    );
  };

  // ---- context plumbing ----

  @provide({ context: toastRegionContext })
  @state()
  accessor _ctx: ToastRegionContext = this.#buildContext();

  #buildContext(): ToastRegionContext {
    return {
      position: this.position,
      maxVisible: this.maxVisible,
      paused: this.#paused,
      swipeDirections: this.#resolveSwipeDirections(),
      swipeThreshold: this.swipeThreshold,
      registerToast: this.#registerToast,
      unregisterToast: this.#unregisterToast,
      dismiss: this.#dismiss,
    };
  }

  #resolveSwipeDirections(): readonly SwipeDirection[] {
    const raw = this.swipeDirections;
    if (raw === "none") return [];
    if (raw && raw.trim().length > 0) {
      const valid: SwipeDirection[] = [];
      for (const part of raw.split(",")) {
        const t = part.trim();
        if (t === "left" || t === "right" || t === "up" || t === "down") {
          valid.push(t);
        }
      }
      return valid;
    }
    // Default: outward from the anchored edge.
    switch (this.position) {
      case "top-right":
      case "bottom-right":
        return ["right"];
      case "top-left":
      case "bottom-left":
        return ["left"];
      case "top-center":
        return ["up"];
      case "bottom-center":
        return ["down"];
    }
  }

  // ---- lifecycle ----

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "region");
    this.setAttribute("aria-label", this.label);
    this.setAttribute("data-position", this.position);
    this.#parsedHotkey = parseHotkey(this.hotkey);
    this.addEventListener("pointerenter", this.#handlePointerEnter);
    this.addEventListener("pointerleave", this.#handlePointerLeave);
    this.addEventListener("focusin", this.#handleFocusIn);
    this.addEventListener("focusout", this.#handleFocusOut);
    this.addEventListener("keydown", this.#handleRegionKeyDown);
    document.addEventListener("visibilitychange", this.#handleVisibilityChange);
    document.addEventListener("keydown", this.#handleDocumentKeyDown);
    this.#documentHidden = document.hidden;
    this.#recomputePaused();
    this.#recomputeExpanded();

    this.#resizeObserver = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        const h = entry.contentRect.height;
        const prev = this.#heights.get(el);
        if (prev !== h) {
          this.#heights.set(el, h);
          changed = true;
        }
      }
      if (changed) this.#updateBeforeHeights();
    });

    this._ctx = this.#buildContext();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("pointerenter", this.#handlePointerEnter);
    this.removeEventListener("pointerleave", this.#handlePointerLeave);
    this.removeEventListener("focusin", this.#handleFocusIn);
    this.removeEventListener("focusout", this.#handleFocusOut);
    this.removeEventListener("keydown", this.#handleRegionKeyDown);
    document.removeEventListener(
      "visibilitychange",
      this.#handleVisibilityChange,
    );
    document.removeEventListener("keydown", this.#handleDocumentKeyDown);
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;
  }

  override willUpdate(changed: PropertyValues): void {
    if (changed.has("position")) {
      this.setAttribute("data-position", this.position);
      // Mirror to every toast.
      for (const el of this.#registry.values()) {
        el.setAttribute("data-position", this.position);
      }
    }
    if (changed.has("label")) {
      this.setAttribute("aria-label", this.label);
    }
    if (changed.has("maxVisible")) {
      this.#updateIndices();
    }
    if (changed.has("expanded") || changed.has("expandOnHover")) {
      this.#recomputeExpanded();
    }
    if (changed.has("hotkey")) {
      this.#parsedHotkey = parseHotkey(this.hotkey);
    }
    this._ctx = this.#buildContext();
  }

  override render(): TemplateResult {
    return html`
      <div
        part="list"
        ?data-paused=${this.#paused}
      >
        <slot></slot>
      </div>
    `;
  }
}
