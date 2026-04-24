/** Ported from original DUI: deep-future-app/app/client/components/dui/avatar */
import { LitElement, type PropertyValues, type TemplateResult } from "lit";
export type ImageStatus = "idle" | "loading" | "loaded" | "error";
export declare const loadingStatusChangeEvent: (detail: {
    status: ImageStatus;
}) => CustomEvent<{
    status: ImageStatus;
}>;
/**
 * `<dui-avatar>` — Avatar component with image and fallback support.
 *
 * Renders an image when `src` is provided and loads successfully.
 * Falls back to slotted content (e.g. initials) after an optional delay.
 *
 * @slot - Fallback content shown when the image is unavailable.
 * @csspart root - The avatar container.
 * @csspart image - The avatar image element.
 * @csspart fallback - The fallback content container.
 * @cssprop --avatar-size - Avatar dimensions (width and height). Default: var(--space-12).
 * @fires loading-status-change - Fired when the image loading status changes. Detail: { status }
 */
export declare class DuiAvatarPrimitive extends LitElement {
    #private;
    static tagName: "dui-avatar";
    static styles: any[];
    /** Image URL for the avatar. */
    accessor src: string | undefined;
    /** Alt text for the avatar image. */
    accessor alt: string;
    /** Milliseconds to wait before showing fallback content. */
    accessor fallbackDelay: number | undefined;
    /**
     * Avatar size as a CSS length value (e.g. `"var(--space-8)"`, `"2rem"`).
     * When set, overrides `--avatar-size` on the host.
     */
    accessor size: string | undefined;
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(changed: PropertyValues): void;
    render(): TemplateResult;
}
