/** Ported from original DUI: deep-future-app/app/client/components/dui/checkbox */

import { createContext } from "@lit/context";

export type CheckboxGroupContext = {
  readonly checkedValues: readonly string[];
  readonly allValues: readonly string[];
  readonly disabled: boolean;
  readonly toggle: (value: string) => void;
  readonly toggleAll: (checked: boolean) => void;
};

export const checkboxGroupContext = createContext<CheckboxGroupContext>(
  Symbol("dui-checkbox-group"),
);
