/** Ported from original DUI: deep-future-app/app/client/components/dui/preview-card */

import { createContext } from "@lit/context";

export type PreviewCardSide = "top" | "bottom";

export type PreviewCardContext = {
  readonly open: boolean;
  readonly triggerId: string;
  readonly popupId: string;
  readonly side: PreviewCardSide;
  readonly sideOffset: number;
  readonly triggerEl: HTMLElement | undefined;
  readonly openPreviewCard: () => void;
  readonly closePreviewCard: () => void;
  readonly setTriggerEl: (el: HTMLElement | undefined) => void;
};

export const previewCardContext = createContext<PreviewCardContext>(
  Symbol("dui-preview-card"),
);
