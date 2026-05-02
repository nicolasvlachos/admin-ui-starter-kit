/**
 * ActivityMarker — left-edge visual for a row.
 *
 * Density mapping:
 *   - `compact`  → small tone-coloured dot
 *   - `default`  → 22px tone-tinted square with the event icon
 *   - `rich`     → 28px tone-tinted circle with the event icon
 *
 * Always renders the connector line beneath unless `isLast` is true.
 */
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { ActivityDensity, ActivityTone } from '../activities.types';

import { ACTIVITY_TONE } from './tone-tokens';

export interface ActivityMarkerProps {
    icon: LucideIcon;
    tone: ActivityTone;
    density: ActivityDensity;
    isLast: boolean;
}

export function ActivityMarker({
    icon: Icon,
    tone,
    density,
    isLast,
}: ActivityMarkerProps) {
    const palette = ACTIVITY_TONE[tone];

    if (density === 'compact') {
        return (
            <div className="flex flex-col items-center">
                <span
                    aria-hidden
                    className={cn('mt-1.5 size-2 shrink-0 rounded-full', palette.dot)}
                />
                {!isLast && (
                    <span aria-hidden className={cn('mt-1 w-px flex-1', palette.line)} />
                )}
            </div>
        );
    }

    if (density === 'rich') {
        return (
            <div className="flex flex-col items-center">
                <span
                    className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-full ring-1 ring-border/60',
                        palette.bg,
                        palette.fg,
                    )}
                >
                    <Icon className="size-3.5" />
                </span>
                {!isLast && (
                    <span aria-hidden className={cn('mt-1 w-px flex-1', palette.line)} />
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <span
                className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full',
                    palette.bg,
                    palette.fg,
                )}
            >
                <Icon className="size-3" />
            </span>
            {!isLast && (
                <span aria-hidden className={cn('mt-1 w-px flex-1', palette.line)} />
            )}
        </div>
    );
}
