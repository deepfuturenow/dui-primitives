import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "../core/base.ts";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
  }

  [part="track"] {
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  [part="indicator"] {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: var(--progress-value, 0%);
    height: 100%;
  }
`;

/**
 * `<dui-progress>` — A progress bar indicating completion status.
 *
 * Set `value` to a number for determinate progress, or leave `null` for indeterminate.
 *
 * @csspart root - The outer container.
 * @csspart track - The progress track.
 * @csspart indicator - The filled indicator.
 */
export class DuiProgressPrimitive extends LitElement {
  static tagName = "dui-progress" as const;

  static override styles = [base, styles];

  @property({ type: Number })
  accessor value: number | null = null;

  @property({ type: Number })
  accessor min = 0;

  @property({ type: Number })
  accessor max = 100;

  get #percent(): number {
    if (this.value === null) return 0;
    const range = this.max - this.min;
    if (range <= 0) return 0;
    return Math.max(0, Math.min(100, ((this.value - this.min) / range) * 100));
  }

  get #isIndeterminate(): boolean {
    return this.value === null;
  }

  get #isComplete(): boolean {
    return this.value !== null && this.value >= this.max;
  }

  override render(): TemplateResult {
    const percent = this.#percent;

    return html`
      <div
        part="root"
        role="progressbar"
        aria-valuenow="${this.value ?? nothing}"
        aria-valuemin="${this.min}"
        aria-valuemax="${this.max}"
        ?data-complete="${this.#isComplete}"
        ?data-progressing="${!this.#isIndeterminate && !this.#isComplete}"
        ?data-indeterminate="${this.#isIndeterminate}"
        style="--progress-value: ${percent}%"
      >
        <div part="track">
          <div part="indicator"></div>
        </div>
      </div>
    `;
  }
}
