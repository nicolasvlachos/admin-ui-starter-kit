/**
 * Activities feature types. Decoupled from any framework module so the feature
 * ships standalone — consumers map their domain types into `ActivityItem<TData>`
 * at the call site via accessors / callbacks.
 */
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import type { ActivitiesStrings } from './activities.strings';

/** Semantic tone shared by the marker, status badges, and resource chips. */
export type ActivityTone =
    | 'primary'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'info'
    | 'neutral';

/** Density preset: dot-only / standard icon row / full rich row with extras. */
export type ActivityDensity = 'compact' | 'default' | 'rich';

/** Person who caused the activity. */
export interface ActivityActor {
    /** Stable id used to detect "current user" → "You" rendering. */
    id?: string;
    name: string;
    avatarUrl?: string;
    /** Initials fallback when avatar is missing. */
    initials?: string;
    /** Anchor href when the consumer wants the actor name to be a link. */
    href?: string;
}

/** Lightweight pointer to a resource — looked up against the registry. */
export interface ActivityResourceRef {
    /** Stable key — domain-scoped (e.g. `order:1234`, `user:42`). */
    key: string;
    /** Domain hint — `order`, `product`, `user`, `task`, … */
    type?: string;
    /** Display label fallback when the registry has no entry. */
    label?: string;
}

/**
 * Persisted, rich resource configuration. The registry maps `key → config`,
 * and consumers can save/restore the whole map via `onResourcesChange`.
 */
export interface ActivityResourceConfig {
    label: string;
    href?: string;
    icon?: LucideIcon;
    tone?: ActivityTone;
    /** Inline status badge alongside the chip. */
    badge?: { label: string; tone?: ActivityTone };
    /** Free-form tags rendered after the label. */
    tags?: readonly string[];
    /** Free-form note exposed via tooltip. */
    note?: string;
}

/** A single piece of the headline — composed inline by the renderer. */
export type ActivityHeadlineSegment =
    | { type: 'text'; text: string }
    | { type: 'actor'; text: string; actorId?: string; href?: string }
    | { type: 'field'; text: string }
    | { type: 'value'; text: string }
    | { type: 'status'; text: string; tone?: ActivityTone }
    | { type: 'resource'; text?: string; resource: ActivityResourceRef };

/** A single before / after pair — feeds the collapsible "Show changes" block. */
export interface ActivityChange {
    /** Attribute key — used as React key. */
    key: string;
    /** Display label of the attribute. */
    label: string;
    /** Before value. `null` means there was no prior value. */
    old?: string | null;
    /** After value. `null` means the value was cleared. */
    new?: string | null;
    /** Free-form description fallback when neither old/new is set. */
    description?: string;
}

/** A single activity entry. Generic over `TData` for domain payload. */
export interface ActivityItem<TData = unknown> {
    id: string;
    /** Domain event key (e.g. `created`, `status_changed`, `mail_sent`). */
    event: string;
    /** Optional source bucket — drives the source-badge label. */
    source?: string;
    actor?: ActivityActor;
    /** Pre-built segments — preferred over `headline`. */
    segments?: readonly ActivityHeadlineSegment[];
    /** Plain-text fallback when no segments are provided. */
    headline?: string;
    /** Secondary description rendered beneath the headline. */
    description?: ReactNode;
    /** ISO timestamp — drives date grouping and relative time. */
    createdAt?: string;
    /** Pre-formatted timestamp override — bypasses accessors. */
    timestamp?: string;
    /** Inline chip-row metadata (rich density). */
    metadata?: ReadonlyArray<{ label: string; value: string }>;
    /** Per-attribute change details. */
    changes?: readonly ActivityChange[];
    /** Resources referenced — looked up against the registry for rich chips. */
    resources?: readonly ActivityResourceRef[];
    /** Free-form payload threaded through callbacks. */
    data?: TData;
    /** Override the visual marker for this row only. */
    iconOverride?: LucideIcon;
    toneOverride?: ActivityTone;
}

/** Per-event mass configuration entry. */
export interface ActivityEventConfig {
    icon: LucideIcon;
    tone: ActivityTone;
    /** Display label for the event. Defaults to `strings.events[event] || event`. */
    label?: string;
    /** Per-event source-badge override. */
    sourceLabel?: string;
}

/** Mass-configurable event map. Merged on top of `defaultActivityEventConfig`. */
export type ActivityEventConfigMap = Readonly<Record<string, ActivityEventConfig>>;

/** Per-row action — renders into the inline action menu (rich density). */
export interface ActivityAction<TData = unknown> {
    id: string;
    label: string;
    icon?: LucideIcon;
    tone?: ActivityTone;
    onClick: (activity: ActivityItem<TData>) => void;
    disabled?: boolean;
}

/** Render-prop context handed to consumer-provided row renderers. */
export interface ActivityRenderRowContext<TData = unknown> {
    density: ActivityDensity;
    isLast: boolean;
    isFirstInGroup: boolean;
    activity: ActivityItem<TData>;
    eventConfig: ActivityEventConfig;
    tone: ActivityTone;
    relativeTime: string | null;
    absoluteTime: string | null;
    sourceLabel: string | null;
    expanded: boolean;
    toggleExpanded: () => void;
}

