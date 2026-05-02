/**
 * Tone palettes shared by the marker, headline status segments, and the
 * resource tag. Tones map to semantic shadcn tokens — never to raw colours —
 * so a consumer rebrand at `:root` flows through the activities feature
 * automatically.
 */
import type { ActivityTone } from '../activities.types';
import type { ComposedBadgeVariant } from '@/components/base/badge/badge';

export interface ActivityToneStyle {
    /** Filled background — used by the rich icon marker. */
    bg: string;
    /** Foreground text colour matching the bg. */
    fg: string;
    /** Solid colour used by the compact dot. */
    dot: string;
    /** Border tint used by the connector line. */
    line: string;
    /** Background for chips / tags. */
    chipBg: string;
    /** Text colour for chips / tags. */
    chipFg: string;
}

export const ACTIVITY_TONE: Record<ActivityTone, ActivityToneStyle> = {
    primary: {
        bg: 'bg-primary/15',
        fg: 'text-primary',
        dot: 'bg-primary',
        line: 'bg-primary/30',
        chipBg: 'bg-primary/10',
        chipFg: 'text-primary',
    },
    success: {
        bg: 'bg-success/15',
        fg: 'text-success',
        dot: 'bg-success',
        line: 'bg-success/30',
        chipBg: 'bg-success/15',
        chipFg: 'text-success',
    },
    warning: {
        bg: 'bg-warning/30',
        fg: 'text-warning-foreground',
        dot: 'bg-warning',
        line: 'bg-warning/40',
        chipBg: 'bg-warning/30',
        chipFg: 'text-warning-foreground',
    },
    destructive: {
        bg: 'bg-destructive/15',
        fg: 'text-destructive',
        dot: 'bg-destructive',
        line: 'bg-destructive/30',
        chipBg: 'bg-destructive/15',
        chipFg: 'text-destructive',
    },
    info: {
        bg: 'bg-info/15',
        fg: 'text-info',
        dot: 'bg-info',
        line: 'bg-info/30',
        chipBg: 'bg-info/15',
        chipFg: 'text-info',
    },
    neutral: {
        bg: 'bg-muted',
        fg: 'text-muted-foreground',
        dot: 'bg-muted-foreground/60',
        line: 'bg-border',
        chipBg: 'bg-muted',
        chipFg: 'text-muted-foreground',
    },
};

/** Map an activity tone onto the closest base/Badge variant. */
export const TONE_TO_BADGE_VARIANT: Record<ActivityTone, ComposedBadgeVariant> = {
    primary: 'primary',
    success: 'success',
    warning: 'warning',
    destructive: 'destructive',
    info: 'info',
    neutral: 'secondary',
};
