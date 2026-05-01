/**
 * Pointer-based swipe-to-dismiss controller for `<dui-toast>`.
 *
 * Activates after an activation distance, locks to the dominant axis, and
 * commits to dismissal when distance OR velocity crosses a threshold. While
 * active, writes:
 *
 *  - `data-swipe="start" | "move" | "end" | "cancel"` on the host.
 *  - `--swipe-amount-x`, `--swipe-amount-y` CSS vars on the host.
 *
 * Suppresses the synthetic click that would otherwise fire on the inner
 * action/close buttons after an activated swipe ends.
 */

import type { SwipeDirection, ToastDismissReason } from "./toast-context.ts";

/** Pointer movement (px) required before swipe activates. */
const ACTIVATION_DISTANCE = 6;
/** Velocity (px/s) at or above which a swipe commits to dismiss. */
const VELOCITY_THRESHOLD = 600;
/** How long the post-end / cancel state lingers before being cleared. */
const RESET_DELAY = 350;

export interface SwipeControllerOptions {
  /** Returns the currently allowed swipe directions. Empty = disabled. */
  getDirections: () => readonly SwipeDirection[];
  /** Returns the distance threshold (px). */
  getThreshold: () => number;
  /** Called when the swipe commits to dismissal. */
  onDismiss: (reason: ToastDismissReason) => void;
}

export class ToastSwipeController {
  #host: HTMLElement;
  #opts: SwipeControllerOptions;

  #pointerId = -1;
  #startX = 0;
  #startY = 0;
  #startTime = 0;
  #lastX = 0;
  #lastY = 0;
  #lastTime = 0;
  /** Locked axis after activation. */
  #axis: "x" | "y" | undefined;
  /** Whether we've passed activation distance. */
  #active = false;
  /** Suppress next click after an active swipe ends. */
  #suppressClick = false;
  #resetTimer: number | undefined;

  constructor(host: HTMLElement, opts: SwipeControllerOptions) {
    this.#host = host;
    this.#opts = opts;
  }

  attach(): void {
    this.#host.addEventListener("pointerdown", this.#onPointerDown);
    this.#host.addEventListener("pointermove", this.#onPointerMove);
    this.#host.addEventListener("pointerup", this.#onPointerUp);
    this.#host.addEventListener("pointercancel", this.#onPointerCancel);
    this.#host.addEventListener("click", this.#onClick, { capture: true });
    // Suppress native text/image drag-and-drop while a swipe is active so it
    // doesn't steal the gesture on desktop browsers.
    this.#host.addEventListener("dragstart", this.#onDragStart);
  }

  detach(): void {
    this.#host.removeEventListener("pointerdown", this.#onPointerDown);
    this.#host.removeEventListener("pointermove", this.#onPointerMove);
    this.#host.removeEventListener("pointerup", this.#onPointerUp);
    this.#host.removeEventListener("pointercancel", this.#onPointerCancel);
    this.#host.removeEventListener("click", this.#onClick, { capture: true });
    this.#host.removeEventListener("dragstart", this.#onDragStart);
    if (this.#resetTimer !== undefined) {
      clearTimeout(this.#resetTimer);
      this.#resetTimer = undefined;
    }
  }

  #directionAllowed(dir: SwipeDirection): boolean {
    return this.#opts.getDirections().includes(dir);
  }

  #onPointerDown = (e: PointerEvent): void => {
    // Primary button only; allow touch/pen.
    if (e.button !== 0 && e.pointerType === "mouse") return;
    // Don't engage if there are no allowed directions.
    if (this.#opts.getDirections().length === 0) return;
    // Don't hijack interactions on inner controls.
    if (this.#isInteractiveTarget(e.target)) return;

    this.#pointerId = e.pointerId;
    this.#startX = this.#lastX = e.clientX;
    this.#startY = this.#lastY = e.clientY;
    this.#startTime = this.#lastTime = e.timeStamp;
    this.#axis = undefined;
    this.#active = false;
  };

  #onPointerMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.#pointerId) return;

    const dx = e.clientX - this.#startX;
    const dy = e.clientY - this.#startY;

    if (!this.#active) {
      const dist = Math.hypot(dx, dy);
      if (dist < ACTIVATION_DISTANCE) return;

      // Lock axis to the dominant component and check direction is allowed.
      const horiz = Math.abs(dx) >= Math.abs(dy);
      if (horiz) {
        const dir: SwipeDirection = dx > 0 ? "right" : "left";
        if (!this.#directionAllowed(dir)) {
          this.#cancelTracking();
          return;
        }
        this.#axis = "x";
      } else {
        const dir: SwipeDirection = dy > 0 ? "down" : "up";
        if (!this.#directionAllowed(dir)) {
          this.#cancelTracking();
          return;
        }
        this.#axis = "y";
      }

      this.#active = true;
      this.#host.setAttribute("data-swipe", "start");
      try {
        this.#host.setPointerCapture(e.pointerId);
      } catch {
        // Some browsers reject capture after the gesture started; keep tracking.
      }
    }

    const allowedDx = this.#axis === "x" ? this.#clampX(dx) : 0;
    const allowedDy = this.#axis === "y" ? this.#clampY(dy) : 0;

    this.#host.style.setProperty("--swipe-amount-x", `${allowedDx}px`);
    this.#host.style.setProperty("--swipe-amount-y", `${allowedDy}px`);
    this.#host.setAttribute("data-swipe", "move");

    this.#lastX = e.clientX;
    this.#lastY = e.clientY;
    this.#lastTime = e.timeStamp;
  };

