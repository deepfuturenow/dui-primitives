/**
 * Imperative `toast()` facade — Sonner-style ergonomics on top of the
 * declarative `<dui-toast-region>` + `<dui-toast>` primitives.
 *
 * All operations are sugar over DOM manipulation of the same primitives, so
 * imperative and declarative usage can interleave inside the same region.
 */

import { DuiToastActionPrimitive } from "./toast-action.ts";
import { DuiToastClosePrimitive } from "./toast-close.ts";
import { DuiToastRegionPrimitive } from "./toast-region.ts";
import {
  DuiToastPrimitive,
  type ToastPriority,
  type ToastType,
} from "./toast.ts";
import type { ToastPosition } from "./toast-context.ts";

// ---- types ----

export interface ToastAction {
  /** Label rendered inside the action button. */
  label: string;
  /** Click handler. The toast dismisses automatically with reason "action". */
  onClick?: (event: MouseEvent) => void;
}

export interface ToastOptions {
  /** Custom id. If omitted one is generated. Reusing an id updates in place. */
  id?: string;
  /** Description text or DOM node, slotted into the `description` slot. */
  description?: string | Node;
  /** Visual / semantic type. */
  type?: ToastType;
  /** Auto-dismiss timeout (ms). 0 disables. Defaults to configured value. */
  duration?: number;
  /** Live-region politeness. */
  priority?: ToastPriority;
  /** Append a default close button. Falls back to global config. */
  closeButton?: boolean;
  /** Append an action button. */
  action?: ToastAction;
}

export interface PromiseMessages<T> {
  loading: string | Node;
  success: string | Node | ((data: T) => string | Node);
  error: string | Node | ((error: unknown) => string | Node);
}

export interface ToastConfig {
  /** Default region position. */
  position: ToastPosition;
  /** Default auto-dismiss duration (ms). */
  defaultDuration: number;
  /** Default `max-visible` for auto-created regions. */
  maxVisible: number;
  /** Default close-button policy. */
  closeButton: boolean;
  /** Default `expand-on-hover` policy. */
  expandOnHover: boolean;
  /** Selector or element where the auto-created region is appended. */
  target: Element | string;
  /** A pre-existing region to use instead of auto-creating. */
  region?: DuiToastRegionPrimitive;
}

// ---- module state ----

const DEFAULT_CONFIG: ToastConfig = {
  position: "bottom-right",
  defaultDuration: 4000,
  maxVisible: 3,
  closeButton: false,
  expandOnHover: true,
  target: "body",
};

let config: ToastConfig = { ...DEFAULT_CONFIG };
let autoRegion: DuiToastRegionPrimitive | undefined;
const toastMap = new Map<string, DuiToastPrimitive>();

let nextId = 1;
const genId = (): string => `toast-${nextId++}`;

// ---- registration safety net ----

/**
 * Ensure all four primitive classes are registered as custom elements.
 * Convention break: declarative primitives are NOT self-registering, but the
 * imperative API needs working elements at call time.
 */
function ensureRegistered(): void {
  const pairs: Array<[string, CustomElementConstructor]> = [
    [DuiToastRegionPrimitive.tagName, DuiToastRegionPrimitive],
    [DuiToastPrimitive.tagName, DuiToastPrimitive],
    [DuiToastActionPrimitive.tagName, DuiToastActionPrimitive],
    [DuiToastClosePrimitive.tagName, DuiToastClosePrimitive],
  ];
  for (const [tag, ctor] of pairs) {
    if (!customElements.get(tag)) {
      customElements.define(tag, ctor);
    }
  }
}

// ---- region resolution ----

function resolveTarget(target: Element | string): Element {
  if (typeof target !== "string") return target;
  const found = document.querySelector(target);
  if (!found) {
    throw new Error(
      `[dui-toast] target selector "${target}" did not match any element.`,
    );
  }
  return found;
}

