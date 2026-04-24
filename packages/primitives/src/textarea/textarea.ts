/** Ported from original DUI: deep-future-app/app/client/components/dui/textarea */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { styleMap } from "lit/directives/style-map.js";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";

export type TextareaResize = "none" | "vertical" | "horizontal" | "both" | "auto";


export const textareaChangeEvent = customEvent<{ value: string }>(
  "textarea-change",
  { bubbles: true, composed: true },
);

const styles = css`
  :host {
    display: block;
  }

  [part="textarea"] {
    display: block;
    box-sizing: border-box;
    width: 100%;
    font-family: inherit;
    outline: none;
    resize: vertical;
  }

  [part="textarea"][data-resize="none"] {
    resize: none;
  }

  [part="textarea"][data-resize="vertical"] {
    resize: vertical;
  }

  [part="textarea"][data-resize="horizontal"] {
    resize: horizontal;
  }

  [part="textarea"][data-resize="both"] {
    resize: both;
  }

  [part="textarea"][data-resize="auto"] {
    resize: none;
    field-sizing: content;
  }

  [part="textarea"]:disabled {
    cursor: not-allowed;
  }
`;

/**
 * A multi-line text input with resize modes including auto-grow.
 */
export class DuiTextareaPrimitive extends LitElement {
  static tagName = "dui-textarea" as const;
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

  /** Current textarea value. */
  @property()
  accessor value = "";

  /** Placeholder text. */
  @property()
  accessor placeholder = "";

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: Boolean })
  accessor required = false;

  @property({ type: Boolean })
  accessor readonly = false;

  /** Number of visible text rows. */
  @property({ type: Number })
  accessor rows: number | undefined = undefined;

  @property({ type: Number, attribute: "minlength" })
  accessor minLength: number | undefined = undefined;

  @property({ type: Number, attribute: "maxlength" })
  accessor maxLength: number | undefined = undefined;

  @property()
  accessor name = "";

  /** Resize behavior: "none" | "vertical" | "horizontal" | "both" | "auto". */
  @property()
  accessor resize: TextareaResize = "vertical";

  /** Maximum height (CSS value). Textarea scrolls when content exceeds this. */
  @property({ attribute: "max-height" })
  accessor maxHeight: string | undefined = undefined;

  override willUpdate(): void {
    this.#internals.setFormValue(this.value);
  }

  #syncValidity(): void {
    const textarea = this.shadowRoot?.querySelector("textarea");
    if (textarea) {
      this.#internals.setValidity(
        textarea.validity,
        textarea.validationMessage,
        textarea,
      );
    }
  }

  override updated(): void {
    this.#syncValidity();
  }

  #onInput = (event: InputEvent): void => {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;

    this.#internals.setFormValue(this.value);

    this.dispatchEvent(textareaChangeEvent({ value: this.value }));
  };

  override render(): TemplateResult {
    const textAreaStyles = styleMap({
      overflowY: this.maxHeight === undefined ? "auto" : "initial",
      maxHeight: this.maxHeight ?? "initial",
    });

    return html`
      <textarea
        part="textarea"
        style=${textAreaStyles}
        .value=${live(this.value)}
        placeholder=${this.placeholder}
        rows=${this.rows ?? ""}
        ?disabled=${this.disabled}
        ?required=${this.required}
        ?readonly=${this.readonly}
        minlength=${this.minLength ?? ""}
        maxlength=${this.maxLength ?? ""}
        name=${this.name}
        data-resize=${this.resize}
        @input=${this.#onInput}
      ></textarea>
    `;
  }
}
