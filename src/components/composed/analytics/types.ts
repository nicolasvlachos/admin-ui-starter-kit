/**
 * Unified analytics types — the single source of truth for every
 * metric / stat / KPI surface in the library. All analytics components
 * consume the same `MetricData` shape so a single dataset can drive a hero
 * card, a metric bar, a grid, or a comparison view without re-mapping.
 */
import type { LucideIcon } from 'lucide-react';

/** Format hint for a metric value. The Metric component formats accordingly. */
export type MetricValueType = 'number' | 'currency' | 'percentage' | 'duration' | 'text';

/** Direction of a change vs the comparison baseline. */
export type MetricDirection = 'up' | 'down' | 'neutral';

/**
 * Tone for direction colouring. Decouples direction from semantic colour —
 * for some metrics "down" is good (e.g. churn), so consumers can override.
 */
export type MetricTrend = 'positive' | 'negative' | 'neutral';

/** Colour scheme used by Metric variants that support tinting. */
export type MetricColorScheme =
	| 'default'
	| 'primary'
	| 'success'
	| 'warning'
	| 'danger'
	| 'info';

/** Visual layout variant for the canonical `Metric` component. */
export type MetricVariant =
	/** Default tile — label, value, optional sparkline / trend chip / footer. */
	| 'default'
	/** Wrapped in a SmartCard (with shadow, padding, optional tooltip). */
	| 'card'
	/** Single-row icon + label + value + change chip. Compact list/sidebar use. */
	| 'compact'
	/** Inline `Label: value ↑12%` chip. Pure inline copy. */
	| 'minimal'
	/** Border + soft tint based on `colorScheme`. */
	| 'bordered'
	/** Dark surface card with bottom-aligned area sparkline. Hero-row variant. */
	| 'accent'
	/** Tinted card with stepped progress bar (`progress` prop drives fill). */
	| 'colored';

/** Canonical sizing scale used across atoms and molecules. */
export type MetricSize = 'sm' | 'md' | 'lg';

/** Trend chip rendering style. */
export type MetricTrendVariant = 'default' | 'badge' | 'compact' | 'inline';

/** Period strip controller (`MetricBar` selector + `onPeriodChange`). */
export interface MetricPeriod {
	label: string;
	value: string;
}

/** Delta vs comparison period. `value` is plain text — formatting is consumer-side. */
export interface MetricChange {
	value: number | string;
	direction: MetricDirection;
	label?: string;
}

/**
 * Shared metric data shape. `id` is required for stable list keys; `value` accepts
 * `null` to render the empty placeholder; `valueType` tells the component how to
 * format numeric values (currency, percentage, duration, …).
 */
export interface MetricData {
	id: string;
	label: string;
	value: number | string | null;
	valueType?: MetricValueType;
	currency?: string;
	change?: MetricChange;
	sparkline?: readonly number[];
	icon?: LucideIcon;
	tooltip?: string;
	subtitle?: string;
	footer?: string;
	trend?: MetricTrend;
	href?: string;
	onClick?: () => void;
}

/** Time-series datapoint used by the gradient/area chart variants. */
export interface MetricDataPoint {
	label: string;
	value: number;
}