/** Slot map — every consumer-overridable surface. */
export interface ActivityFeedSlots<TData = unknown> {
    /** Replace the whole row. */
    renderRow?: (
        activity: ActivityItem<TData>,
        ctx: ActivityRenderRowContext<TData>,
    ) => ReactNode;
    /** Replace the headline only. */
    renderHeadline?: (
        activity: ActivityItem<TData>,
        ctx: ActivityRenderRowContext<TData>,
    ) => ReactNode;
    /** Replace the marker (dot / icon). */
    renderMarker?: (
        activity: ActivityItem<TData>,
        ctx: ActivityRenderRowContext<TData>,
    ) => ReactNode;
    /** Replace the date-group label. */
    renderDateLabel?: (label: string, isFirst: boolean) => ReactNode;
    /** Replace the empty state. */
    empty?: ReactNode;
    /** Replace the loading state. */
    loading?: ReactNode;
    /** Rendered above the first row (e.g. composer). */
    header?: ReactNode;
    /** Rendered below the last row. */
    footer?: ReactNode;
}

/** Accessor functions — consumer maps domain ↔ feature. */
export interface ActivityFeedAccessors<TData = unknown> {
    /** Format ISO → relative ("2 hours ago"). Defaults to `date-fns`. */
    formatRelativeTime?: (iso: string) => string;
    /** Format ISO → absolute (locale-aware). Defaults to `Intl.DateTimeFormat`. */
    formatAbsoluteTime?: (iso: string) => string;
    /** Format the date-group label. Defaults to today/yesterday/Intl. */
    formatDateGroupLabel?: (iso: string | null, strings: ActivitiesStrings) => string;
    /** Resolve `event` → display label. Defaults to event-config / strings / event. */
    getEventLabel?: (event: string) => string | undefined;
    /** Resolve `source` → display label. Defaults to `strings.sources[source]`. */
    getSourceLabel?: (source: string) => string | undefined;
    /** Per-row action list. */
    actionsForActivity?: (
        activity: ActivityItem<TData>,
    ) => readonly ActivityAction<TData>[] | undefined;
}

/** Callbacks fired by interactive surfaces. */
export interface ActivityFeedCallbacks<TData = unknown> {
    onActivityClick?: (activity: ActivityItem<TData>) => void;
    onActorClick?: (
        actor: ActivityActor,
        activity: ActivityItem<TData>,
    ) => void;
    onResourceClick?: (
        resource: ActivityResourceRef,
        config: ActivityResourceConfig | undefined,
        activity: ActivityItem<TData>,
    ) => void;
    onAction?: (actionId: string, activity: ActivityItem<TData>) => void;
}

/** Resource-registry inputs — wires save/restore. */
export interface ActivityResourcesProps {
    /** Initial registry contents. Treated as the seed each time identity changes. */
    resources?: Readonly<Record<string, ActivityResourceConfig>>;
    /** Fires whenever the registry changes — wire to localStorage / API. */
    onResourcesChange?: (
        registry: Readonly<Record<string, ActivityResourceConfig>>,
    ) => void;
}

/** Top-level props. */
export interface ActivityFeedProps<TData = unknown>
    extends ActivityFeedAccessors<TData>,
        ActivityFeedCallbacks<TData>,
        ActivityResourcesProps {
    activities?: ReadonlyArray<ActivityItem<TData>>;
    /** Density preset. Default `default`. */
    density?: ActivityDensity;
    /** Group rows by date (Today / Yesterday / formatted). Default `true`. */
    groupByDate?: boolean;
    /** Auto-expand all change-detail blocks. Default `false`. */
    expandedByDefault?: boolean;
    /** Authenticated user — enables "You" rendering on actor segments. */
    currentUserId?: string;
    /** Loading flag — switches to `slots.loading`. */
    loading?: boolean;
    /** Mass event configuration. Merged with `defaultActivityEventConfig`. */
    eventConfig?: ActivityEventConfigMap;
    /** String overrides (deep-partial). */
    strings?: Partial<ActivitiesStrings>;
    /** Slot overrides. */
    slots?: ActivityFeedSlots<TData>;
    className?: string;
    /** Locale for Intl formatters. Defaults to `undefined` (host locale). */
    locale?: string;
}

/** Card wrapper — same as feed but rendered inside `SmartCard`. */
export interface ActivityFeedCardProps<TData = unknown>
    extends ActivityFeedProps<TData> {
    /** Card title. Defaults to `strings.title`. */
    title?: ReactNode;
    /** Card padding preset. Default `base`. */
    padding?: 'sm' | 'base' | 'lg';
    /** Optional composer / above-feed slot embedded in the card. */
    composerSlot?: ReactNode;
    /** Card title-suffix region. */
    titleSuffix?: ReactNode;
    /** Card description. */
    description?: ReactNode;
}
