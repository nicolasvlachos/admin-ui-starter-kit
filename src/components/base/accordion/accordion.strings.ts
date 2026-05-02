/**
 * Strings for `SmartAccordion`. There aren't many — Radix handles the
 * trigger ARIA states automatically, so the only library-owned copy is
 * the optional landmark label on the wrapping nav region. Consumers
 * override per-item `title` / `badge` / `content` directly via
 * `SmartAccordionItem` props (the strings live in the data, not here).
 */
export interface SmartAccordionStrings {
	/**
	 * Sets `aria-label` on the wrapping element so screen readers can name
	 * the accordion region. Optional — when absent, no aria-label is set.
	 */
	regionAriaLabel?: string;
}

export const defaultSmartAccordionStrings: SmartAccordionStrings = {
	regionAriaLabel: undefined,
};
