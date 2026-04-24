/** Ported from original DUI: deep-future-app/app/client/components/dui/portal */

import { css, html, LitElement, type PropertyValues, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { getRootDocument } from "../core/dom.ts";

export type QueryRoot = "shadow" | "document";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-portal>` — Teleports light DOM children to a target container.
 *
 * Children are moved back into the portal when the element disconnects,
 * allowing the portal and its children to be moved or garbage-collected
 * correctly.
 *
 * @slot - Content to teleport.
 * @attr {string} target - CSS selector for the destination container (default: "body").
 * @attr {"shadow" | "document"} target-root - Where to resolve the target selector.
 */
export class DuiPortalPrimitive extends LitElement {
  static tagName = "dui-portal" as const;

  static override styles = [styles];

  /** CSS selector for the destination container. */
  @property({ type: String })
  accessor target: string = "body";

  /** Where to resolve the target selector: "document" (default) or "shadow". */
  @property({ type: String, attribute: "target-root", reflect: true })
  accessor targetRoot: QueryRoot = "document";

  /** Direct element reference for cross-shadow-root targets. Takes precedence over `target` selector. */
  @property({ attribute: false })
  accessor targetElement: HTMLElement | undefined;

  #container: Element | undefined = undefined;
  #movedNodes: Set<Node> = new Set();
  #isMoving = false;

  #queryTarget(): Element | undefined {
    const root = getRootDocument(this, {
      composed: this.targetRoot === "document",
    });
    return root?.querySelector(this.target) ?? undefined;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#container = this.targetElement ?? this.#queryTarget();
    if (this.#container && this.childNodes.length > 0) {
      this.#moveChildrenToTarget();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#detach();
  }

  protected override updated(changed: PropertyValues): void {
    if (
      changed.has("target") ||
      changed.has("targetRoot") ||
      changed.has("targetElement")
    ) {
      this.#detach();
      this.#attach();
    }
  }

  #attach(): void {
    this.#container = this.targetElement ?? this.#queryTarget();
    this.#moveChildrenToTarget();
  }

  #detach(): void {
    if (this.#movedNodes.size === 0) return;

    this.#isMoving = true;
    for (const node of this.#movedNodes) {
      this.append(node);
    }
    this.#movedNodes.clear();
    this.#isMoving = false;

    this.#container = undefined;
  }

  #moveChildrenToTarget(): void {
    if (!this.#container) {
      throw new Error(`Portal target does not exist: ${this.target}`);
    }

    this.#isMoving = true;
    const nodes = Array.from(this.childNodes);
    for (const node of nodes) {
      this.#container.appendChild(node);
      this.#movedNodes.add(node);
    }
    this.#isMoving = false;
  }

  #handleSlotChange = (): void => {
    if (this.#isMoving || !this.#container) return;
    this.#moveChildrenToTarget();
  };

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#handleSlotChange}></slot>`;
  }
}
