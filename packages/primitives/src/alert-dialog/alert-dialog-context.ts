/** Ported from original DUI: deep-future-app/app/client/components/dui/alert-dialog */

import { createContext } from "@lit/context";

export type AlertDialogContext = {
  readonly open: boolean;
  readonly dialogId: string;
  readonly triggerId: string;
  readonly titleId: string;
  readonly descriptionId: string;
  readonly openDialog: () => void;
  readonly closeDialog: () => void;
};

export const alertDialogContext = createContext<AlertDialogContext>(
  Symbol("dui-alert-dialog"),
);
