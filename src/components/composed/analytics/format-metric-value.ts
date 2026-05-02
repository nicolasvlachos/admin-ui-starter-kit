/**
 * formatMetricValue — single canonical formatter for every metric surface.
 *
 * Keeps formatting logic out of the layout components so the same dataset
 * renders identically regardless of which `Metric*` variant displays it.
 */
import {
	EMPTY,
	formatCurrency,
	formatDuration,
	formatNumber,
	formatPercentage,
} from '@/lib/format';
import type { MetricData } from './types';

export function formatMetricValue(data: MetricData): string {
	if (data.value === null || data.value === undefined) return EMPTY;

	const value = data.value;
	const numeric = typeof value === 'number' ? value : null;

	switch (data.valueType) {
		case 'currency':
			return numeric !== null
				? formatCurrency(numeric, { currency: data.currency })
				: String(value);
		case 'percentage':
			return numeric !== null ? formatPercentage(numeric) : String(value);
		case 'duration':
			return numeric !== null ? formatDuration(numeric) : String(value);
		case 'number':
			return numeric !== null ? formatNumber(numeric) : String(value);
		case 'text':
		default:
			return String(value);
	}
}

/**
 * Resolve the effective `MetricTrend` for a metric — explicit `trend` wins,
 * otherwise we infer from `change.direction` (`up` → positive, `down` →
 * negative, `neutral`/missing → neutral).
 */
export function resolveTrend(data: MetricData): 'positive' | 'negative' | 'neutral' {
	if (data.trend) return data.trend;
	if (data.change?.direction === 'up') return 'positive';
	if (data.change?.direction === 'down') return 'negative';
	return 'neutral';
}
