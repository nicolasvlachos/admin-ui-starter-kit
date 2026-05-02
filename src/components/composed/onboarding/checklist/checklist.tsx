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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/base/accordion';
import { Heading, Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultOnboardingChecklistStrings,
	type OnboardingChecklistStrings,
} from './checklist.strings';
import type {
	OnboardingChecklistProps,
	OnboardingChecklistVariant,
	OnboardingStepStatus,
} from './checklist.types';
import { StepStatusIndicator } from './partials/step-status-indicator';

const ROOT_VARIANT_CLASS: Record<OnboardingChecklistVariant, string> = {
	card: 'space-y-2 border-0 rounded-none overflow-visible',
	bordered: 'rounded-lg border border-border bg-card overflow-hidden',
	flat: 'border-0 rounded-none bg-transparent overflow-visible',
};

const ITEM_VARIANT_CLASS: Record<OnboardingChecklistVariant, string> = {
	card: 'border border-border bg-card rounded-md',
	bordered: 'bg-transparent not-last:border-b border-border',
	flat: 'border-0 bg-transparent data-open:bg-muted/30 rounded-md',
};

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

export function OnboardingChecklist({
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
}: OnboardingChecklistProps) {
	const strings = useStrings(defaultOnboardingChecklistStrings, stringsProp);
	const isControlled = value !== undefined;
	const computedDefault = useMemo(
		() => defaultExpanded ?? defaultExpandedFor(steps),
		// `steps` only matters at first render; if the consumer passes new
		// steps after mount, they should drive expansion via `value`.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);
	const [internalValue, setInternalValue] = useState<string[]>(computedDefault);
	const expanded = isControlled ? value : internalValue;
	const previouslyExpanded = useRef<Set<string>>(new Set(computedDefault));

	const handleValueChange = useCallback(
		(next: unknown) => {
			const nextArr = (next as string[]) ?? [];
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
			multiple={multiple}
			value={expanded}
			onValueChange={handleValueChange}
			aria-label={strings.regionAriaLabel}
			className={cn(ROOT_VARIANT_CLASS[variant], className)}
		>
			{steps.map((step) => (
				<AccordionItem
					key={step.id}
					value={step.id}
					className={cn(ITEM_VARIANT_CLASS[variant], stepClassName)}
				>
					<AccordionTrigger
						disabled={step.disabled}
						className="gap-3 px-4 py-(--row-py) hover:no-underline"
					>
						<div className="flex w-full min-w-0 items-center gap-3 pr-2">
							<StepStatusIndicator
								status={step.status}
								ariaLabel={pickStatusAria(step.status, strings)}
							/>
							<Heading
								tag="h4"
								className={cn(
									'border-0 pb-0 text-sm font-semibold',
									TITLE_TONE_CLASS[step.status],
								)}
							>
								{step.title}
							</Heading>
							{!!step.badge && (
								<span className="ml-auto inline-flex shrink-0">{step.badge}</span>
							)}
						</div>
					</AccordionTrigger>
					{!!step.content && (
						<AccordionContent className="pl-12 pr-4 pt-0">
							<Text size="sm" type="secondary" className="leading-relaxed" tag="div">
								{step.content}
							</Text>
						</AccordionContent>
					)}
				</AccordionItem>
			))}
		</Accordion>
	);
}

OnboardingChecklist.displayName = 'OnboardingChecklist';
