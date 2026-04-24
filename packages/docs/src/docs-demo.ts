import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * A simple demo container for primitive examples.
 */
@customElement("prim-demo")
export class PrimDemo extends LitElement {
  static override styles = css`
    :host {
      display: block;
      margin-bottom: 24px;
    }
    .label {
      font-size: 13px;
      font-weight: 600;
      color: #888;
      margin-bottom: 8px;
    }
    .content {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 24px;
      background: #fff;
    }
    @media (prefers-color-scheme: dark) {
      .content {
        border-color: #2a2a35;
        background: #1a1a22;
      }
    }
  `;

  @property() accessor label = "";

  override render() {
    return html`
      ${this.label ? html`<div class="label">${this.label}</div>` : ""}
      <div class="content"><slot></slot></div>
    `;
  }
}
