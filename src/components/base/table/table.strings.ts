import { type DataTableStrings, type DataTableStringsOverride } from './table.types';

const fallbackTitleCase = (value: string): string => {
    const formatted = value
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!formatted) {
        return 'Column';
    }

    return formatted.replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatColumnLabel = (columnId: string, currentLabel?: string | null): string => {
    if (currentLabel && currentLabel.trim().length > 0) {
        return currentLabel;
    }

    return fallbackTitleCase(columnId);
};

export const defaultDataTableStrings: DataTableStrings = {
    emptyState: {
        message: 'No results found.',
    },
    actions: {
        triggerLabel: 'Actions',
        srLabel: 'Row actions menu',
    },
    filter: {
        searchPlaceholder: 'Filter...',
        columnsButton: 'Columns',
    },
    columnVisibility: {
        title: 'Toggle columns',
        triggerLabel: 'Columns',
        formatLabel: formatColumnLabel,
    },
    toolbar: {
        scrollLeft: 'Scroll left',
        scrollRight: 'Scroll right',
        columns: 'Toggle columns',
        dense: 'Compact view',
        comfortable: 'Comfortable view',
    },
    pagination: {
        showing: 'Showing',
        to: 'to',
        of: 'of',
        entries: 'results',
        previous: 'Previous',
        next: 'Next',
        page: 'Page',
        rowsPerPage: 'Rows per page',
        ariaLabel: 'Pagination navigation',
    },
    selection: {
        summary: (selected, total) => `${selected} of ${total} row${total === 1 ? '' : 's'} selected.`,
        row: (index) => `Select row ${index + 1}`,
        selectAll: 'Select all rows',
    },
} as const;

const mergeNested = <T extends object>(defaults: T, overrides?: Partial<T>): T => ({
    ...defaults,
    ...(overrides ?? {}),
});

export const mergeDataTableStrings = (overrides?: DataTableStringsOverride): DataTableStrings => {
    if (!overrides) {
        return defaultDataTableStrings;
    }

    return {
        emptyState: mergeNested(defaultDataTableStrings.emptyState, overrides.emptyState),
        actions: mergeNested(defaultDataTableStrings.actions, overrides.actions),
        filter: mergeNested(defaultDataTableStrings.filter, overrides.filter),
        columnVisibility: mergeNested(defaultDataTableStrings.columnVisibility, overrides.columnVisibility),
        toolbar: mergeNested(defaultDataTableStrings.toolbar, overrides.toolbar),
        pagination: mergeNested(defaultDataTableStrings.pagination, overrides.pagination),
        selection: mergeNested(defaultDataTableStrings.selection, overrides.selection),
    };
};
