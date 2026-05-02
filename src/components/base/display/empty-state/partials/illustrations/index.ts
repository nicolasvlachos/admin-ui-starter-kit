/**
 * Token-driven illustrations for `<EmptyState>`.
 *
 * Each illustration is a small composition of `bg-muted` /
 * `bg-background` / `border-border` divs (no raw palette colors), so it
 * adapts to the consumer's theme automatically. Use as the `media`
 * prop of `<EmptyState>` — pick one per resource:
 *
 *     <EmptyState
 *         media={<StackedCardsIllustration />}
 *         title="No products yet"
 *         description="Add your first product to start selling."
 *         actions={<Button>Add product</Button>}
 *     />
 *
 * Add new illustrations by dropping a new file in this folder and
 * re-exporting it here. Keep them framework-agnostic and
 * token-driven — never reach for raw color literals.
 */
export { DocumentStackIllustration } from './document-stack';
export { InboxCleanIllustration } from './inbox-clean';
export { SearchGlassIllustration } from './search-glass';
export { StackedCardsIllustration } from './stacked-cards';
export { UsersCircleIllustration } from './users-circle';
