/** Ported from original DUI: deep-future-app/app/client/components/dui/popover */
import { css, html, LitElement } from "lit";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { popoverContext } from "./popover-context.ts";
const hostStyles = css `
  :host {
    display: contents;
  }
`;
const componentStyles = css `
  .Trigger {
    display: contents;
  }
`;
/**
 * `<dui-popover-trigger>` — Click-to-toggle trigger for the popover.
 *
 * @slot - Content that triggers the popover (usually a button).
 */
export class DuiPopoverTriggerPrimitive extends LitElement {
    static tagName = "dui-popover-trigger";
    static styles = [base, hostStyles, componentStyles];
    #ctx = new ContextConsumer(this, {
        context: popoverContext,
        subscribe: true,
    });
    #handleClick = (e) => {
        e.stopPropagation();
        this.#updateTriggerEl();
        this.#ctx.value?.togglePopover();
    };
    #updateTriggerEl() {
        const slot = this.shadowRoot?.querySelector("slot");
        const el = slot?.assignedElements()?.[0] ?? this;
        this.#ctx.value?.setTriggerEl(el);
    }
    /** Mirror open state onto the slotted element so its theme can style it. */
    #syncOpenAttr() {
        const slot = this.shadowRoot?.querySelector("slot");
        const el = slot?.assignedElements()?.[0];
        if (!el)
            return;
        const isOpen = this.#ctx.value?.open ?? false;
        if (isOpen) {
            el.setAttribute("data-open", "");
        }
        else {
            el.removeAttribute("data-open");
        }
    }
    updated() {
        this.#syncOpenAttr();
    }
    render() {
        const isOpen = this.#ctx.value?.open ?? false;
        const popupId = this.#ctx.value?.popupId ?? "";
        const triggerId = this.#ctx.value?.triggerId ?? "";
        return html `
      <span
        class="Trigger"
        part="trigger"
        id="${triggerId}"
        aria-haspopup="dialog"
        aria-expanded="${isOpen}"
        aria-controls="${isOpen ? popupId : ""}"
        ?data-popup-open="${isOpen}"
        @click="${this.#handleClick}"
      >
        <slot></slot>
      </span>
    `;
    }
}
