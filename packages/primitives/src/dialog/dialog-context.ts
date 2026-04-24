/** Ported from original DUI: deep-future-app/app/client/components/dui/dialog */

import { createContext } from "@lit/context";

export type DialogContext = {
  readonly open: boolean;
  readonly dialogId: string;
  readonly triggerId: string;
  readonly titleId: string;
  readonly descriptionId: string;
  readonly openDialog: () => void;
  readonly closeDialog: () => void;
};

export const dialogContext = createContext<DialogContext>(
  Symbol("dui-dialog"),
);
