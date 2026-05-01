import { css, html, LitElement, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ContextConsumer, provide } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import {
  type ToastDismissReason,
  type ToastItemContext,
  toastItemContext,
  toastRegionContext,
} from "./toast-context.ts";
import { ToastSwipeController } from "./toast-swipe-controller.ts";

export type ToastType =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "loading";

export type ToastPriority = "polite" | "assertive";

export type ToastOpenChangeDetail = { open: boolean };
export type ToastDismissDetail = {
  id: string;
  reason: ToastDismissReason;
};

/** Fired on the toast when its open state changes. */
export const toastOpenChangeEvent = customEvent<ToastOpenChangeDetail>(
  "open-change",
  { bubbles: true, composed: true },
);

/** Fired on the toast (and bubbles) when it dismisses. */
export const toastDismissEvent = customEvent<ToastDismissDetail>(
  "dismiss",
  { bubbles: true, composed: true },
);

const hostStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    /* Re-enable pointer events suppressed by the region host. */
    pointer-events: auto;
  }

  :host([data-state="closed"]) {
    display: none;
  }
`;

const componentStyles = css`
  [part="root"] {
    box-sizing: border-box;
    transition-property: opacity, transform;
    /* Default touch-action allows vertical scroll while letting horizontal
       swipes engage the gesture controller. Override per-position in your
       theme if you swipe vertically. */
    touch-action: pan-y;
    /* Suppress native text selection so click-drag engages the swipe gesture
       on desktop instead of starting a text selection. Consumers who want
       selectable toast content can override with user-select: text. */
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    /* Swipe offset — structural, always applied. The vars are written by the
       gesture controller on the host and inherit into the shadow tree.
       Stacking transforms are typically applied to the host element and
       compose with this part transform without override. */
    transform: translate(
      var(--swipe-amount-x, 0),
      var(--swipe-amount-y, 0)
    );
  }

  /* During an active drag, snap to the pointer 1:1. */
  :host([data-swipe="move"]) [part="root"] {
    transition: none;
  }
  /* Spring back when cancelled. */
  :host([data-swipe="cancel"]) [part="root"] {
    transition: transform 220ms cubic-bezier(0.2, 0.7, 0.25, 1);
  }
  /* On commit, fly out further in the swipe direction during close. */
  :host([data-swipe="end"]) [part="root"] {
    transition: transform 200ms ease-out, opacity 200ms ease-out;
    transform: translate(
      calc(var(--swipe-amount-x, 0) * 3),
      calc(var(--swipe-amount-y, 0) * 3)
    );
  }

  [part="title"]:empty,
  [part="description"]:empty {
    display: none;
  }
