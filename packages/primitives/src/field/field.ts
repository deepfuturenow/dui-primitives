import { css, html, LitElement, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "../core/base.ts";

/** Selector matching all DUI form controls that can be wired by a field. */
const CONTROL_SELECTOR = [
  "dui-input",
  "dui-textarea",
  "dui-select",
  "dui-checkbox",
  "dui-checkbox-group",
  "dui-radio",
  "dui-radio-group",
  "dui-switch",
  "dui-number-field",
  "dui-stepper",
  "dui-slider",
  "dui-combobox",
  "dui-dropzone",
].join(", ");

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
  }

  [part="root"][data-orientation="horizontal"] {
    flex-direction: row;
    align-items: start;
  }

  /* Hide wrapper parts when no content is slotted */
  [part="label"]:not([data-slotted]) { display: none; }
  [part="label"] { cursor: default; }
  [part="label"][data-disabled] { cursor: not-allowed; }

  [part="description"]:not([data-slotted]) { display: none; }

  [part="error"] { display: none; }
  [part="error"][data-invalid] { display: block; }
`;

/**
 * `<dui-field>` — Slot-based form field wrapper.
 *
 * Provides label, description, and error slots around a default-slotted
 * form control. Manages ARIA wiring, field state (dirty, touched, focused,
 * filled), disabled propagation, and label click-to-focus.
 *
 * @slot label - Label text (e.g. `<span slot="label">Email</span>`).
 * @slot - Default slot for the form control.
 * @slot description - Help text (e.g. `<span slot="description">…</span>`).
 * @slot error - Error message (e.g. `<span slot="error">Required</span>`).
 * @csspart root - The field container element.
 * @csspart label - The label wrapper.
 * @csspart description - The description wrapper.
 * @csspart error - The error wrapper (hidden unless invalid).
 */
export class DuiFieldPrimitive extends LitElement {
  static tagName = "dui-field" as const;

  static override styles = [base, styles];

  /** Whether the child control is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Whether the field is in an invalid state. */
  @property({ type: Boolean, reflect: true })
  accessor invalid = false;

  /** Layout direction: vertical (column) or horizontal (row). */
  @property()
  accessor orientation: "vertical" | "horizontal" = "vertical";

  // --- Internal state ---

  @state()
  accessor #dirty = false;

  @state()
  accessor #touched = false;

  @state()
  accessor #focused = false;

  @state()
  accessor #filled = false;

  @state()
  accessor #hasLabel = false;

  @state()
  accessor #hasDescription = false;

  @state()
  accessor #hasError = false;

  // --- Stable IDs ---

  #fieldId = crypto.randomUUID().slice(0, 8);

  get #labelId(): string {
    return `field-${this.#fieldId}-label`;
  }

  get #descriptionId(): string {
    return `field-${this.#fieldId}-desc`;
  }

  get #errorId(): string {
    return `field-${this.#fieldId}-error`;
  }

  // --- Control reference ---

  #control: HTMLElement | undefined;
  #controlWasDisabled = false;

  // --- Lifecycle ---

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("focusin", this.#onFocusIn);
    this.addEventListener("focusout", this.#onFocusOut);
    this.addEventListener("input", this.#onInput);
    this.addEventListener("change", this.#onChange);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("focusin", this.#onFocusIn);
    this.removeEventListener("focusout", this.#onFocusOut);
    this.removeEventListener("input", this.#onInput);
    this.removeEventListener("change", this.#onChange);
  }

  override willUpdate(changed: PropertyValues): void {
    if (changed.has("invalid") && this.#control) {
      this.#wireControl();
    }
    if (changed.has("disabled") && this.#control) {
      if (this.disabled) {
        this.#controlWasDisabled = this.#control.hasAttribute("disabled");
        this.#control.setAttribute("disabled", "");
      } else if (!this.#controlWasDisabled) {
        this.#control.removeAttribute("disabled");
      }
    }
  }

  // --- Field state from DOM events ---

  #onFocusIn = (): void => {
    this.#focused = true;
  };

  #onFocusOut = (): void => {
    this.#focused = false;
    this.#touched = true;
  };

  #onInput = (): void => {
    this.#dirty = true;
    this.#filled = true;
  };

  #onChange = (): void => {
    this.#dirty = true;
  };

  // --- Slot change handlers ---

  #onControlSlotChange = (): void => {
    const slot = this.shadowRoot?.querySelector(
      "slot:not([name])",
    ) as HTMLSlotElement;
    const nodes = slot?.assignedElements({ flatten: true }) ?? [];
    this.#control = nodes.find((el) =>
      el.matches(CONTROL_SELECTOR)
    ) as HTMLElement | undefined;

    if (this.#control) {
      this.#wireControl();
      if (this.disabled) {
        this.#controlWasDisabled = this.#control.hasAttribute("disabled");
        this.#control.setAttribute("disabled", "");
      }
    }
  };

  #onLabelSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this.#hasLabel = slot.assignedNodes({ flatten: true }).length > 0;
  };

  #onDescriptionSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this.#hasDescription = slot.assignedNodes({ flatten: true }).length > 0;
    this.#wireControl();
  };

  #onErrorSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this.#hasError = slot.assignedNodes({ flatten: true }).length > 0;
    this.#wireControl();
  };

  // --- ARIA wiring ---

  #wireControl(): void {
    const ctrl = this.#control;
    if (!ctrl) return;

    // Build aria-describedby from present slots
    const parts: string[] = [];
    if (this.#hasDescription) parts.push(this.#descriptionId);
    if (this.invalid && this.#hasError) parts.push(this.#errorId);
    const describedBy = parts.join(" ") || null;

    if (describedBy) ctrl.setAttribute("aria-describedby", describedBy);
    else ctrl.removeAttribute("aria-describedby");

    ctrl.setAttribute("aria-invalid", String(this.invalid));
  }

  // --- Label click-to-focus ---

  #onLabelClick = (): void => {
    if (!this.disabled) {
      this.#control?.focus();
    }
  };

  // --- Render ---

  override render(): TemplateResult {
    return html`
      <div
        part="root"
        role="group"
        ?data-disabled="${this.disabled}"
        ?data-invalid="${this.invalid}"
        ?data-valid="${!this.invalid}"
        ?data-dirty="${this.#dirty}"
        ?data-touched="${this.#touched}"
        ?data-filled="${this.#filled}"
        ?data-focused="${this.#focused}"
        data-orientation="${this.orientation}"
      >
        <div
          part="label"
          id="${this.#labelId}"
          ?data-slotted="${this.#hasLabel}"
          ?data-disabled="${this.disabled}"
          @click="${this.#onLabelClick}"
        >
          <slot
            name="label"
            @slotchange="${this.#onLabelSlotChange}"
          ></slot>
        </div>
        <slot @slotchange="${this.#onControlSlotChange}"></slot>
        <div
          part="description"
          id="${this.#descriptionId}"
          ?data-slotted="${this.#hasDescription}"
        >
          <slot
            name="description"
            @slotchange="${this.#onDescriptionSlotChange}"
          ></slot>
        </div>
        <div
          part="error"
          id="${this.#errorId}"
          role="alert"
          ?data-invalid="${this.invalid}"
        >
          <slot
            name="error"
            @slotchange="${this.#onErrorSlotChange}"
          ></slot>
        </div>
      </div>
    `;
  }
}
