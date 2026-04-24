export type ToggleGroupContext = {
    readonly value: string[];
    readonly disabled: boolean;
    readonly type: "single" | "multiple";
    readonly toggle: (itemValue: string) => void;
};
export declare const toggleGroupContext: any;
