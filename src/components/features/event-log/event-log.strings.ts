/**
 * EventLog strings — i18n surface for the timeline shell. The bulk of
 * user-facing copy in EventLog comes from downstream features
 * (`CommentsStrings`, `MentionsConfig`); the strings here cover the
 * timeline-level chrome only (list aria label, future load-more / empty
 * states). Adding the file now so a future copy addition lands as a
 * non-breaking change rather than expanding the props surface.
 */

export interface EventLogStrings {
    /** aria-label for the `<ul>` that wraps event rows. Matters for
     *  screen readers landing in the middle of a long timeline. */
    listAriaLabel: string;
    /** Empty-state message when `entries` is empty and no composer is
     *  configured. */
    emptyMessage: string;
}

export const defaultEventLogStrings: EventLogStrings = {
    listAriaLabel: 'Activity timeline',
    emptyMessage: 'No activity yet.',
};
