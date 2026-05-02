import type { ReactNode } from 'react';

/** Shared height class for all filter control elements. */
export const FILTER_ELEMENT_HEIGHT = 'h-8';

/**
 * Core type definitions and interfaces for the filters feature.
 *
 * This file defines:
 * - Filter types (SELECT, MULTI_SELECT, SEARCH, RANGE, DATE)
 * - Filter operators (equals, contains, in, etc.)
 * - Configuration interfaces for filters
 * - Context value types for filter state management
 * - Validation and display configuration types
 *
 * These types are used throughout the filters feature to ensure type safety
 * and consistent data structures.
 */

export const FilterType = {
    SELECT: 'select',
    MULTI_SELECT: 'multi_select',
    ASYNC_SELECT: 'async_select',
    SEARCH: 'search',
    RANGE: 'range',
    DATE: 'date',
    TAGS: 'tags',
} as const;

export type FilterType = (typeof FilterType)[keyof typeof FilterType];

// Convert string union to enum for better type safety and autocompletion
// Note: All enum values are used via the FilterOperator type below, even if not directly referenced
export const FilterOperatorEnum = {
    EQUALS: 'equals',
    CONTAINS: 'contains',
    IN: 'in',
    NOT_IN: 'not_in',
    NOT: 'not',
    BEFORE: 'before',
    AFTER: 'after',
    BETWEEN: 'between',
    GT: 'gt',
    LT: 'lt',
    GTE: 'gte',
    LTE: 'lte',
    HAS: 'has',
    HAS_ANY: 'has_any',
    HAS_ALL: 'has_all',
} as const;

// Strict type for better type safety - using enum values to match backend
export type FilterOperator = (typeof FilterOperatorEnum)[keyof typeof FilterOperatorEnum];

export interface OperatorOption {
    label: string;
    value: FilterOperator;
}

// Filter display types
// Accept both 'drawer' and 'collapsed' as synonyms for the collapsed UI
export type FilterDisplay = 'always' | 'drawer' | 'collapsed' | 'hidden';

export const FilterCategory = {
    FILTER: 'filter',
    SORT: 'sort',
    GROUP: 'group',
} as const;

export type FilterCategory = (typeof FilterCategory)[keyof typeof FilterCategory];

export interface FilterOption {
    label: string;
    value: string;
    icon: ReactNode;
    children?: FilterOption[];
    disabled?: boolean;
    description?: string;
    color?: string;
}

export interface DisplayConfig {
    renderConfig?: {
        desktop: string;
        mobile?: string;
        tablet?: string;
    };
    display?: FilterDisplay;
    category?: FilterCategory;
    priority?: number;
    hidden?: boolean;
    className?: string; // Simplified config for basic styling needs
}

export interface ValidationConfig {
    min?: number;
    max?: number;
    pattern?: RegExp;
    required?: boolean;
    custom?: (value: unknown) => boolean | string;
}

export interface FilterDependency {
    key: string;
    operator: FilterOperator;
    value: string | string[];
}

/**
 * Configuration for ASYNC_SELECT filters that fetch options from the server.
 *
 * Supports two modes:
 * - Declarative: provide `fetchOptions` on FilterConfig (simpler, backward-compatible)
 * - TanStack Query: provide `asyncConfig` for full control over caching, abort, preload
 *
 * When both are provided, `asyncConfig` takes precedence.
 */
export interface AsyncSelectConfig<TItem = unknown> {
    /** TanStack Query key factory — receives { query, limit } and returns a stable key */
    queryKey: (args: { query: string; limit: number }) => readonly unknown[];
    /** Fetcher function — receives { query, limit, signal } and returns items */
    fetcher: (args: {
        query: string;
        limit: number;
        signal?: AbortSignal;
    }) => Promise<TItem[]>;
    /** Maps a fetched item to a FilterOption for display */
    mapToOption: (item: TItem) => FilterOption;
    /** Max items to fetch per request (default: 10) */
    limit?: number;
    /** Minimum characters before fetching (default: 0) */
    minQueryLength?: number;
    /** Whether to fetch with empty query on open (default: true) */
    preload?: boolean;
    /** Debounce delay in ms (default: 300) */
    debounceMs?: number;
    /** TanStack Query staleTime in ms (default: 60_000) */
    staleTime?: number;
    /** TanStack Query gcTime in ms (default: 300_000) */
    gcTime?: number;
}

export interface FilterConfig {
    key: string;
    label: string;
    /** Plural form of the label, used in "{count} {label} selected" when count > 1 */
    pluralLabel?: string;
    type: FilterType;
    description?: string;
    operator?: FilterOperator;
    operators?: OperatorOption[]; // Available operators for this filter
    options?: FilterOption[];
    placeholder?: string;
    delay?: number;
    icon: ReactNode;
    displayConfig: DisplayConfig;
    defaultValue?: string | string[];
    validation?: ValidationConfig;
    dependencies?: FilterDependency[];
    fetchOptions?: (
        dependencyValues: Record<string, string[]>,
    ) => Promise<FilterOption[]>;
    multiple?: boolean;
    closeOnSelect?: boolean;
    maxSelected?: number;
    /** TanStack Query-powered async config for ASYNC_SELECT filters */
    asyncConfig?: AsyncSelectConfig;
    dateFormat?: {
        display?: string; // Format for display (e.g., 'MMM d, yyyy')
        param?: string; // Format for URL parameters (e.g., 'yyyy-MM-dd')
    };
    // Date picker specific options
    datePickerConfig?: {
        showConfirmButton?: boolean;
        showShortcuts?: boolean;
        fullWidth?: boolean;
        noDatePlaceholder?: string;
        noRangePlaceholder?: string;
        autoApply?: boolean; // Whether to automatically apply date selections
    };
    // Optional formatting functions
    format?: (value: unknown) => string;
    parse?: (value: string) => unknown;
    transform?: (value: unknown) => unknown;
}

export interface ActiveFilter {
    id: string;
    key: string;
    operator: FilterOperator;
    value: string[];
}

export interface FilterGroup {
    label: string;
    filters: FilterConfig[];
}

export interface FilterState {
    [key: string]: string[];
}

export interface FilterTabPreset {
    key: string;
    value: string[];
    operator?: FilterOperator;
}

export interface FilterTab {
    id: string;
    label: string;
    presets: FilterTabPreset[];
    count?: number;
}
