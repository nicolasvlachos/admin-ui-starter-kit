/**
 * ActivityRow — single row layout used by `<ActivityFeed />`.
 *
 * Composes the marker, headline, optional description, metadata chips,
 * source badge, timestamp, and (rich-only) the change-detail block plus
 * action menu. Per-density layout follows the design-system rules:
 * compact (dot, single line) / default (icon, headline + meta line) /
 * rich (icon, full header + body + actions).
 */
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import type {
    ActivityAction,
    ActivityActor,
    ActivityDensity,
    ActivityEventConfig,
    ActivityItem,
    ActivityResourceConfig,
    ActivityResourceRef,
    ActivityTone,
} from '../activities.types';

import { ActivityActionsMenu } from './activity-actions-menu';
import { ActivityChanges } from './activity-changes';
import { ActivityHeadline } from './activity-headline';
import { ActivityMarker } from './activity-marker';
import { ActivityResourceTag } from './activity-resource-tag';

export interface ActivityRowProps<TData = unknown> {
    activity: ActivityItem<TData>;
    density: ActivityDensity;
    eventConfig: ActivityEventConfig;
    tone: ActivityTone;
    isLast: boolean;
    expanded: boolean;
    onToggleExpanded: () => void;
    relativeTime: string | null;
    absoluteTime: string | null;
    sourceLabel: string | null;
    youLabel: string;
    showChangesLabel: string;
    hideChangesLabel: string;
    actionsLabel: string;
    currentUserId?: string;
    actions: readonly ActivityAction<TData>[];
    onActivityClick?: (activity: ActivityItem<TData>) => void;
    onActorClick?: (actor: ActivityActor, activity: ActivityItem<TData>) => void;
    onResourceClick?: (
        resource: ActivityResourceRef,
        config: ActivityResourceConfig | undefined,
        activity: ActivityItem<TData>,
    ) => void;
    onAction?: (actionId: string, activity: ActivityItem<TData>) => void;
    getResourceConfig?: (
        ref: ActivityResourceRef,
    ) => ActivityResourceConfig | undefined;
    /** Slot override for the headline only. */
    headlineOverride?: ReactNode;
    /** Slot override for the marker only. */
    markerOverride?: ReactNode;
}

export function ActivityRow<TData = unknown>(props: ActivityRowProps<TData>) {
    const {
        activity,
        density,
        eventConfig,
        tone,
        isLast,
        expanded,
        onToggleExpanded,
        relativeTime,
        absoluteTime,
        sourceLabel,
        youLabel,
        showChangesLabel,
        hideChangesLabel,
        actionsLabel,
        currentUserId,
        actions,
        onActivityClick,
        onActorClick,
        onResourceClick,
        onAction,
        getResourceConfig,
        headlineOverride,
        markerOverride,
    } = props;

    const Icon = activity.iconOverride ?? eventConfig.icon;
    const hasChanges = (activity.changes?.length ?? 0) > 0;
    const hasMetadata = (activity.metadata?.length ?? 0) > 0;
    const hasResources = (activity.resources?.length ?? 0) > 0;
    const hasDescription =
        activity.description !== undefined &&
        activity.description !== null &&
        activity.description !== '';
    const showSecondaryRow = density !== 'compact';
    const showRichBody = density === 'rich';

    const headlineNode =
        headlineOverride ??
        (
            <ActivityHeadline<TData>
                activity={activity}
                currentUserId={currentUserId}
                youLabel={youLabel}
                onActorClick={onActorClick}
                onResourceClick={onResourceClick}
                getResourceConfig={getResourceConfig}
            />
        );

    const markerNode =
        markerOverride ?? (
            <ActivityMarker
                icon={Icon}
                tone={tone}
                density={density}
                isLast={isLast}
            />
        );

    const interactive = typeof onActivityClick === 'function';

    return (
        <div
            className={cn(
                'relative flex gap-3',
                interactive && 'cursor-pointer rounded-md hover:bg-muted/40',
            )}
            onClick={interactive ? () => onActivityClick?.(activity) : undefined}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={
                interactive
                    ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onActivityClick?.(activity);
                            }
                      }
                    : undefined
            }
        >
            {markerNode}

            <div
                className={cn(
                    'min-w-0 flex-1',
                    !isLast && (density === 'rich' ? 'pb-4' : density === 'compact' ? 'pb-2.5' : 'pb-3'),
                )}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
                        <Text tag="span" lineHeight="snug">
                            {headlineNode}
                        </Text>
                        {!!sourceLabel && (
                            <Badge inline variant="secondary">
                                {sourceLabel}
                            </Badge>
                        )}
                        {showRichBody && hasChanges && (
                            <Button
                                type="button"
                                size="icon-xs"
                                variant="secondary"
                                buttonStyle="ghost"
                                className="h-5 w-5 text-muted-foreground"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleExpanded();
                                }}
                                title={expanded ? hideChangesLabel : showChangesLabel}
                                aria-label={expanded ? hideChangesLabel : showChangesLabel}
                                aria-expanded={expanded}
                            >
                                {expanded ? (
                                    <ChevronDown className="size-3.5" />
                                ) : (
                                    <ChevronRight className="size-3.5" />
                                )}
                            </Button>
                        )}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        {!!relativeTime && (
                            <Text
                                size="xs"
                                type="secondary"
                                className="whitespace-nowrap tabular-nums pt-0.5"
                                title={absoluteTime ?? undefined}
                            >
                                {relativeTime}
                            </Text>
                        )}
                        {showRichBody && actions.length > 0 && (
                            <ActivityActionsMenu<TData>
                                activity={activity}
                                actions={actions}
                                onAction={onAction}
                                label={actionsLabel}
                            />
                        )}
                    </div>
                </div>

                {!!showSecondaryRow && hasDescription && (
                    <Text tag="div" size="xs" type="secondary" className="mt-1">
                        {activity.description}
                    </Text>
                )}

                {!!showRichBody && hasMetadata && activity.metadata && (
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {activity.metadata.map((m) => (
                            <Text key={m.label} size="xs" type="secondary">
                                <Text tag="span" size="xs" type="discrete">
                                    {m.label}:{' '}
                                </Text>
                                {m.value}
                            </Text>
                        ))}
                    </div>
                )}

                {!!showRichBody && hasResources && activity.resources && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {activity.resources.map((res) => {
                            const cfg = getResourceConfig?.(res);
                            return (
                                <ActivityResourceTag
                                    key={res.key}
                                    resource={res}
                                    config={cfg}
                                    onClick={
                                        onResourceClick
                                            ? () =>
                                                    onResourceClick(
                                                        res,
                                                        cfg,
                                                        activity,
                                                    )
                                            : undefined
                                    }
                                />
                            );
                        })}
                    </div>
                )}

                {!!showRichBody && hasChanges && expanded && activity.changes && (
                    <div className="mt-2">
                        <ActivityChanges changes={activity.changes} />
                    </div>
                )}
            </div>
        </div>
    );
}
