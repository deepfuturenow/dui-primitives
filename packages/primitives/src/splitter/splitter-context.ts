import { createContext } from "@lit/context";

export type SplitterPanelMeta = {
  readonly id: string;
  readonly minSize: number;
  readonly maxSize: number;
  readonly defaultSize: number | undefined;
  readonly order: number | undefined;
  readonly el: HTMLElement;
};

export type SplitterHandleMeta = {
  readonly el: HTMLElement;
  readonly disabled: boolean;
};

export type SplitterHandleAria = {
  readonly valueNow: number;
  readonly valueMin: number;
  readonly valueMax: number;
  readonly controls: string;
};

export interface SplitterContext {
  readonly orientation: "horizontal" | "vertical";
  readonly disabled: boolean;
  readonly resizing: boolean;
  readonly draggingHandleId: string | undefined;
  readonly keyboardStep: number;
  readonly keyboardStepLarge: number;

  // Panel API
  readonly registerPanel: (meta: SplitterPanelMeta) => void;
  readonly unregisterPanel: (id: string) => void;
  readonly getPanelSize: (id: string) => number;
  readonly isPanelCollapsed: (id: string) => boolean;

  // Handle API
  readonly registerHandle: (meta: SplitterHandleMeta) => string;
  readonly unregisterHandle: (handleId: string) => void;
  readonly updateHandle: (
    handleId: string,
    patch: Partial<SplitterHandleMeta>,
  ) => void;
  readonly beginDrag: (handleId: string, ev: PointerEvent) => void;
  readonly nudge: (handleId: string, deltaPct: number) => void;
  readonly resetHandle: (handleId: string) => void;
  readonly getHandleAria: (handleId: string) => SplitterHandleAria | null;
}

export const splitterContext = createContext<SplitterContext>(
  Symbol("dui-splitter"),
);
