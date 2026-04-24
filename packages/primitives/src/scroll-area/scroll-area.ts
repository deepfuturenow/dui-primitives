/** Ported from original DUI: deep-future-app/app/client/components/dui/scroll-area */

import {
  css,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "../core/base.ts";

const styles = css`
  :host {
    display: block;
    position: relative;
    overflow: hidden;
    height: 100%;
    max-height: var(--scroll-area-max-height, none);
  }

  .ScrollArea {
    position: relative;
    width: 100%;
    height: 100%;
    max-height: inherit;
  }

  .Viewport {
    width: 100%;
    height: 100%;
    max-height: inherit;
    overflow: auto;
    overscroll-behavior: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  :host([fade]) .Viewport[data-scrolled] {
    -webkit-mask-image: linear-gradient(to bottom, transparent, black var(--scroll-fade-size, 1.5rem));
    mask-image: linear-gradient(to bottom, transparent, black var(--scroll-fade-size, 1.5rem));
  }

  .Scrollbar {
    position: absolute;
    display: flex;
    justify-content: center;
    opacity: 0;
    pointer-events: none;

    &[data-hovering],
    &[data-scrolling] {
      opacity: 1;
      pointer-events: auto;
    }

    &[data-scrolling] {
      transition-duration: 0ms;
    }
  }

  .Scrollbar::before {
    content: "";
    position: absolute;
  }

  .Scrollbar[data-orientation="vertical"] {
    top: 0;
    right: 0;
    bottom: 0;

    &::before {
      width: 1.25rem;
      height: 100%;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .Scrollbar[data-orientation="horizontal"] {
    left: 0;
    right: 0;
    bottom: 0;

    &::before {
      width: 100%;
      height: 1.25rem;
      bottom: -0.25rem;
    }
  }

  .Thumb[data-orientation="vertical"] {
    width: 100%;
    min-height: 1.25rem;
  }

  .Thumb[data-orientation="horizontal"] {
    height: 100%;
    min-width: 1.25rem;
  }
`;

type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

/**
 * `<dui-scroll-area>` — A scroll container with custom styled scrollbar.
 *
 * Hides the native scrollbar and renders a custom track + thumb with
 * auto-hide behavior. Supports vertical, horizontal, or both orientations.
 *
 * @slot - Default slot for scrollable content.
 *
 * @cssprop [--scroll-area-max-height] - Max-height constraint.
 * @cssprop [--scroll-area-thumb-color] - Scrollbar thumb color.
 * @cssprop [--scroll-fade-size] - Distance over which the top fade goes from transparent to opaque (default: 1.5rem).
 */
export class DuiScrollAreaPrimitive extends LitElement {
  static tagName = "dui-scroll-area" as const;
  static override styles = [base, styles];

  /** Scroll direction(s). */
  @property({ reflect: true })
  accessor orientation: ScrollAreaOrientation = "vertical";

  /** Show a fade overlay at the top when scrolled. */
  @property({ type: Boolean, reflect: true })
  accessor fade = false;

  /** Optional max-height constraint (CSS value). */
  @property({ attribute: "max-height" })
  accessor maxHeight: string | undefined = undefined;

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("maxHeight")) {
      if (this.maxHeight)
        this.style.setProperty("--scroll-area-max-height", this.maxHeight);
      else this.style.removeProperty("--scroll-area-max-height");
    }
  }

  // --- Internal state ---

  @state()
  accessor #hasOverflowX = false;
  @state()
  accessor #hasOverflowY = false;
  @state()
  accessor #hovering = false;
  @state()
  accessor #scrolling = false;

  @state()
  accessor #thumbHeightPercent = 0;
  @state()
  accessor #thumbWidthPercent = 0;

  @state()
  accessor #thumbTopPercent = 0;
  @state()
  accessor #thumbLeftPercent = 0;

  @state()
  accessor #isAtTop = true;

  static readonly #SCROLL_BOTTOM_TOLERANCE = 1;

  #isAtBottom = true;
  #prevScrollTop = 0;

  #scrollEndTimer: ReturnType<typeof setTimeout> | undefined;
  #resizeObserver: ResizeObserver | undefined;
  #dragging: "vertical" | "horizontal" | undefined;
  #dragStartPointer = 0;
  #dragStartScroll = 0;

  // --- Lifecycle ---

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("pointerenter", this.#onPointerEnter);
    this.addEventListener("pointerleave", this.#onPointerLeave);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("pointerenter", this.#onPointerEnter);
    this.removeEventListener("pointerleave", this.#onPointerLeave);
    this.#resizeObserver?.disconnect();
    clearTimeout(this.#scrollEndTimer);
  }

  protected override firstUpdated(): void {
    const viewport = this.#viewport;
    if (!viewport) return;

    this.#resizeObserver = new ResizeObserver(() => this.#measure());
    this.#resizeObserver.observe(viewport);
    const slot = viewport.querySelector("slot");
    if (slot) {
      const observe = () => {
        for (const node of slot.assignedElements()) {
          this.#resizeObserver!.observe(node);
        }
      };
      slot.addEventListener("slotchange", () => {
        observe();
        requestAnimationFrame(() => this.#measure());
      });
      observe();
    }
    this.#measure();
  }

  // --- Public methods ---

  /** Scroll the viewport to the bottom. */
  async scrollToBottom(): Promise<void> {
    await this.updateComplete;
    const viewport = this.#viewport;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
      this.#isAtBottom = true;
      this.#prevScrollTop = viewport.scrollTop;
    }
  }

  /** Whether the viewport is scrolled to the top. */
  get isAtTop(): boolean {
    return this.#isAtTop;
  }

  /** Whether the viewport is scrolled to the bottom. */
  get isAtBottom(): boolean {
    return this.#isAtBottom;
  }

  // --- Getters ---

  get #viewport(): HTMLElement | null {
    return this.shadowRoot?.querySelector(".Viewport") ?? null;
  }

  get #showVertical(): boolean {
    return this.orientation === "vertical" || this.orientation === "both";
  }

  get #showHorizontal(): boolean {
    return this.orientation === "horizontal" || this.orientation === "both";
  }

  // --- Measurement ---

  #measure = (): void => {
    const vp = this.#viewport;
    if (!vp) return;

    const hasOverflowY = vp.scrollHeight > vp.clientHeight;
    const hasOverflowX = vp.scrollWidth > vp.clientWidth;

    this.#hasOverflowY = hasOverflowY;
    this.#hasOverflowX = hasOverflowX;

    if (hasOverflowY) {
      this.#thumbHeightPercent = (vp.clientHeight / vp.scrollHeight) * 100;
    }
    if (hasOverflowX) {
      this.#thumbWidthPercent = (vp.clientWidth / vp.scrollWidth) * 100;
    }

    this.#updateThumbPosition(vp);
  };

  #updateThumbPosition = (vp: HTMLElement): void => {
    if (this.#hasOverflowY) {
      const maxScrollTop = vp.scrollHeight - vp.clientHeight;
      this.#thumbTopPercent =
        maxScrollTop > 0
          ? (vp.scrollTop / maxScrollTop) * (100 - this.#thumbHeightPercent)
          : 0;
    }
    if (this.#hasOverflowX) {
      const maxScrollLeft = vp.scrollWidth - vp.clientWidth;
      this.#thumbLeftPercent =
        maxScrollLeft > 0
          ? (vp.scrollLeft / maxScrollLeft) * (100 - this.#thumbWidthPercent)
          : 0;
    }
  };

  // --- Event handlers ---

  #onScroll = (): void => {
    const vp = this.#viewport;
    if (!vp) return;

    this.#scrolling = true;
    this.#updateThumbPosition(vp);

    const wasAtBottom = this.#isAtBottom;
    const scrolledUp = vp.scrollTop < this.#prevScrollTop;

    this.#isAtTop = vp.scrollTop <= 0;
    this.#isAtBottom =
      vp.scrollTop + vp.clientHeight >=
      vp.scrollHeight - DuiScrollAreaPrimitive.#SCROLL_BOTTOM_TOLERANCE;

    if (scrolledUp && wasAtBottom && !this.#isAtBottom) {
      this.dispatchEvent(
        new Event("scrolled-from-bottom", { bubbles: true, composed: true }),
      );
    } else if (!wasAtBottom && this.#isAtBottom) {
      this.dispatchEvent(
        new Event("scrolled-to-bottom", { bubbles: true, composed: true }),
      );
    }

    this.#prevScrollTop = vp.scrollTop;

    clearTimeout(this.#scrollEndTimer);
    this.#scrollEndTimer = setTimeout(() => {
      this.#scrolling = false;
    }, 1000);
  };

  #onPointerEnter = (): void => {
    this.#hovering = true;
    this.#measure();
  };

  #onPointerLeave = (): void => {
    this.#hovering = false;
  };

  // --- Track click (jump to position) ---

  #onTrackPointerDown = (
    orientation: "vertical" | "horizontal",
    event: PointerEvent,
  ): void => {
    event.preventDefault();
    event.stopPropagation();

    const vp = this.#viewport;
    if (!vp) return;

    if (orientation === "vertical") {
      const track = this.shadowRoot?.querySelector(
        '.Scrollbar[data-orientation="vertical"]',
      ) as HTMLElement | null;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const fraction = (event.clientY - rect.top) / rect.height;
      vp.scrollTop = fraction * (vp.scrollHeight - vp.clientHeight);
    } else {
      const track = this.shadowRoot?.querySelector(
        '.Scrollbar[data-orientation="horizontal"]',
      ) as HTMLElement | null;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const fraction = (event.clientX - rect.left) / rect.width;
      vp.scrollLeft = fraction * (vp.scrollWidth - vp.clientWidth);
    }
  };

  // --- Thumb drag ---

  #onThumbPointerDown = (
    orientation: "vertical" | "horizontal",
    event: PointerEvent,
  ): void => {
    event.preventDefault();
    event.stopPropagation();

    const vp = this.#viewport;
    if (!vp) return;

    this.#dragging = orientation;
    if (orientation === "vertical") {
      this.#dragStartPointer = event.clientY;
      this.#dragStartScroll = vp.scrollTop;
    } else {
      this.#dragStartPointer = event.clientX;
      this.#dragStartScroll = vp.scrollLeft;
    }

    document.addEventListener("pointermove", this.#onDragMove);
    document.addEventListener("pointerup", this.#onDragEnd);
  };

  #onDragMove = (event: PointerEvent): void => {
    const vp = this.#viewport;
    if (!vp || !this.#dragging) return;

    if (this.#dragging === "vertical") {
      const track = this.shadowRoot?.querySelector(
        '.Scrollbar[data-orientation="vertical"]',
      ) as HTMLElement | null;
      if (!track) return;
      const delta = event.clientY - this.#dragStartPointer;
      const trackHeight = track.clientHeight;
      const scrollRange = vp.scrollHeight - vp.clientHeight;
      vp.scrollTop =
        this.#dragStartScroll + (delta / trackHeight) * scrollRange;
    } else {
      const track = this.shadowRoot?.querySelector(
        '.Scrollbar[data-orientation="horizontal"]',
      ) as HTMLElement | null;
      if (!track) return;
      const delta = event.clientX - this.#dragStartPointer;
      const trackWidth = track.clientWidth;
      const scrollRange = vp.scrollWidth - vp.clientWidth;
      vp.scrollLeft =
        this.#dragStartScroll + (delta / trackWidth) * scrollRange;
    }
  };

  #onDragEnd = (): void => {
    this.#dragging = undefined;
    document.removeEventListener("pointermove", this.#onDragMove);
    document.removeEventListener("pointerup", this.#onDragEnd);
  };

  // --- Render ---

  #renderVerticalScrollbar(): TemplateResult | typeof nothing {
    if (!this.#showVertical || !this.#hasOverflowY) return nothing;

    return html`
      <div
        class="Scrollbar"
        part="scrollbar-vertical"
        data-orientation="vertical"
        ?data-hovering="${this.#hovering}"
        ?data-scrolling="${this.#scrolling}"
        @pointerdown="${(e: PointerEvent) =>
          this.#onTrackPointerDown("vertical", e)}"
      >
        <div
          class="Thumb"
          part="thumb-vertical"
          data-orientation="vertical"
          style="height: ${this.#thumbHeightPercent}%; top: ${this
            .#thumbTopPercent}%; position: absolute;"
          @pointerdown="${(e: PointerEvent) =>
            this.#onThumbPointerDown("vertical", e)}"
        ></div>
      </div>
    `;
  }

  #renderHorizontalScrollbar(): TemplateResult | typeof nothing {
    if (!this.#showHorizontal || !this.#hasOverflowX) return nothing;

    return html`
      <div
        class="Scrollbar"
        part="scrollbar-horizontal"
        data-orientation="horizontal"
        ?data-hovering="${this.#hovering}"
        ?data-scrolling="${this.#scrolling}"
        @pointerdown="${(e: PointerEvent) =>
          this.#onTrackPointerDown("horizontal", e)}"
      >
        <div
          class="Thumb"
          part="thumb-horizontal"
          data-orientation="horizontal"
          style="width: ${this.#thumbWidthPercent}%; left: ${this
            .#thumbLeftPercent}%; position: absolute;"
          @pointerdown="${(e: PointerEvent) =>
            this.#onThumbPointerDown("horizontal", e)}"
        ></div>
      </div>
    `;
  }

  override render(): TemplateResult {
    return html`
      <div
        class="ScrollArea"
        part="root"
        ?data-has-overflow-x="${this.#hasOverflowX}"
        ?data-has-overflow-y="${this.#hasOverflowY}"
        ?data-scrolling="${this.#scrolling}"
      >
        <div class="Viewport" part="viewport" ?data-scrolled="${!this.#isAtTop}" @scroll="${this.#onScroll}">
          <slot></slot>
        </div>
        ${this.#renderVerticalScrollbar()} ${this.#renderHorizontalScrollbar()}
      </div>
    `;
  }
}
