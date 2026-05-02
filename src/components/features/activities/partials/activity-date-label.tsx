/**
 * ActivityDateLabel — eyebrow rendered above each date group.
 *
 * Consumers can override via `slots.renderDateLabel`. Default: small
 * uppercase eyebrow above each group, with extra top margin between groups.
 */
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export interface ActivityDateLabelProps {
    label: string;
    isFirst: boolean;
    className?: string;
}

export function ActivityDateLabel({
    label,
    isFirst,
    className,
}: ActivityDateLabelProps) {
    if (label === '') return null;
    return (
        <Text
            size="xxs"
            type="secondary"
            weight="medium"
            className={cn(
                'uppercase tracking-wider',
                !isFirst && 'mt-5',
                className,
            )}
        >
            {label}
        </Text>
    );
}
