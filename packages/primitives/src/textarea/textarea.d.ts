/** Ported from original DUI: deep-future-app/app/client/components/dui/textarea */
import { LitElement, type TemplateResult } from "lit";
export type TextareaResize = "none" | "vertical" | "horizontal" | "both" | "auto";
export declare const textareaChangeEvent: (detail: {
    value: string;
}) => CustomEvent<{
    value: string;
}>;
/**
 * A multi-line text input with resize modes including auto-grow.
 */
export declare class DuiTextareaPrimitive extends LitElement {
    #private;
    static tagName: "dui-textarea";
    static formAssociated: boolean;
    static shadowRootOptions: ShadowRootInit;
    static styles: any[];
    constructor();
    /** Current textarea value. */
    accessor value: string;
    /** Placeholder text. */
    accessor placeholder: string;
    accessor disabled: boolean;
    accessor required: boolean;
    accessor readonly: boolean;
    /** Number of visible text rows. */
    accessor rows: number | undefined;
    accessor minLength: number | undefined;
    accessor maxLength: number | undefined;
    accessor name: string;
    /** Resize behavior: "none" | "vertical" | "horizontal" | "both" | "auto". */
    accessor resize: TextareaResize;
    /** Maximum height (CSS value). Textarea scrolls when content exceeds this. */
    accessor maxHeight: string | undefined;
    willUpdate(): void;
    updated(): void;
    render(): TemplateResult;
}
