/** Ported from original DUI: deep-future-app/app/client/components/dui/sidebar */
export type SidebarContext = {
    readonly state: "expanded" | "collapsed";
    readonly open: boolean;
    readonly openMobile: boolean;
    readonly isMobile: boolean;
    readonly side: "left" | "right";
    readonly variant: string;
    readonly collapsible: "offcanvas" | "icon" | "none";
    readonly setOpen: (open: boolean) => void;
    readonly toggleSidebar: () => void;
};
export declare const sidebarContext: any;
