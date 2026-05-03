/**
 * MetricTrendChip — compact ↑/↓/→ delta indicator.
 *
 * Decouples direction (up/down/neutral) from tone (positive/negative/neutral)
 * so consumers can flip the colour for inverted metrics like churn or refund
 * rate. Four variants:
 *   - `default`   — coloured icon + value, no chrome
 *   - `badge`     — pill with tinted bg + arrow icon
 *   - `compact`   — coloured arrow + value, no spacing
 *   - `inline`    — value only with sign prefix, no icon
 */
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import type { MetricChange, MetricSize, MetricTrend, MetricTrendVariant } from '../types';

interface MetricTrendChipProps {
	change: MetricChange;
	trend?: MetricTrend;
	size?: MetricSize;
	variant?: MetricTrendVariant;
	className?: string;
}

const TONE_CLASSES: Record<MetricTrend, { text: string; badge: string; arrow: string }> = {
	positive: { text: 'text-success', badge: 'bg-success/10 text-success', arrow: 'text-success' },
	negative: { text: 'text-destructive', badge: 'bg-destructive/10 text-destructive', arrow: 'text-destructive' },
	neutral: { text: 'text-muted-foreground', badge: 'bg-muted text-muted-foreground', arrow: 'text-muted-foreground' },
};

const ICON_SIZE: Record<MetricSize, string> = {
	sm: 'size-3',
	md: 'size-3.5',
	lg: 'size-4',
};

const TEXT_SIZE: Record<MetricSize, 'xxs' | 'xs' | 'sm'> = {
	sm: 'xxs',
	md: 'xs',
	lg: 'sm',
};

const BADGE_PADDING: Record<MetricSize, string> = {
	sm: 'px-1.5 py-0.5',
	md: 'px-2 py-0.5',
	lg: 'px-2.5 py-1',
};

function resolveTone(trend: MetricTrend | undefined, direction: MetricChange['direction']): MetricTrend {
	if (trend) return trend;
	if (direction === 'up') return 'positive';
	if (direction === 'down') return 'negative';
	return 'neutral';
}

export function MetricTrendChip({
	change,
	trend,
	size = 'md',
	variant = 'default',
	className,
}: MetricTrendChipProps) {
	const tone = resolveTone(trend, change.direction);
	const Icon = change.direction === 'up' ? ArrowUp : change.direction === 'down' ? ArrowDown : Minus;
	const palette = TONE_CLASSES[tone];
	const valueText = String(change.value);
	const sign = change.direction === 'up' ? '+' : change.direction === 'down' ? '' : '';

	if (variant === 'inline') {
		return (
			<Text tag="span" size={TEXT_SIZE[size]} weight="medium" className={cn('metric-trend-chip--component', palette.text, 'tabular-nums', className)}>
				{sign}{valueText}
			</Text>
		);
	}

	if (variant === 'compact') {
		return (
			<span className={cn('inline-flex items-center gap-0.5', palette.text, className)}>
				<Icon className={ICON_SIZE[size]} strokeWidth={2.5} aria-hidden="true" />
				<Text tag="span" size={TEXT_SIZE[size]} weight="semibold" className="tabular-nums">
					{valueText}
				</Text>
			</span>
		);
	}

	if (variant === 'badge') {
		return (
			<span className={cn('inline-flex items-center gap-1 rounded-full font-medium tabular-nums', palette.badge, BADGE_PADDING[size], className)}>
				<Icon className={ICON_SIZE[size]} strokeWidth={2.5} aria-hidden="true" />
				<Text tag="span" size={TEXT_SIZE[size]} weight="semibold" className="tabular-nums">
					{valueText}
				</Text>
				{!!change.label && (
					<Text tag="span" size={TEXT_SIZE[size]} className="opacity-70">{change.label}</Text>
				)}
			</span>
		);
	}

	// default
	return (
		<span className={cn('inline-flex items-center gap-1', palette.text, className)}>
			<Icon className={ICON_SIZE[size]} strokeWidth={2.5} aria-hidden="true" />
			<Text tag="span" size={TEXT_SIZE[size]} weight="semibold" className="tabular-nums">
				{valueText}
			</Text>
			{!!change.label && (
				<Text tag="span" size={TEXT_SIZE[size]} type="secondary">{change.label}</Text>
			)}
		</span>
	);
}

MetricTrendChip.displayName = 'MetricTrendChip';
