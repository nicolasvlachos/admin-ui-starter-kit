/**
 * ActivityResourceTag — chip rendering for a registered resource.
 *
 * The resource registry stores per-key `ActivityResourceConfig` (label, icon,
 * tone, badge, tags). This component renders those as a single inline chip
 * suitable for embedding into a headline. Falls back gracefully when the
 * registry has no entry — uses the segment's text/label.
 */
import { CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/base/badge';
import { Text } from '@/components/typography';

import type {
    ActivityResourceConfig,
    ActivityResourceRef,
    ActivityTone,
} from '../activities.types';

import { ACTIVITY_TONE, TONE_TO_BADGE_VARIANT } from './tone-tokens';

export interface ActivityResourceTagProps {
    resource: ActivityResourceRef;
    config?: ActivityResourceConfig;
    /** Fallback label if neither config nor segment text are present. */
    fallbackText?: string;
    onClick?: () => void;
}

export function ActivityResourceTag({
    resource,
    config,
    fallbackText,
    onClick,
}: ActivityResourceTagProps) {
    const tone: ActivityTone = config?.tone ?? 'neutral';
    const palette = ACTIVITY_TONE[tone];
    const Icon = config?.icon ?? CircleDot;
    const label = config?.label ?? fallbackText ?? resource.label ?? resource.key;
    const interactive = typeof onClick === 'function';

    const inner = (
        <>
            <Icon className={cn('size-3 shrink-0', palette.fg)} />
            <Text tag="span" size="xs" weight="medium" className={palette.chipFg}>
                {label}
            </Text>
            {!!config?.tags && config.tags.length > 0 && (
                <Text
                    tag="span"
                    size="xxs"
                    type="secondary"
                    className="border-l border-current/20 pl-1.5 ml-0.5"
                >
                    {config.tags.join(' · ')}
                </Text>
            )}
            {!!config?.badge && (
                <Badge
                    inline
                    variant={TONE_TO_BADGE_VARIANT[config.badge.tone ?? 'neutral']}
                    className="ml-1"
                >
                    {config.badge.label}
                </Badge>
            )}
        </>
    );

    const chipClass = cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 align-baseline',
        'border border-border/60',
        palette.chipBg,
        interactive &&
            'cursor-pointer transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    );

    if (interactive) {
        return (
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                }}
                className={chipClass}
                title={config?.note}
            >
                {inner}
            </button>
        );
    }

    return (
        <span className={chipClass} title={config?.note}>
            {inner}
        </span>
    );
}
