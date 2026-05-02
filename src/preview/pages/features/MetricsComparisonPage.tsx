import { MetricComparison, type MetricData } from '@/components/composed/analytics';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

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

export default function MetricComparisonPage() {
	return (
		<PreviewPage
			title="Features · Metrics · Comparison"
			description="`MetricComparison` — side-by-side current vs previous with a tone-tinted delta box. Reuses the unified `MetricData` shape so currency/percent formatting carries through."
		>
			<PreviewSection title="Default">
				<MetricComparison
					title="Monthly Revenue"
					current={monthly.current}
					previous={monthly.previous}
					currentPeriod="Mar 2026"
					previousPeriod="Feb 2026"
				/>
			</PreviewSection>

			<PreviewSection title="With currency override (EUR)">
				<MetricComparison
					title="Quarterly Revenue"
					current={quarterly.current}
					previous={quarterly.previous}
					currentPeriod="Q1 2026"
					previousPeriod="Q4 2025"
				/>
			</PreviewSection>

			<PreviewSection title="Percentage values">
				<MetricComparison
					title="Conversion rate"
					current={conversion.current}
					previous={conversion.previous}
					currentPeriod="This week"
					previousPeriod="Last week"
				/>
			</PreviewSection>

			<PreviewSection title="Flat (no change)">
				<MetricComparison
					title="Active sessions"
					current={flat.current}
					previous={flat.previous}
				/>
			</PreviewSection>
		</PreviewPage>
	);
}
