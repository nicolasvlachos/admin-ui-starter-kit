/**
 * Shared default strings for `composed/analytics` components.
 *
 * Each component accepts a `strings` prop deep-merged over these defaults
 * so consumers override per-component without touching the rest. Day/month
 * labels live here too because they're localisable in the same way.
 */
export interface AnalyticsStrings {
    /** Fallback shown by `<Metric />` when `error` is true. */
    metricErrorLabel: string;
    /** Default title for `<MetricComparison />` when no `title` prop is passed. */
    comparisonTitle: string;
    /** Labels for the activity heatmap weekday rows (Mon–Sun, length 7). */
    heatmapDayLabels: readonly [string, string, string, string, string, string, string];
    /** Short month names for the activity heatmap header (Jan–Dec, length 12). */
    heatmapMonthNames: readonly [
        string, string, string, string, string, string,
        string, string, string, string, string, string,
    ];
    /** Heatmap legend "less" label (left edge of intensity legend). */
    heatmapLegendLess: string;
    /** Heatmap legend "more" label (right edge of intensity legend). */
    heatmapLegendMore: string;
}

export const defaultAnalyticsStrings: AnalyticsStrings = {
    metricErrorLabel: 'Unable to load metric',
    comparisonTitle: 'Comparison',
    heatmapDayLabels: ['Mon', '', 'Wed', '', 'Fri', '', ''],
    heatmapMonthNames: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    heatmapLegendLess: 'Less',
    heatmapLegendMore: 'More',
};
