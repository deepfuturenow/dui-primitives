import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "../core/base.ts";
import {
  type SplitterContext,
  splitterContext,
} from "./splitter-context.ts";

const styles = css`
  :host {
    display: block;
    flex: 0 0 auto;
    touch-action: none;
    user-select: none;
  }

  :host([data-orientation="horizontal"]) {
    cursor: col-resize;
  }

  :host([data-orientation="vertical"]) {
    cursor: row-resize;
  }

  :host([data-disabled]) {
    cursor: default;
  }

  [part="root"] {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    outline: none;
  }
`;

/**
 * `<dui-splitter-handle>` — Draggable separator between two adjacent panels.
 *
 * Renders a `role="separator"` element with full ARIA wiring. Resizes the
 * panel immediately preceding it against the panel immediately following it
 * in DOM order.
 *
 * Note: Per WAI-ARIA, `aria-orientation` is the orientation of the
 * separator line, which is the *opposite* of the splitter group's
 * `orientation` (a horizontal-axis splitter has a vertical separator).
 *
 * @csspart root - The separator element.
 */
export class DuiSplitterHandlePrimitive extends LitElement {
  static tagName = "dui-splitter-handle" as const;
  static override styles = [base, styles];

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @consume({ context: splitterContext, subscribe: true })
  accessor _ctx!: SplitterContext;

  @state()
  accessor #handleId: string | undefined = undefined;

  @state()
  accessor #focused = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this._ctx) {
      this.#handleId = this._ctx.registerHandle({
        el: this,
        disabled: this.#isDisabled(),
      });
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.#handleId && this._ctx) {
      this._ctx.unregisterHandle(this.#handleId);
      this.#handleId = undefined;
    }
  }

  override willUpdate(changedProps: Map<string, unknown>): void {
    if (changedProps.has("disabled") && this.#handleId && this._ctx) {
      this._ctx.updateHandle(this.#handleId, {
        disabled: this.#isDisabled(),
      });
    }
  }

  #isDisabled(): boolean {
    return this.disabled || (this._ctx?.disabled ?? false);
  }

  #onPointerDown = (ev: PointerEvent): void => {
    if (this.#isDisabled() || !this.#handleId || !this._ctx) return;
    if (ev.button !== undefined && ev.button !== 0) return;
    this._ctx.beginDrag(this.#handleId, ev);
  };

  #onDoubleClick = (ev: MouseEvent): void => {
    if (this.#isDisabled() || !this.#handleId || !this._ctx) return;
    ev.preventDefault();
    this._ctx.resetHandle(this.#handleId);
  };

  #onKeyDown = (ev: KeyboardEvent): void => {
    const ctx = this._ctx;
    const handleId = this.#handleId;
    if (this.#isDisabled() || !handleId || !ctx) return;

    const isHorizontal = ctx.orientation === "horizontal";
    const decreaseKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    const increaseKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const step = ev.shiftKey ? ctx.keyboardStepLarge : ctx.keyboardStep;

    switch (ev.key) {
      case decreaseKey:
        ev.preventDefault();
        ctx.nudge(handleId, -step);
        break;
      case increaseKey:
        ev.preventDefault();
        ctx.nudge(handleId, step);
        break;
      case "Home": {
        const aria = ctx.getHandleAria(handleId);
        if (aria) {
          ev.preventDefault();
          ctx.nudge(handleId, aria.valueMin - aria.valueNow);
        }
        break;
      }
      case "End": {
        const aria = ctx.getHandleAria(handleId);
        if (aria) {
          ev.preventDefault();
          ctx.nudge(handleId, aria.valueMax - aria.valueNow);
        }
        break;
      }
    }
  };

  #onFocus = (): void => {
    this.#focused = true;
  };

  #onBlur = (): void => {
    this.#focused = false;
  };

  override render(): TemplateResult {
    const ctx = this._ctx;
    const orientation = ctx?.orientation ?? "horizontal";
    const disabled = this.#isDisabled();
    const aria =
      this.#handleId && ctx ? ctx.getHandleAria(this.#handleId) : null;
    const dragging =
      ctx?.draggingHandleId !== undefined &&
      ctx.draggingHandleId === this.#handleId;

    // ARIA orientation is the orientation of the separator line, which is
    // perpendicular to the splitter axis.
    const ariaOrientation =
      orientation === "horizontal" ? "vertical" : "horizontal";

    // Reflect interaction state to the host so consumers can write
    // `dui-splitter-handle[data-dragging] { ... }`-style selectors at the
    // top level rather than reaching into shadow DOM via ::part(root).
    if (this.isConnected) {
      this.dataset.orientation = orientation;
      this.toggleAttribute("data-disabled", disabled);
      this.toggleAttribute("data-dragging", dragging);
      this.toggleAttribute("data-focused", this.#focused);
    }

    return html`
      <div
        part="root"
        role="separator"
        tabindex=${disabled ? -1 : 0}
        aria-orientation=${ariaOrientation}
        aria-valuenow=${aria?.valueNow ?? 50}
        aria-valuemin=${aria?.valueMin ?? 0}
        aria-valuemax=${aria?.valueMax ?? 100}
        aria-controls=${aria?.controls ?? ""}
        ?data-disabled=${disabled}
        ?data-dragging=${dragging}
        ?data-focused=${this.#focused}
        @pointerdown=${this.#onPointerDown}
        @dblclick=${this.#onDoubleClick}
        @keydown=${this.#onKeyDown}
        @focus=${this.#onFocus}
        @blur=${this.#onBlur}
      ></div>
    `;
  }
}
