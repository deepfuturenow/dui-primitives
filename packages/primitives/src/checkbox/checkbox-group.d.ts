/** Ported from original DUI: deep-future-app/app/client/components/dui/checkbox */
import { LitElement, type TemplateResult } from "lit";
import { type CheckboxGroupContext } from "./checkbox-group-context.ts";
export declare const valueChangeEvent: (detail: string[]) => CustomEvent<string[]>;
/**
 * `<dui-checkbox-group>` — Groups multiple checkboxes with shared state.
 *
 * Manages a shared array of checked values. Supports controlled and
 * uncontrolled usage, and an `allValues` prop for parent checkbox
 * (select-all) patterns.
 *
 * @slot - Default slot for `<dui-checkbox>` children.
 * @csspart root - The group container element.
 *
 * @fires value-change - Fired when the set of checked values changes. Detail: string[]
 */
export declare class DuiCheckboxGroupPrimitive extends LitElement {
    #private;
    static tagName: "dui-checkbox-group";
    static styles: any[];
    /** Checked values (controlled). */
    accessor value: string[] | undefined;
    /** Initial checked values for uncontrolled usage. */
    accessor defaultValue: string[];
    /**
     * All possible checkbox values in the group.
     * Required when using a parent (select-all) checkbox.
     */
    accessor allValues: string[];
    /** Whether all checkboxes in the group are disabled. */
    accessor disabled: boolean;
    accessor _ctx: CheckboxGroupContext;
    connectedCallback(): void;
    willUpdate(): void;
    render(): TemplateResult;
}
