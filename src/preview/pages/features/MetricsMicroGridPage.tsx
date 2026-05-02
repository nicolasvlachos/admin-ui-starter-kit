import { MetricMicroGrid } from '@/components/composed/analytics';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function MicroChartGridPage() {
	return (
		<PreviewPage
			title="Features · Metrics · Micro chart grid"
			description="`MetricMicroGrid` — six-cell dense overview pairing each KPI with a different lightweight visualization (bars / line / dots / progress / area / pie)."
		>
			<PreviewSection title="Default · auto-assigned charts">
				<div className="max-w-lg">
					<MetricMicroGrid
						title="Overview"
						cells={[
							{ label: 'Revenue', value: '87.4K', data: [42, 55, 60, 65, 75] },
							{ label: 'Orders', value: '1,284', data: [80, 85, 90, 100, 110, 105] },
							{ label: 'Avg Value', value: '68.1', data: [58, 62, 64, 68] },
							{ label: 'Vouchers', value: '73%', data: [73, 100] },
							{ label: 'Growth', value: '+12%', data: [42, 48, 55, 52, 60, 58, 65, 70, 75] },
							{ label: 'Channels', value: '3', data: [520, 186, 94] },
						]}
					/>
				</div>
			</PreviewSection>

			<PreviewSection title="Pinned chart kinds">
				<div className="max-w-lg">
					<MetricMicroGrid
						title="Force per-cell chart"
						cells={[
							{ label: 'Sessions', value: '1.2M', data: [200, 210, 240, 260, 290, 320], chart: 'area' },
							{ label: 'Users', value: '24K', data: [80, 85, 90, 100, 110, 105], chart: 'line' },
							{ label: 'Bounce', value: '32%', data: [32, 100], chart: 'progress' },
							{ label: 'Pages', value: '4.2', data: [3.8, 4.0, 4.1, 4.2, 4.3], chart: 'bars' },
							{ label: 'Devices', value: '3', data: [520, 186, 94], chart: 'pie' },
							{ label: 'Sources', value: '8', data: [4, 6, 5, 7, 8], chart: 'dots' },
						]}
					/>
				</div>
			</PreviewSection>
		</PreviewPage>
	);
}
