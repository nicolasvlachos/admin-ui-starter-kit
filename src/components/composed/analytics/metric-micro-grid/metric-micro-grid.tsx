/**
 * MetricMicroGrid — six-cell dense KPI overview where each cell pairs a
 * label/value with a different lightweight visualization (bars / line /
 * dots / progress / area / pie). Useful as a top-of-page summary widget
 * on a packed dashboard.
 *
 * Cells are positional: index 0 → bars, 1 → line, 2 → dots, 3 → progress,
 * 4 → area, 5 → pie. To pin a specific renderer, pass `chart` per cell.
 */
import { useId } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export type MicroChartKind = 'bars' | 'line' | 'dots' | 'progress' | 'area' | 'pie';

export interface MicroMetricCell {
	id?: string;
	label: string;
	value: string;
	data: readonly number[];
	chart?: MicroChartKind;
}

export interface MetricMicroGridProps {
	title?: string;
	cells: readonly MicroMetricCell[];
	className?: string;
}

const DEFAULT_ORDER: MicroChartKind[] = ['bars', 'line', 'dots', 'progress', 'area', 'pie'];

const CHART_COLORS: Record<MicroChartKind, string> = {
	bars: 'var(--primary)',
	line: 'var(--info)',
	dots: 'var(--warning)',
	progress: 'var(--success)',
	area: 'var(--primary)',
	pie: 'var(--success)',
};

const PIE_PALETTE = ['var(--success)', 'var(--info)', 'var(--warning)'];

function MicroBars({ data, color }: { data: readonly number[]; color: string }) {
	const max = Math.max(...data, 1);
	return (
		<div className="flex h-5 items-end gap-[2px]">
			{data.slice(0, 6).map((v, i) => (
				<div
					key={`bar-${i}`}
					className="flex-1 rounded-t-sm"
					style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.8 }}
				/>
			))}
		</div>
	);
}

function MicroLine({ data, color }: { data: readonly number[]; color: string }) {
	const max = Math.max(...data, 1);
	const min = Math.min(...data);
	const range = max - min || 1;
	const points = data.slice(0, 6);
	return (
		<svg viewBox="0 0 60 16" className="h-5 w-full" preserveAspectRatio="none">
			<polyline
				fill="none"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				points={points
					.map((v, i) => `${(i / Math.max(points.length - 1, 1)) * 60},${16 - ((v - min) / range) * 14}`)
					.join(' ')}
			/>
		</svg>
	);
}

function MicroDots({ data, color }: { data: readonly number[]; color: string }) {
	const max = Math.max(...data, 1);
	return (
		<div className="flex h-5 items-end justify-around">
			{data.slice(0, 5).map((v, i) => (
				<div
					key={`dot-${i}`}
					className="h-1.5 w-1.5 rounded-full"
					style={{ marginBottom: `${(v / max) * 12}px`, backgroundColor: color }}
				/>
			))}
		</div>
	);
}

function MicroProgress({ data, color }: { data: readonly number[]; color: string }) {
	const value = data[0] ?? 0;
	const max = data[1] ?? 100;
	const pct = Math.min((value / max) * 100, 100);
	return (
		<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
			<div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
		</div>
	);
}

function MicroAreaChart({ data, color }: { data: readonly number[]; color: string }) {
	const id = useId();
	const gradId = `micro-area-${id.replaceAll(':', '')}`;
	const chartData = data.map((v, i) => ({ i, v }));
	return (
		<div className="h-5 w-full">
			<ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 1 }}>
				<AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
					<defs>
						<linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={color} stopOpacity={0.3} />
							<stop offset="100%" stopColor={color} stopOpacity={0} />
						</linearGradient>
					</defs>
					<Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.25} fill={`url(#${gradId})`} />
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}

function MicroPie({ data }: { data: readonly number[] }) {
	const total = data.reduce((a, b) => a + b, 0) || 1;
	let cumAngle = 0;
	return (
		<svg viewBox="0 0 24 24" className="h-6 w-6">
			{data.slice(0, 3).map((v, i) => {
				const angle = (v / total) * 360;
				const startAngle = cumAngle;
				cumAngle += angle;
				const startRad = ((startAngle - 90) * Math.PI) / 180;
				const endRad = ((startAngle + angle - 90) * Math.PI) / 180;
				const largeArc = angle > 180 ? 1 : 0;
				const x1 = 12 + 10 * Math.cos(startRad);
				const y1 = 12 + 10 * Math.sin(startRad);
				const x2 = 12 + 10 * Math.cos(endRad);
				const y2 = 12 + 10 * Math.sin(endRad);
				return (
					<path
						key={`slice-${i}`}
						d={`M12,12 L${x1},${y1} A10,10 0 ${largeArc},1 ${x2},${y2} Z`}
						fill={PIE_PALETTE[i % PIE_PALETTE.length]}
					/>
				);
			})}
		</svg>
	);
}

function ChartFor({ kind, data }: { kind: MicroChartKind; data: readonly number[] }) {
	const color = CHART_COLORS[kind];
	if (kind === 'bars') return <MicroBars data={data} color={color} />;
	if (kind === 'line') return <MicroLine data={data} color={color} />;
	if (kind === 'dots') return <MicroDots data={data} color={color} />;
	if (kind === 'progress') return <MicroProgress data={data} color={color} />;
	if (kind === 'area') return <MicroAreaChart data={data} color={color} />;
	return <MicroPie data={data} />;
}

export function MetricMicroGrid({ title = 'Overview', cells, className }: MetricMicroGridProps) {
	return (
		<SmartCard title={title} className={className} padding="sm">
			<div className="grid grid-cols-3 grid-rows-2 -m-2">
				{cells.slice(0, 6).map((cell, i) => (
					<div
						key={cell.id ?? cell.label}
						className={cn(
							'flex flex-col gap-1.5 px-3 py-2.5',
							i % 3 !== 2 && 'border-r border-border/50',
							i < 3 && 'border-b border-border/50',
						)}
					>
						<Text size="xxs" type="secondary" className="truncate uppercase tracking-wider">
							{cell.label}
						</Text>
						<Text tag="span" weight="bold" className="tabular-nums truncate">
							{cell.value}
						</Text>
						<div className="mt-auto">
							<ChartFor kind={cell.chart ?? DEFAULT_ORDER[i]} data={cell.data} />
						</div>
					</div>
				))}
			</div>
		</SmartCard>
	);
}

MetricMicroGrid.displayName = 'MetricMicroGrid';
