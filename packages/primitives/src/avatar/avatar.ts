/** Ported from original DUI: deep-future-app/app/client/components/dui/avatar */

import {
  css,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";

export type ImageStatus = "idle" | "loading" | "loaded" | "error";

export const loadingStatusChangeEvent = customEvent<{ status: ImageStatus }>(
  "loading-status-change",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    --avatar-size: var(--space-12);
    display: inline-block;
  }

  [part="root"] {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    user-select: none;
    overflow: hidden;
    height: var(--avatar-size);
    width: var(--avatar-size);
  }

  [part="image"] {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }

  [part="fallback"] {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
`;

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
export class DuiAvatarPrimitive extends LitElement {
  static tagName = "dui-avatar" as const;

  static override styles = [base, styles];

  /** Image URL for the avatar. */
  @property()
  accessor src: string | undefined = undefined;

  /** Alt text for the avatar image. */
  @property()
  accessor alt = "";

  /** Milliseconds to wait before showing fallback content. */
  @property({ type: Number, attribute: "fallback-delay" })
  accessor fallbackDelay: number | undefined = undefined;

  /**
   * Avatar size as a CSS length value (e.g. `"var(--space-8)"`, `"2rem"`).
   * When set, overrides `--avatar-size` on the host.
   */
  @property({ reflect: true })
  accessor size: string | undefined = undefined;

  @state()
  accessor #imageStatus: ImageStatus = "idle";

  @state()
  accessor #delayPassed = false;

  #probeImage: HTMLImageElement | undefined;
  #delayTimer: ReturnType<typeof setTimeout> | undefined;

  #setImageStatus(status: ImageStatus): void {
    this.#imageStatus = status;
    this.dispatchEvent(loadingStatusChangeEvent({ status }));
  }

  #startProbe(): void {
    this.#cleanupProbe();

    if (!this.src) {
      this.#setImageStatus("error");
      return;
    }

    this.#setImageStatus("loading");

    const img = new Image();
    img.onload = () => this.#setImageStatus("loaded");
    img.onerror = () => this.#setImageStatus("error");
    img.src = this.src;
    this.#probeImage = img;
  }

  #cleanupProbe(): void {
    if (this.#probeImage) {
      this.#probeImage.onload = null;
      this.#probeImage.onerror = null;
      this.#probeImage = undefined;
    }
  }

  #startDelay(): void {
    this.#clearDelay();

    if (this.fallbackDelay === undefined || this.fallbackDelay <= 0) {
      this.#delayPassed = true;
      return;
    }

    this.#delayPassed = false;
    this.#delayTimer = setTimeout(() => {
      this.#delayPassed = true;
    }, this.fallbackDelay);
  }

  #clearDelay(): void {
    if (this.#delayTimer !== undefined) {
      clearTimeout(this.#delayTimer);
      this.#delayTimer = undefined;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#startDelay();
    this.#startProbe();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#cleanupProbe();
    this.#clearDelay();
  }

  override willUpdate(changed: PropertyValues): void {
    if (changed.has("size")) {
      if (this.size) {
        this.style.setProperty("--avatar-size", this.size);
      } else {
        this.style.removeProperty("--avatar-size");
      }
    }
    if (changed.has("src")) {
      this.#startProbe();
    }
    if (changed.has("fallbackDelay")) {
      this.#startDelay();
    }
  }

  override render(): TemplateResult {
    const showImage = this.src && this.#imageStatus === "loaded";
    const showFallback = !showImage && this.#delayPassed;

    return html`
      <span part="root">
        ${showImage
          ? html`
              <img
                part="image"
                src="${this.src!}"
                alt="${this.alt}"
              />
            `
          : showFallback
            ? html`
                <span part="fallback"><slot></slot></span>
              `
            : nothing}
      </span>
    `;
  }
}
