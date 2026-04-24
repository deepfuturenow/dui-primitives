/**
 * Define an event factory for custom events of `type`.
 * Returned event will always be of same type with same event options.
 * @example
 * ```ts
 * const greetEvent = event<string>('greet-event', { bubbles: true });
 * document.dispatchEvent(greetEvent("Hello, world!"));
 * ```
 */
export declare const customEvent: <Detail>(type: string, options?: EventInit) => (detail: Detail) => CustomEvent<Detail>;
