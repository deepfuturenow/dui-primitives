export type TabsContext = {
    readonly value: string | undefined;
    readonly orientation: "horizontal" | "vertical";
    readonly select: (value: string) => void;
};
export declare const tabsContext: any;
