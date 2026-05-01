import { createContext } from "@lit/context";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastDismissReason =
  | "auto"
  | "action"
  | "close"
  | "programmatic"
  | "swipe"
  | "keyboard";

export type SwipeDirection = "left" | "right" | "up" | "down";

/**
 * Context provided by `<dui-toast-region>` to its descendant toasts.
 * Carries shared layout/behavior state and registry callbacks.
 */
export interface ToastRegionContext {
  readonly position: ToastPosition;
  readonly maxVisible: number;
  /** True while dismissal timers should be paused (hover/focus/visibility). */
  readonly paused: boolean;
  /** Allowed swipe directions for descendant toasts. Empty = swipe disabled. */
  readonly swipeDirections: readonly SwipeDirection[];
  /** Distance threshold (px) before a swipe commits to dismiss. */
  readonly swipeThreshold: number;
  readonly registerToast: (id: string, el: HTMLElement) => void;
  readonly unregisterToast: (id: string) => void;
  readonly dismiss: (id: string, reason: ToastDismissReason) => void;
}

export const toastRegionContext = createContext<ToastRegionContext>(
  Symbol("dui-toast-region"),
);

/**
 * Context provided by each `<dui-toast>` to its own descendants
 * (close button, action button, custom dismiss controls).
 */
export interface ToastItemContext {
  readonly id: string;
  readonly dismiss: (reason: ToastDismissReason) => void;
}

export const toastItemContext = createContext<ToastItemContext>(
  Symbol("dui-toast"),
);
