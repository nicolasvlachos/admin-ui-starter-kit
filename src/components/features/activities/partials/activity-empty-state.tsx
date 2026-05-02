/**
 * ActivityEmptyState — neutral empty surface used when no activities are
 * available. Consumers replace via `slots.empty`.
 */
import { Activity } from 'lucide-react';

import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export interface ActivityEmptyStateProps {
    title: string;
    hint?: string;
    className?: string;
}

export function ActivityEmptyState({
    title,
    hint,
    className,
}: ActivityEmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-2 px-6 py-10 text-center',
                className,
            )}
        >
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Activity className="size-4" />
            </span>
            <Text weight="medium">
                {title}
            </Text>
            {!!hint && (
                <Text size="xs" type="secondary">
                    {hint}
                </Text>
            )}
        </div>
    );
}
