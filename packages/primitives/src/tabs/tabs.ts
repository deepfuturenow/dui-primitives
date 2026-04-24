/** Ported from original DUI: deep-future-app/app/client/components/dui/tabs */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";
import { type TabsContext, tabsContext } from "./tabs-context.ts";

export const valueChangeEvent = customEvent<string>("value-change", {
  bubbles: true,
  composed: true,
});

const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
  }

  [part="root"][data-orientation="vertical"] {
    flex-direction: row;
  }

  :host([controls="footer"]) [part="root"] {
    flex-direction: column-reverse;
  }
`;

/**
 * A tabbed interface component with animated indicator and keyboard navigation.
 */
export class DuiTabsPrimitive extends LitElement {
  static tagName = "dui-tabs" as const;
  static override styles = [base, styles];

  /** Controlled active tab value. */
  @property()
  accessor value: string | undefined = undefined;

  /** Initial active tab value (uncontrolled mode). */
  @property({ attribute: "default-value" })
  accessor defaultValue: string | undefined = undefined;

  /** Layout orientation. */
  @property({ reflect: true })
  accessor orientation: "horizontal" | "vertical" = "horizontal";

  /** Whether tab list appears above or below content. */
  @property({ reflect: true })
  accessor controls: "header" | "footer" = "header";

  @state()
  accessor #internalValue: string | undefined = undefined;

  #getValue = (): string | undefined => this.value ?? this.#internalValue;

  #select = (tabValue: string): void => {
    if (this.value === undefined) {
      this.#internalValue = tabValue;
    }
    this.dispatchEvent(valueChangeEvent(tabValue));
  };

  @provide({ context: tabsContext })
  @state()
  accessor _ctx: TabsContext = this.#buildContext();

  #buildContext(): TabsContext {
    return {
      value: this.#getValue(),
      orientation: this.orientation,
      select: this.#select,
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.value === undefined && this.defaultValue !== undefined) {
      this.#internalValue = this.defaultValue;
    }
    this._ctx = this.#buildContext();
  }

  override willUpdate(): void {
    this._ctx = this.#buildContext();
  }

  override render(): TemplateResult {
    return html`
      <div part="root" data-orientation=${this.orientation}>
        <slot></slot>
      </div>
    `;
  }
}
