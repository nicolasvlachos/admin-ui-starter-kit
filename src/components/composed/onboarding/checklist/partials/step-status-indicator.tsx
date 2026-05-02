/**
 * StepStatusIndicator — the small leading icon that signals each step's
 * status in an OnboardingChecklist.
 *
 * - `completed`   → filled success check
 * - `in-progress` → soft warning-tinted disc with a small pulsing dot
 * - `pending`     → muted spinner ring
 *
 * Token-driven: success / warning / muted-foreground tokens only. No
 * raw palette colors so consumer rebrand flows through.
 */
import { CheckCircle2 } from 'lucide-react';

import { Spinner } from '@/components/base/spinner';
import { cn } from '@/lib/utils';

import type { OnboardingStepStatus } from '../checklist.types';

interface StepStatusIndicatorProps {
	status: OnboardingStepStatus;
	ariaLabel: string;
	className?: string;
}

export function StepStatusIndicator({
	status,
	ariaLabel,
	className,
}: StepStatusIndicatorProps) {
	if (status === 'completed') {
		return (
			<span
				role="img"
				aria-label={ariaLabel}
				className={cn('flex size-5 items-center justify-center', className)}
			>
				<CheckCircle2 className="size-5 fill-success text-background" />
			</span>
		);
	}

	if (status === 'in-progress') {
		return (
			<span
				role="img"
				aria-label={ariaLabel}
				className={cn(
					'flex size-5 items-center justify-center rounded-full bg-warning/15 ring-1 ring-warning/30',
					className,
				)}
			>
				<span className="size-2 rounded-full bg-warning" />
			</span>
		);
	}

	return (
		<span
			role="img"
			aria-label={ariaLabel}
			className={cn('flex size-5 items-center justify-center text-muted-foreground/70', className)}
		>
			<Spinner className="size-4 opacity-60" />
		</span>
	);
}

StepStatusIndicator.displayName = 'StepStatusIndicator';