`;

/**
 * `<dui-toast>` — A single toast notification.
 *
 * Lives inside `<dui-toast-region>` (or standalone). Manages its own open/close
 * lifecycle, auto-dismiss timer (paused while the region reports paused state),
 * and ARIA wiring for title/description slots.
 *
 * Three escape valves for content:
 * 1. **Named slots** (`title`, `description`) — auto-wires `aria-labelledby`
 *    and `aria-describedby`.
 * 2. **Default slot** — render anything; the toast's live-region role announces it.
 * 3. **`data-toast-dismiss`** — any descendant element with this attribute will
 *    dismiss the toast on click (no need for `<dui-toast-close>`).
 *
 * @slot - Default content; rendered after the title/description wrappers.
 * @slot title - Title content; wrapped in `[part="title"]` and used for aria-labelledby.
 * @slot description - Description content; wrapped in `[part="description"]` and used for aria-describedby.
 * @slot action - Optional action region (typically holds `<dui-toast-action>`).
 * @slot close - Optional close region (typically holds `<dui-toast-close>`).
 *
 * @csspart root - The toast container element.
 * @csspart title - The title wrapper.
 * @csspart description - The description wrapper.
 *
 * @attr {string} data-state - `"open"` | `"closing"` | `"closed"`.
 * @attr {boolean} data-starting-style - Set for one frame after open begins.
 * @attr {boolean} data-ending-style - Set during close transition.
 * @attr {boolean} data-front - Set on the most recently registered toast.
 * @attr {string} data-type - Mirrors the `type` property.
 *
 * @fires open-change - `{ open: boolean }`.
 * @fires dismiss - `{ id, reason }`. Reason is `auto` | `action` | `close` |
 *   `programmatic` | `swipe` | `keyboard`.
 */
export class DuiToastPrimitive extends LitElement {
  static tagName = "dui-toast" as const;
  static override styles = [base, hostStyles, componentStyles];

  /** Controlled open state. */
  @property({ type: Boolean, reflect: true })
  accessor open: boolean | undefined = undefined;

  /** Initial open state (uncontrolled). Defaults to true so a fresh toast is shown. */
  @property({ type: Boolean, attribute: "default-open" })
  accessor defaultOpen = true;

  /** Auto-dismiss after this many ms. `0` or `loading` type disables auto-dismiss. */
  @property({ type: Number })
  accessor duration = 4000;

  /** Visual / semantic type. `loading` disables auto-dismiss by default. */
  @property({ type: String, reflect: true })
  accessor type: ToastType = "default";

  /** Live-region politeness. `assertive` is for high-priority alerts. */
  @property({ type: String })
  accessor priority: ToastPriority = "polite";

  /** Stable id for this toast. Auto-generated if not provided. */
  @property({ type: String, attribute: "toast-id", reflect: true })
  accessor toastId: string | undefined = undefined;

  /**
   * Tier-3 escape hatch: when true, the toast renders ONLY the default slot
   * inside `[part="root"]`. The title/description/action/close slot wrappers
   * are removed and ARIA labelledby/describedby are not auto-wired.
   *
   * The host still owns: live-region role, registry membership, layout vars,
   * pause/resume timer, swipe gestures, keyboard dismiss, and the
   * `[data-toast-dismiss]` click delegation.
   */
  @property({ type: Boolean, reflect: true })
  accessor headless = false;

  @state()
  accessor #internalOpen = false;

  @state()
  accessor #state: "open" | "closing" | "closed" = "closed";

  @state()
  accessor #startingStyle = false;

  @state()
  accessor #endingStyle = false;

  @state()
  accessor #hasTitle = false;

  @state()
  accessor #hasDescription = false;

  #instanceId = crypto.randomUUID().slice(0, 8);
  #titleId = `dui-toast-title-${this.#instanceId}`;
  #descriptionId = `dui-toast-desc-${this.#instanceId}`;

  // Auto-dismiss timer state.
  #timerHandle: number | undefined;
  #timerStart = 0;
  #timerRemaining = 0;
  #timerWasPaused = false;

  /** Fallback timeout for the close-animation transitionend; cleared on disconnect. */
  #closeAnimationTimer: number | undefined;

  // Track previous controlled value to detect external open->false transitions.
  #lastEffectiveOpen = false;

  /** Whether we are currently registered with a region. */
  #registered = false;

  #regionCtx = new ContextConsumer(this, {
    context: toastRegionContext,
    subscribe: true,
  });

  #swipe = new ToastSwipeController(this, {
    getDirections: () => this.#regionCtx.value?.swipeDirections ?? [],
    getThreshold: () => this.#regionCtx.value?.swipeThreshold ?? 50,
    onDismiss: (reason) => this.#beginClose(reason),
  });

  #registerWithRegion(): void {
    if (this.#registered) return;
    const ctx = this.#regionCtx.value;
    if (!ctx) return;
    ctx.registerToast(this.#effectiveId, this);
    this.#registered = true;
  }

  #unregisterFromRegion(): void {
    if (!this.#registered) return;
    this.#regionCtx.value?.unregisterToast(this.#effectiveId);
    this.#registered = false;
  }

  get #effectiveOpen(): boolean {
    return this.open ?? this.#internalOpen;
  }

  get #effectiveId(): string {
    return this.toastId ?? `dui-toast-${this.#instanceId}`;
  }

  get #autoDismissDisabled(): boolean {
    return this.type === "loading" || this.duration <= 0;
  }

  // ---- lifecycle ----

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.open === undefined && this.defaultOpen) {
      this.#internalOpen = true;
    }
    // Make the toast programmatically focusable (region hotkey + arrow nav)
    // without polluting the natural Tab order. Consumers who explicitly set
    // tabindex keep their value.
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "-1");
    }
    this.addEventListener("dui-toast-request-dismiss", this.#handleRequestDismiss as EventListener);
    this.addEventListener("click", this.#handleDelegatedDismiss);
    this.addEventListener("keydown", this.#handleKeyDown);
    this.#swipe.attach();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#clearTimer();
    if (this.#closeAnimationTimer !== undefined) {
      clearTimeout(this.#closeAnimationTimer);
      this.#closeAnimationTimer = undefined;
    }
    this.#unregisterFromRegion();
    this.removeEventListener("dui-toast-request-dismiss", this.#handleRequestDismiss as EventListener);
    this.removeEventListener("click", this.#handleDelegatedDismiss);
    this.removeEventListener("keydown", this.#handleKeyDown);
    this.#swipe.detach();
  }

  override willUpdate(changed: PropertyValues): void {
    // Maintain item context whenever id changes (rare).
    if (changed.has("toastId")) {
      this._itemCtx = this.#buildItemContext();
    }
    // Sync data-state attribute as our state changes.
    this.setAttribute("data-state", this.#state);
  }

  override updated(): void {
    const open = this.#effectiveOpen;
    const wasOpen = this.#lastEffectiveOpen;
    this.#lastEffectiveOpen = open;

    // Safety net: if we're open but haven't registered yet (e.g. region
    // context wasn't available at #beginOpen time), retry now.
    if (this.#state === "open" && !this.#registered && this.#regionCtx.value) {
      this.#registerWithRegion();
    }

    // External open=false transition while we are open → programmatic close.
    if (!open && wasOpen && this.#state === "open") {
      this.#beginClose("programmatic");
      return;
    }

    // Open transition.
    if (open && this.#state === "closed") {
      this.#beginOpen();
      return;
    }

    // React to region pause changes.
    if (this.#state === "open" && !this.#autoDismissDisabled) {
      const paused = this.#regionCtx.value?.paused ?? false;
      if (paused && !this.#timerWasPaused) {
        this.#pauseTimer();
      } else if (!paused && this.#timerWasPaused) {
        this.#resumeTimer();
      }
    }
  }

  // ---- open / close animations ----

  async #beginOpen(): Promise<void> {
    // Register with region BEFORE the first paint so layout vars are
    // available when the open transition starts.
    this.#registerWithRegion();
    this.#state = "open";
    this.#startingStyle = true;
    this.#endingStyle = false;
    this.requestUpdate();

    // Two RAFs to let `data-starting-style` apply before we flip it off,
    // matching the dialog primitive's animation pattern.
    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r()))
    );
    this.#startingStyle = false;

    this.dispatchEvent(toastOpenChangeEvent({ open: true }));
    this.#startTimerIfNeeded();
  }

  #beginClose(reason: ToastDismissReason): void {
    // Pre-open dismiss: state is "closed" but defaultOpen / open=true is
    // queued (between connect and the first render). Cancel the pending open
    // without animation and dispatch the dismiss event so imperative consumers
    // can clean up. Without this guard, dismiss requests issued synchronously
    // after creation are silently swallowed.
    if (this.#state === "closed") {
      if (!this.#effectiveOpen) return; // truly already closed
      if (this.open === undefined) this.#internalOpen = false;
      this.#lastEffectiveOpen = false;
      this.#unregisterFromRegion();
      this.dispatchEvent(toastOpenChangeEvent({ open: false }));
      this.dispatchEvent(
        toastDismissEvent({ id: this.#effectiveId, reason }),
      );
      return;
    }
    if (this.#state !== "open") return; // already closing
    this.#clearTimer();
    this.#state = "closing";
    this.#endingStyle = true;
    this.requestUpdate();

    const root = this.shadowRoot?.querySelector('[part="root"]') as
      | HTMLElement
      | null;
    if (!root) {
      this.#finishClose(reason);
      return;
    }

    let called = false;
    const done = (): void => {
      if (called) return;
      called = true;
      root.removeEventListener("transitionend", onEnd);
      if (this.#closeAnimationTimer !== undefined) {
        clearTimeout(this.#closeAnimationTimer);
        this.#closeAnimationTimer = undefined;
      }
      this.#finishClose(reason);
    };
    const onEnd = (e: Event): void => {
      if ((e as TransitionEvent).propertyName === "opacity") done();
    };
    root.addEventListener("transitionend", onEnd);
    // Fallback in case no transition is defined.
    this.#closeAnimationTimer = setTimeout(done, 400) as unknown as number;
  }

  #finishClose(reason: ToastDismissReason): void {
    // If the toast was disconnected mid-animation, don't dispatch events into
    // the void or attempt to mutate state. The disconnectedCallback already
    // unregistered us.
    if (!this.isConnected) return;
    this.#state = "closed";
    this.#endingStyle = false;
    if (this.open === undefined) {
      this.#internalOpen = false;
    }
    // Drop out of the region's registry so remaining toasts re-index.
    this.#unregisterFromRegion();
    this.dispatchEvent(toastOpenChangeEvent({ open: false }));
    this.dispatchEvent(
      toastDismissEvent({ id: this.#effectiveId, reason }),
    );
  }

  // ---- auto-dismiss timer ----

  #startTimerIfNeeded(): void {
    if (this.#autoDismissDisabled) return;
    this.#timerRemaining = this.duration;
    const paused = this.#regionCtx.value?.paused ?? false;
    if (paused) {
      this.#timerWasPaused = true;
      return;
    }
    this.#scheduleTimer();
  }

  #scheduleTimer(): void {
    this.#clearTimer();
    this.#timerStart = performance.now();
    this.#timerWasPaused = false;
    this.#timerHandle = setTimeout(() => {
      this.#beginClose("auto");
    }, this.#timerRemaining) as unknown as number;
  }

  #pauseTimer(): void {
    if (this.#timerHandle === undefined) return;
    clearTimeout(this.#timerHandle);
    this.#timerHandle = undefined;
    const elapsed = performance.now() - this.#timerStart;
    this.#timerRemaining = Math.max(0, this.#timerRemaining - elapsed);
    this.#timerWasPaused = true;
  }

  #resumeTimer(): void {
    if (this.#autoDismissDisabled) return;
    this.#scheduleTimer();
  }

  #clearTimer(): void {
    if (this.#timerHandle !== undefined) {
      clearTimeout(this.#timerHandle);
      this.#timerHandle = undefined;
    }
    this.#timerWasPaused = false;
  }

  // ---- dismiss plumbing ----

  /** Public method: dismiss this toast with the given reason. */
  dismiss(reason: ToastDismissReason = "programmatic"): void {
    this.#beginClose(reason);
  }

  /**
   * Restart the auto-dismiss countdown using the current `duration` value.
   * No-op if not currently open or if auto-dismiss is disabled
   * (`type === "loading"` or `duration <= 0`). Used by the imperative facade
   * after promise transitions and `toast.update()` calls.
   */
  resetTimer(): void {
    if (this.#state !== "open") return;
    this.#clearTimer();
    this.#startTimerIfNeeded();
  }

  #handleRequestDismiss = (e: CustomEvent<{ reason: ToastDismissReason }>): void => {
    e.stopPropagation();
    this.#beginClose(e.detail?.reason ?? "programmatic");
  };

  /** Keyboard dismiss: Delete/Backspace while focus is inside the toast. */
  #handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    const target = e.target as HTMLElement | null;
    if (!target) return;
    // Don't intercept text-editing keystrokes.
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return;
    }
    e.preventDefault();
    this.#beginClose("keyboard");
  };

  /** Click-delegation: any descendant with [data-toast-dismiss] dismisses. */
  #handleDelegatedDismiss = (e: Event): void => {
    const path = e.composedPath();
    for (const node of path) {
      if (node === this) break;
      if (
        node instanceof Element &&
        node.hasAttribute("data-toast-dismiss")
      ) {
        const reason = (node.getAttribute("data-toast-dismiss-reason") ??
          "close") as ToastDismissReason;
        this.#beginClose(reason);
        return;
      }
    }
  };

  // ---- ARIA wiring via slot inspection ----

  #handleTitleSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this.#hasTitle = slot.assignedNodes({ flatten: true }).length > 0;
  };
  #handleDescriptionSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this.#hasDescription = slot.assignedNodes({ flatten: true }).length > 0;
  };

  // ---- item context provided to descendants ----

  #dismissFromChild = (reason: ToastDismissReason): void => {
    this.#beginClose(reason);
  };

  @provide({ context: toastItemContext })
  @state()
  accessor _itemCtx: ToastItemContext = this.#buildItemContext();

  #buildItemContext(): ToastItemContext {
    return {
      id: this.#effectiveId,
      dismiss: this.#dismissFromChild,
    };
  }

  // ---- render ----

  override render(): TemplateResult {
    const role = this.priority === "assertive" ? "alert" : "status";
    const ariaLive = this.priority;

    return html`
      <div
        part="root"
        role=${role}
        aria-live=${ariaLive}
        aria-atomic="true"
        aria-labelledby=${this.headless
          ? ""
          : (this.#hasTitle ? this.#titleId : "")}
        aria-describedby=${this.headless
          ? ""
          : (this.#hasDescription ? this.#descriptionId : "")}
        data-type=${this.type}
        ?data-starting-style=${this.#startingStyle}
        ?data-ending-style=${this.#endingStyle}
      >
        ${this.headless
          ? html`<slot></slot>`
          : html`
              <div part="title" id=${this.#titleId}>
                <slot
                  name="title"
                  @slotchange=${this.#handleTitleSlotChange}
                ></slot>
              </div>
              <div part="description" id=${this.#descriptionId}>
                <slot
                  name="description"
                  @slotchange=${this.#handleDescriptionSlotChange}
                ></slot>
              </div>
              <slot></slot>
              <slot name="action"></slot>
              <slot name="close"></slot>
            `}
      </div>
    `;
  }
}
