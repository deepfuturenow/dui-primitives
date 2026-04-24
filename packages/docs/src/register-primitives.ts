/**
 * Register all DUI primitives as custom elements for the docs site.
 * Primitives are not self-registering — this module handles registration.
 */

import { DuiAccordionPrimitive, DuiAccordionItemPrimitive } from "@dui/primitives/accordion";
import { DuiAlertDialogPrimitive, DuiAlertDialogPopupPrimitive, DuiAlertDialogTriggerPrimitive, DuiAlertDialogClosePrimitive } from "@dui/primitives/alert-dialog";
import { DuiAvatarPrimitive } from "@dui/primitives/avatar";
import { DuiBadgePrimitive } from "@dui/primitives/badge";
import { DuiBreadcrumbPrimitive, DuiBreadcrumbItemPrimitive, DuiBreadcrumbLinkPrimitive, DuiBreadcrumbPagePrimitive, DuiBreadcrumbSeparatorPrimitive, DuiBreadcrumbEllipsisPrimitive } from "@dui/primitives/breadcrumb";
import { DuiButtonPrimitive } from "@dui/primitives/button";
import { DuiCalendarPrimitive } from "@dui/primitives/calendar";
import { DuiCardPrimitive } from "@dui/primitives/card";
import { DuiCardGridPrimitive } from "@dui/primitives/card-grid";
import { DuiCheckboxPrimitive, DuiCheckboxGroupPrimitive } from "@dui/primitives/checkbox";
import { DuiCollapsiblePrimitive } from "@dui/primitives/collapsible";
import { DuiComboboxPrimitive } from "@dui/primitives/combobox";
import { DuiCommandPrimitive, DuiCommandInputPrimitive, DuiCommandListPrimitive, DuiCommandItemPrimitive, DuiCommandGroupPrimitive, DuiCommandEmptyPrimitive, DuiCommandSeparatorPrimitive, DuiCommandShortcutPrimitive } from "@dui/primitives/command";
import { DuiDataTablePrimitive } from "@dui/primitives/data-table";
import { DuiDialogPrimitive, DuiDialogPopupPrimitive, DuiDialogTriggerPrimitive, DuiDialogClosePrimitive } from "@dui/primitives/dialog";
import { DuiDropzonePrimitive } from "@dui/primitives/dropzone";
import { DuiFieldPrimitive } from "@dui/primitives/field";
import { DuiFieldsetPrimitive } from "@dui/primitives/fieldset";
import { DuiIconPrimitive } from "@dui/primitives/icon";
import { DuiInputPrimitive } from "@dui/primitives/input";
import { DuiMenuPrimitive, DuiMenuItemPrimitive } from "@dui/primitives/menu";
import { DuiMenubarPrimitive } from "@dui/primitives/menubar";
import { DuiNumberFieldPrimitive } from "@dui/primitives/number-field";
import { DuiPopoverPrimitive, DuiPopoverPopupPrimitive, DuiPopoverTriggerPrimitive, DuiPopoverClosePrimitive } from "@dui/primitives/popover";
import { DuiPortalPrimitive } from "@dui/primitives/portal";
import { DuiPreviewCardPrimitive, DuiPreviewCardPopupPrimitive, DuiPreviewCardTriggerPrimitive } from "@dui/primitives/preview-card";
import { DuiProgressPrimitive } from "@dui/primitives/progress";
import { DuiRadioPrimitive, DuiRadioGroupPrimitive } from "@dui/primitives/radio";
import { DuiScrollAreaPrimitive } from "@dui/primitives/scroll-area";
import { DuiSelectPrimitive } from "@dui/primitives/select";
import { DuiSeparatorPrimitive } from "@dui/primitives/separator";
import { DuiSidebarPrimitive, DuiSidebarProviderPrimitive, DuiSidebarContentPrimitive, DuiSidebarHeaderPrimitive, DuiSidebarFooterPrimitive, DuiSidebarGroupPrimitive, DuiSidebarGroupLabelPrimitive, DuiSidebarMenuPrimitive, DuiSidebarMenuItemPrimitive, DuiSidebarMenuButtonPrimitive, DuiSidebarSeparatorPrimitive, DuiSidebarTriggerPrimitive, DuiSidebarInsetPrimitive } from "@dui/primitives/sidebar";
import { DuiSliderPrimitive } from "@dui/primitives/slider";
import { DuiSpinnerPrimitive } from "@dui/primitives/spinner";
import { DuiSplitButtonPrimitive } from "@dui/primitives/split-button";
import { DuiStepperPrimitive } from "@dui/primitives/stepper";
import { DuiSwitchPrimitive } from "@dui/primitives/switch";
import { DuiTabsPrimitive, DuiTabsListPrimitive, DuiTabPrimitive, DuiTabsPanelPrimitive, DuiTabsIndicatorPrimitive } from "@dui/primitives/tabs";
import { DuiTextareaPrimitive } from "@dui/primitives/textarea";
import { DuiTogglePrimitive, DuiToggleGroupPrimitive } from "@dui/primitives/toggle";
import { DuiToolbarPrimitive } from "@dui/primitives/toolbar";
import { DuiTooltipPrimitive, DuiTooltipPopupPrimitive, DuiTooltipTriggerPrimitive } from "@dui/primitives/tooltip";
import { DuiTruncPrimitive } from "@dui/primitives/trunc";

