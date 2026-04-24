import { createContext } from "@lit/context";

export type TabsContext = {
  readonly value: string | undefined;
  readonly orientation: "horizontal" | "vertical";
  readonly select: (value: string) => void;
};

export const tabsContext = createContext<TabsContext>(Symbol("dui-tabs"));
