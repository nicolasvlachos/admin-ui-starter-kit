import type { ReactNode } from 'react';

export interface PopoverMenuItem<T = unknown> {
    /** Unique identifier — also the cmdk match value when no `searchValue` provided. */
    value: string;
    /** Visible label rendered in the row. Override entirely via `renderItem`. */
    label: ReactNode;
    /** Optional secondary line rendered under the label. */
    description?: ReactNode;
    /** Leading icon — keep small (size-3.5/size-4 max). */
    icon?: ReactNode;
    /** Show the trailing checkmark when `true`. */
    selected?: boolean;
    /** Disable the row. */
    disabled?: boolean;
    /** Custom string used by cmdk for matching when `label` is not a plain string. */
    searchValue?: string;
    /** Arbitrary payload for `onSelect` consumers. */
    data?: T;
}

export interface PopoverMenuStrings {
    /** Placeholder for the search input (when `search` is enabled). */
    searchPlaceholder: string;
    /** Empty-state copy when filtering yields no items. */
    empty: string;
    /** Loading-state copy. */
    loading: string;
}

export const defaultPopoverMenuStrings: PopoverMenuStrings = {
    searchPlaceholder: 'Search…',
    empty: 'No results.',
    loading: 'Loading…',
};
