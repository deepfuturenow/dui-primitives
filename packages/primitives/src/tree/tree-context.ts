import { createContext } from "@lit/context";

export type SelectionMode = "none" | "single" | "multiple";

export type TreeContext = {
  readonly expandedValues: readonly string[];
  readonly selectedValues: readonly string[];
  readonly selectionMode: SelectionMode;
  readonly disabled: boolean;
  readonly focusedValue: string | null;
  readonly toggleExpand: (value: string) => void;
  readonly activate: (value: string, isBranch: boolean) => void;
  readonly setFocused: (value: string) => void;
};

export const treeContext = createContext<TreeContext>(Symbol("dui-tree"));
