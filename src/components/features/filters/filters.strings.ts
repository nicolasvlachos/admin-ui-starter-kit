/**
 * Filter strings — default copy and nested override contract.
 *
 * Consumers localize filters by passing `strings` to `<FilterProvider>`.
 * No routing, framework i18n hook, or backend shared-props contract belongs in
 * this default feature path.
 */

export interface FilterOperatorStrings {
    contains: string;
    equals: string;
    notContains: string;
    is: string;
    isNot: string;
    greaterThan: string;
    lessThan: string;
    before: string;
    after: string;
    between: string;
    has: string;
    hasAny: string;
    hasAll: string;
}

export interface FilterStrings {
    // Filter loading states
    loading: string;
    loadingOptions: string; // "Loading {filterLabel} options..."

    // Action buttons
    clear: string;
    confirm: string;
    clearFilters: string;
    clearAll: string;

    // Date selection
    selectDate: string;
    selectDateRange: string;
    calendar: {
        dateSelected: string;
        notDateSelected: string;
        notDateRangeSelected: string;
        selectedEndDate: string;
        today: string;
        yesterday: string;
        lastSevenDays: string;
        lastThirtyDays: string;
        thisMonth: string;
        lastMonth: string;
        thisYear: string;
        lastYear: string;
        customRange: string;
    };

    // Value selection
    selectValues: string;
    searchPlaceholder: string; // "Search {filterLabel}..."
    noOptionsFound: string;
    selected: string; // "{count} {filterLabel} selected"
    nothingSelected: string; // pill value text when nothing has been picked yet

    // Tags
    enterTag: string;
    addTag: string;
    removeTag: string;
    tag: string;
    tags: string;
    enterTags: string;

    // Filter list
    searchFilters: string;
    noFiltersAvailable: string;
    availableFilters: string;
    activeFilters: string;
    clearSearch: string;
    backToFilters: string;
    select: string;
    options: string;

    // Operator selector (active-filter pill dropdown)
    operator: string;
    operators: FilterOperatorStrings;

    // Range filters
    min: string;
    max: string;

    // Async select filters
    fetchError: string;
    retryFetch: string;
    minQueryHint: string; // "Type at least {min} characters..."
    searching: string;

    // Error boundary
    error: {
        title: string;
        descriptionWithKey: string;
        generic: string;
        unknown: string;
    };

    // Value validation
    validation: {
        required: string;
        minValue: string;
        maxValue: string;
        invalidFormat: string;
    };
}

/**
 * Default English strings for the filter system.
 * These serve as fallbacks when no strings are provided.
 */
export const defaultFilterStrings: FilterStrings = {
    // Filter loading states
    loading: 'Loading',
    loadingOptions: 'Loading {filterLabel} options...',

    // Action buttons
    clear: 'Clear',
    confirm: 'Confirm',
    clearFilters: 'Clear filters',
    clearAll: 'Clear all',

    // Date selection
    selectDate: 'Select date',
    selectDateRange: 'Select date range',
    calendar: {
        dateSelected: 'Date selected',
        notDateSelected: 'No date selected',
        notDateRangeSelected: 'No date range selected',
        selectedEndDate: 'Select end date',
        today: 'Today',
        yesterday: 'Yesterday',
        lastSevenDays: 'Last 7 days',
        lastThirtyDays: 'Last 30 days',
        thisMonth: 'This month',
        lastMonth: 'Last month',
        thisYear: 'This year',
        lastYear: 'Last year',
        customRange: 'Custom range',
    },

    // Value selection
    selectValues: 'Select values',
    searchPlaceholder: 'Search {filterLabel}...',
    noOptionsFound: 'No options found',
    selected: '{count} {filterLabel} selected',
    nothingSelected: 'Nothing selected',

    // Tags
    enterTag: 'Enter tag',
    addTag: 'Add tag',
    removeTag: 'Remove',
    tag: 'tag',
    tags: 'tags',
    enterTags: 'Enter tags',

    // Filter list
    searchFilters: 'Search filters...',
    noFiltersAvailable: 'No filters available',
    availableFilters: 'Available Filters',
    activeFilters: 'Active Filters',
    clearSearch: 'Clear search',
    backToFilters: 'Back to filters',
    select: 'Select',
    options: 'options',

    // Operator selector (active-filter pill dropdown)
    operator: 'Operator',
    operators: {
        contains: 'contains',
        equals: 'is',
        notContains: 'does not contain',
        is: 'is',
        isNot: 'is not',
        greaterThan: 'greater than',
        lessThan: 'less than',
        before: 'before',
        after: 'after',
        between: 'between',
        has: 'has',
        hasAny: 'has any',
        hasAll: 'has all',
    },

    // Range filters
    min: 'Min',
    max: 'Max',

    // Async select filters
    fetchError: 'Failed to load options',
    retryFetch: 'Retry',
    minQueryHint: 'Type at least {min} characters...',
    searching: 'Searching...',

    // Error boundary
    error: {
        title: 'Filter error',
        descriptionWithKey: 'There was a problem with "{filterKey}" filter.',
        generic: 'There was a problem loading this filter.',
        unknown: 'Unknown error',
    },

    // Value validation
    validation: {
        required: 'This filter is required',
        minValue: 'Value must be at least {min}',
        maxValue: 'Value must be at most {max}',
        invalidFormat: 'Invalid format',
    },
};

/**
 * Helper function to interpolate values in strings.
 * Replaces {key} with the corresponding value from the params object.
 */
export function interpolateFilterString(
    template: string,
    params: Record<string, string | number>,
): string {
    const withCurlyPlaceholders = template.replace(/{(\w+)}/g, (match, key) => {
        return String(params[key] ?? match);
    });

    const withColonPlaceholdersReplaced = withCurlyPlaceholders.replace(
        /:(\w+)/g,
        (match, key) => {
            return params[key] !== undefined ? String(params[key]) : match;
        },
    );

    return withColonPlaceholdersReplaced;
}

/**
 * Helper function to get a string from a strings object
 * with dot notation support.
 */
export function getFilterString(
    strings: FilterStrings,
    path: string,
    params?: Record<string, string | number>,
): string {
    const keys = path.split('.');
    let result: unknown = strings;

    for (const key of keys) {
        if (result == null || typeof result !== 'object') {
            return path; // Return the path if the string is not found
        }
        result = (result as Record<string, unknown>)[key];
    }

    if (typeof result === 'string') {
        return params ? interpolateFilterString(result, params) : result;
    }

    return path; // Return the path if the string is not found
}
