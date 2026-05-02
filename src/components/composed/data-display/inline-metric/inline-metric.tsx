/**
 * InlineMetricBadge — compact "label · value · change%" pill rows.
 * Three sizes (sm / base / lg) drive padding, gap, and per-token font sizes.
 * `lg` is the previously-too-big-default rebalanced — value sits at `xs` so
 * the chip stays inline-friendly; consumers needing larger figures should
 * use `MiniKpi` or `StatCard` instead.
 */
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';

import type { InlineMetricBadgeProps } from './types';

const containerSize: Record<string, string> = {
	sm: 'gap-1 rounded-full px-2 py-0.5',
	md: 'gap-1.5 rounded-full px-2.5 py-1',
	base: 'gap-1.5 rounded-full px-2.5 py-1',
	lg: 'gap-1.5 rounded-full px-3 py-1',
};

const labelSize: Record<string, 'xxs' | 'xs'> = {
	sm: 'xxs',
	md: 'xxs',
	base: 'xxs',
	lg: 'xs',
};

const valueSize: Record<string, 'xxs' | 'xs'> = {
	sm: 'xxs',
	md: 'xs',
	base: 'xs',
	lg: 'xs',
};

const changeSize: Record<string, 'xxs' | 'xs'> = {
	sm: 'xxs',
	md: 'xxs',
	base: 'xxs',
	lg: 'xxs',
};

export function InlineMetricBadge({ metrics, className }: InlineMetricBadgeProps) {
	return (
		<div className={cn('flex flex-wrap gap-1.5', className)}>
			{metrics.map((m) => {
				const sz = m.size ?? 'base';
				return (
					<span
						key={m.label}
						className={cn(
							'inline-flex items-center bg-card ring-1 ring-border/60',
							containerSize[sz] ?? containerSize.base,
						)}
					>
						<Text tag="span" size={labelSize[sz] ?? 'xxs'} type="secondary">
							{m.label}
						</Text>
						<Text
							tag="span"
							size={valueSize[sz] ?? 'xs'}
							weight="semibold"
							className="tabular-nums"
						>
							{m.value}
						</Text>
						<Text
							tag="span"
							size={changeSize[sz] ?? 'xxs'}
							weight="medium"
							className={cn(
								'tabular-nums inline-flex items-center gap-0.5 rounded-full px-1',
								m.up ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive',
							)}
						>
							{m.up ? '↑' : '↓'}
							{m.change}
						</Text>
					</span>
				);
			})}
		</div>
	);
}

InlineMetricBadge.displayName = 'InlineMetricBadge';
