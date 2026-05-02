/**
 * Strings for `GlobalSearch` and its partials. Consumers override via the
 * `strings` prop on `<GlobalSearch />`; values are deep-merged over these
 * defaults so partial overrides are safe.
 */
export interface GlobalSearchStrings {
    /** Placeholder copy for the search input. */
    placeholder: string;
    /** aria-label for the clear-search icon button. */
    clear: string;
    /** Loading-state copy. */
    loading: string;
    /** Empty-state title — uses {{query}} as a placeholder. */
    emptyTitle: string;
    /** Empty-state body copy. */
    emptyHint: string;
    /** Idle-state heading for "Recent" suggestions. */
    idleRecent: string;
    /** Idle-state heading for curated "Suggestions". */
    idleSuggestions: string;
    /** Tab label for the "All" tab. */
    tabAll: string;
    /** Footer "navigate" hint. */
    footerNavigate: string;
    /** Footer "open" hint. */
    footerOpen: string;
    /** Footer "close" hint. */
    footerClose: string;
    /** Trailing N results count. */
    resultsCount: string;
    /** "See all" group action — jumps to that tab. */
    seeAll: string;
}

export const defaultGlobalSearchStrings: GlobalSearchStrings = {
    placeholder: 'Search…',
    clear: 'Clear search',
    loading: 'Searching…',
    emptyTitle: 'No results for "{{query}}"',
    emptyHint: 'Try a shorter keyword or check the spelling.',
    idleRecent: 'Recent',
    idleSuggestions: 'Suggestions',
    tabAll: 'All',
    footerNavigate: 'navigate',
    footerOpen: 'open',
    footerClose: 'close',
    resultsCount: '{{count}} results',
    seeAll: 'See all',
};

/** Replace `{{key}}` tokens with values from `params`. */
export function interpolateString(
    template: string,
    params: Record<string, string | number>,
): string {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        const v = params[key];
        return v === undefined ? match : String(v);
    });
}
