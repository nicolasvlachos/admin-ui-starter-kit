/**
 * Strings for `<OnboardingChecklist>`. Indicator labels are screen-reader
 * announcements for the status icons; consumers wire their i18n into them.
 *
 * The `regionAriaLabel` is intentionally optional — the consumer typically
 * already has a heading above the checklist that names it ("Set up your
 * workspace"), so adding an aria-label here would be redundant.
 */
export interface OnboardingChecklistStrings {
	regionAriaLabel?: string;
	statusCompletedAria: string;
	statusInProgressAria: string;
	statusPendingAria: string;
}

export const defaultOnboardingChecklistStrings: OnboardingChecklistStrings = {
	regionAriaLabel: undefined,
	statusCompletedAria: 'Completed',
	statusInProgressAria: 'In progress',
	statusPendingAria: 'Pending',
};
