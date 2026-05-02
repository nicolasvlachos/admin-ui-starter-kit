/**
 * ActivityFeed — framework-agnostic activity timeline.
 *
 * Composition seams:
 *   - `strings`            — deep-partial override of every label
 *   - `eventConfig`        — mass-configurable per-event icon/tone/labels
 *   - `slots`              — replace any region (row / headline / marker /
 *                              dateLabel / empty / loading / header / footer)
 *   - `slots.renderRow`    — full per-row override
 *   - `accessors`          — formatRelative/Absolute, getEventLabel, …
 *   - `actionsForActivity` — surface a per-row action menu (rich density)
 *   - `resources` + `onResourcesChange` — registry-driven rich resource
 *                              tags (icons, badges, links, tags) with save
 *                              and restore semantics for the consumer
 *
 * Headless usage:
 *   - Call `useActivityFeed({ activities, ... })` directly to drive a
 *     completely custom UI against the same grouping/expand state machine.
 *   - Call `useActivityResources({ resources, onResourcesChange })` to
 *     drive the registry independently.
 *
 * Framework-agnostic:
 *   - No router import, no i18n SDK import. Wire actor / resource navigation
 *     via callbacks at the call site.
 */
import { useMemo, type ReactNode } from 'react';

import { Text } from '@/components/typography';
import { useDatesConfig } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';

import {
    defaultActivityEventConfig,
    resolveEventConfig,
} from './activities.config';
import {
    defaultActivitiesStrings,
    type ActivitiesStrings,
} from './activities.strings';
import type {
    ActivityAction,
    ActivityFeedProps,
    ActivityItem,
    ActivityRenderRowContext,
    ActivityTone,
} from './activities.types';
import { useActivityFeed } from './hooks/use-activity-feed';
import { useActivityResources } from './hooks/use-activity-resources';
import {
    ActivityDateLabel,
    ActivityEmptyState,
    ActivityRow,
} from './partials';

function defaultFormatAbsolute(iso: string, locale?: string): string {
    try {
        return new Intl.DateTimeFormat(locale, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(iso));
    } catch {
        return iso;
    }
}

function resolveTone<TData>(
    activity: ActivityItem<TData>,
    eventTone: ActivityTone,
): ActivityTone {
    return activity.toneOverride ?? eventTone;
}

