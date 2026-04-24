/** Ported from original DUI: deep-future-app/app/client/components/dui/checkbox */
export type CheckboxGroupContext = {
    readonly checkedValues: readonly string[];
    readonly allValues: readonly string[];
    readonly disabled: boolean;
    readonly toggle: (value: string) => void;
    readonly toggleAll: (checked: boolean) => void;
};
export declare const checkboxGroupContext: any;
