import { MetricComparison, type MetricData } from '@/components/composed/analytics';

const monthly: { current: MetricData; previous: MetricData } = {
	current: { id: 'cur', label: 'Current', value: 48250, valueType: 'currency', currency: 'USD' },
	previous: { id: 'prev', label: 'Previous', value: 41800, valueType: 'currency', currency: 'USD' },
};

const quarterly: { current: MetricData; previous: MetricData } = {
	current: { id: 'cur', label: 'Current', value: 148500, valueType: 'currency', currency: 'EUR' },
	previous: { id: 'prev', label: 'Previous', value: 132100, valueType: 'currency', currency: 'EUR' },
};

const conversion: { current: MetricData; previous: MetricData } = {
	current: { id: 'cur', label: 'Current', value: 0.082, valueType: 'percentage' },
	previous: { id: 'prev', label: 'Previous', value: 0.094, valueType: 'percentage' },
};

const flat: { current: MetricData; previous: MetricData } = {
	current: { id: 'cur', label: 'Current', value: 1240, valueType: 'number' },
	previous: { id: 'prev', label: 'Previous', value: 1240, valueType: 'number' },
};

export function Default() {
	return (
		<>
			<MetricComparison
								title="Monthly Revenue"
								current={monthly.current}
								previous={monthly.previous}
								currentPeriod="Mar 2026"
								previousPeriod="Feb 2026"
							/>
		</>
	);
}

export function WithCurrencyOverrideEUR() {
	return (
		<>
			<MetricComparison
								title="Quarterly Revenue"
								current={quarterly.current}
								previous={quarterly.previous}
								currentPeriod="Q1 2026"
								previousPeriod="Q4 2025"
							/>
		</>
	);
}

export function PercentageValues() {
	return (
		<>
			<MetricComparison
								title="Conversion rate"
								current={conversion.current}
								previous={conversion.previous}
								currentPeriod="This week"
								previousPeriod="Last week"
							/>
		</>
	);
}

export function FlatNoChange() {
	return (
		<>
			<MetricComparison
								title="Active sessions"
								current={flat.current}
								previous={flat.previous}
							/>
		</>
	);
}
