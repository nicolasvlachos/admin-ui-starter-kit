/**
 * base/accordion — thin wrapper around the shadcn `ui/accordion` primitive.
 *
 * The wrapper has two tiers:
 *
 * 1. Low-level re-exports (`Accordion`, `AccordionItem`, `AccordionTrigger`,
 *    `AccordionContent`) — pass-throughs for full compound-component
 *    composition, with the layer-2 layering rule (rule 1, rule 2) honored:
 *    only this file reaches into `@/components/ui/accordion`.
 *
 * 2. `<SmartAccordion items={…} />` — the higher-level admin convenience,
 *    encoding the recurring "leading icon medallion + title + optional badge
 *    + body" pattern with density / typography / strings already wired.
 *    See `./smart-accordion.tsx`.
 *
 * Density: triggers default to `px-3 py-(--row-py)` so a consumer's
 * `<UIProvider>` density override flows through.
 */
export {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from '@/components/ui/accordion';
