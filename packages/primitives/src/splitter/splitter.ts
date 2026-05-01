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

export const collapseChangeEvent = customEvent<{
  panelId: string;
  collapsed: boolean;
}>("collapse-change", {
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
 * Effective minimum size for a panel: 0 if currently collapsed (so its
 * size can rest at 0 without the constraint solver fighting it), else its
 * declared `minSize`.
 */
function effectiveMin(
  panel: SplitterPanelMeta,
  collapsed: ReadonlySet<string>,
): number {
  return collapsed.has(panel.id) ? 0 : panel.minSize;
}

/**
 * Two-panel resize math. Given a base sizes array and a signed delta in
 * percent for the boundary between `beforeIdx` and `afterIdx`, return the
 * new sizes array with the delta applied and clamped against both panels'
 * `[minSize, maxSize]`. No cascading to non-adjacent panels (v1).
 *
 * Collapsed panels are treated as having `minSize = 0` so an adjacent drag
 * can't accidentally re-inflate them.
 */
function applyHandleDelta(
  baseSizes: readonly number[],
  panels: readonly SplitterPanelMeta[],
  beforeIdx: number,
  afterIdx: number,
  deltaPct: number,
  collapsed: ReadonlySet<string>,
): number[] {
  const result = [...baseSizes];
  const a = beforeIdx;
  const b = afterIdx;
  if (a < 0 || b < 0 || a >= result.length || b >= result.length) return result;

  const minA = effectiveMin(panels[a], collapsed);
  const minB = effectiveMin(panels[b], collapsed);

  const proposedA = result[a] + deltaPct;
  const clampA = Math.min(panels[a].maxSize, Math.max(minA, proposedA));
  let applied = clampA - result[a];

  const proposedB = result[b] - applied;
  if (proposedB < minB) {
    applied = result[b] - minB;
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
 *
 * Collapsed panels are treated as having `minSize = 0` so they're permitted
 * to rest at 0 without the redistributor inflating them. Their `maxSize` is
 * also pinned to 0 so the redistributor can't spill surplus into them.
 */
function clampToConstraints(
  sizes: readonly number[],
  panels: readonly SplitterPanelMeta[],
  collapsed: ReadonlySet<string>,
): number[] {
  const n = sizes.length;
  if (n === 0) return [];

  const result = sizes.map((s, i) => {
    if (collapsed.has(panels[i].id)) return 0;
    return Math.min(panels[i].maxSize, Math.max(panels[i].minSize, s));
  });

  for (let iter = 0; iter < 10; iter++) {
    const sum = result.reduce((a, b) => a + b, 0);
    const diff = 100 - sum;
    if (Math.abs(diff) < 0.001) break;

    const adjustable = result
      .map((s, i) => {
        if (collapsed.has(panels[i].id)) return { i, slack: 0 };
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
   * with. Used as the target for `resetHandle()` (double-click) and
   * `resetSizes()`. Refreshed only when the panel set changes (add/remove),
   * not on subsequent drags.
   */
  #initialSizes: number[] = [];

  /**
   * Panels currently flagged as collapsed. Their sizes are held at 0 and
   * the constraint solver treats their `minSize` as 0 (overriding any
   * declared minimum — collapse explicitly bypasses it).
   */
  #collapsed = new Set<string>();

  /**
   * For each currently-collapsed panel, the size it had immediately before
   * being collapsed. Used by `expandPanel()` to restore. Not persisted
   * across reloads — rehydrated-collapsed panels expand to `defaultSize`
   * (or an equal share) instead.
   */
  #collapsedFrom = new Map<string, number>();

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
    const rootRect = isHorizontal ? rect.width : rect.height;
    if (rootRect <= 0) return;

    // Panels share `container - sum(handles)` (grow-based layout in
    // splitter-panel.ts), so the drag math must use the same budget.
    // Without this subtraction, percentage deltas applied to panel pixel
    // sizes would under-shoot pointer movement and the cursor would drift
    // away from the handle during long drags.
    let totalHandleSize = 0;
    for (const meta of this.#handleRegistry.values()) {
      const r = meta.el.getBoundingClientRect();
      totalHandleSize += isHorizontal ? r.width : r.height;
    }
    const rootSize = rootRect - totalHandleSize;
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
    const startSizes = state.startSizes;
    this.#dragState = null;
    this.#resizing = false;
    this.#draggingHandleId = undefined;
    if (wasDragging) {
      // Auto-collapse runs only on drag end (not during pointermove) to
      // avoid `data-collapsed` flickering on/off as the user drags through
      // 0. `startSizes` is the snapshot at drag start — used as the
      // pre-collapse size to remember for `expandPanel()` restore.
      this.#autoCollapseAtZero(startSizes);
      this.#flushSave();
    }
  }

  // ---- Public imperative API ---------------------------------------------

  /**
   * Current effective sizes (controlled `value` if set, else internal
   * state). Returned as a defensive copy.
   */
  getSizes(): number[] {
    return [...this.#getEffectiveSizes()];
  }

  /**
   * Size for a single panel by id. Returns 0 if the id is unknown.
   */
  getPanelSize(panelId: string): number {
    return this.#getPanelSize(panelId);
  }

  /** Whether a panel is currently collapsed. */
  isPanelCollapsed(panelId: string): boolean {
    return this.#collapsed.has(panelId);
  }

  /**
   * Imperatively set every panel's size. `sizes` must have the same length
   * as the current panel set. Values are normalized to sum to 100 and
   * clamped against per-panel constraints (collapsed panels remain at 0).
   *
   * Does not mutate the collapsed set — use `expandPanel(id)` to revive a
   * collapsed panel.
   */
  setSizes(sizes: readonly number[]): void {
    if (this.#panelOrder.length === 0) return;
    if (sizes.length !== this.#panelOrder.length) {
      console.warn(
        `[dui-splitter] setSizes: expected ${this.#panelOrder.length} sizes, got ${sizes.length}`,
      );
      return;
    }
    const panels = this.#orderedPanels();
    if (!panels) return;
    // Force collapsed panels to 0 regardless of caller input.
    const seeded = sizes.map((s, i) =>
      this.#collapsed.has(panels[i].id) ? 0 : s,
    );
    const next = clampToConstraints(
      normalizeSum(seeded),
      panels,
      this.#collapsed,
    );
    this.#commitSizes(next);
  }

  /**
   * Restore all panels to their initial layout (the snapshot taken when
   * the current panel set was first laid out). Also clears any collapsed
   * state, dispatching `collapse-change` for each previously-collapsed
   * panel.
   */
  resetSizes(): void {
    if (this.#panelOrder.length === 0) return;
    const panels = this.#orderedPanels();
    if (!panels) return;

    // End any in-flight drag so it can't fight the reset.
    if (this.#dragState !== null) this.#endDrag();

    // Uncollapse everything; fires `collapse-change` per affected panel.
    for (const id of [...this.#collapsed]) {
      this.#flipCollapsed(id, false);
    }

    const base =
      this.#initialSizes.length === panels.length
        ? [...this.#initialSizes]
        : distributeInitialSizes(panels);
    const next = clampToConstraints(base, panels, this.#collapsed);
    this.#commitSizes(next);
  }

  /**
   * Force a panel to size 0, donating its space to neighbors. The panel's
   * `minSize` is bypassed for the duration of the collapse. Donation
   * heuristic: prefer the after-neighbor if it has slack, else the
   * before-neighbor, else distribute proportionally across other panels.
   *
   * No-op if the panel is unknown or already collapsed.
   */
  collapsePanel(panelId: string): void {
    if (this.#panelOrder.length === 0) return;
    if (this.#collapsed.has(panelId)) return;
    const idx = this.#panelOrder.indexOf(panelId);
    if (idx === -1) {
      console.warn(`[dui-splitter] collapsePanel: unknown panel id "${panelId}"`);
      return;
    }
    const panels = this.#orderedPanels();
    if (!panels) return;

    if (this.#dragState !== null) this.#endDrag();

    const current = [...this.#getEffectiveSizes()];
    const donated = current[idx];
    if (donated <= 0) {
      // Already effectively zero — just flag it.
      this.#flipCollapsed(
        panelId,
        true,
        panels[idx].defaultSize ?? 100 / panels.length,
      );
      this.#commitSizes(
        clampToConstraints(current, panels, this.#collapsed),
      );
      return;
    }

    const next = [...current];
    next[idx] = 0;

    // Pick recipient(s) for the donated size.
    const after = idx + 1;
    const before = idx - 1;
    const slackOf = (i: number) => panels[i].maxSize - current[i];

    if (after < panels.length && slackOf(after) >= donated - 0.0001) {
      next[after] = current[after] + donated;
    } else if (before >= 0 && slackOf(before) >= donated - 0.0001) {
      next[before] = current[before] + donated;
    } else {
      // Proportional fallback across all other panels with slack.
      const recipients = panels
        .map((_, i) => ({ i, slack: i === idx ? 0 : Math.max(0, slackOf(i)) }))
        .filter((r) => r.slack > 0.0001);
      const totalSlack = recipients.reduce((a, r) => a + r.slack, 0);
      if (totalSlack > 0) {
        const portion = Math.min(donated, totalSlack);
        for (const { i, slack } of recipients) {
          next[i] = current[i] + (slack / totalSlack) * portion;
        }
      }
      // If no slack anywhere, the redistributor in clampToConstraints will
      // sort out whatever it can.
    }

    this.#flipCollapsed(panelId, true, donated);

    this.#commitSizes(clampToConstraints(next, panels, this.#collapsed));
  }

  /**
   * Restore a previously-collapsed panel to its remembered size. If the
   * collapsed state was rehydrated from storage (no in-memory snapshot of
   * the prior size), the panel restores to its `defaultSize` or an equal
   * share. Space is reclaimed from the same neighbor it was donated to,
   * falling back to proportional withdrawal if that neighbor lacks slack.
   *
   * No-op if the panel is unknown or not collapsed.
   */
  expandPanel(panelId: string): void {
    if (this.#panelOrder.length === 0) return;
    if (!this.#collapsed.has(panelId)) return;
    const idx = this.#panelOrder.indexOf(panelId);
    if (idx === -1) return;
    const panels = this.#orderedPanels();
    if (!panels) return;

    if (this.#dragState !== null) this.#endDrag();

    const restoreAmt =
      this.#collapsedFrom.get(panelId) ??
      panels[idx].defaultSize ??
      100 / panels.length;

    // Mark uncollapsed *before* clamp so the panel's real minSize applies.
    this.#flipCollapsed(panelId, false);

    const current = [...this.#getEffectiveSizes()];
    const next = [...current];
    next[idx] = restoreAmt;

    // Reclaim from neighbors. Prefer the after-neighbor (mirror of collapse
    // donation), then before, then proportional withdrawal.
    const after = idx + 1;
    const before = idx - 1;
    const giveOf = (i: number) =>
      Math.max(0, current[i] - effectiveMin(panels[i], this.#collapsed));

    let taken = 0;
    if (after < panels.length && giveOf(after) >= restoreAmt - 0.0001) {
      next[after] = current[after] - restoreAmt;
      taken = restoreAmt;
    } else if (before >= 0 && giveOf(before) >= restoreAmt - 0.0001) {
      next[before] = current[before] - restoreAmt;
      taken = restoreAmt;
    } else {
      // Proportional withdrawal across all panels with slack to give.
      const donors = panels
        .map((_, i) => ({ i, slack: i === idx ? 0 : giveOf(i) }))
        .filter((d) => d.slack > 0.0001);
      const totalSlack = donors.reduce((a, d) => a + d.slack, 0);
      const portion = Math.min(restoreAmt, totalSlack);
      for (const { i, slack } of donors) {
        next[i] = current[i] - (slack / totalSlack) * portion;
      }
      taken = portion;
    }
    // If we couldn't take the full restoreAmt, scale down what we put back
    // so the array still sums right. clampToConstraints will handle the
    // tail end via its redistribution loop.
    if (taken < restoreAmt - 0.0001) {
      next[idx] = taken;
    }

    this.#commitSizes(clampToConstraints(next, panels, this.#collapsed));
  }

  /** Helper: build the ordered panel-meta array, or null if registration is incomplete. */
  #orderedPanels(): SplitterPanelMeta[] | null {
    const panels = this.#panelOrder
      .map((id) => this.#panelRegistry.get(id))
      .filter((p): p is SplitterPanelMeta => p !== undefined);
    if (panels.length !== this.#panelOrder.length) return null;
    return panels;
  }

  // ---- Drag / keyboard nudge ---------------------------------------------

  #nudge = (handleId: string, deltaPct: number): void => {
    if (this.disabled) return;
    const handle = this.#handleRegistry.get(handleId);
    if (!handle || handle.disabled) return;
    if (!Number.isFinite(deltaPct) || deltaPct === 0) return;

    // Keyboard nudges are incremental from the *current* sizes.
    const current = [...this.#getEffectiveSizes()];
    const next = this.#computeFromBaseSizes(handleId, current, deltaPct);
    if (!next) return;
    this.#commitSizes(next);
    // Discrete commit — unlike pointermove, no flicker risk, so run the
    // auto-collapse pass after every nudge. `current` is the pre-nudge
    // snapshot, used as the remembered pre-collapse size.
    this.#autoCollapseAtZero(current);
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

    return applyHandleDelta(
      baseSizes,
      panels,
      beforeIdx,
      afterIdx,
      deltaPct,
      this.#collapsed,
    );
  }

  /** Commit a new sizes array — write to internal state if uncontrolled, dispatch event always. */
  #commitSizes(next: number[]): void {
    // Auto-uncollapse: any panel currently flagged collapsed whose
    // committed size has risen above the threshold (e.g. a neighbour was
    // dragged/nudged to give it room) is no longer collapsed. Done here
    // — not just on drag end — because a non-zero size with
    // `data-collapsed` set would be visually inconsistent during the
    // drag itself, and the flag flips at most once during a drag (when
    // the panel first leaves zero), so there's no flicker concern.
    if (this.#collapsed.size > 0) {
      for (let i = 0; i < this.#panelOrder.length; i++) {
        const id = this.#panelOrder[i];
        if (this.#collapsed.has(id) && (next[i] ?? 0) > 0.01) {
          this.#flipCollapsed(id, false);
        }
      }
    }
    if (this.value === undefined) {
      this.#internalSizes = next;
      this.#scheduleSave();
    }
    this.dispatchEvent(valueChangeEvent([...next]));
    this.requestUpdate();
  }

  /**
   * Mutate the collapsed set and dispatch `collapse-change` if the state
   * actually changed. Single source of truth for collapsed-flag flips,
   * shared between API (`collapsePanel`/`expandPanel`/`resetSizes`) and
   * drag/nudge auto-collapse paths.
   *
   * `fromSize` is consulted only when collapsing — it's stashed in
   * `#collapsedFrom` so a later `expandPanel(id)` can restore the panel
   * to its pre-collapse size.
   */
  #flipCollapsed(
    panelId: string,
    collapsed: boolean,
    fromSize?: number,
  ): void {
    const has = this.#collapsed.has(panelId);
    if (has === collapsed) return;
    if (collapsed) {
      this.#collapsed.add(panelId);
      if (fromSize !== undefined && fromSize > 0.01) {
        this.#collapsedFrom.set(panelId, fromSize);
      }
    } else {
      this.#collapsed.delete(panelId);
      this.#collapsedFrom.delete(panelId);
    }
    this.dispatchEvent(collapseChangeEvent({ panelId, collapsed }));
    this.requestUpdate();
  }

  /**
   * Flip any `collapsible` panel currently at size ~0 to collapsed.
   * Called after discrete size-committing actions (drag end, keyboard
   * nudge) so consumers see a single clean transition rather than
   * `data-collapsed` toggling per pointermove frame as the user drags
   * through zero.
   *
   * `prevSizes`, when supplied, is the pre-action snapshot of sizes —
   * the entry for each collapsing panel becomes its remembered
   * pre-collapse size for `expandPanel()` restoration.
   */
  #autoCollapseAtZero(prevSizes?: readonly number[]): void {
    if (this.#panelOrder.length === 0) return;
    const sizes = this.#getEffectiveSizes();
    for (let i = 0; i < this.#panelOrder.length; i++) {
      const id = this.#panelOrder[i];
      if (this.#collapsed.has(id)) continue;
      const panel = this.#panelRegistry.get(id);
      if (!panel?.collapsible) continue;
      if ((sizes[i] ?? 0) >= 0.01) continue;
      const remembered = prevSizes?.[i];
      const fromSize =
        remembered !== undefined && remembered > 0.01
          ? remembered
          : (panel.defaultSize ?? 100 / this.#panelOrder.length);
      this.#flipCollapsed(id, true, fromSize);
    }
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

  /**
   * Stored payload shape is `{ sizes, collapsed }`. For back-compat with
   * v1 (which stored a bare `number[]`) we accept either shape on read.
   */
  #loadFromStorage():
    | { sizes: number[]; collapsed: string[] }
    | null {
    const key = this.#storageKey();
    if (!key) return null;
    try {
      const raw = globalThis.localStorage?.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // v1 back-compat: bare array of numbers.
      if (
        Array.isArray(parsed) &&
        parsed.every((n) => typeof n === "number" && Number.isFinite(n))
      ) {
        return { sizes: parsed, collapsed: [] };
      }
      // v2 shape.
      if (
        parsed &&
        typeof parsed === "object" &&
        Array.isArray(parsed.sizes) &&
        parsed.sizes.every(
          (n: unknown) => typeof n === "number" && Number.isFinite(n),
        ) &&
        Array.isArray(parsed.collapsed) &&
        parsed.collapsed.every((id: unknown) => typeof id === "string")
      ) {
        return { sizes: parsed.sizes, collapsed: parsed.collapsed };
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
        JSON.stringify({
          sizes: this.#internalSizes,
          collapsed: [...this.#collapsed],
        }),
      );
    } catch {
      // SSR, private mode, quota — ignore.
    }
  }

  #isPanelCollapsed = (panelId: string): boolean => {
    return this.#collapsed.has(panelId);
  };

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
      isPanelCollapsed: this.#isPanelCollapsed,
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
          this.#collapsed,
        );
      }
      // Drop any collapsed ids no longer present in the registry.
      this.#pruneCollapsed(panels);
      return;
    }

    let next: number[];
    if (!this.#seeded) {
      // First seed: storage > defaultValue > per-panel defaultSize > equal.
      const stored = this.#loadFromStorage();
      if (stored && stored.sizes.length === panels.length) {
        next = normalizeSum(stored.sizes);
        // Rehydrate collapsed ids that are still present in the registry.
        // Force their sizes to 0 (storage drift safety) — the redistributor
        // will rebalance the rest below.
        const known = new Set(panels.map((p) => p.id));
        this.#collapsed = new Set(stored.collapsed.filter((id) => known.has(id)));
        for (let i = 0; i < panels.length; i++) {
          if (this.#collapsed.has(panels[i].id)) next[i] = 0;
        }
      } else if (this.defaultValue.length === panels.length) {
        next = normalizeSum(this.defaultValue);
      } else {
        next = distributeInitialSizes(panels);
      }
      this.#seeded = true;
    } else if (this.#internalSizes.length !== panels.length) {
      // Panel set changed (added/removed) — redistribute.
      this.#pruneCollapsed(panels);
      next = distributeInitialSizes(panels);
    } else {
      next = [...this.#internalSizes];
    }

    this.#internalSizes = clampToConstraints(next, panels, this.#collapsed);

    // Refresh the initial-sizes snapshot when the panel set changes.
    if (this.#initialSizes.length !== panels.length) {
      this.#initialSizes = [...this.#internalSizes];
    }
  }

  /** Drop any collapsed-set / collapsed-from entries for unknown panel ids. */
  #pruneCollapsed(panels: readonly SplitterPanelMeta[]): void {
    const known = new Set(panels.map((p) => p.id));
    for (const id of [...this.#collapsed]) {
      if (!known.has(id)) this.#collapsed.delete(id);
    }
    for (const id of [...this.#collapsedFrom.keys()]) {
      if (!known.has(id)) this.#collapsedFrom.delete(id);
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