  #onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.#pointerId) return;
    this.#pointerId = -1;

    if (!this.#active) {
      // Tap, not swipe — leave click handling to the browser.
      return;
    }

    const dx = e.clientX - this.#startX;
    const dy = e.clientY - this.#startY;
    const elapsed = Math.max(e.timeStamp - this.#startTime, 1);
    const distance = this.#axis === "x" ? Math.abs(dx) : Math.abs(dy);
    const velocity = distance / elapsed * 1000; // px/s

    const threshold = this.#opts.getThreshold();
    const shouldDismiss = distance >= threshold || velocity >= VELOCITY_THRESHOLD;

    // Suppress the synthetic click that would fire on inner buttons.
    this.#suppressClick = true;
    queueMicrotask(() => {
      this.#suppressClick = false;
    });

    if (shouldDismiss) {
      this.#host.setAttribute("data-swipe", "end");
      // Leave --swipe-amount-* in place so consumer CSS can choreograph the
      // exit (e.g. translate further off-screen) keyed on data-swipe="end".
      this.#opts.onDismiss("swipe");
    } else {
      this.#host.setAttribute("data-swipe", "cancel");
      this.#host.style.setProperty("--swipe-amount-x", "0px");
      this.#host.style.setProperty("--swipe-amount-y", "0px");
      this.#scheduleReset();
    }

    this.#active = false;
    this.#axis = undefined;
  };

  #onPointerCancel = (e: PointerEvent): void => {
    if (e.pointerId !== this.#pointerId) return;
    this.#pointerId = -1;
    if (this.#active) {
      this.#host.setAttribute("data-swipe", "cancel");
      this.#host.style.setProperty("--swipe-amount-x", "0px");
      this.#host.style.setProperty("--swipe-amount-y", "0px");
      this.#scheduleReset();
    }
    this.#active = false;
    this.#axis = undefined;
  };

  #onClick = (e: MouseEvent): void => {
    if (this.#suppressClick) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  };

  /** Block native text/image drag-and-drop while the gesture is engaged. */
  #onDragStart = (e: DragEvent): void => {
    if (this.#pointerId !== -1 || this.#active) {
      e.preventDefault();
    }
  };

  #cancelTracking(): void {
    this.#pointerId = -1;
    this.#active = false;
    this.#axis = undefined;
  }

  #scheduleReset(): void {
    if (this.#resetTimer !== undefined) clearTimeout(this.#resetTimer);
    this.#resetTimer = setTimeout(() => {
      this.#host.removeAttribute("data-swipe");
      this.#host.style.removeProperty("--swipe-amount-x");
      this.#host.style.removeProperty("--swipe-amount-y");
      this.#resetTimer = undefined;
    }, RESET_DELAY) as unknown as number;
  }

  #clampX(dx: number): number {
    const left = this.#directionAllowed("left");
    const right = this.#directionAllowed("right");
    if (dx < 0 && !left) return 0;
    if (dx > 0 && !right) return 0;
    return dx;
  }

  #clampY(dy: number): number {
    const up = this.#directionAllowed("up");
    const down = this.#directionAllowed("down");
    if (dy < 0 && !up) return 0;
    if (dy > 0 && !down) return 0;
    return dy;
  }

  #isInteractiveTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false;
    // Don't engage swipe when the user is interacting with form fields.
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target as HTMLElement).isContentEditable
    ) {
      return true;
    }
    return false;
  }
}
