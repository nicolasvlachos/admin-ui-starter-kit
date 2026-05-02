/**
 * Default user-facing strings for `<MetadataList>`.
 *
 * Consumers wire backend i18n at the call site:
 *
 *   <MetadataList strings={{ infoFallback: t('metadata.info') }} … />
 */

export interface MetadataListStrings {
	/**
	 * Suffix appended to the label when generating the tooltip-trigger
	 * `aria-label` ("<label> info"). Receives the label as the first arg
	 * so consumers can localise the full template.
	 */
	formatInfoAriaLabel: (label: string) => string;
	/** Fallback `aria-label` used when the field label is not a plain string. */
	infoFallback: string;
}

export const defaultMetadataListStrings: MetadataListStrings = {
	formatInfoAriaLabel: (label) => `${label} info`,
	infoFallback: 'Info',
};
