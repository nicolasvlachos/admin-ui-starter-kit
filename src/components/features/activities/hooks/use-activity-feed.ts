/**
 * useActivityFeed — headless state machine for the Activities feature.
 *
 * Returns date-grouped activities with stable React keys, plus the expand /
 * collapse map for change-detail rows. Consumers wanting a fully custom UI
 * can call this hook directly and bypass `<ActivityFeed />`.
 */
import { isToday, isYesterday } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import type { ActivitiesStrings } from '../activities.strings';
import type { ActivityItem } from '../activities.types';

export interface ActivityKeyedItem<TData = unknown> {
    activity: ActivityItem<TData>;
    key: string;
}

export interface ActivityDateGroup<TData = unknown> {
    label: string;
    items: ActivityKeyedItem<TData>[];
}

export interface UseActivityFeedOptions<TData = unknown> {
    activities: ReadonlyArray<ActivityItem<TData>>;
    groupByDate?: boolean;
    expandedByDefault?: boolean;
    locale?: string;
    strings: ActivitiesStrings;
    formatDateGroupLabel?: (
        iso: string | null,
        strings: ActivitiesStrings,
    ) => string;
}

export interface UseActivityFeedReturn<TData = unknown> {
    groups: ActivityDateGroup<TData>[];
    total: number;
    isExpanded: (id: string) => boolean;
    toggleExpanded: (id: string) => void;
    setExpanded: (id: string, value: boolean) => void;
    expandAll: () => void;
    collapseAll: () => void;
}

function defaultDateGroupLabel(
    iso: string | null,
    strings: ActivitiesStrings,
    locale?: string,
): string {
    if (!iso) return strings.undated;
    const date = new Date(iso);
    if (isToday(date)) return strings.today;
    if (isYesterday(date)) return strings.yesterday;
    try {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    } catch {
        return new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    }
}

export function useActivityFeed<TData = unknown>({
    activities,
    groupByDate = true,
    expandedByDefault = false,
    locale,
    strings,
    formatDateGroupLabel,
}: UseActivityFeedOptions<TData>): UseActivityFeedReturn<TData> {
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

    const keyed = useMemo<ActivityKeyedItem<TData>[]>(() => {
        const seen = new Map<string, number>();
        return activities.map((activity) => {
            const baseId = String(activity.id ?? '').trim();
            const createdAt = String(activity.createdAt ?? '').trim();
            const event = String(activity.event ?? '').trim();
            const source = String(activity.source ?? '').trim();
            const keyBase = [baseId, createdAt, event, source].join(':');
            const occurrence = (seen.get(keyBase) ?? 0) + 1;
            seen.set(keyBase, occurrence);
            return { activity, key: `${keyBase}:${occurrence}` };
        });
    }, [activities]);

    const groups = useMemo<ActivityDateGroup<TData>[]>(() => {
        if (!groupByDate) {
            return keyed.length > 0 ? [{ label: '', items: keyed }] : [];
        }
        const out: ActivityDateGroup<TData>[] = [];
        let currentLabel = '__init__';
        let currentItems: ActivityKeyedItem<TData>[] = [];

        const labelFor = (iso: string | null) =>
            formatDateGroupLabel
                ? formatDateGroupLabel(iso, strings)
                : defaultDateGroupLabel(iso, strings, locale);

        for (const item of keyed) {
            const iso = item.activity.createdAt ?? null;
            const label = labelFor(iso);
            if (label !== currentLabel) {
                if (currentItems.length > 0) {
                    out.push({ label: currentLabel, items: currentItems });
                }
                currentLabel = label;
                currentItems = [item];
            } else {
                currentItems.push(item);
            }
        }
        if (currentItems.length > 0) {
            out.push({ label: currentLabel, items: currentItems });
        }
        return out;
    }, [keyed, groupByDate, locale, strings, formatDateGroupLabel]);

    const isExpanded = useCallback(
        (id: string) => expandedMap[id] ?? expandedByDefault,
        [expandedMap, expandedByDefault],
    );

    const toggleExpanded = useCallback((id: string) => {
        setExpandedMap((current) => ({
            ...current,
            [id]: !(current[id] ?? false),
        }));
    }, []);

    const setExpanded = useCallback((id: string, value: boolean) => {
        setExpandedMap((current) => ({ ...current, [id]: value }));
    }, []);

    const expandAll = useCallback(() => {
        const next: Record<string, boolean> = {};
        for (const k of keyed) next[k.activity.id] = true;
        setExpandedMap(next);
    }, [keyed]);

    const collapseAll = useCallback(() => setExpandedMap({}), []);

    return {
        groups,
        total: keyed.length,
        isExpanded,
        toggleExpanded,
        setExpanded,
        expandAll,
        collapseAll,
    };
}
