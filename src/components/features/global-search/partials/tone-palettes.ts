/**
 * Default tone palettes for thumbnails and avatars.
 *
 * Consumers can override per-call via `slots.toneBg` / `slots.toneAvatar`.
 */
import type { GlobalSearchTone } from '../global-search.types';

export const DEFAULT_TONE_BG: Record<GlobalSearchTone, string> = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/20 text-warning-foreground',
    info: 'bg-info/15 text-info',
    destructive: 'bg-destructive/15 text-destructive',
    default: 'bg-muted text-muted-foreground',
};

export const DEFAULT_TONE_AVATAR: Record<GlobalSearchTone, string> = {
    primary: 'bg-primary/15 text-primary',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/20 text-warning-foreground',
    info: 'bg-info/15 text-info',
    destructive: 'bg-destructive/15 text-destructive',
    default: 'bg-muted text-muted-foreground',
};
