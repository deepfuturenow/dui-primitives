/** Ported from original DUI: deep-future-app/app/client/components/dui/command */
/**
 * Score an item against a search query.
 * Returns 0 for no match, higher values for better matches.
 */
export declare const commandScore: (query: string, value: string, textContent: string, keywords: readonly string[]) => number;
