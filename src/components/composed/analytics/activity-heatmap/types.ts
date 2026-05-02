import type { AnalyticsStrings } from '../analytics.strings';

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export interface ActivityHeatmapDay {
	date: string;
	level: ActivityLevel;
}

export type ActivityHeatmapStrings = Pick<
	AnalyticsStrings,
	'heatmapDayLabels' | 'heatmapMonthNames' | 'heatmapLegendLess' | 'heatmapLegendMore'
>;

export interface ActivityHeatmapProps {
	title: string;
	description?: string;
	data: readonly ActivityHeatmapDay[];
	className?: string;
	/** Override day labels, month names, and legend copy for i18n. */
	strings?: Partial<ActivityHeatmapStrings>;
}
