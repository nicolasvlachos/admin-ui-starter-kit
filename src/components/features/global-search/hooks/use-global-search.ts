/**
 * useGlobalSearch — headless state machine for `<GlobalSearch />`.
 *
 * Owns the active-row index, active tab, and the keyboard-navigation
 * handler. Returns the derived flat list (results filtered by tab) so
 * consumers can render entirely custom UIs against the same state.
 *
 * Usage:
 *   const search = useGlobalSearch({ results, query });
 *   <input onKeyDown={search.onKeyDown} />
 *   {search.flat.map((r, i) => <Row active={i === search.activeIdx} … />)}
 */
import { useEffect, useMemo, useRef, useState } from 'react';

import type { GlobalSearchResult } from '../global-search.types';

export interface UseGlobalSearchOptions<TGroup extends string = string> {
    results: ReadonlyArray<GlobalSearchResult<TGroup>>;
    query: string;
    /** Fires when the user activates a row (Enter or click). */
    onResultSelect?: (result: GlobalSearchResult<TGroup>) => void;
    /** Fires when the user presses Escape. */
    onClose?: () => void;
}

export interface UseGlobalSearchReturn<TGroup extends string = string> {
    /** Results bucketed by group, in insertion order. */
    grouped: Record<string, GlobalSearchResult<TGroup>[]>;
    /** Result count per tab (`all` plus each group key). */
    tabCounts: Record<string, number>;
    /** Currently-selected tab. */
    activeTab: 'all' | TGroup;
    /** Set the active tab — also resets the active index. */
    setActiveTab: (tab: 'all' | TGroup) => void;
    /** Filtered grouped map respecting the active tab. */
    visibleGrouped: Record<string, GlobalSearchResult<TGroup>[]>;
    /** Flat ordered list matching what is currently rendered. */
    flat: GlobalSearchResult<TGroup>[];
    /** Index into `flat` of the currently-highlighted row. */
    activeIdx: number;
    setActiveIdx: (i: number) => void;
    /** Programmatically activate a result by id. */
    setActiveById: (id: string) => void;
    /** Bind to the search input's `onKeyDown` for arrow / enter / escape support. */
    onKeyDown: (e: React.KeyboardEvent) => void;
    /** Activate the row at `activeIdx`. */
    selectActive: () => void;
}

export function useGlobalSearch<TGroup extends string = string>({
    results,
    query,
    onResultSelect,
    onClose,
}: UseGlobalSearchOptions<TGroup>): UseGlobalSearchReturn<TGroup> {
    const [activeTab, setActiveTabState] =
        useState<'all' | TGroup>('all');
    const [activeIdx, setActiveIdx] = useState(0);

    // Reset both the active row and the active tab when the query changes
    // (so a fresh query never inherits a stale highlight or filter).
    useEffect(() => {
        setActiveTabState('all');
        setActiveIdx(0);
    }, [query]);

    const grouped = useMemo(() => {
        const buckets: Record<string, GlobalSearchResult<TGroup>[]> = {};
        for (const r of results) {
            (buckets[r.group] ??= []).push(r);
        }
        return buckets;
    }, [results]);

    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = { all: results.length };
        for (const [k, v] of Object.entries(grouped)) counts[k] = v.length;
        return counts;
    }, [results.length, grouped]);

    const visibleGrouped = useMemo(() => {
        if (activeTab === 'all') return grouped;
        const sub = grouped[activeTab as string];
        return sub ? ({ [activeTab as string]: sub } as Record<string, GlobalSearchResult<TGroup>[]>) : {};
    }, [grouped, activeTab]);

    const flat = useMemo(() => {
        if (activeTab === 'all') return results.slice();
        return grouped[activeTab as string] ?? [];
    }, [activeTab, grouped, results]);

    const activeIdxRef = useRef(activeIdx);
    activeIdxRef.current = activeIdx;
    const flatRef = useRef(flat);
    flatRef.current = flat;

    const setActiveTab = (tab: 'all' | TGroup) => {
        setActiveTabState(tab);
        setActiveIdx(0);
    };

    const setActiveById = (id: string) => {
        const idx = flatRef.current.findIndex((r) => r.id === id);
        if (idx >= 0) setActiveIdx(idx);
    };

    const selectActive = () => {
        const item = flatRef.current[activeIdxRef.current];
        if (item) onResultSelect?.(item);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIdx((i) => Math.min(i + 1, flatRef.current.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            const item = flatRef.current[activeIdxRef.current];
            if (item) {
                e.preventDefault();
                onResultSelect?.(item);
            }
        } else if (e.key === 'Escape') {
            onClose?.();
        }
    };

    return {
        grouped,
        tabCounts,
        activeTab,
        setActiveTab,
        visibleGrouped,
        flat,
        activeIdx,
        setActiveIdx,
        setActiveById,
        onKeyDown,
        selectActive,
    };
}
