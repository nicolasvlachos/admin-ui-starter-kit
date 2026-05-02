import { InlineMetricBadge } from '@/components/composed/data-display/inline-metric';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function MetricsInlineBadgePage() {
	return (
		<PreviewPage title="Features · Metrics · Inline badge" description="`InlineMetricBadge` — compact `label · value · change%` pill rows. Use as in-flow copy where a full Metric tile is too heavy.">
			<PreviewSection title="Mixed sizes & directions" span="full">
				<InlineMetricBadge
					metrics={[
						{ label: 'Revenue', value: '52.3K', change: '+12%', up: true, size: 'md' },
						{ label: 'Orders', value: '1,284', change: '+8%', up: true, size: 'md' },
						{ label: 'Returns', value: '23', change: '-5%', up: false, size: 'sm' },
						{ label: 'AOV', value: '351 USD', change: '+3%', up: true, size: 'lg' },
					]}
				/>
			</PreviewSection>
		</PreviewPage>
	);
}
