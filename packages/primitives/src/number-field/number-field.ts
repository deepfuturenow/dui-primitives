import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";

export const valueChangeEvent = customEvent<{ value: number }>(
  "value-change",
  { bubbles: true, composed: true },
);

export const valueCommittedEvent = customEvent<{ value: number }>(
  "value-committed",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    box-sizing: border-box;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition-property: background, box-shadow, border-color, color, opacity;
  }

  [part="root"][data-scrub] {
    cursor: ew-resize;
  }

  [part="root"][data-disabled] {
    pointer-events: none;
  }

  [part="label"] {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  [part="label"][data-scrub] {
    cursor: ew-resize;
  }

  [part="icon"] {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  [part="input"] {
    box-sizing: border-box;
    outline: none;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    min-width: 0;
    flex: 1;
  }

  [part="input"][data-scrub] {
    cursor: ew-resize;
  }

  [part="input"]:disabled {
    cursor: not-allowed;
  }

  [part="unit"] {
    flex-shrink: 0;
    pointer-events: none;
  }

`;

/** Drag threshold in px before scrub starts. */
const DRAG_THRESHOLD = 3;

/**
 * `<dui-number-field>` — A numeric input with optional label, icon,
 * unit suffix, drag-to-scrub behavior, and precision formatting.
 *
 * For simple step-up/step-down with buttons, use `<dui-stepper>` instead.
 *
 * @csspart root - The outer container.
 * @csspart label - Label text element.
 * @csspart icon - Icon slot wrapper.
 * @csspart input - The text input element.
 * @csspart unit - Unit suffix element.
 * @fires value-change - Fired when value changes. Detail: { value: number }
 * @fires value-committed - Fired on pointerup (end of drag), blur, or Enter. Detail: { value: number }
 */
export class DuiNumberFieldPrimitive extends LitElement {
  static tagName = "dui-number-field" as const;
  static formAssociated = true;

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles = [base, styles];

  #internals!: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  // ── Core properties ────────────────────────────────────────────────

  @property({ type: Number })
  accessor value: number | undefined = undefined;

  @property({ type: Number, attribute: "default-value" })
  accessor defaultValue: number | undefined = undefined;

  @property({ type: Number })
  accessor min: number | undefined = undefined;

  @property({ type: Number })
  accessor max: number | undefined = undefined;

  @property({ type: Number })
  accessor step = 1;

  @property({ type: Number, attribute: "large-step" })
  accessor largeStep = 10;

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: Boolean, reflect: true, attribute: "read-only" })
  accessor readOnly = false;

  @property({ type: Boolean })
  accessor required = false;

  @property()
  accessor name: string | undefined = undefined;

  // ── Display properties ─────────────────────────────────────────────

  @property({ reflect: true })
  accessor label = "";

  @property({ reflect: true, attribute: "label-position" })
  accessor labelPosition = "";

  @property({ reflect: true, attribute: "icon-position" })
  accessor iconPosition = "";

  @property({ reflect: true })
  accessor unit = "";

  @property({ type: Number })
  accessor precision: number | undefined = undefined;

  // ── Interaction zone booleans ──────────────────────────────────────

  @property({ type: Boolean, reflect: true, attribute: "scrub-label" })
  accessor scrubLabel = false;

  @property({ type: Boolean, reflect: true, attribute: "scrub-value" })
  accessor scrubValue = false;

  @property({ type: Boolean, reflect: true, attribute: "scrub-field" })
  accessor scrubField = false;

  @property({ type: Boolean, reflect: true, attribute: "click-label" })
  accessor clickLabel = false;

  @property({ type: Boolean, reflect: true, attribute: "click-value" })
  accessor clickValue = false;

  @property({ type: Boolean, reflect: true, attribute: "click-field" })
  accessor clickField = false;

  // ── Internal state ─────────────────────────────────────────────────

  @state()
  accessor #internalValue: number | undefined = undefined;

  @state()
  accessor #inputText = "";

  @state()
  accessor #dragging = false;

  @state()
  accessor #editing = false;

  // ── Drag state (not reactive) ──────────────────────────────────────

  #dragStartX = 0;
  #dragStartValue = 0;
  #dragStarted = false;
  #dragPointerId: number | null = null;
  #dragZoneAllowsClick = false;

  // ── Computed getters ───────────────────────────────────────────────

  get #currentValue(): number | undefined {
    return this.value ?? this.#internalValue;
  }



  get #inferredPrecision(): number {
    const stepStr = String(this.step);
    const dotIndex = stepStr.indexOf(".");
    if (dotIndex === -1) return 0;
    return stepStr.length - dotIndex - 1;
  }

  get #displayValue(): string {
    const v = this.#currentValue;
    if (v === undefined) return "";
    const p = this.precision ?? this.#inferredPrecision;
    return v.toFixed(p);
  }

  /** Whether any interaction boolean is explicitly set by the consumer. */
  get #hasExplicitInteraction(): boolean {
    return (
      this.scrubLabel ||
      this.scrubValue ||
      this.scrubField ||
      this.clickLabel ||
      this.clickValue ||
      this.clickField
    );
  }

  /** Effective scrub-label: explicit or default. */
  get #effectiveScrubLabel(): boolean {
    if (this.#hasExplicitInteraction) return this.scrubLabel;
    // Default: scrub on label when a label is present
    return this.label !== "";
  }

  /** Effective scrub-value: explicit or default. */
  get #effectiveScrubValue(): boolean {
    if (this.#hasExplicitInteraction) return this.scrubValue;
    return false;
  }

  /** Effective scrub-field: explicit or default. */
  get #effectiveScrubField(): boolean {
    if (this.#hasExplicitInteraction) return this.scrubField;
    // Default: scrub on field when no label
    return this.label === "";
  }

  /** Effective click-label: explicit or default. */
  get #effectiveClickLabel(): boolean {
    if (this.#hasExplicitInteraction) return this.clickLabel;
    return false;
  }

  /** Effective click-value: explicit or default. */
  get #effectiveClickValue(): boolean {
    if (this.#hasExplicitInteraction) return this.clickValue;
    return true;
  }

  /** Effective click-field: explicit or default. */
  get #effectiveClickField(): boolean {
    if (this.#hasExplicitInteraction) return this.clickField;
    return false;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.value === undefined && this.defaultValue !== undefined) {
      this.#internalValue = this.#clamp(this.defaultValue);
    }
    this.#syncInputText();
  }

  override willUpdate(): void {
    if (!this.#editing) {
      this.#syncInputText();
    }
    this.#internals.setFormValue(
      this.#currentValue !== undefined ? String(this.#currentValue) : null,
    );
  }

  // ── Value helpers ──────────────────────────────────────────────────

  #syncInputText(): void {
    this.#inputText = this.#displayValue;
  }

  #clamp(val: number): number {
    if (this.min !== undefined) val = Math.max(this.min, val);
    if (this.max !== undefined) val = Math.min(this.max, val);
    return val;
  }

  #setValue(val: number): void {
    const clamped = this.#clamp(val);

    if (this.value === undefined) {
      this.#internalValue = clamped;
    }

    this.dispatchEvent(valueChangeEvent({ value: clamped }));
  }

  #increment = (amount: number): void => {
    if (this.disabled || this.readOnly) return;
    const current = this.#currentValue ?? this.min ?? 0;
    this.#setValue(current + amount);
  };

  #decrement = (amount: number): void => {
    if (this.disabled || this.readOnly) return;
    const current = this.#currentValue ?? this.max ?? 0;
    this.#setValue(current - amount);
  };

  #commitInput(): void {
    const parsed = parseFloat(this.#inputText);
    if (Number.isNaN(parsed)) {
      this.#syncInputText();
    } else {
      this.#setValue(parsed);
    }
    this.#editing = false;
    const v = this.#currentValue;
    if (v !== undefined) {
      this.dispatchEvent(valueCommittedEvent({ value: v }));
    }
  }

  #focusInputAndSelectAll(): void {
    const input = this.shadowRoot?.querySelector<HTMLInputElement>(
      '[part="input"]',
    );
    if (input) {
      this.#editing = true;
      input.focus();
      input.select();
    }
  }

  // ── Drag-to-scrub ─────────────────────────────────────────────────

  #startDrag(e: PointerEvent, allowsClick: boolean): void {
    if (this.disabled || this.readOnly) return;

    this.#dragPointerId = e.pointerId;
    this.#dragStartX = e.clientX;
    this.#dragStartValue = this.#currentValue ?? 0;
    this.#dragStarted = false;
    this.#dragZoneAllowsClick = allowsClick;

    this.setPointerCapture(e.pointerId);
    this.addEventListener("pointermove", this.#onPointerMove);
    this.addEventListener("pointerup", this.#onPointerUp);
    this.addEventListener("pointercancel", this.#onPointerUp);
  }

  #onPointerMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.#dragPointerId) return;

    const deltaX = e.clientX - this.#dragStartX;

    if (!this.#dragStarted) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD) return;
      this.#dragStarted = true;
      this.#dragging = true;
    }

    let sensitivity = this.step;
    if (e.shiftKey) {
      sensitivity = this.step * 0.1;
    } else if (e.ctrlKey || e.metaKey) {
      sensitivity = this.largeStep;
    }

    const newValue = this.#dragStartValue + deltaX * sensitivity;
    this.#setValue(newValue);
  };

  #onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.#dragPointerId) return;

    this.releasePointerCapture(e.pointerId);
    this.removeEventListener("pointermove", this.#onPointerMove);
    this.removeEventListener("pointerup", this.#onPointerUp);
    this.removeEventListener("pointercancel", this.#onPointerUp);

    if (this.#dragStarted) {
      this.#dragging = false;
      const v = this.#currentValue;
      if (v !== undefined) {
        this.dispatchEvent(valueCommittedEvent({ value: v }));
      }
    } else if (this.#dragZoneAllowsClick) {
      this.#focusInputAndSelectAll();
    }

    this.#dragPointerId = null;
  };

  // ── Zone pointer handlers ──────────────────────────────────────────

  #onLabelPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    // Field-wide flags apply to all zones
    const allowsScrub = this.#effectiveScrubLabel || this.#effectiveScrubField;
    const allowsClick = this.#effectiveClickLabel || this.#effectiveClickField;

    if (allowsScrub && allowsClick) {
      e.preventDefault();
      this.#startDrag(e, true);
    } else if (allowsScrub) {
      e.preventDefault();
      this.#startDrag(e, false);
    } else if (allowsClick) {
      e.preventDefault();
      this.#focusInputAndSelectAll();
    }
  };

  #onInputPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    // Field-wide flags apply to all zones
    const allowsScrub = this.#effectiveScrubValue || this.#effectiveScrubField;
    const allowsClick = this.#effectiveClickValue || this.#effectiveClickField;

    if (allowsScrub && allowsClick) {
      e.preventDefault();
      this.#startDrag(e, true);
    } else if (allowsScrub) {
      e.preventDefault();
      this.#startDrag(e, false);
    } else if (allowsClick) {
      this.#editing = true;
    }
  };

  #onRootPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    // Root handler only fires for clicks on the root background itself
    const rootEl = this.shadowRoot?.querySelector('[part="root"]');
    if (e.target !== rootEl) return;

    const allowsScrub = this.#effectiveScrubField;
    const allowsClick = this.#effectiveClickField;

    if (allowsScrub && allowsClick) {
      e.preventDefault();
      this.#startDrag(e, true);
    } else if (allowsScrub) {
      e.preventDefault();
      this.#startDrag(e, false);
    } else if (allowsClick) {
      e.preventDefault();
      this.#focusInputAndSelectAll();
    }
  };

  // ── Input event handlers ───────────────────────────────────────────

  #onInput = (e: InputEvent): void => {
    this.#inputText = (e.target as HTMLInputElement).value;
  };

  #onBlur = (): void => {
    if (this.#editing) {
      this.#commitInput();
    }
  };

  #onFocus = (): void => {
    this.#editing = true;
    const input = this.shadowRoot?.querySelector<HTMLInputElement>(
      '[part="input"]',
    );
    if (input) {
      requestAnimationFrame(() => input.select());
    }
  };

  #onKeyDown = (e: KeyboardEvent): void => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        if (e.shiftKey) {
          this.#increment(this.step * 0.1);
        } else if (e.ctrlKey || e.metaKey) {
          this.#increment(this.largeStep);
        } else {
          this.#increment(this.step);
        }
        this.#syncInputText();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (e.shiftKey) {
          this.#decrement(this.step * 0.1);
        } else if (e.ctrlKey || e.metaKey) {
          this.#decrement(this.largeStep);
        } else {
          this.#decrement(this.step);
        }
        this.#syncInputText();
        break;
      case "Home":
        if (this.min !== undefined) {
          e.preventDefault();
          this.#setValue(this.min);
        }
        break;
      case "End":
        if (this.max !== undefined) {
          e.preventDefault();
          this.#setValue(this.max);
        }
        break;
      case "Enter":
        this.#commitInput();
        break;
      case "Escape": {
        this.#editing = false;
        this.#syncInputText();
        const input = this.shadowRoot?.querySelector<HTMLInputElement>(
          '[part="input"]',
        );
        if (input) input.blur();
        break;
      }
    }
  };

  // ── Render ─────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const currentValue = this.#currentValue;

    // Compute which zones are scrubbable for cursor styling
    const labelScrub = this.#effectiveScrubLabel || this.#effectiveScrubField;
    const inputScrub = this.#effectiveScrubValue || this.#effectiveScrubField;
    const rootScrub = this.#effectiveScrubField;

    return html`
      <span
        part="label"
        ?data-scrub="${labelScrub}"
        @pointerdown="${this.#onLabelPointerDown}"
      >${this.label}</span>

      <div
        part="root"
        ?data-scrub="${rootScrub}"
        ?data-dragging="${this.#dragging}"
        ?data-disabled="${this.disabled}"
        ?data-readonly="${this.readOnly}"
        @pointerdown="${this.#onRootPointerDown}"
      >
        <span part="icon">
          <slot name="icon"></slot>
        </span>

        <input
          part="input"
          type="text"
          inputmode="decimal"
          ?data-scrub="${inputScrub}"
          .value="${live(this.#inputText)}"
          ?disabled="${this.disabled}"
          ?readonly="${this.readOnly}"
          ?required="${this.required}"
          aria-label="${this.label || nothing}"
          aria-valuenow="${currentValue ?? nothing}"
          aria-valuemin="${this.min ?? nothing}"
          aria-valuemax="${this.max ?? nothing}"
          @pointerdown="${this.#onInputPointerDown}"
          @input="${this.#onInput}"
          @keydown="${this.#onKeyDown}"
          @focus="${this.#onFocus}"
          @blur="${this.#onBlur}"
        />

        <span part="unit">${this.unit}</span>

      </div>
    `;
  }
}
