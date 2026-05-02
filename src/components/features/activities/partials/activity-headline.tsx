/**
 * ActivityHeadline — segment renderer for the headline line.
 *
 * Renders typed segments (`actor` / `field` / `value` / `status` / `resource`
 * / `text`) into mixed inline content with proper typography and tone.
 *
 * When no segments are provided, falls back to splitting `headline` around
 * the actor's name so the actor still becomes interactive when possible.
 */
import { Fragment, type ReactNode } from 'react';

import { Badge } from '@/components/base/badge';
import { Text } from '@/components/typography';

import type {
    ActivityActor,
    ActivityHeadlineSegment,
    ActivityItem,
    ActivityResourceConfig,
    ActivityResourceRef,
} from '../activities.types';
import { ActivityResourceTag } from './activity-resource-tag';
import { TONE_TO_BADGE_VARIANT } from './tone-tokens';

export interface ActivityHeadlineProps<TData = unknown> {
    activity: ActivityItem<TData>;
    currentUserId?: string;
    youLabel: string;
    onActorClick?: (actor: ActivityActor, activity: ActivityItem<TData>) => void;
    onResourceClick?: (
        resource: ActivityResourceRef,
        config: ActivityResourceConfig | undefined,
        activity: ActivityItem<TData>,
    ) => void;
    /** Live registry lookup for resource segments. */
    getResourceConfig?: (
        ref: ActivityResourceRef,
    ) => ActivityResourceConfig | undefined;
}

function ActorNode<TData>({
    actorId,
    text,
    href,
    activity,
    youLabel,
    currentUserId,
    onActorClick,
}: {
    actorId?: string;
    text: string;
    href?: string;
    activity: ActivityItem<TData>;
    youLabel: string;
    currentUserId?: string;
    onActorClick?: (actor: ActivityActor, activity: ActivityItem<TData>) => void;
}) {
    const isYou =
        currentUserId !== undefined &&
        actorId !== undefined &&
        currentUserId === actorId;
    const display = isYou ? youLabel : text;
    const actor: ActivityActor = activity.actor ?? { id: actorId, name: text };

    if (href) {
        return (
            <a
                href={href}
                onClick={(e) => {
                    if (onActorClick) {
                        e.preventDefault();
                        e.stopPropagation();
                        onActorClick(actor, activity);
                    }
                }}
                className="font-semibold text-foreground underline-offset-2 hover:underline"
            >
                {display}
            </a>
        );
    }

    if (onActorClick) {
        return (
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onActorClick(actor, activity);
                }}
                className="font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
                {display}
            </button>
        );
    }

    return (
        <Text tag="span" weight="semibold">
            {display}
        </Text>
    );
}

function renderSegments<TData>(
    segments: readonly ActivityHeadlineSegment[],
    props: ActivityHeadlineProps<TData>,
): ReactNode {
    return segments.map((segment, index) => {
        const key = `seg-${index}-${segment.type}`;
        switch (segment.type) {
            case 'actor':
                return (
                    <Fragment key={key}>
                        <ActorNode<TData>
                            actorId={segment.actorId}
                            text={segment.text}
                            href={segment.href}
                            activity={props.activity}
                            youLabel={props.youLabel}
                            currentUserId={props.currentUserId}
                            onActorClick={props.onActorClick}
                        />{' '}
                    </Fragment>
                );
            case 'field':
            case 'value':
                return (
                    <Fragment key={key}>
                        <Text tag="span" weight="semibold">
                            {segment.text}
                        </Text>{' '}
                    </Fragment>
                );
            case 'status':
                return (
                    <Fragment key={key}>
                        <Badge
                            inline
                            variant={TONE_TO_BADGE_VARIANT[segment.tone ?? 'neutral']}
                        >
                            {segment.text}
                        </Badge>{' '}
                    </Fragment>
                );
            case 'resource': {
                const config = props.getResourceConfig?.(segment.resource);
                return (
                    <Fragment key={key}>
                        <ActivityResourceTag
                            resource={segment.resource}
                            config={config}
                            fallbackText={segment.text}
                            onClick={
                                props.onResourceClick
                                    ? () =>
                                            props.onResourceClick?.(
                                                segment.resource,
                                                config,
                                                props.activity,
                                            )
                                    : undefined
                            }
                        />{' '}
                    </Fragment>
                );
            }
            case 'text':
            default:
                return (
                    <Fragment key={key}>
                        <Text tag="span">
                            {segment.text}
                        </Text>{' '}
                    </Fragment>
                );
        }
    });
}

function renderFallback<TData>(props: ActivityHeadlineProps<TData>): ReactNode {
    const { activity } = props;
    const fallbackHeadline =
        activity.headline ?? activity.event;
    const actorName = activity.actor?.name;
    if (!actorName || !fallbackHeadline.includes(actorName)) {
        return (
            <Text tag="span">
                {fallbackHeadline}
            </Text>
        );
    }
    const [before, ...after] = fallbackHeadline.split(actorName);
    return (
        <>
            {!!before && (
                <Text tag="span">
                    {before}
                </Text>
            )}
            <ActorNode<TData>
                actorId={activity.actor?.id}
                text={actorName}
                href={activity.actor?.href}
                activity={activity}
                youLabel={props.youLabel}
                currentUserId={props.currentUserId}
                onActorClick={props.onActorClick}
            />
            {after.length > 0 && (
                <Text tag="span">
                    {after.join(actorName)}
                </Text>
            )}
        </>
    );
}

export function ActivityHeadline<TData = unknown>(
    props: ActivityHeadlineProps<TData>,
) {
    const segments = props.activity.segments;
    if (segments && segments.length > 0) {
        return (
            <span className="leading-snug [&>span]:leading-snug">
                {renderSegments<TData>(segments, props)}
            </span>
        );
    }
    return <span className="leading-snug">{renderFallback<TData>(props)}</span>;
}
