import { useMemo, useCallback } from 'react';
import { Button } from '@/components/base/buttons';
import { cn } from '@/lib/utils';
import { useFilters } from '../filter-context';
import { FilterType, type ActiveFilter, type FilterTab } from '../filters.types';
import { getDefaultOperatorForType } from '../operator-options';

interface FilterTabsProps {
    tabs: FilterTab[];
}

/**
 * Horizontal tab row for filter presets (Shopify admin style).
 *
 * - "All" tab (empty presets): active when zero non-search active filters
 * - Named tabs: active when presets exactly match non-search active filters
 * - Search filters are preserved across tab switches
 */
export function FilterTabs({ tabs }: FilterTabsProps) {
    const { activeFilters, filters, replaceFilters } = useFilters();

    const nonSearchFilters = useMemo(
        () => activeFilters.filter((f) => {
            const config = filters.find((fc) => fc.key === f.key);
            return config?.type !== FilterType.SEARCH;
        }),
        [activeFilters, filters],
    );

    const searchFilters = useMemo(
        () => activeFilters.filter((f) => {
            const config = filters.find((fc) => fc.key === f.key);
            return config?.type === FilterType.SEARCH;
        }),
        [activeFilters, filters],
    );

    const activeTabId = useMemo(() => {
        for (const tab of tabs) {
            // "All" tab: no presets → active when zero non-search filters
            if (tab.presets.length === 0) {
                if (nonSearchFilters.length === 0) return tab.id;
                continue;
            }

            // Named tab: bidirectional exact match
            if (tab.presets.length !== nonSearchFilters.length) continue;

            const allMatch = tab.presets.every((preset) => {
                const active = nonSearchFilters.find((f) => f.key === preset.key);
                if (!active) return false;

                const sortedPreset = [...preset.value].sort();
                const sortedActive = [...active.value].sort();
                if (sortedPreset.length !== sortedActive.length) return false;
                if (sortedPreset.some((v, i) => v !== sortedActive[i])) return false;

                // Check operator if specified in preset
                if (preset.operator && active.operator !== preset.operator) return false;

                return true;
            });

            if (allMatch) return tab.id;
        }

        return null;
    }, [tabs, nonSearchFilters]);

    const handleTabClick = useCallback(
        (tab: FilterTab) => {
            if (tab.presets.length === 0) {
                // "All" tab — keep only search filters
                replaceFilters([...searchFilters]);
                return;
            }

            const presetFilters: ActiveFilter[] = tab.presets.map((preset) => {
                const filterConfig = filters.find((fc) => fc.key === preset.key);
                const operator =
                    preset.operator ??
                    filterConfig?.operator ??
                    (filterConfig
                        ? getDefaultOperatorForType(filterConfig.type)
                        : 'equals');

                return {
                    id: preset.key,
                    key: preset.key,
                    value: preset.value,
                    operator,
                };
            });

            replaceFilters([...searchFilters, ...presetFilters]);
        },
        [filters, searchFilters, replaceFilters],
    );

    if (tabs.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1.5" role="tablist">
            {tabs.map((tab) => {
                const isActive = activeTabId === tab.id;

                return (
                    <Button
                        key={tab.id}
                        type="button"
                        variant="secondary"
                        buttonStyle="ghost"
                        size="xs"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleTabClick(tab)}
                        className={cn(
                            'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                            isActive
                                ? 'bg-foreground text-background'
                                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span
                                className={cn(
                                    'ml-1 tabular-nums',
                                    isActive
                                        ? 'text-background/70'
                                        : 'text-muted-foreground/70',
                                )}
                            >
                                {tab.count}
                            </span>
                        )}
                    </Button>
                );
            })}
        </div>
    );
}
