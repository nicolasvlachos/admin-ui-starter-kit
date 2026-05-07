---
id: features/metrics-kpi-row
title: "Features · Metrics · KPI row"
description: "`MiniKpiRow` — compact horizontal divider-separated KPI strip for header / footer accents."
layer: features
family: "Metrics"
sourcePath: src/components/composed/data-display/mini-kpi
examples:
  - Example4KPIs
  - Example3KPIs
imports:
  - @/components/composed/data-display/mini-kpi
tags:
  - features
  - metrics
  - mini-kpi
  - kpi
  - row
  - minikpirow
  - compact
---

# Features · Metrics · KPI row

`MiniKpiRow` — compact horizontal divider-separated KPI strip for header / footer accents.

**Layer:** `features`  
**Source:** `src/components/composed/data-display/mini-kpi`

## Examples

```tsx
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
```

## Example exports

- `Example4KPIs`
- `Example3KPIs`

