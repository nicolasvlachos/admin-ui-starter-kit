/**
 * Default user-facing strings for the `features/card` family.
 *
 * Consumers wire backend i18n at the call site:
 *
 *   <SharedResourceCard strings={{ noResourceSelected: t('card.empty') }} … />
 */

export interface SharedResourceCardStrings {
	currentlySelected: string;
	noResourceContent: string;
	noResourceSelected: string;
	changeAction: string;
}

export const defaultSharedResourceCardStrings: SharedResourceCardStrings = {
	currentlySelected: 'Currently selected:',
	noResourceContent: 'No resource content configured.',
	noResourceSelected: 'No resource selected.',
	changeAction: 'Change',
};
