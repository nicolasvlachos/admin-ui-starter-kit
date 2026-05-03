/**
 * MetricGrid — responsive grid of `Metric` cells. The grid is the workhorse
 * for KPI rows on dashboards: pass a list, choose a variant, and the
 * component handles layout / column counts / spacing.
 *
 * Variants are forwarded to `Metric` so a single grid can show either
 * standalone cards, bordered tints, or compact list rows.
 *
 * Column counts default to `auto` — the grid breaks at sm/lg/xl based on
 * the cell count. Override with `columns` to pin a specific layout.
 */
import { cn } from '@/lib/utils';

import { Metric } from '../metric/metric';
import type {
	MetricColorScheme,
	MetricData,
	MetricSize,
	MetricVariant,
} from '../types';

export interface MetricGridProps {
	metrics: MetricData[];
	/** Cell variant — restricted to grid-friendly layouts. */
	variant?: Extract<MetricVariant, 'card' | 'compact' | 'bordered' | 'accent' | 'colored'>;
	size?: MetricSize;
	colorScheme?: MetricColorScheme;
	/** Force a fixed column count. `auto` picks based on cell count. */
	columns?: 'auto' | 1 | 2 | 3 | 4 | 6;
	gap?: 'sm' | 'md' | 'lg';
	showSparklines?: boolean;
	showChanges?: boolean;
	showIcons?: boolean;
	loading?: boolean;
	className?: string;
}

const GAP_CLASS: Record<NonNullable<MetricGridProps['gap']>, string> = {
	sm: 'gap-2',
	md: 'gap-3',
	lg: 'gap-4',
};

function autoColumnsFor(count: number): string {
	if (count <= 1) return 'grid-cols-1';
	if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
	if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
	if (count === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
	if (count === 5 || count === 6) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';
	return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
}

const COLUMN_CLASS: Record<Exclude<NonNullable<MetricGridProps['columns']>, 'auto'>, string> = {
	1: 'grid-cols-1',
	2: 'grid-cols-1 sm:grid-cols-2',
	3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
	4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
	6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
};

export function MetricGrid({
	metrics,
	variant = 'card',
	size = 'md',
	colorScheme = 'default',
	columns = 'auto',
	gap = 'md',
	showSparklines = true,
	showChanges = true,
	showIcons = true,
	loading = false,
	className,
}: MetricGridProps) {
	const columnsClass = columns === 'auto' ? autoColumnsFor(metrics.length) : COLUMN_CLASS[columns];

	return (
		<div className={cn('metric-grid--component', 'grid', columnsClass, GAP_CLASS[gap], className)}>
			{metrics.map((metric) => (
				<Metric
					key={metric.id}
					data={metric}
					variant={variant}
					size={size}
					colorScheme={colorScheme}
					showSparkline={showSparklines}
					showChange={showChanges}
					showIcon={showIcons}
					loading={loading}
				/>
			))}
		</div>
	);
}

MetricGrid.displayName = 'MetricGrid';