function getRegion(): DuiToastRegionPrimitive {
  ensureRegistered();
  // Explicit region takes precedence.
  if (config.region && config.region.isConnected) return config.region;
  if (autoRegion && autoRegion.isConnected) return autoRegion;

  const region = document.createElement(
    DuiToastRegionPrimitive.tagName,
  ) as DuiToastRegionPrimitive;
  region.position = config.position;
  region.maxVisible = config.maxVisible;
  region.expandOnHover = config.expandOnHover;
  region.setAttribute("data-auto-region", "");
  resolveTarget(config.target).appendChild(region);
  autoRegion = region;
  return region;
}

// ---- slot manipulation helpers ----

function clearSlot(el: Element, slotName: string | null): void {
  for (const child of Array.from(el.children)) {
    const slot = child.getAttribute("slot");
    if (slotName === null) {
      if (slot === null) child.remove();
    } else if (slot === slotName) {
      child.remove();
    }
  }
}

function setNamedSlot(
  el: Element,
  slotName: string,
  content: string | Node,
): void {
  clearSlot(el, slotName);
  const wrapper = document.createElement("span");
  wrapper.setAttribute("slot", slotName);
  if (typeof content === "string") {
    wrapper.textContent = content;
  } else {
    wrapper.appendChild(content);
  }
  el.appendChild(wrapper);
}

function setDefaultSlot(el: Element, content: Node): void {
  clearSlot(el, null);
  el.appendChild(content);
}

function setActionSlot(el: Element, action: ToastAction | undefined): void {
  clearSlot(el, "action");
  if (!action) return;
  const wrapper = document.createElement(
    DuiToastActionPrimitive.tagName,
  );
  wrapper.setAttribute("slot", "action");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = action.label;
  if (action.onClick) btn.addEventListener("click", action.onClick);
  wrapper.appendChild(btn);
  el.appendChild(wrapper);
}

function setCloseSlot(el: Element, show: boolean): void {
  clearSlot(el, "close");
  if (!show) return;
  const wrapper = document.createElement(
    DuiToastClosePrimitive.tagName,
  );
  wrapper.setAttribute("slot", "close");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Dismiss");
  btn.textContent = "×";
  wrapper.appendChild(btn);
  el.appendChild(wrapper);
}

// ---- core: create-or-update one toast ----

function applyOptions(
  el: DuiToastPrimitive,
  message: string | Node,
  opts: ToastOptions,
): void {
  // Properties.
  el.type = opts.type ?? "default";
  el.priority = opts.priority ?? "polite";
  // Loading toasts default to no auto-dismiss unless explicit duration is given.
  if (opts.duration !== undefined) {
    el.duration = opts.duration;
  } else if (opts.type === "loading") {
    el.duration = 0;
  } else {
    el.duration = config.defaultDuration;
  }

  // Content.
  if (typeof message === "string") {
    setNamedSlot(el, "title", message);
    if (opts.description !== undefined) {
      setNamedSlot(el, "description", opts.description);
    } else {
      clearSlot(el, "description");
    }
    // Custom-content default slot (if previously set) gets cleared.
    clearSlot(el, null);
  } else {
    // Custom render — message is a Node, slotted into the default slot.
    setDefaultSlot(el, message);
    clearSlot(el, "title");
    clearSlot(el, "description");
  }

  // Action and close.
  setActionSlot(el, opts.action);
  setCloseSlot(el, opts.closeButton ?? config.closeButton);
}

function createOrUpdate(
  message: string | Node,
  opts: ToastOptions = {},
): string {
  ensureRegistered();
  const id = opts.id ?? genId();
  const existing = toastMap.get(id);

  if (existing && existing.isConnected) {
    applyOptions(existing, message, opts);
    // Restart the timer so updates (e.g. promise transitions) get full duration.
    existing.resetTimer();
    return id;
  }

  // Create fresh.
  const el = document.createElement(
    DuiToastPrimitive.tagName,
  ) as DuiToastPrimitive;
  el.toastId = id;
  applyOptions(el, message, opts);
  el.addEventListener("dismiss", () => {
    toastMap.delete(id);
    // Allow CSS hooks to observe the removal; remove on next microtask.
    queueMicrotask(() => {
      if (el.parentElement) el.parentElement.removeChild(el);
    });
  });
  toastMap.set(id, el);
  getRegion().appendChild(el);
  return id;
}