export function ActivityFeed<TData = unknown>(props: ActivityFeedProps<TData>) {
    const {
        activities = [],
        density = 'default',
        groupByDate = true,
        expandedByDefault = false,
        currentUserId,
        loading = false,
        eventConfig: eventConfigOverride,
        strings: stringsProp,
        slots,
        className,
        locale,
        // accessors
        formatRelativeTime,
        formatAbsoluteTime,
        formatDateGroupLabel,
        getEventLabel: _getEventLabel,
        getSourceLabel,
        actionsForActivity,
        // callbacks
        onActivityClick,
        onActorClick,
        onResourceClick,
        onAction,
        // resources
        resources,
        onResourcesChange,
    } = props;

    const strings: ActivitiesStrings = useMemo<ActivitiesStrings>(
        () => ({
            ...defaultActivitiesStrings,
            ...stringsProp,
            sources: {
                ...defaultActivitiesStrings.sources,
                ...(stringsProp?.sources ?? {}),
            },
            events: {
                ...defaultActivitiesStrings.events,
                ...(stringsProp?.events ?? {}),
            },
        }),
        [stringsProp],
    );

    const eventConfigMap = useMemo(
        () => ({ ...defaultActivityEventConfig, ...eventConfigOverride }),
        [eventConfigOverride],
    );

    const registry = useActivityResources({
        resources,
        onResourcesChange,
    });

    const feed = useActivityFeed<TData>({
        activities,
        groupByDate,
        expandedByDefault,
        locale,
        strings,
        formatDateGroupLabel,
    });

    const { formatRelativeTime: storeFormatRelative } = useDatesConfig();
    const fmtRelative = formatRelativeTime ?? storeFormatRelative ?? ((iso: string) => iso);
    const fmtAbsolute = formatAbsoluteTime ?? ((iso: string) => defaultFormatAbsolute(iso, locale));

    if (loading) {
        return (
            <div className={cn('px-2 py-4', className)}>
                {slots?.loading ?? (
                    <Text type="secondary" align="center">
                        {strings.loading}
                    </Text>
                )}
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className={cn('px-2 py-2', className)}>
                {slots?.empty ?? <ActivityEmptyState title={strings.empty} />}
            </div>
        );
    }

    const totalRendered = feed.groups.reduce((acc, g) => acc + g.items.length, 0);
    let renderedSoFar = 0;

    return (
        <div className={cn('flex flex-col', className)}>
            {!!slots?.header && <div className="mb-3">{slots.header}</div>}

            <div className="flex flex-col">
                {feed.groups.map((group, gi) => {
                    const isFirstGroup = gi === 0;
                    return (
                        <div key={`${group.label}-${gi}`} className={cn(isFirstGroup ? '' : 'mt-1')}>
                            {slots?.renderDateLabel
                                ? slots.renderDateLabel(group.label, isFirstGroup)
                                : (
                                    <ActivityDateLabel
                                        label={group.label}
                                        isFirst={isFirstGroup}
                                        className={isFirstGroup ? '' : 'mb-2'}
                                    />
                                )}

                            <div className={cn('flex flex-col', !!group.label && 'mt-2')}>
                                {group.items.map((keyed, ii) => {
                                    const activity = keyed.activity;
                                    const isFirstInGroup = ii === 0;
                                    const isLast =
                                        ++renderedSoFar === totalRendered;
                                    const eventCfg = resolveEventConfig(
                                        activity.event,
                                        eventConfigMap,
                                    );
                                    const tone = resolveTone(activity, eventCfg.tone);
                                    const relativeTime = activity.timestamp
                                        ?? (activity.createdAt
                                            ? fmtRelative(activity.createdAt)
                                            : null);
                                    const absoluteTime = activity.createdAt
                                        ? fmtAbsolute(activity.createdAt)
                                        : null;
                                    const sourceLabel = activity.source
                                        ? (getSourceLabel?.(activity.source)
                                                ?? strings.sources[activity.source]
                                                ?? eventCfg.sourceLabel
                                                ?? null)
                                        : eventCfg.sourceLabel ?? null;
                                    const sourceLabelTrimmed =
                                        sourceLabel && sourceLabel.trim().length > 0
                                            ? sourceLabel
                                            : null;
                                    const actions: readonly ActivityAction<TData>[] =
                                        actionsForActivity?.(activity) ?? [];

                                    const ctx: ActivityRenderRowContext<TData> = {
                                        density,
                                        isLast,
                                        isFirstInGroup,
                                        activity,
                                        eventConfig: eventCfg,
                                        tone,
                                        relativeTime,
                                        absoluteTime,
                                        sourceLabel: sourceLabelTrimmed,
                                        expanded: feed.isExpanded(activity.id),
                                        toggleExpanded: () =>
                                            feed.toggleExpanded(activity.id),
                                    };

                                    const customRow = slots?.renderRow?.(activity, ctx);
                                    if (customRow !== undefined) {
                                        return (
                                            <div key={keyed.key}>{customRow}</div>
                                        );
                                    }

                                    const headlineOverride =
                                        slots?.renderHeadline?.(activity, ctx);
                                    const markerOverride =
                                        slots?.renderMarker?.(activity, ctx);

                                    return (
                                        <ActivityRow<TData>
                                            key={keyed.key}
                                            activity={activity}
                                            density={density}
                                            eventConfig={eventCfg}
                                            tone={tone}
                                            isLast={isLast}
                                            expanded={ctx.expanded}
                                            onToggleExpanded={ctx.toggleExpanded}
                                            relativeTime={relativeTime}
                                            absoluteTime={absoluteTime}
                                            sourceLabel={sourceLabelTrimmed}
                                            youLabel={strings.you}
                                            showChangesLabel={strings.showChanges}
                                            hideChangesLabel={strings.hideChanges}
                                            actionsLabel={strings.actionsLabel}
                                            currentUserId={currentUserId}
                                            actions={actions}
                                            onActivityClick={onActivityClick}
                                            onActorClick={onActorClick}
                                            onResourceClick={onResourceClick}
                                            onAction={onAction}
                                            getResourceConfig={(ref) =>
                                                registry.get(ref)
                                            }
                                            headlineOverride={
                                                headlineOverride as ReactNode | undefined
                                            }
                                            markerOverride={
                                                markerOverride as ReactNode | undefined
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!!slots?.footer && <div className="mt-3">{slots.footer}</div>}
        </div>
    );
}

ActivityFeed.displayName = 'ActivityFeed';
