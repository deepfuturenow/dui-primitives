/**
 * Coordinates popup components so that only one is open at a time.
 * When a popup opens, any previously-open popup is closed first.
 */
/** Call when opening — closes any other open popup first. */
export declare const notifyPopupOpening: (instance: HTMLElement, closeFn: () => void) => void;
/** Call when closing — removes this instance from tracking. */
export declare const notifyPopupClosing: (instance: HTMLElement) => void;