// ---- public API ----

function toastFn(message: string | Node, opts?: ToastOptions): string {
  return createOrUpdate(message, opts ?? {});
}

const success = (message: string, opts?: ToastOptions): string =>
  createOrUpdate(message, { ...opts, type: "success" });

const error = (message: string, opts?: ToastOptions): string =>
  createOrUpdate(message, { ...opts, type: "error" });

const warning = (message: string, opts?: ToastOptions): string =>
  createOrUpdate(message, { ...opts, type: "warning" });

const info = (message: string, opts?: ToastOptions): string =>
  createOrUpdate(message, { ...opts, type: "info" });

const loading = (message: string, opts?: ToastOptions): string =>
  createOrUpdate(message, { ...opts, type: "loading" });

const custom = (content: Node, opts?: ToastOptions): string =>
  createOrUpdate(content, opts ?? {});

const update = (
  id: string,
  message: string | Node,
  opts?: ToastOptions,
): string => createOrUpdate(message, { ...opts, id });

const dismiss = (id?: string): void => {
  if (id === undefined) {
    for (const el of toastMap.values()) {
      el.dismiss("programmatic");
    }
    return;
  }
  const el = toastMap.get(id);
  el?.dismiss("programmatic");
};

const promise = <T>(
  p: Promise<T>,
  msgs: PromiseMessages<T>,
  opts?: ToastOptions,
): string => {
  const id = opts?.id ?? genId();
  createOrUpdate(msgs.loading, { ...opts, id, type: "loading" });
  p.then(
    (data) => {
      const msg = typeof msgs.success === "function"
        ? (msgs.success as (d: T) => string | Node)(data)
        : msgs.success;
      createOrUpdate(msg, { ...opts, id, type: "success" });
    },
    (err) => {
      const msg = typeof msgs.error === "function"
        ? (msgs.error as (e: unknown) => string | Node)(err)
        : msgs.error;
      createOrUpdate(msg, { ...opts, id, type: "error" });
    },
  );
  return id;
};

const configure = (partial: Partial<ToastConfig>): void => {
  config = { ...config, ...partial };
  // Apply live-changeable properties to the existing auto-region, if any.
  if (autoRegion && autoRegion.isConnected) {
    if (partial.position !== undefined) autoRegion.position = partial.position;
    if (partial.maxVisible !== undefined) {
      autoRegion.maxVisible = partial.maxVisible;
    }
    if (partial.expandOnHover !== undefined) {
      autoRegion.expandOnHover = partial.expandOnHover;
    }
  }
};

/** Read-only view of the current configuration (for testing/debugging). */
const getConfig = (): Readonly<ToastConfig> => ({ ...config });

/** Return the current auto-created region, if any. */
const getAutoRegion = (): DuiToastRegionPrimitive | undefined => autoRegion;

// ---- exported callable API ----

export type ToastApi = ((message: string | Node, opts?: ToastOptions) => string) & {
  success: typeof success;
  error: typeof error;
  warning: typeof warning;
  info: typeof info;
  loading: typeof loading;
  custom: typeof custom;
  update: typeof update;
  dismiss: typeof dismiss;
  promise: typeof promise;
  configure: typeof configure;
  getConfig: typeof getConfig;
  getAutoRegion: typeof getAutoRegion;
};

export const toast: ToastApi = Object.assign(toastFn, {
  success,
  error,
  warning,
  info,
  loading,
  custom,
  update,
  dismiss,
  promise,
  configure,
  getConfig,
  getAutoRegion,
});
