/**
 * MetricComparison — period-over-period comparison surface.
 *
 * Renders two side-by-side `Metric.bordered`-style boxes for current vs
 * previous, with a delta block below showing absolute + percent change in
 * a tone-tinted box. Layout stacks vertically below the `sm` breakpoint.
 *
 * Accepts `MetricData` for both halves so format hints (currency, percent,
 * duration) carry over consistently. Strings overridable for i18n.
 */
import { ArrowDown, ArrowRight, ArrowUp, Equal } from 'lucide-react';

import { SmartCard } from '@/components/base/cards';
import { Heading, Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { formatMetricValue } from '../format-metric-value';
import type { MetricData } from '../types';

export interface MetricComparisonStrings {
	title: string;
	currentLabel: string;
	previousLabel: string;
	suffix: string;
}

export const defaultMetricComparisonStrings: MetricComparisonStrings = {
	title: 'Comparison',
	currentLabel: 'This period',
	previousLabel: 'Previous period',
	suffix: 'vs previous',
};

export interface MetricComparisonProps {
	current: MetricData;
	previous: MetricData;
	title?: string;
	currentPeriod?: string;
	previousPeriod?: string;
	className?: string;
	strings?: Partial<MetricComparisonStrings>;
}

function toNumber(value: MetricData['value']): number | null {
	if (value === null || value === undefined) return null;
	if (typeof value === 'number') return value;
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
}

export function MetricComparison({
	current,
	previous,
	title,
	currentPeriod,
	previousPeriod,
	className,
	strings: stringsProp,
}: MetricComparisonProps) {
	const strings = useStrings(defaultMetricComparisonStrings, {
		...(title ? { title } : {}),
		...stringsProp,
	});

	const currentNum = toNumber(current.value);
	const previousNum = toNumber(previous.value);
	const canCompute = currentNum !== null && previousNum !== null;
	const delta = canCompute ? (currentNum as number) - (previousNum as number) : 0;
	const deltaPct = canCompute && (previousNum as number) !== 0
		? Math.round((delta / (previousNum as number)) * 100)
		: 0;
	const isUp = delta > 0;
	const isFlat = delta === 0;
	const Arrow = isFlat ? Equal : isUp ? ArrowUp : ArrowDown;

	const tone = isFlat
		? { box: 'bg-muted/40', chip: 'bg-card text-muted-foreground border border-border/60' }
		: isUp
			? { box: 'bg-success/10', chip: 'bg-success/15 text-success' }
			: { box: 'bg-destructive/10', chip: 'bg-destructive/15 text-destructive' };

	const formatDelta = (value: number) => {
		const abs = Math.abs(value);
		// reuse the formatter so currency/percent metrics render correctly
		return formatMetricValue({ ...current, value: abs });
	};

	return (
		<SmartCard title={strings.title} className={cn('metric-comparison--component', className)}>
			{!!(currentPeriod || previousPeriod) && (
				<div className="flex flex-wrap items-center gap-1.5">
					{!!currentPeriod && (
						<Text
							tag="span"
							size="xxs"
							weight="medium"
							className="rounded-full bg-muted px-2 py-0.5 uppercase tracking-wider text-muted-foreground"
						>
							{currentPeriod}
						</Text>
					)}
					{!!previousPeriod && (
						<Text
							tag="span"
							size="xxs"
							weight="medium"
							className="rounded-full bg-muted/40 px-2 py-0.5 uppercase tracking-wider text-muted-foreground/70"
						>
							{previousPeriod}
						</Text>
					)}
				</div>
			)}

			<div className="mt-3 grid items-stretch gap-2 grid-cols-1 sm:grid-cols-[1fr_auto_1fr]">
				<div className="rounded-lg border border-border/60 bg-card px-3 py-2.5">
					<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wider">
						{strings.currentLabel}
					</Text>
					<Heading tag="h5" className="text-xl tabular-nums tracking-tight border-none pb-0">
						{formatMetricValue(current)}
					</Heading>
				</div>
				<div className="flex items-center justify-center text-muted-foreground/60">
					<ArrowRight className="hidden size-4 sm:block" aria-hidden="true" />
					<ArrowDown className="size-4 sm:hidden" aria-hidden="true" />
				</div>
				<div className="rounded-lg bg-muted/40 px-3 py-2.5">
					<Text size="xxs" weight="medium" className="uppercase tracking-wider text-muted-foreground/70">
						{strings.previousLabel}
					</Text>
					<Heading tag="h5" className="text-xl tabular-nums tracking-tight border-none pb-0 text-muted-foreground">
						{formatMetricValue(previous)}
					</Heading>
				</div>
			</div>

			{!!canCompute && (
				<div className={cn('mt-3 flex flex-wrap items-center gap-2 rounded-lg px-3 py-2', tone.box)}>
					<div className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5', tone.chip)}>
						<Arrow className="size-3" strokeWidth={2.5} aria-hidden="true" />
						<Text tag="span" size="xs" weight="semibold" className="tabular-nums">
							{isUp ? '+' : isFlat ? '' : '−'}{formatDelta(delta)}
						</Text>
					</div>
					<Text size="xs" type="secondary" className="tabular-nums">
						{isUp ? '+' : isFlat ? '' : '−'}{Math.abs(deltaPct)}% {strings.suffix}
					</Text>
				</div>
			)}
		</SmartCard>
	);
}

MetricComparison.displayName = 'MetricComparison';
