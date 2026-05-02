import type { ReactNode } from 'react';

import type { StringsProp } from '@/lib/strings';

import type { OnboardingChecklistStrings } from './checklist.strings';

/** Status of a single onboarding step. */
export type OnboardingStepStatus = 'completed' | 'in-progress' | 'pending';

export interface OnboardingChecklistStep {
	/** Stable identifier for controlled-mode + accordion value. */
	id: string;
	/** Current status — drives the leading indicator and tone. */
	status: OnboardingStepStatus;
	/** Step title; renders as a `<Heading tag="h4">`. */
	title: ReactNode;
	/**
	 * Trailing badge — typically a status pill ("Ready", "Required",
	 * "Recommended"). Pass any node — usually `<Badge>` from
	 * `base/badge`.
	 */
	badge?: ReactNode;
	/**
	 * Body content shown when the step is expanded. This is where
	 * forms / inputs / illustrations live.
	 */
	content?: ReactNode;
	/** Prevents the step from expanding/collapsing when true. */
	disabled?: boolean;
}

/**
 * Visual chrome for the checklist shell. Same axis as `SmartAccordion`'s
 * variant prop — re-exported here for discoverability.
 *
 * `card`     — each step is a separate rounded card.
 * `bordered` — single rounded shell with row dividers (the canonical
 *              onboarding look from the user's reference).
 * `flat`     — no chrome at all.
 */
export type OnboardingChecklistVariant = 'card' | 'bordered' | 'flat';

export interface OnboardingChecklistProps {
	steps: OnboardingChecklistStep[];
	/**
	 * Initial expanded step ids (uncontrolled). Defaults to opening the
	 * first non-completed step so the user lands on the next thing to do.
	 */
	defaultExpanded?: string[];
	/** Allow multiple steps expanded simultaneously. Defaults to `false`. */
	multiple?: boolean;
	/** Controlled expanded step ids. */
	value?: string[];
	/** Change callback for controlled mode. */
	onValueChange?: (value: string[]) => void;
	/**
	 * Emit when a step is opened (for analytics — fires on transitions
	 * from "not in expanded set" to "in expanded set").
	 */
	onStepOpen?: (id: string) => void;
	/** Visual chrome. Defaults to `'bordered'` (the canonical onboarding shape). */
	variant?: OnboardingChecklistVariant;
	className?: string;
	stepClassName?: string;
	strings?: StringsProp<OnboardingChecklistStrings>;
}
