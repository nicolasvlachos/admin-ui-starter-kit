/**
 * BreadcrumbProgress — wizard / multi-step navigation with completed,
 * current, and upcoming states. Click any completed step to jump back.
 */
import { Check } from 'lucide-react';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultBreadcrumbProgressStrings,
	type BreadcrumbProgressProps,
} from './types';

export function BreadcrumbProgress({ steps, currentIndex, onStepClick, className, strings: stringsProp }: BreadcrumbProgressProps) {
	const strings = useStrings(defaultBreadcrumbProgressStrings, stringsProp);

	return (
		<div className={cn('breadcrumb-progress--component', 'w-full', className)}>
			<div className="flex items-center justify-between mb-2">
				<Text size="xs" type="secondary" weight="medium" className="uppercase tracking-wider">
					{strings.stepLabel} {currentIndex + 1} {strings.ofLabel} {steps.length}
				</Text>
				<Text tag="span" size="xs" weight="semibold" className="tabular-nums">{Math.round(((currentIndex + 1) / steps.length) * 100)}%</Text>
			</div>
			<ol className="flex items-center gap-2">
				{steps.map((step, idx) => {
					const isCompleted = idx < currentIndex;
					const isCurrent = idx === currentIndex;
					const isClickable = onStepClick && (isCompleted || isCurrent);
					return (
						<li key={step.id} className="flex flex-1 items-center gap-2">
							<button
								type="button"
								onClick={() => isClickable && onStepClick?.(step.id, idx)}
								disabled={!isClickable}
								className={cn(
									'flex items-center gap-2 rounded-md px-2 py-1 text-left transition-colors',
									'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
									isClickable && 'hover:bg-muted/40',
									!isClickable && 'cursor-default',
								)}
							>
								<span
									className={cn(
										'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums',
										isCompleted && 'bg-success text-success-foreground',
										isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/15',
										!isCompleted && !isCurrent && 'bg-muted text-muted-foreground',
									)}
								>
									{isCompleted ? <Check className="size-3.5" /> : idx + 1}
								</span>
								<div className="hidden sm:block min-w-0">
									<Text size="xs" weight="semibold" className={cn(!isCurrent && !isCompleted && 'text-muted-foreground')}>{step.label}</Text>
									{!!step.hint && <Text size="xxs" type="discrete" className="truncate">{step.hint}</Text>}
								</div>
							</button>
							{idx < steps.length - 1 && (
								<div className={cn('h-px flex-1', isCompleted ? 'bg-success' : 'bg-border')} />
							)}
						</li>
					);
				})}
			</ol>
		</div>
	);
}

BreadcrumbProgress.displayName = 'BreadcrumbProgress';
