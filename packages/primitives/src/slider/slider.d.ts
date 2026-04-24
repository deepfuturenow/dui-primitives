/** Ported from original DUI: deep-future-app/app/client/components/dui/slider */
import { LitElement, type TemplateResult } from "lit";
export declare const valueChangeEvent: (detail: {
    value: number;
}) => CustomEvent<{
    value: number;
}>;
export declare const valueCommittedEvent: (detail: {
    value: number;
}) => CustomEvent<{
    value: number;
}>;
/**
 * A slider for selecting numeric values within a range.
 *
 * Supports pointer drag, keyboard navigation (arrows, Page Up/Down, Home/End),
 * a hidden native range input for accessibility, and an optional click-to-type
 * value readout (enabled via the `field` variant).
 */
export declare class DuiSliderPrimitive extends LitElement {
    #private;
    static tagName: "dui-slider";
    static formAssociated: boolean;
    static styles: any[];
    constructor();
    /** Current value. */
    accessor value: number;
    /** Minimum value. */
    accessor min: number;
    /** Maximum value. */
    accessor max: number;
    /** Step increment. */
    accessor step: number;
    /** Whether the slider is disabled. */
    accessor disabled: boolean;
    /** Name for form submission. */
    accessor name: string;
    /** Label text displayed by the slider. */
    accessor label: string;
    /** Unit suffix on the value readout (e.g. `m`, `°`, `%`). */
    accessor unit: string;
    /** Decimal places for value readout. Auto-inferred from `step` if not set. */
    accessor precision: number | undefined;
    willUpdate(): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
}
