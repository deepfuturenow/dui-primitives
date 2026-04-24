import { LitElement, type PropertyValues, type TemplateResult } from "lit";
/**
 * `<dui-field>` — Slot-based form field wrapper.
 *
 * Provides label, description, and error slots around a default-slotted
 * form control. Manages ARIA wiring, field state (dirty, touched, focused,
 * filled), disabled propagation, and label click-to-focus.
 *
 * @slot label - Label text (e.g. `<span slot="label">Email</span>`).
 * @slot - Default slot for the form control.
 * @slot description - Help text (e.g. `<span slot="description">…</span>`).
 * @slot error - Error message (e.g. `<span slot="error">Required</span>`).
 * @csspart root - The field container element.
 * @csspart label - The label wrapper.
 * @csspart description - The description wrapper.
 * @csspart error - The error wrapper (hidden unless invalid).
 */
export declare class DuiFieldPrimitive extends LitElement {
    #private;
    static tagName: "dui-field";
    static styles: any[];
    /** Whether the child control is disabled. */
    accessor disabled: boolean;
    /** Whether the field is in an invalid state. */
    accessor invalid: boolean;
    /** Layout direction: vertical (column) or horizontal (row). */
    accessor orientation: "vertical" | "horizontal";
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(changed: PropertyValues): void;
    render(): TemplateResult;
}
