/**
 * MetricGradient — vivid full-bleed gradient hero card with embedded area
 * chart. Used at the top of marketing dashboards or analytics overview
 * pages where a single metric earns the most visual weight.
 *
 * Themes (`green` / `purple` / `warm` / `ocean`) drive the gradient palette;
 * the data prop accepts a `readonly MetricDataPoint[]` so consumers can pass
 * named time-series points. Renders the active dot in white and the area
 * fill in a soft white-on-tone gradient for legibility.
 */
import { useId } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Heading, Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { MetricTrendChip } from '../atoms/metric-trend-chip';
import type { MetricChange, MetricDataPoint } from '../types';

export type MetricGradientTheme = 'green' | 'purple' | 'warm' | 'ocean';

export interface MetricGradientProps {
	title: string;
	value?: string;
	change?: MetricChange;
	data: readonly MetricDataPoint[];
	theme?: MetricGradientTheme;
	subtitle?: string;
	className?: string;
}

const THEME_BG: Record<MetricGradientTheme, string> = {
	green: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800',
	purple: 'bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800',
	warm: 'bg-gradient-to-br from-orange-500 via-rose-600 to-pink-700',
	ocean: 'bg-gradient-to-br from-sky-600 via-cyan-700 to-blue-800',
};

interface ChartTooltipPayload {
	value: number;
	name: string;
	color?: string;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: ChartTooltipPayload[]; label?: string }) {
	if (!active || !payload?.length) return null;
	return (
		<div className={cn('metric-gradient--component', 'rounded-lg bg-foreground/95 px-3 py-2 shadow-lg backdrop-blur-sm')}>
			{!!label && <Text size="xxs" className="text-background/60 mb-1">{label}</Text>}
			{payload.map((entry, idx) => (
				<div key={`tt-${idx}`} className="flex items-center gap-2">
					<div className="size-2 rounded-full" style={{ backgroundColor: entry.color ?? '#fff' }} aria-hidden="true" />
					<Text size="xs" weight="semibold" className="text-background tabular-nums">
						{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
					</Text>
				</div>
			))}
		</div>
	);
}

export function MetricGradient({
	title,
	value,
	change,
	data,
	theme = 'green',
	subtitle,
	className,
}: MetricGradientProps) {
	const id = useId();
	const gradientId = `metric-grad-${id.replaceAll(':', '')}`;

	return (
		<div
			className={cn(
				'relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ring-1 ring-white/10',
				THEME_BG[theme],
				className,
			)}
		>
			<div className="absolute -right-12 -top-12 size-44 rounded-full bg-white/[0.08] blur-2xl" aria-hidden="true" />
			<div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-white/[0.06] blur-xl" aria-hidden="true" />

			<div className="relative flex items-start justify-between gap-3">
				<div className="min-w-0">
					<Text size="xs" weight="medium" className="uppercase tracking-wider text-white/70">{title}</Text>
					{!!value && (
						<Heading
							tag="h3"
							className="mt-1 text-3xl font-bold tabular-nums tracking-tight border-none pb-0 text-white leading-none"
						>
							{value}
						</Heading>
					)}
					{!!subtitle && <Text size="xs" className="mt-1 text-white/70">{subtitle}</Text>}
				</div>
				{!!change && (
					<MetricTrendChip
						change={change}
						trend={change.direction === 'up' ? 'positive' : change.direction === 'down' ? 'negative' : 'neutral'}
						size="sm"
						variant="badge"
						className="shrink-0 !bg-white/20 !text-white"
					/>
				)}
			</div>

			<div className="relative -mx-1 mt-3 h-24">
				<ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 1 }}>
					<AreaChart data={data as MetricDataPoint[]} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
						<defs>
							<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="white" stopOpacity={0.3} />
								<stop offset="100%" stopColor="white" stopOpacity={0} />
							</linearGradient>
						</defs>
						<Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.4)', strokeWidth: 1 }} />
						<Area
							type="monotone"
							dataKey="value"
							stroke="rgba(255,255,255,0.7)"
							strokeWidth={2}
							fill={`url(#${gradientId})`}
							dot={false}
							activeDot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: 'rgba(255,255,255,0.7)' }}
							isAnimationActive
							animationDuration={800}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

MetricGradient.displayName = 'MetricGradient';
