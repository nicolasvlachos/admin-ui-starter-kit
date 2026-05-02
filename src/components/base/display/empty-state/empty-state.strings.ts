/**
 * Strings for `<EmptyState>`. English defaults — every piece of copy is
 * deep-merge-overridable per rule 8.
 *
 * `title`/`description` here are the *fallback* defaults the component
 * renders when neither the prop nor a per-illustration preset supplies
 * its own copy. In practice, the consumer usually passes an explicit
 * `title` / `description` per resource ("No products", "No invoices yet")
 * — these defaults exist so a bare `<EmptyState />` still renders
 * sensibly during scaffolding.
 */
export interface EmptyStateStrings {
	title: string;
	description: string;
	ariaLabel: string;
}

export const defaultEmptyStateStrings: EmptyStateStrings = {
	title: 'Nothing here yet',
	description: 'Once data lands, it will show up in this view.',
	ariaLabel: 'Empty state',
};
