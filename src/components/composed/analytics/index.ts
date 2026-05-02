/**
 * Analytics — unified module for every metric/stat/KPI surface in the
 * library. One data shape (`MetricData`), one trend chip, one sparkline,
 * eight composable surfaces:
 *
 *   - Metric              — single metric (7 visual variants)
 *   - MetricBar           — horizontal strip (default + gradient frame)
 *   - MetricGrid          — responsive grid of Metric cells
 *   - MetricComparison    — period-over-period delta box
 *   - MetricMicroGrid     — 6-cell dense overview with mini visualizations
 *   - MetricGradient      — vivid hero card with embedded area chart
 *   - ActivityHeatmap     — daily-activity calendar grid
 *
 * Atoms used internally:
 *   - MetricTrendChip     — ↑/↓/→ delta indicator (4 variants)
 *   - MetricSparkline     — recharts area mini chart
 *   - MetricSkeleton      — loading placeholder per variant
 */

// ── shared types ────────────────────────────────────────────────────────
export type {
	MetricChange,
	MetricColorScheme,
	MetricData,
	MetricDataPoint,
	MetricDirection,
	MetricPeriod,
	MetricSize,
	MetricTrend,
	MetricTrendVariant,
	MetricValueType,
	MetricVariant,
} from './types';

// ── shared strings ──────────────────────────────────────────────────────
export {
	defaultAnalyticsStrings,
	type AnalyticsStrings,
} from './analytics.strings';

// ── shared formatters / helpers ─────────────────────────────────────────
export { formatMetricValue, resolveTrend } from './format-metric-value';

// ── atoms ───────────────────────────────────────────────────────────────
export { MetricTrendChip } from './atoms/metric-trend-chip';
export { MetricSparkline } from './atoms/metric-sparkline';
export { MetricSkeleton } from './atoms/metric-skeleton';

// ── molecules / organisms ───────────────────────────────────────────────
export { Metric, type MetricProps } from './metric';
export { MetricBar, type MetricBarProps, type MetricBarVariant } from './metric-bar';
export { MetricGrid, type MetricGridProps } from './metric-grid';
export {
	MetricComparison,
	defaultMetricComparisonStrings,
	type MetricComparisonProps,
	type MetricComparisonStrings,
} from './metric-comparison';
export {
	MetricMicroGrid,
	type MetricMicroGridProps,
	type MicroChartKind,
	type MicroMetricCell,
} from './metric-micro-grid';
export {
	MetricGradient,
	type MetricGradientProps,
	type MetricGradientTheme,
} from './metric-gradient';
export {
	ActivityHeatmap,
	type ActivityHeatmapDay,
	type ActivityHeatmapProps,
	type ActivityHeatmapStrings,
	type ActivityLevel,
} from './activity-heatmap';
