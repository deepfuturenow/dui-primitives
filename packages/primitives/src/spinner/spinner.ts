/** Ported from original DUI: deep-future-app/app/client/components/dui/spinner */

import { css, html, LitElement, svg, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "../core/base.ts";



/** Pulsing circle loading animation SVG */
const pulseSvg = svg`
  <svg
    part="svg"
    viewBox="0 0 44 44"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Loading"
  >
    <circle cx="22" cy="22" r="8" fill="currentColor">
      <animate
        attributeName="r"
        values="8;14;8"
        dur="1.2s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.445,0.05,0.55,0.95;0.445,0.05,0.55,0.95"
        keyTimes="0;0.5;1"
      />
      <animate
        attributeName="opacity"
        values="1;0.2;1"
        dur="1.2s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.445,0.05,0.55,0.95;0.445,0.05,0.55,0.95"
        keyTimes="0;0.5;1"
      />
    </circle>
  </svg>
`;

/** Lucide loader icon with rotation animation */
const lucideLoaderSvg = svg`
  <svg
    part="svg"
    data-rotate
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    role="img"
    aria-label="Loading"
  >
    <path d="M12 2v4" />
    <path d="m16.2 7.8 2.9-2.9" />
    <path d="M18 12h4" />
    <path d="m16.2 16.2 2.9 2.9" />
    <path d="M12 18v4" />
    <path d="m4.9 19.1 2.9-2.9" />
    <path d="M2 12h4" />
    <path d="m4.9 4.9 2.9 2.9" />
  </svg>
`;

/** Lucide loader circle icon with rotation animation */
const lucideLoaderCircleSvg = svg`
  <svg
    part="svg"
    data-rotate
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    role="img"
    aria-label="Loading"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
`;

const styles = css`
  :host {
    display: block;
  }

  [part="svg"] {
    display: block;
    width: 100%;
    height: 100%;
  }

  [part="svg"][data-rotate] {
    animation: spin 1.25s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

/**
 * A loading indicator with multiple animation variants and sizes.
 */
export class DuiSpinnerPrimitive extends LitElement {
  static tagName = "dui-spinner" as const;
  static override styles = [base, styles];

  /** Animation variant. */
  @property({ reflect: true })
  accessor variant: string = "";

  #getSvg() {
    switch (this.variant) {
      case "lucide-loader":
        return lucideLoaderSvg;
      case "lucide-loader-circle":
        return lucideLoaderCircleSvg;
      default:
        return pulseSvg;
    }
  }

  override render(): TemplateResult {
    return html`${this.#getSvg()}`;
  }
}
