/**
 * Coordinates popup components so that only one is open at a time.
 * When a popup opens, any previously-open popup is closed first.
 */
const openPopups = new Map();
/** Call when opening — closes any other open popup first. */
export const notifyPopupOpening = (instance, closeFn) => {
    for (const [key, close] of openPopups) {
        if (key !== instance)
            close();
    }
    openPopups.clear();
    openPopups.set(instance, closeFn);
};
/** Call when closing — removes this instance from tracking. */
export const notifyPopupClosing = (instance) => {
    openPopups.delete(instance);
};
