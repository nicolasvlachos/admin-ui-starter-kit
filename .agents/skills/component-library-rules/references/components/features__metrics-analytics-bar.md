---
id: features/metrics-analytics-bar
title: "Features · Metrics · Analytics bar"
description: "`MetricBar` — horizontal KPI strip with hairline-divided cells. Pair with `MetricGrid` for card-style layouts."
layer: features
family: "Metrics"
sourcePath: src/components/composed/analytics
examples:
  - MetricBarDefault
  - MetricBarGradientFrame
  - MetricGridCompactCardsAlternative
imports:
  - @/components/composed/analytics
tags:
  - features
  - metrics
  - analytics
  - bar
  - metricbar
  - horizontal
  - kpi
---

# Features · Metrics · Analytics bar

`MetricBar` — horizontal KPI strip with hairline-divided cells. Pair with `MetricGrid` for card-style layouts.

**Layer:** `features`  
**Source:** `src/components/composed/analytics`

## Examples

```tsx
import { CreditCard, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { MetricBar, MetricGrid, type MetricData } from '@/components/composed/analytics';

const UP = [12, 18, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45];
const DOWN = [40, 38, 35, 30, 28, 25, 22, 20, 18, 15, 12, 10];
const FLAT = [20, 22, 21, 23, 20, 22, 21, 23, 22, 21, 23, 22];

const KPIS: MetricData[] = [
	{ id: 'rev', label: 'Revenue', value: '52.3K', change: { value: '12.5%', direction: 'up' }, sparkline: UP, icon: DollarSign },
	{ id: 'ord', label: 'Orders', value: '284', change: { value: '8.1%', direction: 'up' }, sparkline: UP, icon: ShoppingBag },
	{ id: 'cust', label: 'Customers', value: '856', change: { value: '2.3%', direction: 'down' }, sparkline: DOWN, icon: Users },
	{ id: 'aov', label: 'Avg. Order', value: '184 USD', change: { value: '0%', direction: 'neutral' }, sparkline: FLAT, icon: CreditCard },
];

const FINANCE: MetricData[] = [
	{ id: 'rev', label: 'Total Revenue', value: '52,340 USD', change: { value: '12.5%', direction: 'up' }, sparkline: UP },
	{ id: 'profit', label: 'Net Profit', value: '31,404 USD', change: { value: '8.7%', direction: 'up' }, sparkline: [5, 8, 6, 10, 9, 12, 11, 14] },
	{ id: 'exp', label: 'Expenses', value: '20,936 USD', change: { value: '3.2%', direction: 'down' }, sparkline: DOWN, trend: 'positive' },
];

export function MetricBarDefault() {
	return (
		<>
			<MetricBar period={{ label: 'Last 30 days', value: 'last_30' }} metrics={KPIS} />
		</>
	);
}

export function MetricBarGradientFrame() {
	return (
		<>
			<MetricBar variant="gradient" metrics={FINANCE} footerText="Updated just now" />
		</>
	);
}

export function MetricGridCompactCardsAlternative() {
	return (
		<>
			<MetricGrid metrics={KPIS} variant="compact" columns={4} />
		</>
	);
}
```

## Example exports

- `MetricBarDefault`
- `MetricBarGradientFrame`
- `MetricGridCompactCardsAlternative`

