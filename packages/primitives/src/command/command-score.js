/** Ported from original DUI: deep-future-app/app/client/components/dui/command */
/**
 * Score an item against a search query.
 * Returns 0 for no match, higher values for better matches.
 */
export const commandScore = (query, value, textContent, keywords) => {
    if (!query)
        return 1;
    const q = query.toLowerCase();
    const v = value.toLowerCase();
    const t = textContent.toLowerCase();
    if (v === q)
        return 1.0;
    if (v.startsWith(q))
        return 0.8;
    if (t.startsWith(q))
        return 0.75;
    if (v.includes(q))
        return 0.7;
    if (t.includes(q))
        return 0.6;
    for (const kw of keywords) {
        if (kw.toLowerCase().startsWith(q))
            return 0.5;
    }
    for (const kw of keywords) {
        if (kw.toLowerCase().includes(q))
            return 0.4;
    }
    return 0;
};
