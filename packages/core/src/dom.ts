/**
 * DOM utilities for composed tree traversal and focus management.
 * Pierces shadow roots and resolves slot assignments.
 */

export type GetRootDocumentOptions = { composed?: boolean };

/**
 * Get the root node (Document or DocumentFragment) of a given node.
 *
 * @param node - The node to get the root of.
 * @param options.composed - If true (default), pierce shadow roots to get the host's root.
 *                          If false, stop at shadow root boundaries.
 */
export const getRootDocument = (
  node: Node,
  { composed = true }: GetRootDocumentOptions = {},
): Document | DocumentFragment | undefined => {
  const root = node.getRootNode({ composed });
  if (root instanceof DocumentFragment) {
    return root;
  } else if (root instanceof Document) {
    return root;
  }
  return undefined;
};

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Get the composed children of a node, piercing shadow roots and
 * resolving `<slot>` elements to their assigned content.
 */
const getComposedChildren = (node: Node): Node[] => {
  if (node instanceof HTMLSlotElement) {
    return node.assignedNodes({ flatten: true });
  }
  if (node instanceof Element && node.shadowRoot) {
    return Array.from(node.shadowRoot.childNodes);
  }
  return Array.from(node.childNodes);
};

/**
 * Recursively walk the composed DOM tree (piercing shadow roots, resolving
 * slot assignments) and return all natively-focusable elements in document
 * order.
 */
export const getComposedFocusableElements = (root: Node): HTMLElement[] => {
  const results: HTMLElement[] = [];

  const walk = (node: Node): void => {
    if (
      node instanceof HTMLElement &&
      node.matches(FOCUSABLE_SELECTOR) &&
      !node.hasAttribute("disabled")
    ) {
      results.push(node);
      return;
    }
    for (const child of getComposedChildren(node)) {
      walk(child);
    }
  };

  for (const child of getComposedChildren(root)) {
    walk(child);
  }
  return results;
};

/**
 * Find the first element matching `selector` in the composed tree
 * (piercing shadow roots and resolving slot assignments).
 */
export const queryComposedTree = (
  root: Node,
  selector: string,
): HTMLElement | null => {
  const walk = (node: Node): HTMLElement | null => {
    if (node instanceof HTMLElement && node.matches(selector)) {
      return node;
    }
    for (const child of getComposedChildren(node)) {
      const found = walk(child);
      if (found) return found;
    }
    return null;
  };

  for (const child of getComposedChildren(root)) {
    const found = walk(child);
    if (found) return found;
  }
  return null;
};

/**
 * Find the first element with the `autofocus` attribute in the composed tree.
 */
export const queryComposedAutofocus = (root: Node): HTMLElement | null =>
  queryComposedTree(root, "[autofocus]");
