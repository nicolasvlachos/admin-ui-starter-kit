/**
 * MetricBar — horizontal strip of metrics with an optional period selector
 * on the leading edge. Cells are divided by hairlines so a row of 4 KPIs
 * reads as a single integrated module rather than disconnected cards.
 *
 * Variants:
 *   `default`  — flat hairline-divided bar with period chip on the left.
 *                Best for tables/dashboards where the bar sits above content.
 *   `gradient` — same layout wrapped in a tinted gradient frame for hero
 *                placement.
 *
 * Always render `Metric` cells inside; never render layout-specific markup
 * directly. That keeps the formatting / colouring rules in one place.
 */
import { Calendar } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { Metric } from '../metric/metric';
import type { MetricData, MetricPeriod, MetricSize } from '../types';

export type MetricBarVariant = 'default' | 'gradient';

export interface MetricBarProps {
	metrics: MetricData[];
	period?: MetricPeriod;
	onPeriodChange?: (value: string) => void;
	variant?: MetricBarVariant;
	size?: MetricSize;
	showSparklines?: boolean;
	showChanges?: boolean;
	footerText?: string;
	className?: string;
}

export function MetricBar({
	metrics,
	period,
	onPeriodChange,
	variant = 'default',
	size = 'md',
	showSparklines = true,
	showChanges = true,
	footerText,
	className,
}: MetricBarProps) {
	const cells = (
		<div className="flex min-w-0 flex-1 items-stretch divide-x divide-border">
			{metrics.map((metric) => (
				<div key={metric.id} className="flex-1 min-w-0 px-4 py-3">
					<Metric
						data={metric}
						variant="default"
						size={size}
						showSparkline={showSparklines}
						showChange={showChanges}
					/>
				</div>
			))}
		</div>
	);

	const periodChip = !!period && (
		<div className="flex shrink-0 items-center px-3">
			<Button
				variant="secondary"
				buttonStyle="ghost"
				className="gap-1.5"
				onClick={onPeriodChange ? () => onPeriodChange(period.value) : undefined}
			>
				<Calendar className="size-3.5" aria-hidden="true" />
				<Text size="xs" weight="medium">{period.label}</Text>
			</Button>
		</div>
	);

	if (variant === 'gradient') {
		return (
			<div
				className={cn('metric-bar--component', 
					'rounded-xl bg-gradient-to-r from-primary/8 via-info/5 to-success/8 p-[1px]',
					className,
				)}
			>
				<div className="flex items-stretch overflow-hidden rounded-[11px] bg-card">
					{periodChip && (
						<>
							{periodChip}
							<div className="w-px bg-border" aria-hidden="true" />
						</>
					)}
					{cells}
				</div>
				{!!footerText && (
					<div className="rounded-b-[11px] border-t border-border/50 bg-card px-4 py-2">
						<Text size="xxs" type="discrete">{footerText}</Text>
					</div>
				)}
			</div>
		);
	}

	return (
		<div
			className={cn(
				'flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm',
				className,
			)}
		>
			<div className="flex items-stretch">
				{periodChip && (
					<>
						{periodChip}
						<div className="w-px bg-border" aria-hidden="true" />
					</>
				)}
				{cells}
			</div>
			{!!footerText && (
				<div className="border-t border-border/50 px-4 py-2">
					<Text size="xxs" type="discrete">{footerText}</Text>
				</div>
			)}
		</div>
	);
}

MetricBar.displayName = 'MetricBar';
