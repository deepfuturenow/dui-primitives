/** Ported from original DUI: deep-future-app/app/client/components/dui/popover */

import { createContext } from "@lit/context";

export type PopoverSide = "top" | "bottom";

export type PopoverContext = {
  readonly open: boolean;
  readonly triggerId: string;
  readonly popupId: string;
  readonly side: PopoverSide;
  readonly sideOffset: number;
  readonly triggerEl: HTMLElement | undefined;
  readonly openPopover: () => void;
  readonly closePopover: () => void;
  readonly togglePopover: () => void;
  readonly setTriggerEl: (el: HTMLElement | undefined) => void;
};

export const popoverContext = createContext<PopoverContext>(
  Symbol("dui-popover"),
);
