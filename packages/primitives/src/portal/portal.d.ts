/** Ported from original DUI: deep-future-app/app/client/components/dui/portal */
import { LitElement, type PropertyValues, type TemplateResult } from "lit";
export type QueryRoot = "shadow" | "document";
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
export declare class DuiPortalPrimitive extends LitElement {
    #private;
    static tagName: "dui-portal";
    static styles: any[];
    /** CSS selector for the destination container. */
    accessor target: string;
    /** Where to resolve the target selector: "document" (default) or "shadow". */
    accessor targetRoot: QueryRoot;
    /** Direct element reference for cross-shadow-root targets. Takes precedence over `target` selector. */
    accessor targetElement: HTMLElement | undefined;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected updated(changed: PropertyValues): void;
    render(): TemplateResult;
}
