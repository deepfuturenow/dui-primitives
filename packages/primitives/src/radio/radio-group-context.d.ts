export type RadioGroupContext = {
    readonly name: string | undefined;
    readonly value: string | undefined;
    readonly disabled: boolean;
    readonly readOnly: boolean;
    readonly required: boolean;
    readonly select: (value: string) => void;
};
export declare const radioGroupContext: any;
