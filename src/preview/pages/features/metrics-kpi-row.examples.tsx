// @ts-nocheck
import { MiniKpiRow } from '@/components/composed/data-display/mini-kpi';

export function Example4KPIs() {
	return (
		<>
			<MiniKpiRow
								kpis={[
									{ value: '2,847', label: 'Orders' },
									{ value: '142K', label: 'Revenue' },
									{ value: '94.2%', label: 'Fulfillment' },
									{ value: '4.8', label: 'Rating' },
								]}
							/>
		</>
	);
}

export function Example3KPIs() {
	return (
		<>
			<MiniKpiRow
								kpis={[
									{ value: '128', label: 'Active' },
									{ value: '24', label: 'Pending' },
									{ value: '7', label: 'Overdue' },
								]}
							/>
		</>
	);
}
