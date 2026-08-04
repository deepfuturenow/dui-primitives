/**
 * SPIKE (Phase 1): native-Popover-API replacement for FloatingPortalController.
 *
 * The old controller teleports the popup node out to `document.body` to escape
 * `container-type` / `overflow` / stacking-context ancestors, then pays a long
 * tail of hacks to undo the consequences of that teleport (node moving, CSS var
 * forwarding, shadow re-adoption, a hardcoded z-index, a global one-open-at-a-
 * time coordinator, and a manual document-click light-dismiss listener).
 *
 * This controller keeps ONLY the part that has no native equivalent —
 * Floating UI positioning — and hands everything else to the platform:
 *
 *   - top-layer rendering (escapes overflow/contain/stacking)  → `popover` attr
 *   - light dismiss (outside click) + Esc                      → `popover="auto"`
 *   - one-auto-popover-at-a-time                               → `popover="auto"`
 *   - stacking order                                           → top layer
 *
 * The popup element stays in its own shadow root the whole time, so there is
 * nothing to teleport, nothing to move back, and nothing to forward. The host
 * renders the `[popover]` element itself; this controller just shows/hides it
 * and positions it.
 */

import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { Placement } from "@floating-ui/dom";
import {
  type FloatingPopupSide,
  startFixedAutoUpdate,
} from "./floating-popup-utils.ts";

type ControllerHost = ReactiveControllerHost & HTMLElement;

export type FloatingTopLayerControllerOptions = {
  /** Returns the anchor element used for positioning. */
  getAnchor: () => HTMLElement | null | undefined;
  /** Returns the `[popover]` element the host renders into its own shadow root. */
  getPopover: () => HTMLElement | null | undefined;
  /** Whether the popup width should match the anchor width. Default: false. */
  matchWidth?: boolean;
  /** Set popup min-width to anchor width instead of fixing width. Default: false. */
  minMatchWidth?: boolean;
  /** Floating UI placement. Default: "bottom". */
  placement?: Placement;
  /** Offset in px between anchor and popup. Default: 4. */
  offset?: number;
  /** Called after each Floating UI reposition (e.g. to update data-side). */
  onPosition?: (result: { x: number; y: number; placement: Placement }) => void;
  /**
   * Called when the popover closes because the PLATFORM dismissed it
   * (outside click or Esc), so the host can sync that back into its own
   * open state. Not called for programmatic `close()`.
   */
  onLightDismiss?: () => void;
};

export class FloatingTopLayerController implements ReactiveController {
  #host: ControllerHost;
  #opts: FloatingTopLayerControllerOptions;
  #placement: Placement;
  #offset: number;
  #cleanupAutoUpdate: (() => void) | null = null;
  #open = false;

  get isOpen(): boolean {
    return this.#open;
  }

  set placement(value: Placement) {
    this.#placement = value;
  }

  set offset(value: number) {
    this.#offset = value;
  }

  constructor(
    host: ControllerHost,
    options: FloatingTopLayerControllerOptions,
  ) {
    this.#host = host;
    this.#opts = options;
    this.#placement = options.placement ?? "bottom";
    this.#offset = options.offset ?? 4;
    host.addController(this);
  }

  hostDisconnected(): void {
    this.#stopAutoUpdate();
  }

  /** Promote the popup to the top layer and start tracking the anchor. */
  open(): void {
    const popover = this.#opts.getPopover();
    if (!popover || popover.matches(":popover-open")) return;

    popover.showPopover();
    this.#open = true;
    this.#startAutoUpdate();
  }

  /** Programmatic close (trigger/close-button). Exit animation runs via CSS. */
  close(): void {
    const popover = this.#opts.getPopover();
    if (!popover || !popover.matches(":popover-open")) return;

    popover.hidePopover();
    this.#open = false;
    this.#stopAutoUpdate();
  }

  /**
   * Wire this to the `[popover]` element's `toggle` event. When the platform
   * closes the popover (outside click / Esc), sync it back to host state.
   */
  handleToggle = (event: Event): void => {
    const toggle = event as ToggleEvent;
    if (toggle.newState === "closed" && this.#open) {
      this.#open = false;
      this.#stopAutoUpdate();
      this.#opts.onLightDismiss?.();
    }
  };

  #startAutoUpdate(): void {
    if (this.#cleanupAutoUpdate) return;
    const anchor = this.#opts.getAnchor();
    const popover = this.#opts.getPopover();
    if (!anchor || !popover) return;

    this.#cleanupAutoUpdate = startFixedAutoUpdate(anchor, popover, {
      placement: this.#placement,
      offsetPx: this.#offset,
      matchWidth: this.#opts.matchWidth ?? false,
      minMatchWidth: this.#opts.minMatchWidth ?? false,
      onPosition: this.#opts.onPosition,
    });
  }

  #stopAutoUpdate(): void {
    this.#cleanupAutoUpdate?.();
    this.#cleanupAutoUpdate = null;
  }
}

export type { FloatingPopupSide };
