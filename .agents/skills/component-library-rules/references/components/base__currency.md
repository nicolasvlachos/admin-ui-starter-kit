---
id: base/currency
title: "Currency"
description: "MoneyDisplay and CurrencyPairPreview — locale-aware, dual-pricing-aware money rendering driven by useCurrency() / UIProvider config."
layer: base
family: "Display"
sourcePath: src/components/base/currency
examples:
  - Default
  - Sizes
  - MultipleCurrencies
  - EmptyState
  - PairStackedEmphasisVariants
  - PairInlineEmphasisVariants
  - PairMinimalVariant
  - CurrencyPairPreviewExample
  - ProviderConfigDualPricing
  - RealisticOrdersList
imports:
  - @/components/base/currency/currency-pair-preview
  - @/components/base/display/money-display
  - @/preview/_mocks
tags:
  - base
  - display
  - currency
  - moneydisplay
  - currencypairpreview
  - locale
  - aware
---

# Currency

MoneyDisplay and CurrencyPairPreview — locale-aware, dual-pricing-aware money rendering driven by useCurrency() / UIProvider config.

**Layer:** `base`  
**Source:** `src/components/base/currency`

## Examples

```tsx
import { MoneyDisplay } from '@/components/base/display/money-display';
import { CurrencyPairPreview } from '@/components/base/currency/currency-pair-preview';
import { UIProvider } from '@/lib/ui-provider';
import { MOCK_ORDERS } from '@/preview/_mocks';

const PAIR = {
	primary: { amount: 124.5, currency: 'USD' },
	secondary: { amount: 63.66, currency: 'EUR' },
} as const;

export function Default() {
	return <MoneyDisplay money={{ amount: 124.5, currency: 'USD' }} />;
}

export function Sizes() {
	const sizes = ['xs', 'sm', 'base', 'lg', 'xl'] as const;
	return (
		<div className="flex flex-col gap-2">
			{sizes.map((s) => (
				<MoneyDisplay key={s} money={{ amount: 1850, currency: 'EUR' }} size={s} />
			))}
		</div>
	);
}

export function MultipleCurrencies() {
	return (
		<div className="flex flex-col gap-2">
			<MoneyDisplay money={{ amount: 124.5, currency: 'USD' }} />
			<MoneyDisplay money={{ amount: 1850, currency: 'EUR' }} />
			<MoneyDisplay money={{ amount: 9800, currency: 'JPY' }} />
			<MoneyDisplay money={{ amount: 350, currency: 'GBP' }} />
		</div>
	);
}

export function EmptyState() {
	return <MoneyDisplay emptyLabel="—" />;
}

export function PairStackedEmphasisVariants() {
	const variants = ['discrete', 'muted', 'match', 'hidden'] as const;
	return (
		<div className="flex flex-col gap-3">
			{variants.map((v) => (
				<div key={v} className="flex items-center gap-3">
					<span className="w-20 text-xs uppercase text-muted-foreground">{v}</span>
					<MoneyDisplay moneyPair={PAIR} showPair size="base" secondaryEmphasis={v} />
				</div>
			))}
		</div>
	);
}

export function PairInlineEmphasisVariants() {
	const variants = ['discrete', 'muted', 'match'] as const;
	return (
		<div className="flex flex-col gap-3">
			{variants.map((v) => (
				<div key={v} className="flex items-center gap-3">
					<span className="w-20 text-xs uppercase text-muted-foreground">{v}</span>
					<MoneyDisplay
						moneyPair={PAIR}
						showPair
						dualPricingDisplay="inline"
						size="base"
						secondaryEmphasis={v}
					/>
				</div>
			))}
		</div>
	);
}

export function PairMinimalVariant() {
	return (
		<MoneyDisplay
			moneyPair={PAIR}
			showPair
			variant="minimal"
			size="base"
		/>
	);
}

export function CurrencyPairPreviewExample() {
	return (
		<div className="flex flex-col gap-2">
			<CurrencyPairPreview
				pair={{
					source: { value: '100.00', currency: 'EUR', symbol: '€' },
					target: { value: '195.58', currency: 'USD' },
				}}
			/>
			<CurrencyPairPreview pair={null} emptyLabel="No conversion" />
		</div>
	);
}

export function ProviderConfigDualPricing() {
	return (
		<UIProvider
			config={{
				money: {
					defaultCurrency: 'EUR',
					displayCurrency: 'EUR',
					dualPricingEnabled: true,
					displayMode: 'dual',
					formatMode: 'with_symbol',
				},
			}}
		>
			<div className="flex flex-col gap-3">
				<MoneyDisplay
					moneyPair={{
						primary: { amount: 49.99, currency: 'EUR' },
						secondary: { amount: 97.78, currency: 'USD' },
					}}
					size="lg"
				/>
				<CurrencyPairPreview
					pair={{
						source: { value: '49.99', currency: 'EUR', symbol: '€' },
						target: { value: '97.78', currency: 'USD' },
					}}
					size="base"
				/>
			</div>
		</UIProvider>
	);
}

export function RealisticOrdersList() {
	return (
		<div className="flex flex-col gap-1 w-full max-w-md">
			{MOCK_ORDERS.slice(0, 5).map((o) => (
				<div key={o.id} className="flex items-center justify-between border-b border-border py-1.5 text-sm">
					<span className="font-mono text-xs">{o.number}</span>
					<MoneyDisplay money={{ amount: o.totalUsd, currency: 'USD' }} />
				</div>
			))}
		</div>
	);
}
```

## Example exports

- `Default`
- `Sizes`
- `MultipleCurrencies`
- `EmptyState`
- `PairStackedEmphasisVariants`
- `PairInlineEmphasisVariants`
- `PairMinimalVariant`
- `CurrencyPairPreviewExample`
- `ProviderConfigDualPricing`
- `RealisticOrdersList`

