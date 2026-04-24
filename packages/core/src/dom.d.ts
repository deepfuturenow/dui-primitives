/**
 * DOM utilities for composed tree traversal and focus management.
 * Pierces shadow roots and resolves slot assignments.
 */
export type GetRootDocumentOptions = {
    composed?: boolean;
};
/**
 * Get the root node (Document or DocumentFragment) of a given node.
 *
 * @param node - The node to get the root of.
 * @param options.composed - If true (default), pierce shadow roots to get the host's root.
 *                          If false, stop at shadow root boundaries.
 */
export declare const getRootDocument: (node: Node, { composed }?: GetRootDocumentOptions) => Document | DocumentFragment | undefined;
/**
 * Recursively walk the composed DOM tree (piercing shadow roots, resolving
 * slot assignments) and return all natively-focusable elements in document
 * order.
 */
export declare const getComposedFocusableElements: (root: Node) => HTMLElement[];
/**
 * Find the first element matching `selector` in the composed tree
 * (piercing shadow roots and resolving slot assignments).
 */
export declare const queryComposedTree: (root: Node, selector: string) => HTMLElement | null;
/**
 * Find the first element with the `autofocus` attribute in the composed tree.
 */
export declare const queryComposedAutofocus: (root: Node) => HTMLElement | null;
