export interface InlineMetric {
    label: string;
    value: string;
    change: string;
    up: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export interface InlineMetricBadgeProps {
    metrics: InlineMetric[];
    className?: string;
}
