/**
 * Mentions feature — type system.
 *
 * "Mention" is the umbrella term for any inline reference to a domain
 * resource (user, order, booking, …) embedded inside rich-text content.
 * Used by `features/comments` for `@user`/`#booking` style references,
 * and by `features/event-log` for inline links in event descriptions.
 *
 * Generic in the resource-kind union so consumers can lock down their
 * domain: `Mention<'user' | 'booking'>`.
 */
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Tone                                                                */
/* ------------------------------------------------------------------ */

export type MentionTone =
    | 'primary'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'info'
    | 'secondary';

/* ------------------------------------------------------------------ */
/*  Mention (inline reference)                                          */
/* ------------------------------------------------------------------ */

/**
 * A reference to a domain resource embedded inline in rich-text. Stored
 * alongside the HTML payload so the surface can be re-rendered with
 * rich chips even if the HTML markers are stripped or the resource
 * shape changes.
 */
export interface Mention<TKind extends string = string, TData = unknown> {
    /** Stable id — typically `"<kind>:<resourceId>"`. */
    id: string;
    /** Resource kind, must match a key registered in `resources` config. */
    kind: TKind;
    /** Human label rendered in the chip. */
    label: string;
    /** Optional permalink — chip becomes a link when set. */
    href?: string;
    /** Free-form consumer payload (the resource itself, analytics, …). */
    data?: TData;
}

/* ------------------------------------------------------------------ */
/*  Suggestion                                                          */
/* ------------------------------------------------------------------ */

/** Suggestion item returned by a resource-type's `search()` callback. */
export interface MentionSuggestion<TKind extends string = string, TData = unknown> {
    id: string;
    label: string;
    description?: string;
    avatar?: string;
    icon?: LucideIcon;
    href?: string;
    data?: TData;
    /** Internal computed kind — set by the provider, do not pass manually. */
    kind?: TKind;
}

/* ------------------------------------------------------------------ */
/*  Resource type config                                                */
/* ------------------------------------------------------------------ */

/**
 * Configuration for a single resource kind (mention type) the picker
 * exposes. Consumers register one per domain entity they want to link.
 */
export interface MentionResource<TKind extends string = string, TData = unknown> {
    /** Lucide icon shown in the picker tab + (default) chip leading icon. */
    icon?: LucideIcon;
    /** Label shown in the picker tab ("Person", "Booking", …). */
    label?: string;
    /** Trigger character that auto-opens the picker (e.g. `@`, `#`). Optional. */
    trigger?: string;
    /** Async or sync per-kind search. Wins over `onResourceSearch`. */
    search?: (query: string) => Promise<MentionSuggestion<TKind, TData>[]> | MentionSuggestion<TKind, TData>[];
    /** Static suggestions (used when `search` is absent or query is empty). */
    suggestions?: ReadonlyArray<MentionSuggestion<TKind, TData>>;
    /** Build a permalink from a suggestion. */
    buildHref?: (suggestion: MentionSuggestion<TKind, TData>) => string | undefined;
    /** Custom chip renderer — overrides the default badge look. */
    renderChip?: (mention: Mention<TKind, TData>) => ReactNode;
    /** Tone applied to the default chip. */
    tone?: MentionTone;
}

/* ------------------------------------------------------------------ */
/*  Provider config                                                     */
/* ------------------------------------------------------------------ */

/**
 * Global "rich suggestions" callback. Used when:
 *   1. The user types one of the registered triggers (e.g. `@`, `#`)
 *      — the picker opens automatically and calls this with the typed
 *      needle + matched kind.
 *   2. A `resources[kind]` entry is missing both `search` and `suggestions`.
 *
 * Per-kind `search` / `suggestions` always take precedence when present.
 */
export type MentionsResourceSearch<TResource extends string = string> = (
    needle: string,
    kind: TResource,
) => Promise<ReadonlyArray<MentionSuggestion<TResource>>> | ReadonlyArray<MentionSuggestion<TResource>>;

export interface MentionsConfig<TResource extends string = string> {
    /** Resource catalogue. */
    resources?: Partial<Record<TResource, MentionResource<TResource>>>;
    /** Global search fallback. */
    onResourceSearch?: MentionsResourceSearch<TResource>;
}
