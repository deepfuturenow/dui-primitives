/** Ported from original DUI: deep-future-app/app/client/components/dui/accordion */

import { createContext } from "@lit/context";

export type AccordionContext = {
  readonly openValues: readonly string[];
  readonly disabled: boolean;
  readonly orientation: "vertical" | "horizontal";
  readonly loopFocus: boolean;
  readonly keepMounted: boolean;
  readonly toggle: (value: string) => void;
  readonly registerItem: (value: string, el: HTMLElement) => void;
  readonly unregisterItem: (value: string) => void;
  readonly focusItem: (
    value: string,
    direction: "next" | "prev" | "first" | "last",
  ) => void;
};

export const accordionContext = createContext<AccordionContext>(
  Symbol("dui-accordion"),
);
