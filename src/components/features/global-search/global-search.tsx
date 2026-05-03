/**
 * GlobalSearch — framework-agnostic spotlight overlay for app-wide search.
 *
 * Composition seams:
 *   - `strings`        — deep-partial override of the default copy
 *   - `slots`          — replace any region (input, tabs, idle, empty, loading, footer)
 *   - `slots.renderResult` — full per-row override
 *   - `slots.toneBg / toneAvatar` — replace tone palettes
 *
 * Headless usage:
 *   - Call `useGlobalSearch({ results, query })` directly to drive a
 *     completely custom UI against the same selection state machine.
 *
 * Framework-agnostic:
 *   - No router import, no i18n SDK import. Routing is up to the consumer
 *     via `onResultSelect`. Strings live in the `strings` prop.
 *   - The library no longer ships `adapters/$framework/`. Consumers map
 *     their router (Inertia, Tanstack Router, RR7, Next, …) to
 *     `onResultSelect(result)` directly at the call site.
 */
import * as React from 'react';

import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import {
    defaultGlobalSearchStrings,
    interpolateString,
    type GlobalSearchStrings,
} from './global-search.strings';
import type {
    GlobalSearchIdleSection,
    GlobalSearchResult,
    GlobalSearchSlots,
    GlobalSearchTab,
} from './global-search.types';
import { useGlobalSearch } from './hooks/use-global-search';
import {
    GlobalSearchEmptyState,
    GlobalSearchFooter,
    GlobalSearchIdleState,
    GlobalSearchInput,
    GlobalSearchResultRow,
    GlobalSearchTabs,
} from './partials';

export interface GlobalSearchProps<TGroup extends string = string> {
    /** Result list. The component renders these grouped by `result.group`. */
    results?: ReadonlyArray<GlobalSearchResult<TGroup>>;
    /** Current query value (controlled). */
    query: string;
    /** Query change callback. */
    onQueryChange: (q: string) => void;
    /** Activation callback — fires on row click or Enter. */
    onResultSelect?: (result: GlobalSearchResult<TGroup>) => void;
    /** Escape-key callback. */
    onClose?: () => void;
    /** Loading flag — switches the input spinner and renders the loading slot. */
    loading?: boolean;
    /** Idle-state sections (Recent / Suggestions / …). */
    idleSections?: ReadonlyArray<GlobalSearchIdleSection>;
    /** Override default group labels in the tab strip. */
    groupLabels?: Partial<Record<TGroup, string>>;
    /** Auto-focus the input on mount. */
    autoFocus?: boolean;
    /** Replace any portion of the default copy. */
    strings?: Partial<GlobalSearchStrings>;
    /** Replace any portion of the layout. */
    slots?: GlobalSearchSlots<TGroup>;
    /** Custom tab list — overrides the auto-generated `All + groups`. */
    tabs?: ReadonlyArray<GlobalSearchTab<TGroup>>;
    /** Wrapper className. */
    className?: string;
}

