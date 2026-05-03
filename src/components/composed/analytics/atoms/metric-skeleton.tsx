/**
 * MetricSkeleton — loading placeholder matching the height/spacing of every
 * `Metric` variant so the layout doesn't jump when data resolves.
 */
import { cn } from '@/lib/utils';
import type { MetricSize, MetricVariant } from '../types';

interface MetricSkeletonProps {
	variant?: MetricVariant;
	size?: MetricSize;
	className?: string;
}

const Bar = ({ className }: { className?: string }) => (
	<div className={cn('animate-pulse rounded bg-muted', className)} />
);

export function MetricSkeleton({
	variant = 'default',
	size = 'md',
	className,
}: MetricSkeletonProps) {
	const padding = size === 'sm' ? 'p-3' : size === 'lg' ? 'p-5' : 'p-4';

	if (variant === 'card' || variant === 'bordered' || variant === 'accent' || variant === 'colored') {
		return (
			<div
				className={cn('metric-skeleton--component', 
					'rounded-xl border border-border bg-card shadow-sm',
					padding,
					className,
				)}
				aria-busy="true"
				aria-live="polite"
			>
				<Bar className="h-3 w-24" />
				<Bar className={cn('mt-3', size === 'lg' ? 'h-9 w-40' : 'h-7 w-32')} />
				<Bar className="mt-2 h-3 w-20" />
				<Bar className="mt-3 h-8 w-full" />
			</div>
		);
	}

	if (variant === 'compact') {
		return (
			<div className={cn('flex items-center gap-3', className)} aria-busy="true">
				<Bar className="size-9 rounded-lg" />
				<div className="flex-1 space-y-1.5">
					<Bar className="h-3 w-20" />
					<Bar className="h-4 w-28" />
				</div>
				<Bar className="h-5 w-12 rounded-full" />
			</div>
		);
	}

	if (variant === 'minimal') {
		return (
			<div className={cn('inline-flex items-baseline gap-2', className)} aria-busy="true">
				<Bar className="h-3 w-12" />
				<Bar className="h-3 w-16" />
			</div>
		);
	}

	// default
	return (
		<div className={cn('flex flex-col gap-1.5', padding, className)} aria-busy="true">
			<Bar className="h-3 w-20" />
			<Bar className="h-5 w-28" />
			<Bar className="mt-1 h-6 w-full" />
		</div>
	);
}

MetricSkeleton.displayName = 'MetricSkeleton';
