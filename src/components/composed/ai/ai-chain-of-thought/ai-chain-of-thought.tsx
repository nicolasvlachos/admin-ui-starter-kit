/**
 * AiChainOfThought — vertical timeline of reasoning steps an agent took (or
 * is taking) to reach a conclusion. Status-aware markers; per-step body slot
 * for nested content (tool calls, code, sub-steps). Pair with `AiReasoning`
 * (free-form trace) when the model emits structured plan steps.
 */
import { AlertCircle, Check, Circle, Loader2, type LucideIcon } from 'lucide-react';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { AiShimmer } from '../ai-shimmer/ai-shimmer';
import {
	defaultAiChainOfThoughtStrings,
	type AiChainOfThoughtProps,
	type AiChainStepStatus,
} from './types';

const STATUS_VISUAL: Record<
	AiChainStepStatus,
	{ icon: LucideIcon; iconCls: string; ring: string; spin?: boolean }
> = {
	pending: {
		icon: Circle,
		iconCls: 'text-muted-foreground/60',
		ring: 'border-border/60 bg-card',
	},
	active: {
		icon: Loader2,
		iconCls: 'text-primary',
		ring: 'border-primary/40 bg-primary/5',
		spin: true,
	},
	completed: {
		icon: Check,
		iconCls: 'text-success-foreground',
		ring: 'border-success/40 bg-success',
	},
	failed: {
		icon: AlertCircle,
		iconCls: 'text-destructive-foreground',
		ring: 'border-destructive/40 bg-destructive',
	},
};

export function AiChainOfThought({
	steps,
	hideHeader = false,
	streaming = false,
	className,
	strings: stringsProp,
}: AiChainOfThoughtProps) {
	const strings = useStrings(defaultAiChainOfThoughtStrings, stringsProp);

	return (
		<div className={cn('ai-chain-of-thought--component', 'rounded-lg border border-border/60 bg-card', className)}>
			{!hideHeader && (
				<div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
					<Text size="xs" type="secondary" weight="medium" className="uppercase tracking-wider">
						{strings.title}
					</Text>
					{streaming && (
						<AiShimmer className="ml-auto !text-xs">
							{strings.streamingHint}
						</AiShimmer>
					)}
				</div>
			)}
			<ol className="relative px-3 py-3">
				{steps.map((step, idx) => {
					const status: AiChainStepStatus = step.status ?? 'pending';
					const visual = STATUS_VISUAL[status];
					const Icon = step.icon ?? visual.icon;
					const isLast = idx === steps.length - 1;
					return (
						<li key={step.id} className="relative flex gap-3 pb-3 last:pb-0">
							{!isLast && (
								<span
									aria-hidden
									className="absolute left-[11px] top-[26px] h-[calc(100%-26px)] w-px bg-border/60"
								/>
							)}
							<span
								aria-hidden
								className={cn(
									'relative z-[1] mt-0.5 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full border',
									visual.ring,
								)}
							>
								<Icon
									className={cn(
										'size-3',
										visual.iconCls,
										visual.spin && 'animate-spin',
									)}
								/>
							</span>
							<div className="min-w-0 flex-1">
								<Text
									weight={status === 'active' ? 'semibold' : 'medium'}
									className={cn(status === 'pending' && 'text-muted-foreground')}
								>
									{step.title}
								</Text>
								{!!step.description && (
									<Text size="xs" type="secondary" className="mt-0.5">
										{step.description}
									</Text>
								)}
								{!!step.body && (
									<div className="mt-2">{step.body}</div>
								)}
							</div>
						</li>
					);
				})}
			</ol>
		</div>
	);
}

AiChainOfThought.displayName = 'AiChainOfThought';