export function GlobalSearch<TGroup extends string = string>({
    results = [],
    query,
    onQueryChange,
    onResultSelect,
    onClose,
    loading = false,
    idleSections,
    groupLabels,
    autoFocus = false,
    strings: stringsProp,
    slots,
    tabs,
    className,
}: GlobalSearchProps<TGroup>) {
    const strings: GlobalSearchStrings = {
        ...defaultGlobalSearchStrings,
        ...stringsProp,
    };

    const search = useGlobalSearch<TGroup>({
        results,
        query,
        onResultSelect,
        onClose,
    });

    const isEmpty =
        !loading && query.trim().length > 1 && results.length === 0;
    const isIdle = !loading && query.trim().length <= 1;

    const resolvedTabs = React.useMemo<
        ReadonlyArray<GlobalSearchTab<TGroup>>
    >(() => {
        if (tabs) return tabs;
        const groupKeys = Object.keys(search.grouped) as TGroup[];
        return [
            { value: 'all', label: strings.tabAll },
            ...groupKeys.map((key) => ({
                value: key,
                label: groupLabels?.[key] ?? key,
            })),
        ];
    }, [tabs, search.grouped, strings.tabAll, groupLabels]);

    return (
        <div
            className={cn('global-search--component', 
                'overflow-hidden rounded-xl border border-border bg-card shadow-2xl',
                className,
            )}
        >
            {slots?.input ?? (
                <GlobalSearchInput
                    value={query}
                    onChange={onQueryChange}
                    onKeyDown={search.onKeyDown}
                    placeholder={strings.placeholder}
                    clearLabel={strings.clear}
                    loading={loading}
                    autoFocus={autoFocus}
                />
            )}

            {!loading && results.length > 0 && (
                slots?.tabs ?? (
                    <GlobalSearchTabs<TGroup>
                        value={search.activeTab}
                        onValueChange={search.setActiveTab}
                        tabs={resolvedTabs}
                        counts={search.tabCounts}
                    />
                )
            )}

            <div className="max-h-[520px] overflow-y-auto">
                {!!isIdle && (slots?.idle ?? (
                    idleSections && idleSections.length > 0 ? (
                        <GlobalSearchIdleState sections={idleSections} />
                    ) : null
                ))}

                {!!loading && (slots?.loading ?? (
                    <div className="flex items-center justify-center px-6 py-12">
                        <Text type="secondary">
                            {strings.loading}
                        </Text>
                    </div>
                ))}

                {!!isEmpty && (slots?.empty ?? (
                    <GlobalSearchEmptyState
                        title={interpolateString(strings.emptyTitle, { query })}
                        hint={strings.emptyHint}
                    />
                ))}

                {!loading && results.length > 0 && (
                    <div className="px-2 py-2">
                        {Object.entries(search.visibleGrouped).map(
                            ([groupKey, items], gi) => (
                                <div
                                    key={groupKey}
                                    className={cn(
                                        'pb-2 last:pb-0',
                                        gi > 0 && 'mt-3 pt-2',
                                    )}
                                >
                                    <div className="flex items-center justify-between px-3 pb-1">
                                        <Text size="xs" type="secondary" weight="medium">
                                            {groupLabels?.[groupKey as TGroup] ?? groupKey}
                                        </Text>
                                        {search.activeTab === 'all' && items.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    search.setActiveTab(groupKey as TGroup)
                                                }
                                                className="rounded text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            >
                                                <Text
                                                    tag="span"
                                                    size="xxs"
                                                    weight="medium"
                                                    className="text-primary"
                                                >
                                                    {strings.seeAll}
                                                </Text>
                                            </button>
                                        )}
                                    </div>
                                    <ul className="space-y-0.5">
                                        {items.map((item) => {
                                            const isActive =
                                                search.flat[search.activeIdx]?.id === item.id;
                                            const ctx = {
                                                isActive,
                                                query,
                                                onSelect: () => onResultSelect?.(item),
                                            };
                                            const node = slots?.renderResult ? (
                                                slots.renderResult(item, ctx)
                                            ) : (
                                                <GlobalSearchResultRow<TGroup>
                                                    result={item}
                                                    isActive={isActive}
                                                    query={query}
                                                    onSelect={ctx.onSelect}
                                                    onMouseEnter={() =>
                                                        search.setActiveById(item.id)
                                                    }
                                                    toneBg={slots?.toneBg}
                                                    toneAvatar={slots?.toneAvatar}
                                                />
                                            );
                                            return <li key={item.id}>{node}</li>;
                                        })}
                                    </ul>
                                </div>
                            ),
                        )}
                    </div>
                )}
            </div>

            {slots?.footer ?? (
                <GlobalSearchFooter
                    navigateLabel={strings.footerNavigate}
                    openLabel={strings.footerOpen}
                    closeLabel={strings.footerClose}
                    trailing={
                        !isIdle && !isEmpty && results.length > 0 ? (
                            <Text
                                tag="span"
                                size="xxs"
                                type="secondary"
                                className="tabular-nums"
                            >
                                {interpolateString(strings.resultsCount, {
                                    count: results.length,
                                })}
                            </Text>
                        ) : undefined
                    }
                />
            )}
        </div>
    );
}
