/**
 * Shared accordion-shell variant classes — used by both `SmartAccordion`
 * and any composed surface that builds on `base/accordion` directly
 * (e.g. `composed/onboarding/checklist`).
 *
 * Exported because two consumers already keep it in lockstep; a third
 * one will copy this exact map. Centralising means a future tweak
 * (e.g. tighten `card` items to `border-border/70`) propagates.
 *
 * Padding tokens for trigger / content live alongside so the rhythm
 * is shared too:
 *
 * - Trigger: `gap-3 px-3 py-(--row-py)` — density-driven, `<UIProvider>`
 *   override flows through.
 * - Content with leading medallion: `pl-12 pr-3 pt-0` — left padding
 *   aligns body text under the title (medallion is `size-8` plus
 *   `gap-3`, so 32 + 12 = pl-12).
 * - Content without medallion: `pl-3 pr-3 pt-0`.
 */
export type AccordionShellVariant = 'card' | 'bordered' | 'flat';

export const ACCORDION_ROOT_VARIANT_CLASS: Record<AccordionShellVariant, string> = {
	card: 'space-y-2 border-0 rounded-none overflow-visible',
	bordered: 'rounded-lg border border-border bg-card overflow-hidden',
	flat: 'border-0 rounded-none bg-transparent overflow-visible',
};

export const ACCORDION_ITEM_VARIANT_CLASS: Record<AccordionShellVariant, string> = {
	card: 'border border-border bg-card rounded-md data-open:bg-card',
	bordered: 'bg-transparent not-last:border-b border-border data-open:bg-muted/40',
	flat: 'border-0 bg-transparent data-open:bg-muted/30 rounded-md',
};

export const ACCORDION_TRIGGER_BASE =
	'gap-3 px-3 py-(--row-py) text-left hover:no-underline';

/**
 * Content-padding presets keyed off the leading-icon width. Use
 * `withMedallion` when the trigger renders an `IconBadge size="sm"`
 * (size-8 = 32px) plus `gap-3` (12px) so body text aligns under the
 * title.
 */
export const ACCORDION_CONTENT_PADDING = {
	withMedallion: 'pl-12 pr-3 pt-0',
	withoutMedallion: 'pl-3 pr-3 pt-0',
} as const;
