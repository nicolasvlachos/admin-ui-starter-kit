/**
 * EventLogEventRow — non-comment entry render. Renders an icon-on-rail
 * row similar to `composed/timelines/activity-stream` but with full
 * mentions support in the description field and shared spacing tokens
 * matching `<CommentItem>` so comments + events line up cleanly under
 * the same surface.
 */
import { Circle } from 'lucide-react';
import type { FC, ReactNode } from 'react';

import { Text } from '@/components/typography';
import { MentionContent } from '@/components/features/mentions';
import { cn } from '@/lib/utils';

import type {
    EventLogActivityEntry,
    EventLogTone,
} from '../event-log.types';
import type { MentionsConfig } from '@/components/features/mentions';

const TONE_CHIP: Record<EventLogTone, string> = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/40 text-warning-foreground',
    destructive: 'bg-destructive/10 text-destructive',
    info: 'bg-info/15 text-info',
    secondary: 'bg-muted text-muted-foreground',
};

export interface EventLogEventRowProps<TResource extends string = string> {
    entry: EventLogActivityEntry<TResource>;
    resources?: MentionsConfig<TResource>['resources'];
    formatRelativeTime?: (iso: string) => string;
    isLast?: boolean;
}

export const EventLogEventRow: FC<EventLogEventRowProps> = ({
    entry,
    resources,
    formatRelativeTime,
    isLast,
}) => {
    const Icon = entry.icon ?? Circle;
    const tone = entry.tone ?? 'secondary';
    const relativeTime =
        entry.timestamp && formatRelativeTime
            ? formatRelativeTime(entry.timestamp)
            : entry.timestamp;

    return (
        <li className="relative flex gap-3" data-event-id={entry.id}>
            {/* Rail + icon chip */}
            <div className="relative flex flex-col items-center pt-1">
                <div
                    className={cn(
                        'flex size-6 shrink-0 items-center justify-center rounded-full ring-1 ring-foreground/[0.04]',
                        TONE_CHIP[tone],
                    )}
                >
                    <Icon className="size-3" aria-hidden />
                </div>
                {!isLast && (
                    <div className="bg-border/60 mt-1 w-px flex-1" aria-hidden />
                )}
            </div>

            <div className="min-w-0 flex-1 pb-3">
                <div className="flex flex-wrap items-baseline gap-x-1.5">
                    {!!entry.actor && (
                        <Text tag="span" weight="semibold">
                            {entry.actor}
                        </Text>
                    )}
                    {!!entry.action && (
                        <Text tag="span" type="secondary">
                            {entry.action}
                        </Text>
                    )}
                    {!!entry.target && (
                        <Text tag="span" weight="medium">
                            {entry.target}
                        </Text>
                    )}
                    {!!entry.headline && !entry.action && !entry.target && (
                        <Text tag="span">
                            {entry.headline}
                        </Text>
                    )}
                    {!!relativeTime && (
                        <Text
                            tag="span"
                            size="xs"
                            type="secondary"
                            className="ml-auto shrink-0 tabular-nums"
                        >
                            {relativeTime}
                        </Text>
                    )}
                </div>

                {!!entry.description && (
                    <div className="mt-1 text-sm leading-relaxed">
                        <MentionContent
                            html={entry.description}
                            mentions={entry.mentions}
                            resources={resources}
                        />
                    </div>
                )}

                {entry.metadata && entry.metadata.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                        {entry.metadata.map((meta: { label: string; value: ReactNode }) => (
                            <Text
                                key={meta.label}
                                size="xs"
                                type="secondary"
                                className="inline-flex items-baseline gap-1"
                            >
                                <Text tag="span" size="xs" type="discrete">
                                    {meta.label}:
                                </Text>
                                <Text tag="span" size="xs" type="secondary">
                                    {meta.value}
                                </Text>
                            </Text>
                        ))}
                    </div>
                )}
            </div>
        </li>
    );
};
