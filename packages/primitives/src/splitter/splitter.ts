import { css, html, LitElement, type TemplateResult } from "lit";
import { property, query, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import {
  type SplitterContext,
  splitterContext,
  type SplitterHandleAria,
  type SplitterHandleMeta,
  type SplitterPanelMeta,
} from "./splitter-context.ts";

export const valueChangeEvent = customEvent<number[]>("value-change", {
  bubbles: true,
  composed: true,
});

const styles = css`
  :host {
    display: block;
    /*
     * Splitters are layout components — they have no intrinsic content of
     * their own. Filling the parent is the universal expectation (matches
     * react-resizable-panels, Radix Vue, Ark UI). Without an explicit height,
     * percentage flex-basis on vertical panels collapses against an
     * indefinite container. Consumers can override on the host to opt out.
     */
    width: 100%;
    height: 100%;
  }

  [part="root"] {
    display: flex;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  [part="root"][data-orientation="horizontal"] {
    flex-direction: row;
  }

  [part="root"][data-orientation="vertical"] {
    flex-direction: column;
  }
`;

const PANEL_TAG = "DUI-SPLITTER-PANEL";
const HANDLE_TAG = "DUI-SPLITTER-HANDLE";

type PanelWithId = HTMLElement & { panelId: string };

/**
 * Distribute initial sizes across panels. Panels with `defaultSize` use it;
 * unsized panels share the remainder equally. If no panel is sized, all
 * panels are equal. Result is normalized to sum to 100.
 */
function distributeInitialSizes(panels: readonly SplitterPanelMeta[]): number[] {
  const n = panels.length;
  if (n === 0) return [];

  const sized = panels.map((p) => p.defaultSize);
  const sizedTotal = sized.reduce<number>((a, b) => a + (b ?? 0), 0);
  const unsizedCount = sized.filter((s) => s === undefined).length;

  let raw: number[];
  if (unsizedCount === 0) {
    raw = sized.map((s) => s ?? 0);
  } else {
    const remaining = Math.max(0, 100 - sizedTotal);
    const perUnsized = remaining / unsizedCount;
    raw = sized.map((s) => s ?? perUnsized);
  }

  return normalizeSum(raw);
}

/** Scale an array so it sums to 100. Equal distribution if total is 0. */
function normalizeSum(sizes: readonly number[]): number[] {
  const n = sizes.length;
  if (n === 0) return [];
  const total = sizes.reduce((a, b) => a + b, 0);
  if (total <= 0) {
    const equal = 100 / n;
    return sizes.map(() => equal);
  }
  return sizes.map((s) => (s * 100) / total);
}

/**
 * Two-panel resize math. Given a base sizes array and a signed delta in
 * percent for the boundary between `beforeIdx` and `afterIdx`, return the
 * new sizes array with the delta applied and clamped against both panels'
 * `[minSize, maxSize]`. No cascading to non-adjacent panels (v1).
 */
function applyHandleDelta(
  baseSizes: readonly number[],
  panels: readonly SplitterPanelMeta[],
  beforeIdx: number,
  afterIdx: number,
  deltaPct: number,
): number[] {
  const result = [...baseSizes];
  const a = beforeIdx;
  const b = afterIdx;
  if (a < 0 || b < 0 || a >= result.length || b >= result.length) return result;

  const proposedA = result[a] + deltaPct;
  const clampA = Math.min(
    panels[a].maxSize,
    Math.max(panels[a].minSize, proposedA),
  );
  let applied = clampA - result[a];

  const proposedB = result[b] - applied;
  if (proposedB < panels[b].minSize) {
    applied = result[b] - panels[b].minSize;
  } else if (proposedB > panels[b].maxSize) {
    applied = result[b] - panels[b].maxSize;
  }

  result[a] += applied;
  result[b] -= applied;
  return result;
}

/**
 * Clamp every size into its panel's [minSize, maxSize], then iteratively
 * push any sum-deficit/surplus into panels that still have slack.
 * Bounded loop prevents pathological inputs (e.g. minSum > 100) from spinning.
 */
function clampToConstraints(
  sizes: readonly number[],
  panels: readonly SplitterPanelMeta[],
): number[] {
  const n = sizes.length;
  if (n === 0) return [];

  const result = sizes.map((s, i) =>
    Math.min(panels[i].maxSize, Math.max(panels[i].minSize, s)),
  );

  for (let iter = 0; iter < 10; iter++) {
    const sum = result.reduce((a, b) => a + b, 0);
    const diff = 100 - sum;
    if (Math.abs(diff) < 0.001) break;

    const adjustable = result
      .map((s, i) => {
        const slack = diff > 0 ? panels[i].maxSize - s : s - panels[i].minSize;
        return { i, slack };
      })
      .filter(({ slack }) => slack > 0.0001);

    if (adjustable.length === 0) break;

    const totalSlack = adjustable.reduce((a, b) => a + b.slack, 0);
    const portion = Math.min(Math.abs(diff), totalSlack);
    const sign = Math.sign(diff);

    for (const { i, slack } of adjustable) {
      result[i] += (slack / totalSlack) * portion * sign;
    }
  }

  return result;
}

/**
 * `<dui-splitter>` — Resizable panel group (WAI-ARIA Window Splitter).
 *
 * Provides orientation, sizes, and registration plumbing for child
 * `<dui-splitter-panel>` and `<dui-splitter-handle>` elements via Lit Context.
 *
 * @slot - Splitter panels and handles in DOM order.
 * @csspart root - The flex container element.
 * @fires value-change - Fires when sizes change. `detail` is `number[]` (percentages, sum 100).
 */
export class DuiSplitterPrimitive extends LitElement {
  static tagName = "dui-splitter" as const;
  static override styles = [base, styles];

  @property({ type: String, reflect: true })
  accessor orientation: "horizontal" | "vertical" = "horizontal";

  @property({ type: Array })
  accessor value: number[] | undefined = undefined;

  @property({ type: Array, attribute: "default-value" })
  accessor defaultValue: number[] = [];

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: Number, attribute: "keyboard-step" })
  accessor keyboardStep = 10;

  @property({ type: Number, attribute: "keyboard-step-large" })
  accessor keyboardStepLarge = 25;

  @property({ type: String, attribute: "auto-save-id" })
  accessor autoSaveId: string | undefined = undefined;

  @query("slot")
  accessor #slot!: HTMLSlotElement;

  /** Uncontrolled sizes (canonical when `value === undefined`). */
  @state()
  accessor #internalSizes: number[] = [];

  /** Whether `#internalSizes` has been seeded from defaults yet. */
  #seeded = false;

  /**
   * Snapshot of the sizes that the current panel set was first laid out
   * with. Used as the target for `resetHandle()` (double-click). Refreshed
   * only when the panel set changes (add/remove), not on subsequent drags.
   */
  #initialSizes: number[] = [];

  /** Whether a pointer drag is in progress (any handle). */
  @state()
  accessor #resizing = false;

  /** All registered panels keyed by panelId. */
  #panelRegistry = new Map<string, SplitterPanelMeta>();

  /** All registered handles keyed by generated handle id. */
  #handleRegistry = new Map<string, SplitterHandleMeta>();

  /** Reverse lookup: handle element → generated id (stable across re-registration). */
  #handleIds = new WeakMap<HTMLElement, string>();
  #nextHandleId = 0;

  /** Panel ids in DOM order, derived from slot's assigned elements. */
  #panelOrder: string[] = [];

  /**
   * For each handle id, the panel id immediately before it (the one this
   * handle resizes against its successor). Derived from slot order.
   */
  #handleBeforePanel = new Map<string, string>();

  /**
   * For each handle id, the panel id immediately after it. Derived from
   * slot order. A handle without an after-panel (trailing handle) cannot
   * be dragged.
   */
  #handleAfterPanel = new Map<string, string>();

  /** Active drag state, or null. */
  #dragState: {
    handleId: string;
    startSizes: number[];
    startCoord: number;
    rootSize: number;
    pointerId: number;
    /**
     * Whether the pointerdown has been promoted to a real drag (movement
     * past the threshold). False during a click-without-movement so that
     * `data-dragging` doesn't flicker and `value-change` isn't dispatched
     * for bare clicks.
     */
    active: boolean;
  } | null = null;

  @state()
  accessor #draggingHandleId: string | undefined = undefined;

  /** Pending storage write timer (debounced). */
  #saveTimer: ReturnType<typeof setTimeout> | null = null;

  // ---- Public registration API (provided via context) ---------------------

  #registerPanel = (meta: SplitterPanelMeta): void => {
    this.#panelRegistry.set(meta.id, meta);
    this.#scheduleRecompute();
  };

  #unregisterPanel = (id: string): void => {
    this.#panelRegistry.delete(id);
    this.#scheduleRecompute();
  };

  #getPanelSize = (id: string): number => {
    const idx = this.#panelOrder.indexOf(id);
    if (idx === -1) return 0;
    const sizes = this.#getEffectiveSizes();
    return sizes[idx] ?? 0;
  };

  #registerHandle = (meta: SplitterHandleMeta): string => {
    let id = this.#handleIds.get(meta.el);
    if (!id) {
      id = `h${this.#nextHandleId++}`;
      this.#handleIds.set(meta.el, id);
    }
    this.#handleRegistry.set(id, meta);
    this.#scheduleRecompute();
    return id;
  };

  #unregisterHandle = (handleId: string): void => {
    this.#handleRegistry.delete(handleId);
    this.#scheduleRecompute();
  };

  #updateHandle = (
    handleId: string,
    patch: Partial<SplitterHandleMeta>,
  ): void => {
    const current = this.#handleRegistry.get(handleId);
    if (!current) return;
    this.#handleRegistry.set(handleId, { ...current, ...patch });
    this.requestUpdate();
  };

  #beginDrag = (handleId: string, ev: PointerEvent): void => {
    if (this.disabled) return;
    const handle = this.#handleRegistry.get(handleId);
    if (!handle || handle.disabled) return;

    // A handle can only drag if it has both a before- and after-panel.
    const beforeId = this.#handleBeforePanel.get(handleId);
    const afterId = this.#handleAfterPanel.get(handleId);
    if (!beforeId || !afterId) return;

    const rect = this.getBoundingClientRect();
    const isHorizontal = this.orientation === "horizontal";
    const rootSize = isHorizontal ? rect.width : rect.height;
    if (rootSize <= 0) return;

    this.#dragState = {
      handleId,
      startSizes: [...this.#getEffectiveSizes()],
      startCoord: isHorizontal ? ev.clientX : ev.clientY,
      rootSize,
      pointerId: ev.pointerId,
      active: false,
    };

    // Listen on `window` so movement is tracked regardless of where the
    // cursor goes — critical because handles are typically only a few
    // pixels thick. We intentionally avoid `setPointerCapture()`: in
    // WebKit (and some Chromium versions) capture suppresses the
    // synthesized click / dblclick events, breaking double-click-to-reset.
    window.addEventListener("pointermove", this.#onPointerMove);
    window.addEventListener("pointerup", this.#onPointerUp);
    window.addEventListener("pointercancel", this.#onPointerUp);
  };

  #onPointerMove = (ev: PointerEvent): void => {
    const state = this.#dragState;
    if (!state || ev.pointerId !== state.pointerId) return;
    if (this.disabled) {
      this.#endDrag();
      return;
    }
    const isHorizontal = this.orientation === "horizontal";
    const coord = isHorizontal ? ev.clientX : ev.clientY;
    const pxDelta = coord - state.startCoord;

    // Promote to an actual drag once the user has moved past 1px. Below
    // the threshold this is still a click-in-progress and we don't want
    // to dispatch value-change or flip data-dragging.
    if (!state.active) {
      if (Math.abs(pxDelta) < 1) return;
      state.active = true;
      this.#resizing = true;
      this.#draggingHandleId = state.handleId;
    }

    const pctDelta = (pxDelta / state.rootSize) * 100;
    const next = this.#computeFromBaseSizes(
      state.handleId,
      state.startSizes,
      pctDelta,
    );
    if (next) this.#commitSizes(next);
  };

  #onPointerUp = (ev: PointerEvent): void => {
    const state = this.#dragState;
    if (!state || ev.pointerId !== state.pointerId) return;
    this.#endDrag();
  };

  #endDrag(): void {
    const state = this.#dragState;
    if (!state) return;
    window.removeEventListener("pointermove", this.#onPointerMove);
    window.removeEventListener("pointerup", this.#onPointerUp);
    window.removeEventListener("pointercancel", this.#onPointerUp);
    const wasDragging = state.active;
    this.#dragState = null;
    this.#resizing = false;
    this.#draggingHandleId = undefined;
    // Only flush save when an actual drag occurred (not a bare click).
    if (wasDragging) this.#flushSave();
  }

  #nudge = (handleId: string, deltaPct: number): void => {
    if (this.disabled) return;
    const handle = this.#handleRegistry.get(handleId);
    if (!handle || handle.disabled) return;
    if (!Number.isFinite(deltaPct) || deltaPct === 0) return;

    // Keyboard nudges are incremental from the *current* sizes.
    const current = [...this.#getEffectiveSizes()];
    const next = this.#computeFromBaseSizes(handleId, current, deltaPct);
    if (next) this.#commitSizes(next);
  };

  /**
   * Reset the two panels adjacent to a handle to their initial sizes.
   * Computed as a single boundary nudge so only those two panels move —
   * the rest of the layout is preserved.
   */
  #resetHandle = (handleId: string): void => {
    if (this.disabled) return;
    const handle = this.#handleRegistry.get(handleId);
    if (!handle || handle.disabled) return;

    const beforeId = this.#handleBeforePanel.get(handleId);
    if (!beforeId) return;
    const beforeIdx = this.#panelOrder.indexOf(beforeId);
    if (beforeIdx === -1 || beforeIdx >= this.#initialSizes.length) return;

    const current = this.#getEffectiveSizes();
    const targetBefore = this.#initialSizes[beforeIdx];
    const delta = targetBefore - current[beforeIdx];
    if (Math.abs(delta) < 0.01) return;

    this.#nudge(handleId, delta);
  };

  /**
   * Compute new sizes for a handle drag/nudge against an arbitrary base.
   * Returns null if the handle is not draggable in current state.
   */
  #computeFromBaseSizes(
    handleId: string,
    baseSizes: readonly number[],
    deltaPct: number,
  ): number[] | null {
    const beforeId = this.#handleBeforePanel.get(handleId);
    const afterId = this.#handleAfterPanel.get(handleId);
    if (!beforeId || !afterId) return null;

    const beforeIdx = this.#panelOrder.indexOf(beforeId);
    const afterIdx = this.#panelOrder.indexOf(afterId);
    if (beforeIdx === -1 || afterIdx === -1) return null;
    if (baseSizes.length !== this.#panelOrder.length) return null;

    const panels = this.#panelOrder
      .map((id) => this.#panelRegistry.get(id))
      .filter((p): p is SplitterPanelMeta => p !== undefined);
    if (panels.length !== this.#panelOrder.length) return null;

    return applyHandleDelta(baseSizes, panels, beforeIdx, afterIdx, deltaPct);
  }

  /** Commit a new sizes array — write to internal state if uncontrolled, dispatch event always. */
  #commitSizes(next: number[]): void {
    if (this.value === undefined) {
      this.#internalSizes = next;
      this.#scheduleSave();
    }
    this.dispatchEvent(valueChangeEvent([...next]));
    this.requestUpdate();
  }

  // ---- Persistence -------------------------------------------------------

  /**
   * Storage key for the current autoSaveId + panel-set signature. Keying by
   * signature avoids restoring a stale layout when panels are added/removed.
   * Returns null when persistence should be skipped (no id, no panels, or
   * controlled mode).
   */
  #storageKey(): string | null {
    if (!this.autoSaveId) return null;
    if (this.value !== undefined) return null;
    if (this.#panelOrder.length === 0) return null;
    const signature = [...this.#panelOrder].sort().join("|");
    return `dui-splitter:${this.autoSaveId}:${signature}`;
  }

  #loadFromStorage(): number[] | null {
    const key = this.#storageKey();
    if (!key) return null;
    try {
      const raw = globalThis.localStorage?.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.every((n) => typeof n === "number" && Number.isFinite(n))
      ) {
        return parsed;
      }
    } catch {
      // Storage unavailable, JSON malformed, or quota error — ignore.
    }
    return null;
  }

  #scheduleSave(): void {
    if (!this.autoSaveId) return;
    if (this.#saveTimer !== null) clearTimeout(this.#saveTimer);
    this.#saveTimer = setTimeout(() => {
      this.#saveTimer = null;
      this.#writeToStorage();
    }, 250);
  }

  #flushSave(): void {
    if (this.#saveTimer !== null) {
      clearTimeout(this.#saveTimer);
      this.#saveTimer = null;
    }
    this.#writeToStorage();
  }

  #writeToStorage(): void {
    const key = this.#storageKey();
    if (!key) return;
    try {
      globalThis.localStorage?.setItem(
        key,
        JSON.stringify(this.#internalSizes),
      );
    } catch {
      // SSR, private mode, quota — ignore.
    }
  }

  #getHandleAria = (handleId: string): SplitterHandleAria | null => {
    const beforeId = this.#handleBeforePanel.get(handleId);
    if (!beforeId) return null;
    const panel = this.#panelRegistry.get(beforeId);
    if (!panel) return null;
    const size = this.#getPanelSize(beforeId);
    return {
      valueNow: Math.round(size),
      valueMin: panel.minSize,
      valueMax: panel.maxSize,
      controls: beforeId,
    };
  };

  // ---- Context object (rebuilt on every update) ---------------------------

  @provide({ context: splitterContext })
  @state()
  accessor _ctx: SplitterContext = this.#buildContext();

  #buildContext(): SplitterContext {
    return {
      orientation: this.orientation,
      disabled: this.disabled,
      resizing: this.#resizing,
      draggingHandleId: this.#draggingHandleId,
      keyboardStep: this.keyboardStep,
      keyboardStepLarge: this.keyboardStepLarge,
      registerPanel: this.#registerPanel,
      unregisterPanel: this.#unregisterPanel,
      getPanelSize: this.#getPanelSize,
      registerHandle: this.#registerHandle,
      unregisterHandle: this.#unregisterHandle,
      updateHandle: this.#updateHandle,
      beginDrag: this.#beginDrag,
      nudge: this.#nudge,
      resetHandle: this.#resetHandle,
      getHandleAria: this.#getHandleAria,
    };
  }

  // ---- Size source-of-truth -----------------------------------------------

  /** Resolved sizes: controlled value if set, else internal state. */
  #getEffectiveSizes(): readonly number[] {
    if (this.value !== undefined) {
      return this.#validateControlledValue(this.value);
    }
    return this.#internalSizes;
  }

  #validateControlledValue(value: readonly number[]): readonly number[] {
    if (value.length !== this.#panelOrder.length) {
      // Length mismatch — fall back to even distribution for render.
      const n = this.#panelOrder.length;
      if (n === 0) return [];
      const equal = 100 / n;
      return Array.from({ length: n }, () => equal);
    }
    return normalizeSum(value);
  }

  // ---- Recompute & lifecycle ---------------------------------------------

  #recomputePending = false;

  #scheduleRecompute(): void {
    if (this.#recomputePending) return;
    this.#recomputePending = true;
    queueMicrotask(() => {
      this.#recomputePending = false;
      this.#recomputeOrder();
      this.#recomputeSizes();
      this.requestUpdate();
    });
  }

  /** Walk slotted children to derive panel order and handle adjacency. */
  #recomputeOrder(): void {
    const slot = this.#slot;
    if (!slot) {
      this.#panelOrder = [];
      this.#handleBeforePanel = new Map();
      this.#handleAfterPanel = new Map();
      return;
    }

    const assigned = slot.assignedElements();
    const orderedPanelIds: string[] = [];
    const beforeMap = new Map<string, string>();
    const afterMap = new Map<string, string>();
    const pendingHandlesAwaitingAfter: string[] = [];

    let lastPanelId: string | undefined;
    for (const el of assigned) {
      const tag = el.tagName;
      if (tag === PANEL_TAG) {
        const id = (el as PanelWithId).panelId;
        if (id && this.#panelRegistry.has(id)) {
          orderedPanelIds.push(id);
          // Any handles since the previous panel now have an after-panel.
          for (const handleId of pendingHandlesAwaitingAfter) {
            afterMap.set(handleId, id);
          }
          pendingHandlesAwaitingAfter.length = 0;
          lastPanelId = id;
        }
      } else if (tag === HANDLE_TAG) {
        const handleId = this.#handleIds.get(el as HTMLElement);
        if (handleId && lastPanelId) {
          beforeMap.set(handleId, lastPanelId);
          pendingHandlesAwaitingAfter.push(handleId);
        }
      }
    }

    this.#panelOrder = orderedPanelIds;
    this.#handleBeforePanel = beforeMap;
    this.#handleAfterPanel = afterMap;
  }

  /**
   * Reseed `#internalSizes` from defaults / current panel meta. Only runs in
   * uncontrolled mode (when `this.value` is `undefined`). In controlled mode,
   * sizes flow directly from the `value` prop on read.
   */
  #recomputeSizes(): void {
    const panels = this.#panelOrder
      .map((id) => this.#panelRegistry.get(id))
      .filter((p): p is SplitterPanelMeta => p !== undefined);

    if (panels.length === 0) {
      this.#internalSizes = [];
      this.#initialSizes = [];
      return;
    }

    if (this.value !== undefined) {
      // Controlled: capture initial snapshot once per panel set.
      this.#seeded = true;
      if (this.#initialSizes.length !== panels.length) {
        this.#initialSizes = clampToConstraints(
          this.#getEffectiveSizes(),
          panels,
        );
      }
      return;
    }

    let next: number[];
    if (!this.#seeded) {
      // First seed: storage > defaultValue > per-panel defaultSize > equal.
      const stored = this.#loadFromStorage();
      if (stored && stored.length === panels.length) {
        next = normalizeSum(stored);
      } else if (this.defaultValue.length === panels.length) {
        next = normalizeSum(this.defaultValue);
      } else {
        next = distributeInitialSizes(panels);
      }
      this.#seeded = true;
    } else if (this.#internalSizes.length !== panels.length) {
      // Panel set changed (added/removed) — redistribute.
      next = distributeInitialSizes(panels);
    } else {
      next = [...this.#internalSizes];
    }

    this.#internalSizes = clampToConstraints(next, panels);

    // Refresh the initial-sizes snapshot when the panel set changes.
    if (this.#initialSizes.length !== panels.length) {
      this.#initialSizes = [...this.#internalSizes];
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._ctx = this.#buildContext();
  }

  override willUpdate(changedProps: Map<string, unknown>): void {
    // Abort an in-flight drag if the splitter becomes disabled mid-drag.
    if (
      changedProps.has("disabled") &&
      this.disabled &&
      this.#dragState !== null
    ) {
      this.#endDrag();
    }
    this._ctx = this.#buildContext();
  }

  override firstUpdated(): void {
    // Slot is now in the DOM — wire change listener and do an initial pass.
    this.#slot?.addEventListener("slotchange", this.#onSlotChange);
    this.#recomputeOrder();
    this.#recomputeSizes();
    this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#slot?.removeEventListener("slotchange", this.#onSlotChange);
    if (this.#saveTimer !== null) {
      clearTimeout(this.#saveTimer);
      this.#saveTimer = null;
    }
  }

  #onSlotChange = (): void => {
    this.#scheduleRecompute();
  };

  override render(): TemplateResult {
    return html`
      <div
        part="root"
        data-orientation=${this.orientation}
        ?data-disabled=${this.disabled}
        ?data-resizing=${this.#resizing}
      >
        <slot></slot>
      </div>
    `;
  }
}
