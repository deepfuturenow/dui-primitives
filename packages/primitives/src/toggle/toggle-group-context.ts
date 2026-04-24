import { createContext } from "@lit/context";

export type ToggleGroupContext = {
  readonly value: string[];
  readonly disabled: boolean;
  readonly type: "single" | "multiple";
  readonly toggle: (itemValue: string) => void;
};

export const toggleGroupContext = createContext<ToggleGroupContext>(
  Symbol("dui-toggle-group"),
);
