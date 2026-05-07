---
id: features/metrics-overview
title: "Features · Metrics · Overview"
description: "The unified metrics module: a single Metric component with seven layout variants, plus MetricBar, MetricGrid, and supporting atoms (TrendChip, Sparkline, Skeleton). One MetricData shape powers every surface — see the dedicated pages for each layout."
layer: features
family: "Metrics"
sourcePath: src/components/composed/analytics
examples:
  - MetricBarDefault
  - MetricBarGradientFrame
  - MetricGridCardVariant
  - MetricGridCompactList
  - MetricSizesSmMdLg
  - MetricMinimalInlineCopy
  - MetricTrendChipExample
  - MetricSparklineExample
  - LoadingSkeletons
  - LiveLoadingState
  - ErrorState
imports:
  - @/components/composed/analytics
  - @/components/typography
tags:
  - features
  - metrics
  - analytics
  - overview
  - unified
  - module
  - single
---

# Features · Metrics · Overview

The unified metrics module: a single Metric component with seven layout variants, plus MetricBar, MetricGrid, and supporting atoms (TrendChip, Sparkline, Skeleton). One MetricData shape powers every surface — see the dedicated pages for each layout.

**Layer:** `features`  
**Source:** `src/components/composed/analytics`

## Examples

```tsx
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import {
	Metric,
	MetricBar,
	MetricGrid,
	MetricSkeleton,
	MetricSparkline,
	MetricTrendChip,
	type MetricData,
} from '@/components/composed/analytics';
import { Text } from '@/components/typography';

const revenue: MetricData = {
	id: 'revenue',
	label: 'Revenue',
	value: 24820,
	valueType: 'currency',
	currency: 'USD',
	change: { value: '12.4%', direction: 'up' },
	sparkline: [120, 140, 132, 158, 167, 180, 198, 220, 240, 248],
	icon: DollarSign,
	subtitle: 'This month',
};

const orders: MetricData = {
	id: 'orders',
	label: 'Orders',
	value: 312,
	valueType: 'number',
	change: { value: '4.1%', direction: 'up' },
	sparkline: [22, 28, 25, 30, 35, 33, 38, 41, 39, 44],
	icon: ShoppingBag,
};

const customers: MetricData = {
	id: 'customers',
	label: 'Active customers',
	value: 1820,
	valueType: 'number',
	change: { value: '2.3%', direction: 'down' },
	sparkline: [200, 198, 205, 195, 188, 182, 178, 180, 184, 182],
	icon: Users,
};

const conversion: MetricData = {
	id: 'conversion',
	label: 'Conversion',
	value: 0.082,
	valueType: 'percentage',
	change: { value: '0.6%', direction: 'up' },
	sparkline: [0.07, 0.071, 0.073, 0.075, 0.078, 0.079, 0.081, 0.082],
	icon: TrendingUp,
};

const ALL = [revenue, orders, customers, conversion];

export function MetricBarDefault() {
	return (
		<>
			<MetricBar
								period={{ label: 'This month', value: 'this_month' }}
								metrics={ALL}
							/>
		</>
	);
}

export function MetricBarGradientFrame() {
	return (
		<>
			<MetricBar
								period={{ label: 'This month', value: 'this_month' }}
								metrics={ALL}
								variant="gradient"
								footerText="Updated 2 minutes ago"
							/>
		</>
	);
}

export function MetricGridCardVariant() {
	return (
		<>
			<MetricGrid metrics={ALL} variant="card" columns={4} />
		</>
	);
}

export function MetricGridCompactList() {
	return (
		<>
			<MetricGrid metrics={ALL} variant="compact" columns={2} />
		</>
	);
}

export function MetricSizesSmMdLg() {
	return (
		<>
			<div className="space-y-3">
								<Metric data={orders} variant="bordered" size="sm" />
								<Metric data={orders} variant="bordered" size="md" />
								<Metric data={orders} variant="bordered" size="lg" />
							</div>
		</>
	);
}

export function MetricMinimalInlineCopy() {
	return (
		<>
			<div className="flex flex-wrap gap-x-6 gap-y-2 rounded-lg border border-border bg-card p-4">
								<Metric data={revenue} variant="minimal" />
								<Metric data={orders} variant="minimal" />
								<Metric data={customers} variant="minimal" />
								<Metric data={conversion} variant="minimal" />
							</div>
		</>
	);
}

export function MetricTrendChipExample() {
	return (
		<>
			<div className="flex flex-wrap items-center gap-3">
								<MetricTrendChip change={{ value: '12.4%', direction: 'up' }} variant="default" />
								<MetricTrendChip change={{ value: '12.4%', direction: 'up' }} variant="badge" />
								<MetricTrendChip change={{ value: '3.2%', direction: 'down' }} variant="badge" />
								<MetricTrendChip change={{ value: '0%', direction: 'neutral' }} variant="badge" />
								<MetricTrendChip change={{ value: '5.1%', direction: 'up' }} variant="compact" />
								<MetricTrendChip change={{ value: '5.1%', direction: 'up' }} variant="inline" />
							</div>
		</>
	);
}

export function MetricSparklineExample() {
	return (
		<>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
								<div className="rounded-lg border border-border bg-card p-3">
									<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wider">Positive</Text>
									<div className="mt-1 h-12 w-full">
										<MetricSparkline data={[120, 140, 132, 158, 167, 180, 198, 220, 240, 248]} trend="positive" />
									</div>
								</div>
								<div className="rounded-lg border border-border bg-card p-3">
									<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wider">Negative</Text>
									<div className="mt-1 h-12 w-full">
										<MetricSparkline data={[200, 198, 205, 195, 188, 182, 178, 180, 184, 182]} trend="negative" />
									</div>
								</div>
								<div className="rounded-lg border border-border bg-card p-3">
									<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wider">Neutral</Text>
									<div className="mt-1 h-12 w-full">
										<MetricSparkline data={[15, 20, 18, 24, 22, 28, 31, 35, 38, 42, 45, 48]} trend="neutral" />
									</div>
								</div>
							</div>
		</>
	);
}

export function LoadingSkeletons() {
	return (
		<>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
								<MetricSkeleton variant="card" />
								<MetricSkeleton variant="bordered" />
								<MetricSkeleton variant="accent" />
								<MetricSkeleton variant="compact" />
							</div>
		</>
	);
}

export function LiveLoadingState() {
	return (
		<>
			<MetricGrid metrics={ALL} variant="card" columns={4} loading />
		</>
	);
}

export function ErrorState() {
	return (
		<>
			<Metric data={revenue} variant="card" error errorLabel="Couldn't load this metric" />
		</>
	);
}
```

## Example exports

- `MetricBarDefault`
- `MetricBarGradientFrame`
- `MetricGridCardVariant`
- `MetricGridCompactList`
- `MetricSizesSmMdLg`
- `MetricMinimalInlineCopy`
- `MetricTrendChipExample`
- `MetricSparklineExample`
- `LoadingSkeletons`
- `LiveLoadingState`
- `ErrorState`