/** Register a primitive if not already defined. */
function reg(ctor: { tagName: string } & CustomElementConstructor) {
  if (!customElements.get(ctor.tagName)) {
    customElements.define(ctor.tagName, ctor);
  }
}

// Register all primitives
reg(DuiAccordionPrimitive);
reg(DuiAccordionItemPrimitive);
reg(DuiAlertDialogPrimitive);
reg(DuiAlertDialogPopupPrimitive);
reg(DuiAlertDialogTriggerPrimitive);
reg(DuiAlertDialogClosePrimitive);
reg(DuiAvatarPrimitive);
reg(DuiBadgePrimitive);
reg(DuiBreadcrumbPrimitive);
reg(DuiBreadcrumbItemPrimitive);
reg(DuiBreadcrumbLinkPrimitive);
reg(DuiBreadcrumbPagePrimitive);
reg(DuiBreadcrumbSeparatorPrimitive);
reg(DuiBreadcrumbEllipsisPrimitive);
reg(DuiButtonPrimitive);
reg(DuiCalendarPrimitive);
reg(DuiCardPrimitive);
reg(DuiCardGridPrimitive);
reg(DuiCheckboxPrimitive);
reg(DuiCheckboxGroupPrimitive);
reg(DuiCollapsiblePrimitive);
reg(DuiComboboxPrimitive);
reg(DuiCommandPrimitive);
reg(DuiCommandInputPrimitive);
reg(DuiCommandListPrimitive);
reg(DuiCommandItemPrimitive);
reg(DuiCommandGroupPrimitive);
reg(DuiCommandEmptyPrimitive);
reg(DuiCommandSeparatorPrimitive);
reg(DuiCommandShortcutPrimitive);
reg(DuiDataTablePrimitive);
reg(DuiDialogPrimitive);
reg(DuiDialogPopupPrimitive);
reg(DuiDialogTriggerPrimitive);
reg(DuiDialogClosePrimitive);
reg(DuiDropzonePrimitive);
reg(DuiFieldPrimitive);
reg(DuiFieldsetPrimitive);
reg(DuiIconPrimitive);
reg(DuiInputPrimitive);
reg(DuiMenuPrimitive);
reg(DuiMenuItemPrimitive);
reg(DuiMenubarPrimitive);
reg(DuiNumberFieldPrimitive);
reg(DuiPopoverPrimitive);
reg(DuiPopoverPopupPrimitive);
reg(DuiPopoverTriggerPrimitive);
reg(DuiPopoverClosePrimitive);
reg(DuiPortalPrimitive);
reg(DuiPreviewCardPrimitive);
reg(DuiPreviewCardPopupPrimitive);
reg(DuiPreviewCardTriggerPrimitive);
reg(DuiProgressPrimitive);
reg(DuiRadioPrimitive);
reg(DuiRadioGroupPrimitive);
reg(DuiScrollAreaPrimitive);
reg(DuiSelectPrimitive);
reg(DuiSeparatorPrimitive);
reg(DuiSidebarPrimitive);
reg(DuiSidebarProviderPrimitive);
reg(DuiSidebarContentPrimitive);
reg(DuiSidebarHeaderPrimitive);
reg(DuiSidebarFooterPrimitive);
reg(DuiSidebarGroupPrimitive);
reg(DuiSidebarGroupLabelPrimitive);
reg(DuiSidebarMenuPrimitive);
reg(DuiSidebarMenuItemPrimitive);
reg(DuiSidebarMenuButtonPrimitive);
reg(DuiSidebarSeparatorPrimitive);
reg(DuiSidebarTriggerPrimitive);
reg(DuiSidebarInsetPrimitive);
reg(DuiSliderPrimitive);
reg(DuiSpinnerPrimitive);
reg(DuiSplitButtonPrimitive);
reg(DuiStepperPrimitive);
reg(DuiSwitchPrimitive);
reg(DuiTabsPrimitive);
reg(DuiTabsListPrimitive);
reg(DuiTabPrimitive);
reg(DuiTabsPanelPrimitive);
reg(DuiTabsIndicatorPrimitive);
reg(DuiTextareaPrimitive);
reg(DuiTogglePrimitive);
reg(DuiToggleGroupPrimitive);
reg(DuiToolbarPrimitive);
reg(DuiTooltipPrimitive);
reg(DuiTooltipPopupPrimitive);
reg(DuiTooltipTriggerPrimitive);
reg(DuiTruncPrimitive);

console.log("[dui-primitives] All primitives registered");
