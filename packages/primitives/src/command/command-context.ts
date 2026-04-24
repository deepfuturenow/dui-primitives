/** Ported from original DUI: deep-future-app/app/client/components/dui/command */

import { createContext } from "@lit/context";

export type CommandItemEntry = {
  readonly id: string;
  readonly value: string;
  readonly keywords: readonly string[];
  readonly textContent: string;
  readonly disabled: boolean;
  readonly groupId: string | undefined;
};

export type CommandContext = {
  readonly search: string;
  readonly selectedItemId: string | undefined;
  readonly listId: string;
  readonly loop: boolean;
  readonly shouldFilter: boolean;
  readonly getScore: (itemId: string) => number;
  readonly getVisibleCount: () => number;
  readonly getGroupVisibleCount: (groupId: string) => number;
  readonly registerItem: (entry: CommandItemEntry) => void;
  readonly unregisterItem: (id: string) => void;
  readonly updateItem: (entry: CommandItemEntry) => void;
  readonly registerGroup: (groupId: string) => void;
  readonly unregisterGroup: (groupId: string) => void;
  readonly setSearch: (value: string) => void;
  readonly selectItem: (id: string) => void;
  readonly handleItemSelect: (value: string) => void;
};

export const commandContext = createContext<CommandContext>(
  Symbol("dui-command"),
);
