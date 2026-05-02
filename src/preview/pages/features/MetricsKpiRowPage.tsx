import { MiniKpiRow } from '@/components/composed/data-display/mini-kpi';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function MetricsKpiRowPage() {
	return (
		<PreviewPage title="Features · Metrics · KPI row" description="`MiniKpiRow` — compact horizontal divider-separated KPI strip for header / footer accents.">
			<PreviewSection title="4 KPIs" span="full">
				<MiniKpiRow
					kpis={[
						{ value: '2,847', label: 'Orders' },
						{ value: '142K', label: 'Revenue' },
						{ value: '94.2%', label: 'Fulfillment' },
						{ value: '4.8', label: 'Rating' },
					]}
				/>
			</PreviewSection>

			<PreviewSection title="3 KPIs" span="full">
				<MiniKpiRow
					kpis={[
						{ value: '128', label: 'Active' },
						{ value: '24', label: 'Pending' },
						{ value: '7', label: 'Overdue' },
					]}
				/>
			</PreviewSection>
		</PreviewPage>
	);
}
