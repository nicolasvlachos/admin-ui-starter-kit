/**
 * Metric — canonical single-metric surface. One component, seven variants:
 *
 *   default   — flat tile (label / value / trend / sparkline) for use inside
 *               MetricBar or other composed surfaces.
 *   card      — wrapped in SmartCard with shadow, padding, optional tooltip.
 *               Use as a standalone hero in a row of three.
 *   compact   — single-row icon + label + value + chip. Sidebar / list use.
 *   minimal   — inline `Label: value ↑12%` chip for in-flow copy.
 *   bordered  — soft tinted border keyed off `colorScheme`.
 *   accent    — dark surface card with bottom-aligned area sparkline.
 *   colored   — segmented progress bar (driven by `progress` prop).
 *
 * All variants share the same `MetricData` shape; only the layout changes.
 */
import { useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';

import { SmartCard } from '@/components/base/cards';
import { Heading, Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { defaultAnalyticsStrings } from '../analytics.strings';
import { MetricSkeleton } from '../atoms/metric-skeleton';
import { MetricSparkline } from '../atoms/metric-sparkline';
import { MetricTrendChip } from '../atoms/metric-trend-chip';
import { formatMetricValue, resolveTrend } from '../format-metric-value';
import type {
	MetricColorScheme,
	MetricData,
	MetricSize,
	MetricVariant,
} from '../types';

export interface MetricProps {
	data: MetricData;
	variant?: MetricVariant;
	size?: MetricSize;
	colorScheme?: MetricColorScheme;
	showSparkline?: boolean;
	showChange?: boolean;
	showIcon?: boolean;
	loading?: boolean;
	error?: boolean;
	errorLabel?: string;
	/** `colored` variant only — 0-100 fill percentage. */
	progress?: number;
	className?: string;
	'aria-label'?: string;
}

// ── colour-scheme palettes (shared between bordered + colored variants) ──
const SCHEME_TINT: Record<MetricColorScheme, { border: string; bg: string; bar: string; dot: string; ring: string }> = {
	default: { border: 'border-border', bg: 'bg-card', bar: 'bg-foreground', dot: 'bg-foreground', ring: 'ring-border' },
	primary: { border: 'border-primary/25', bg: 'bg-primary/5', bar: 'bg-primary', dot: 'bg-primary', ring: 'ring-primary/20' },
	success: { border: 'border-success/30', bg: 'bg-success/5', bar: 'bg-success', dot: 'bg-success', ring: 'ring-success/20' },
	warning: { border: 'border-warning/40', bg: 'bg-warning/10', bar: 'bg-warning', dot: 'bg-warning', ring: 'ring-warning/30' },
	danger: { border: 'border-destructive/30', bg: 'bg-destructive/5', bar: 'bg-destructive', dot: 'bg-destructive', ring: 'ring-destructive/20' },
	info: { border: 'border-info/30', bg: 'bg-info/5', bar: 'bg-info', dot: 'bg-info', ring: 'ring-info/20' },
};

/** Compact value sizes for in-grid / in-bar usage where horizontal space is tight. */
const VALUE_FONT_SIZE: Record<MetricSize, string> = {
	sm: 'text-sm',
	md: 'text-lg',
	lg: 'text-xl',
};

/** Hero value sizes for standalone card / bordered / accent variants. */
const VALUE_FONT_SIZE_HERO: Record<MetricSize, string> = {
	sm: 'text-xl',
	md: 'text-3xl',
	lg: 'text-4xl',
};

const SPARKLINE_HEIGHT: Record<MetricSize, string> = {
	sm: 'h-6',
	md: 'h-8',
	lg: 'h-10',
};

const SEGMENT_COUNT = 16;

export function Metric(props: MetricProps) {
	const {
		data,
		variant = 'default',
		size = 'md',
		colorScheme = 'default',
		showSparkline = true,
		showChange = true,
		showIcon = true,
		loading = false,
		error = false,
		errorLabel,
		progress = 0,
		className,
		'aria-label': ariaLabel,
	} = props;

	const formattedValue = useMemo(() => formatMetricValue(data), [data]);
	const trend = useMemo(() => resolveTrend(data), [data]);

	if (loading) return <MetricSkeleton variant={variant} size={size} className={cn('metric--component', className)} />;
	if (error) {
		return (
			<div className={cn('flex items-center justify-center rounded-lg border border-border bg-card p-4 text-muted-foreground', className)}>
				<Text>{errorLabel ?? defaultAnalyticsStrings.metricErrorLabel}</Text>
			</div>
		);
	}

	const sharedProps = {
		data,
		formattedValue,
		trend,
		size,
		showSparkline,
		showChange,
		showIcon,
		colorScheme,
		ariaLabel: ariaLabel ?? data.label,
		className,
	};

	switch (variant) {
		case 'card':
			return <MetricCard {...sharedProps} />;
		case 'compact':
			return <MetricCompact {...sharedProps} />;
		case 'minimal':
			return <MetricMinimal {...sharedProps} />;
		case 'bordered':
			return <MetricBordered {...sharedProps} />;
		case 'accent':
			return <MetricAccent {...sharedProps} />;
		case 'colored':
			return <MetricColored {...sharedProps} progress={progress} />;
		default:
			return <MetricDefault {...sharedProps} />;
	}
}

Metric.displayName = 'Metric';

// ─────────────────────────────────────────────────────────────────────────
// Internal sub-components — kept private. Each handles one variant only.
// ─────────────────────────────────────────────────────────────────────────

interface SubProps {
	data: MetricData;
	formattedValue: string;
	trend: 'positive' | 'negative' | 'neutral';
	size: MetricSize;
	showSparkline: boolean;
	showChange: boolean;
	showIcon: boolean;
	colorScheme: MetricColorScheme;
	ariaLabel: string;
	className?: string;
}

function MetricDefault({ data, formattedValue, trend, size, showSparkline, showChange, showIcon, ariaLabel, className }: SubProps) {
	const Icon = data.icon;
	return (
		<div className={cn('flex min-w-0 flex-col gap-1', className)} aria-label={ariaLabel}>
			<div className="flex items-center gap-1.5 min-w-0 text-muted-foreground">
				{!!showIcon && !!Icon && <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
				<Text size="xs" type="secondary" weight="medium" className="truncate">{data.label}</Text>
			</div>
			<Heading
				tag="h5"
				className={cn(
					'font-bold tabular-nums tracking-tight border-none pb-0 leading-tight truncate',
					VALUE_FONT_SIZE[size],
				)}
				title={formattedValue}
			>
				{formattedValue}
			</Heading>
			{!!showChange && !!data.change && (
				<div className="min-w-0">
					<MetricTrendChip change={data.change} trend={data.trend} size={size} variant="compact" />
				</div>
			)}
			{!!data.subtitle && <Text size="xs" type="secondary" className="truncate">{data.subtitle}</Text>}
			{!!showSparkline && !!data.sparkline?.length && (
				<MetricSparkline data={data.sparkline} trend={trend} className={cn('mt-auto', SPARKLINE_HEIGHT[size])} />
			)}
			{!!data.footer && <Text size="xxs" type="discrete" className="truncate">{data.footer}</Text>}
		</div>
	);
}

function MetricCard({ data, formattedValue, trend, size, showSparkline, showChange, showIcon, ariaLabel, className }: SubProps) {
	const Icon = data.icon;
	const isInteractive = Boolean(data.href || data.onClick);
	const padding: 'sm' | 'base' | 'lg' = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'base';

	const card = (
		<SmartCard
			title={data.label}
			icon={!!showIcon && !!Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
			tooltip={data.tooltip}
			padding={padding}
			className={cn(isInteractive && 'cursor-pointer transition-shadow hover:shadow-md', className)}
			aria-label={ariaLabel}
		>
			<div className="flex items-baseline justify-between gap-3">
				<Heading
					tag={size === 'sm' ? 'h5' : size === 'lg' ? 'h3' : 'h4'}
					className={cn('font-bold tabular-nums tracking-tight border-none pb-0 leading-none', VALUE_FONT_SIZE_HERO[size])}
				>
					{formattedValue}
				</Heading>
				{!!showChange && !!data.change && (
					<MetricTrendChip change={data.change} trend={data.trend} size={size} variant="badge" />
				)}
			</div>
			{!!data.subtitle && <Text type="secondary" className="mt-2">{data.subtitle}</Text>}
			{!!showSparkline && !!data.sparkline?.length && (
				<MetricSparkline
					data={data.sparkline}
					trend={trend}
					className={cn('mt-3', size === 'lg' ? 'h-12' : 'h-10')}
				/>
			)}
			{!!data.footer && <Text size="xs" type="secondary" className="mt-2">{data.footer}</Text>}
		</SmartCard>
	);

	if (isInteractive && data.onClick) {
		return (
			<div
				role="button"
				tabIndex={0}
				onClick={data.onClick}
				onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && data.onClick?.()}
				className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
			>
				{card}
			</div>
		);
	}
	return card;
}

function MetricCompact({ data, formattedValue, size, showChange, showIcon, ariaLabel, className }: SubProps) {
	const Icon = data.icon;
	return (
		<div className={cn('flex items-center gap-3', className)} aria-label={ariaLabel}>
			{!!showIcon && !!Icon && (
				<span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
					<Icon className="size-4" aria-hidden="true" />
				</span>
			)}
			<div className="min-w-0 flex-1">
				<Text size="xs" type="secondary" className="truncate">{data.label}</Text>
				<Text tag="span" size={size === 'sm' ? 'sm' : 'lg'} weight="bold" className="block truncate tabular-nums">
					{formattedValue}
				</Text>
			</div>
			{!!showChange && !!data.change && (
				<MetricTrendChip change={data.change} trend={data.trend} size={size} variant="badge" className="shrink-0" />
			)}
		</div>
	);
}

function MetricMinimal({ data, formattedValue, size, showChange, ariaLabel, className }: SubProps) {
	return (
		<span className={cn('inline-flex items-baseline gap-2', className)} aria-label={ariaLabel}>
			<Text tag="span" size={size === 'lg' ? 'sm' : 'xs'} type="secondary">{data.label}:</Text>
			<Text tag="span" size={size === 'lg' ? 'sm' : 'xs'} weight="semibold" className="tabular-nums">{formattedValue}</Text>
			{!!showChange && !!data.change && (
				<MetricTrendChip change={data.change} trend={data.trend} size="sm" variant="inline" />
			)}
		</span>
	);
}

function MetricBordered({ data, formattedValue, trend, size, showSparkline, showChange, showIcon, colorScheme, ariaLabel, className }: SubProps) {
	const Icon = data.icon;
	const tint = SCHEME_TINT[colorScheme];
	return (
		<div
			className={cn('flex flex-col gap-3 rounded-xl border p-4 shadow-sm', tint.border, tint.bg, className)}
			aria-label={ariaLabel}
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2 text-muted-foreground">
					{!!showIcon && !!Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
					<Text size="xs" type="secondary" weight="medium">{data.label}</Text>
				</div>
				{!!showChange && !!data.change && (
					<MetricTrendChip change={data.change} trend={data.trend} size={size} variant="badge" />
				)}
			</div>
			<Heading
				tag={size === 'lg' ? 'h3' : 'h4'}
				className={cn('font-bold tabular-nums tracking-tight border-none pb-0 leading-none', VALUE_FONT_SIZE_HERO[size])}
			>
				{formattedValue}
			</Heading>
			{!!data.subtitle && <Text size="xs" type="secondary">{data.subtitle}</Text>}
			{!!showSparkline && !!data.sparkline?.length && (
				<MetricSparkline data={data.sparkline} trend={trend} className={SPARKLINE_HEIGHT[size]} />
			)}
			{!!data.footer && <Text size="xxs" type="discrete">{data.footer}</Text>}
		</div>
	);
}

function MetricAccent({ data, formattedValue, trend, size, showSparkline, showChange, ariaLabel, className }: SubProps) {
	const Icon = data.icon;
	return (
		<div
			className={cn(
				'dark relative flex flex-col rounded-2xl bg-card text-card-foreground shadow-lg ring-1 ring-border overflow-hidden',
				className,
			)}
			aria-label={ariaLabel}
		>
			<div className="flex flex-col gap-2 p-5">
				<div className="flex items-center justify-between gap-3">
					<Text size="xs" type="secondary" weight="medium" className="uppercase tracking-wider">
						{data.label}
					</Text>
					{!!Icon && (
						<span className="inline-flex size-7 items-center justify-center rounded-lg bg-foreground/[0.08]">
							<Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
						</span>
					)}
				</div>
				<div className="flex items-baseline gap-2.5">
					<Heading
						tag="h3"
						className={cn('font-bold tabular-nums tracking-tight border-none pb-0 leading-none text-foreground', VALUE_FONT_SIZE_HERO[size])}
					>
						{formattedValue}
					</Heading>
					{!!showChange && !!data.change && (
						<MetricTrendChip change={data.change} trend={data.trend} size={size} variant="compact" />
					)}
				</div>
				{!!data.subtitle && <Text size="xs" type="secondary">{data.subtitle}</Text>}
			</div>
			{!!showSparkline && !!data.sparkline?.length && (
				<MetricSparkline data={data.sparkline} trend={trend} className="h-12 w-full" />
			)}
		</div>
	);
}

function MetricColored({ data, formattedValue, size, showChange, colorScheme, ariaLabel, className, progress = 0 }: SubProps & { progress?: number }) {
	const tint = SCHEME_TINT[colorScheme === 'default' ? 'primary' : colorScheme];
	const filledCount = Math.round((Math.min(Math.max(progress, 0), 100) / 100) * SEGMENT_COUNT);
	return (
		<div
			className={cn('rounded-xl bg-card p-5 shadow-sm border border-border/50', className)}
			aria-label={ariaLabel}
		>
			<div className="flex items-center gap-2">
				<Text size="xs" type="secondary" weight="medium" className="truncate">{data.label}</Text>
				<span className={cn('size-1.5 rounded-full shrink-0', tint.dot)} aria-hidden="true" />
			</div>
			<div className="mt-2.5 flex items-baseline gap-2">
				<Heading
					tag="h3"
					className={cn('font-bold tabular-nums tracking-tight border-none pb-0 leading-none', VALUE_FONT_SIZE_HERO[size])}
				>
					{formattedValue}
				</Heading>
				{!!data.subtitle && <Text size="xs" type="secondary">{data.subtitle}</Text>}
			</div>
			<div className="mt-4 flex items-center gap-0.5" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
				{Array.from({ length: SEGMENT_COUNT }, (_, i) => (
					<div
						key={`seg-${i}`}
						className={cn('h-6 w-1.5 rounded-sm transition-colors', i < filledCount ? tint.bar : 'bg-muted')}
					/>
				))}
			</div>
			{!!showChange && !!data.change && (
				<div className="mt-3">
					<MetricTrendChip change={data.change} trend={data.trend} size={size} variant="default" />
				</div>
			)}
			{!!data.footer && (
				<div className="mt-2 inline-flex items-center gap-1 text-muted-foreground">
					<ArrowUpRight className="size-3" aria-hidden="true" />
					<Text size="xxs" type="secondary">{data.footer}</Text>
				</div>
			)}
		</div>
	);
}
