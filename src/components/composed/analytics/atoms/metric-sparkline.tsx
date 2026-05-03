/**
 * MetricSparkline — recharts-backed mini area chart used inside Metric
 * variants. Auto-stretches to its container; pass a fixed height (e.g.
 * `h-8 w-full`) on the wrapper. `trend` colours the stroke + gradient
 * (positive/negative/neutral); `color` overrides with any CSS colour
 * (semantic var, hex, rgb).
 */
import { useId, useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

import type { MetricTrend } from '../types';

interface MetricSparklineProps {
	data: readonly number[];
	trend?: MetricTrend;
	color?: string;
	className?: string;
	animated?: boolean;
	'aria-label'?: string;
}

const TREND_COLORS: Record<MetricTrend, string> = {
	positive: 'var(--success)',
	negative: 'var(--destructive)',
	neutral: 'var(--muted-foreground)',
};

export function MetricSparkline({
	data,
	trend = 'neutral',
	color,
	className,
	animated = true,
	'aria-label': ariaLabel = 'Trend sparkline',
}: MetricSparklineProps) {
	const id = useId();
	const gradientId = useMemo(() => `metric-spark-${id.replaceAll(':', '')}`, [id]);
	const stroke = color ?? TREND_COLORS[trend];

	const chartData = useMemo(() => {
		if (!Array.isArray(data) || data.length === 0) return [];
		return data.map((value, i) => ({ i, v: value }));
	}, [data]);

	if (chartData.length === 0) {
		return <div className={cn('metric-sparkline--component', 'w-full', className)} aria-hidden="true" />;
	}

	return (
		<div className={cn('w-full', className)} role="img" aria-label={ariaLabel}>
			<ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 1 }}>
				<AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
					<defs>
						<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={stroke} stopOpacity={0.25} />
							<stop offset="100%" stopColor={stroke} stopOpacity={0} />
						</linearGradient>
					</defs>
					<Area
						type="monotone"
						dataKey="v"
						stroke={stroke}
						strokeWidth={1.75}
						fill={`url(#${gradientId})`}
						dot={false}
						activeDot={false}
						isAnimationActive={animated}
						animationDuration={600}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}

MetricSparkline.displayName = 'MetricSparkline';
