import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/** Subtle tone applied to thumbnail/avatar backgrounds. */
export type GlobalSearchTone =
    | 'primary'
    | 'success'
    | 'warning'
    | 'info'
    | 'destructive'
    | 'default';

/** A single piece of metadata rendered inline on the secondary line. */
export interface GlobalSearchMeta {
    icon?: LucideIcon;
    label: string;
    /** Render the label as monospace + tabular-nums (SKUs, IDs, codes). */
    mono?: boolean;
}

/** Status pill rendered next to the title. */
export interface GlobalSearchBadge {
    label: string;
    tone: 'success' | 'warning' | 'destructive' | 'info' | 'secondary';
}

/** A single search result row. */
export interface GlobalSearchResult<TGroup extends string = string> {
    /** Unique identifier for keyboard navigation and onSelect payload. */
    id: string;
    /** Primary title — the only line guaranteed to render. */
    title: string;
    /** Secondary line — typically subtitle / description / tagline. */
    subtitle?: string;
    /** Group key — the result is bucketed under this in the list. */
    group: TGroup;
    /** Avatar (people-flavoured rows). */
    avatar?: { src?: string; initials: string; tone?: GlobalSearchTone };
    /** Thumbnail (objects/items — bookings, products, files). */
    thumbnail?: { src?: string; icon?: LucideIcon; tone?: GlobalSearchTone };
    /** Inline metadata items separated by `·` on the secondary line. */
    meta?: GlobalSearchMeta[];
    /** Plain-text tags rendered inline on the secondary line. */
    tags?: string[];
    /** Status pill rendered next to the title. */
    badge?: GlobalSearchBadge;
    /** Prominent value displayed on the right edge. */
    rightValue?: string;
    /** Subtle label under `rightValue` (e.g. "Total"). */
    rightLabel?: string;
    /** Recency hint — displayed at the trailing edge of the meta row. */
    timestamp?: string;
    /** Free-form payload forwarded to `onResultSelect`. */
    data?: unknown;
}

/** Static section preset (recent, suggestions) shown when the query is empty. */
export interface GlobalSearchIdleSection {
    id: string;
    label: string;
    icon?: LucideIcon;
    items: Array<{
        id: string;
        label: string;
        icon?: LucideIcon;
        /** Run when clicked — typically `setQuery(item.label)`. */
        onSelect?: () => void;
    }>;
}

/** Tab definition rendered above the result list. */
export interface GlobalSearchTab<TGroup extends string = string> {
    /** "all" is treated specially; otherwise a group key from the results. */
    value: 'all' | TGroup;
    label: string;
}

/** Render-prop context handed to `renderResult`. */
export interface GlobalSearchRenderResultContext {
    isActive: boolean;
    query: string;
    onSelect: () => void;
}

/** Slot map — every consumer-overridable surface. */
export interface GlobalSearchSlots<TGroup extends string = string> {
    /** Replaces the default search input (kbd-aware). */
    input?: ReactNode;
    /** Replaces the default tab strip. */
    tabs?: ReactNode;
    /** Rendered above the result list when `query.trim().length <= 1`. */
    idle?: ReactNode;
    /** Rendered when no results match and the query is long enough. */
    empty?: ReactNode;
    /** Rendered while loading results. */
    loading?: ReactNode;
    /** Rendered below the result list. */
    footer?: ReactNode;
    /** Per-result custom rendering. */
    renderResult?: (
        result: GlobalSearchResult<TGroup>,
        ctx: GlobalSearchRenderResultContext,
    ) => ReactNode;
    /** Custom tone palette. */
    toneBg?: Partial<Record<GlobalSearchTone, string>>;
    toneAvatar?: Partial<Record<GlobalSearchTone, string>>;
}
