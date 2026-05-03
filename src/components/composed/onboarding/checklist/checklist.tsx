/**
 * OnboardingChecklist — the canonical step-list accordion for SaaS
 * onboarding flows. Each step has a status (completed / in-progress /
 * pending), a title, an optional badge, and an optional expanded body
 * for forms / actions / instructions.
 *
 * Composes `base/accordion`'s primitives directly (rule 2). Builds on
 * the shadcn accordion via the wrapped pass-through.
 *
 * Status indicators come from `partials/step-status-indicator.tsx` —
 * token-driven (success / warning / muted-foreground only).
 *
 * Strings — every accessibility label flows through the strings prop
 * (rule 8). Per-step copy lives in the data passed to `steps` (titles,
 * badges, descriptions are consumer-controlled).
 */
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/base/accordion';
import {
	ACCORDION_CONTENT_PADDING,
	ACCORDION_ITEM_VARIANT_CLASS,
	ACCORDION_ROOT_VARIANT_CLASS,
} from '@/components/base/accordion/accordion-variants';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultOnboardingChecklistStrings,
	type OnboardingChecklistStrings,
} from './checklist.strings';
import type {
	OnboardingChecklistProps,
	OnboardingStepStatus,
} from './checklist.types';
import { StepStatusIndicator } from './partials/step-status-indicator';

const TITLE_TONE_CLASS: Record<OnboardingStepStatus, string> = {
	completed: 'text-foreground',
	'in-progress': 'text-foreground',
	pending: 'text-muted-foreground',
};

function pickStatusAria(
	status: OnboardingStepStatus,
	strings: OnboardingChecklistStrings,
): string {
	if (status === 'completed') return strings.statusCompletedAria;
	if (status === 'in-progress') return strings.statusInProgressAria;
	return strings.statusPendingAria;
}

function defaultExpandedFor(steps: OnboardingChecklistProps['steps']): string[] {
	const next = steps.find((s) => s.status !== 'completed' && !s.disabled);
	return next ? [next.id] : [];
}

export const OnboardingChecklist = forwardRef<HTMLDivElement, OnboardingChecklistProps>(function OnboardingChecklist({
	steps,
	defaultExpanded,
	multiple = false,
	value,
	onValueChange,
	onStepOpen,
	variant = 'bordered',
	className,
	stepClassName,
	strings: stringsProp,
}, ref) {
	const strings = useStrings(defaultOnboardingChecklistStrings, stringsProp);
	const isControlled = value !== undefined;
	const computedDefault = useMemo(
		() => defaultExpanded ?? defaultExpandedFor(steps),
		// First-mount default. Re-resolution when `steps` arrives async is
		// handled by the effect below — that effect picks the next pending
		// step and opens it, but only if the user hasn't already toggled
		// anything.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);
	const [internalValue, setInternalValue] = useState<string[]>(computedDefault);
	const userInteractedRef = useRef(false);
	const expanded = isControlled ? value : internalValue;
	const previouslyExpanded = useRef<Set<string>>(new Set(computedDefault));

	// When `steps` is loaded asynchronously (consumer passes [] then
	// populates), promote the next-pending step the first time real
	// steps arrive — but never overwrite an explicit user toggle.
	useEffect(() => {
		if (isControlled || userInteractedRef.current) return;
		if (defaultExpanded !== undefined) return;
		if (steps.length === 0) return;
		if (internalValue.length > 0) return;
		const next = defaultExpandedFor(steps);
		if (next.length > 0) setInternalValue(next);
	}, [steps, isControlled, defaultExpanded, internalValue.length]);

	const handleValueChange = useCallback(
		(next: unknown) => {
			const nextArr = (next as string[]) ?? [];
			userInteractedRef.current = true;
			if (!isControlled) setInternalValue(nextArr);
			onValueChange?.(nextArr);
		},
		[isControlled, onValueChange],
	);

	useEffect(() => {
		if (!onStepOpen) {
			previouslyExpanded.current = new Set(expanded);
			return;
		}
		const prev = previouslyExpanded.current;
		for (const id of expanded) {
			if (!prev.has(id)) onStepOpen(id);
		}
		previouslyExpanded.current = new Set(expanded);
	}, [expanded, onStepOpen]);

	return (
		<Accordion
			ref={ref}
			multiple={multiple}
			value={expanded}
			onValueChange={handleValueChange}
			aria-label={strings.regionAriaLabel}
			className={cn('checklist--component', ACCORDION_ROOT_VARIANT_CLASS[variant], className)}
		>
			{steps.map((step) => (
				<AccordionItem
					key={step.id}
					value={step.id}
					className={cn(ACCORDION_ITEM_VARIANT_CLASS[variant], stepClassName)}
				>
					<AccordionTrigger
						disabled={step.disabled}
						className="gap-3 px-3 py-(--row-py) hover:no-underline"
					>
						<div className="flex w-full min-w-0 items-center gap-3 pr-2">
							<StepStatusIndicator
								status={step.status}
								ariaLabel={pickStatusAria(step.status, strings)}
							/>
							<Text
								tag="span"
								weight="semibold"
								className={cn(TITLE_TONE_CLASS[step.status])}
							>
								{step.title}
							</Text>
							{!!step.badge && (
								<span className="ml-auto inline-flex shrink-0">{step.badge}</span>
							)}
						</div>
					</AccordionTrigger>
					{!!step.content && (
						<AccordionContent className={ACCORDION_CONTENT_PADDING.withMedallion}>
							<Text type="secondary" className="leading-relaxed" tag="div">
								{step.content}
							</Text>
						</AccordionContent>
					)}
				</AccordionItem>
			))}
		</Accordion>
	);
});

OnboardingChecklist.displayName = 'OnboardingChecklist';
