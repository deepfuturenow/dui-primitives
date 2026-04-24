import { createContext } from "@lit/context";

export type MenubarContext = {
  readonly activeMenuId: string | null;
  readonly openMenu: (id: string) => void;
  readonly closeAll: () => void;
  readonly navigateToMenu: (direction: "next" | "prev") => void;
};

export const menubarContext = createContext<MenubarContext>(
  Symbol("dui-menubar"),
);
