/**
 * Strings for the Activities feature. Consumers override via the `strings`
 * prop on `<ActivityFeed>` / `<ActivityFeedCard>`. Values are deep-merged
 * over these defaults — `sources` and `events` merge one level deep so a
 * consumer can override a single source/event label without rewriting the
 * whole map.
 */
export interface ActivitiesStrings {
    /** Card title — usually "Activity". */
    title: string;
    /** Empty-state copy. */
    empty: string;
    /** Loading-state copy. */
    loading: string;
    /** Date-group label for today. */
    today: string;
    /** Date-group label for yesterday. */
    yesterday: string;
    /** Fallback label for activities without a timestamp. */
    undated: string;
    /** Replacement for actor name when `actorId === currentUserId`. */
    you: string;
    /** Toggle button label — collapsed state. */
    showChanges: string;
    /** Toggle button label — expanded state. */
    hideChanges: string;
    /** aria-label for the actions menu trigger. */
    actionsLabel: string;
    /** Generic "more" affordance label. */
    moreLabel: string;
    /** Map of `source` → display label. */
    sources: Record<string, string>;
    /** Map of `event` → display label. Used as a fallback for headlines. */
    events: Record<string, string>;
}

export const defaultActivitiesStrings: ActivitiesStrings = {
    title: 'Activity',
    empty: 'No activity yet.',
    loading: 'Loading activity…',
    today: 'Today',
    yesterday: 'Yesterday',
    undated: 'Undated',
    you: 'You',
    showChanges: 'Show changes',
    hideChanges: 'Hide changes',
    actionsLabel: 'Activity actions',
    moreLabel: 'More',
    sources: {
        comment: 'Comment',
        mail: 'Mail',
        booking_log: 'Booking log',
        activity_log: '',
        system: 'System',
    },
    events: {},
};

/** Replace `{{key}}` tokens with values from `params`. */
export function interpolate(
    template: string,
    params: Record<string, string | number>,
): string {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        const v = params[key];
        return v === undefined ? match : String(v);
    });
}
