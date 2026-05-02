/**
 * ActivityChanges — collapsible old → new diff block.
 *
 * Each entry shows the attribute label, the previous value (line-through, on
 * a destructive tint), an arrow, and the new value (on a success tint). When
 * neither old nor new is set, falls back to `description`.
 */
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import type { ActivityChange } from '../activities.types';

export interface ActivityChangesProps {
    changes: readonly ActivityChange[];
    className?: string;
}

function ChangeValue({ change }: { change: ActivityChange }) {
    const hasOld = change.old !== null && change.old !== undefined;
    const hasNew = change.new !== null && change.new !== undefined;

    if (!hasOld && !hasNew) {
        return (
            <Text size="xs" tag="span">
                {change.description}
            </Text>
        );
    }

    return (
        <Text tag="span" size="xs" className="inline-flex flex-wrap items-baseline gap-1">
            {!!hasOld && (
                <Text
                    tag="span"
                    size="xs"
                    className="rounded bg-destructive/10 text-destructive line-through px-1 py-px"
                >
                    {change.old}
                </Text>
            )}
            {hasOld && hasNew && (
                <Text tag="span" size="xs" type="secondary">
                    →
                </Text>
            )}
            {!!hasNew && (
                <Text
                    tag="span"
                    size="xs"
                    className="rounded bg-success/15 text-success px-1 py-px"
                >
                    {change.new}
                </Text>
            )}
        </Text>
    );
}

export function ActivityChanges({ changes, className }: ActivityChangesProps) {
    if (changes.length === 0) return null;
    return (
        <div
            className={cn(
                'space-y-1.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-2',
                className,
            )}
        >
            {changes.map((change) => (
                <div
                    key={`${change.key}-${change.label}`}
                    className="flex items-baseline gap-2"
                >
                    <Text
                        size="xs"
                        type="secondary"
                        weight="medium"
                        className="shrink-0"
                    >
                        {change.label}
                    </Text>
                    <ChangeValue change={change} />
                </div>
            ))}
        </div>
    );
}
