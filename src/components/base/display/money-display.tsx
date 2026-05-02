/**
 * MoneyDisplay — primary + (optional) secondary currency amount renderer.
 *
 * Resolves a money value from any of `money` / `moneyPair` / `amount` / `pair`
 * (in priority order) and formats via the active `useCurrency` config. When
 * dual pricing is enabled (provider or per-instance `showPair`), the
 * converted secondary value renders either stacked
 * (`dualPricingDisplay="lines"`, default) or inline. Numbers always use the
 * active locale's thousands separator and tabular-nums for stable column
 * alignment.
 *
 * Re-exported from `@/components/base/currency/money-display` to keep
 * currency-namespaced imports grouped.
 */
import type { ComponentProps, ReactNode } from 'react';
import { Text } from '@/components/typography';
import { useCurrency } from '@/components/base/currency/hooks';
import { EMPTY } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useTypographyConfig } from '@/lib/ui-provider';

/**
 * Flexible input shapes accepted by `<MoneyDisplay>`. The component reads
 * defensively (numeric or string `value`/`amount`) and treats `currency` as
 * a free-form ISO 4217 string. Consumers map their domain money/currency
 * types into these at the call site.
 */
export interface CurrencyAmountData {
    value?: number | string | null;
    currency?: string | null;
    symbol?: string | null;
}

export interface MoneyValueData {
    amount?: number | string | null;
    currency?: string | null;
}

export interface MoneyData extends MoneyValueData {
    /** Optional secondary leg used when dual-pricing is enabled. */
    pair?: MoneyValueData | null;
}

export interface MoneyPairData {
    primary?: MoneyData | null;
    secondary?: MoneyData | null;
}

export interface CurrencyPairData {
    source?: CurrencyAmountData | null;
    target?: CurrencyAmountData | null;
}

type BaseTextProps = ComponentProps<typeof Text>;

export type MoneyDisplayVariant = 'default' | 'minimal' | 'stacked';
export type MoneyDisplaySecondaryEmphasis = 'discrete' | 'muted' | 'match' | 'hidden';

export interface MoneyDisplayProps extends Omit<BaseTextProps, 'children' | 'content'> {
	money?: MoneyData | null;
	moneyPair?: MoneyPairData | null;
	amount?: CurrencyAmountData | null;
	pair?: CurrencyPairData | null;
	showPair?: boolean;
	dualPricingDisplay?: 'inline' | 'lines';
	alignment?: 'left' | 'center' | 'right';
	emptyLabel?: ReactNode;
	/**
	 * Visual variant. `default`/`stacked` show secondary on a line below;
	 * `minimal` always renders just the primary value (single token, no
	 * secondary, no separator) — use it for dense rows or chips.
	 */
	variant?: MoneyDisplayVariant;
	/**
	 * Tunes the prominence of the secondary value when it renders.
	 * `discrete` (default for stacked) — `xxs` discrete tone, easy to scan past.
	 * `muted` — `xs` secondary tone (legacy behaviour).
	 * `match` — same size as primary, regular weight.
	 * `hidden` — never render the secondary even if a pair is provided.
	 */
	secondaryEmphasis?: MoneyDisplaySecondaryEmphasis;
}

type ResolvedAmount = {
	value: number;
	currency: string | null;
	symbol: string | null;
};

const toNumber = (raw: string | number | undefined | null): number | null => {
	if (raw === null || raw === undefined) return null;
	const n = typeof raw === 'number' ? raw : Number.parseFloat(String(raw).trim());
	return Number.isFinite(n) ? n : null;
};

const resolveCurrencyAmount = (amount?: CurrencyAmountData | null): ResolvedAmount | null => {
	const n = toNumber(amount?.value);
	if (n === null) return null;
	return {
		value: n,
		currency: amount?.currency ? String(amount.currency) : null,
		symbol: amount?.symbol ? String(amount.symbol) : null,
	};
};

const resolveMoney = (money?: MoneyData | null): ResolvedAmount | null => {
	const n = toNumber(money?.amount);
	if (n === null) return null;
	return {
		value: n,
		currency: money?.currency ? String(money.currency) : null,
		symbol: null,
	};
};

const resolveMoneyValue = (value?: MoneyValueData | null): ResolvedAmount | null => {
	const n = toNumber(value?.amount);
	if (n === null) return null;
	return {
		value: n,
		currency: value?.currency ? String(value.currency) : null,
		symbol: null,
	};
};

export function MoneyDisplay({
	money,
	moneyPair,
	amount,
	pair,
	showPair = false,
	dualPricingDisplay,
	alignment,
	emptyLabel = EMPTY,
	variant = 'default',
	secondaryEmphasis = 'discrete',
	className,
	// Defaults tuned for admin density: `sm` + `medium` reads as a normal
	// number in context, not a hero figure. Pass `size="base"` /
	// `weight="semibold"` for emphasis (totals, KPI tiles).
	size: sizeProp,
	align = 'right',
	weight = 'medium',
	tag = 'span',
	...props
}: MoneyDisplayProps) {
	const { defaultTextSize } = useTypographyConfig();
	const size = sizeProp ?? defaultTextSize ?? 'sm';

	const {
		displayCurrency,
		dualPricingDisplay: globalDualPricingDisplay,
		shouldShowDualPricing,
		formatAmount,
		getCurrencySymbol,
	} = useCurrency();

	const resolvedDualPricingDisplay = dualPricingDisplay ?? globalDualPricingDisplay ?? 'lines';

	const primaryFromMoneyPair =
		(shouldShowDualPricing() || showPair) && moneyPair?.primary
			? resolveMoney(moneyPair.primary)
			: null;
	const primaryFromMoney = resolveMoney(money);
	const primaryFromAmount = resolveCurrencyAmount(amount);

	const primary = primaryFromMoneyPair ?? primaryFromMoney ?? primaryFromAmount ?? null;
	const primaryCurrency = primary?.currency ?? displayCurrency ?? null;

	const shouldRenderPair =
		(showPair || shouldShowDualPricing()) &&
		Boolean(moneyPair ?? pair ?? money?.pair);

	const resolveSecondary = (): ResolvedAmount | null => {
		if (!shouldRenderPair) return null;

		if (moneyPair?.primary && moneyPair?.secondary) {
			return resolveMoney(moneyPair.secondary);
		}

		if (money?.pair) {
			return resolveMoneyValue(money.pair);
		}

		if (pair?.source || pair?.target) {
			const source = resolveCurrencyAmount(pair?.source ?? null);
			const target = resolveCurrencyAmount(pair?.target ?? null);

			if (!source && !target) return null;

			const sourceCurrency = source?.currency ?? null;
			const targetCurrency = target?.currency ?? null;

			if (primaryCurrency && targetCurrency === primaryCurrency) return source;
			if (primaryCurrency && sourceCurrency === primaryCurrency) return target;
			if (displayCurrency && targetCurrency === displayCurrency) return source;
			if (displayCurrency && sourceCurrency === displayCurrency) return target;
			return target ?? source;
		}

		return null;
	};

	const secondary =
		variant === 'minimal' || secondaryEmphasis === 'hidden'
			? null
			: resolveSecondary();

	const resolvedAlign = alignment ?? align;
	const alignmentClass =
		resolvedAlign === 'left'
			? 'text-left'
			: resolvedAlign === 'center'
				? 'text-center'
				: 'text-right';
	const justifyClass =
		resolvedAlign === 'left'
			? 'justify-start'
			: resolvedAlign === 'center'
				? 'justify-center'
				: 'justify-end';

	if (!primary) {
		return (
			<Text
				tag={tag}
				size={size}
				type="secondary"
				align={resolvedAlign}
				className={cn(
					'money--display inline-flex flex-col tabular-nums',
					alignmentClass,
					className,
				)}
				{...props}
			>
				{emptyLabel}
			</Text>
		);
	}

	const primaryLabel = formatAmount(
		primary.value,
		primaryCurrency ?? '',
		primary.symbol ?? (primaryCurrency ? getCurrencySymbol(primaryCurrency) : undefined),
	);
	const secondaryLabel = secondary
		? formatAmount(
				secondary.value,
				secondary.currency ?? '',
				secondary.symbol ?? (secondary.currency ? getCurrencySymbol(secondary.currency) : undefined),
			)
		: null;

	const secondarySize: BaseTextProps['size'] =
		secondaryEmphasis === 'match' ? size
			: secondaryEmphasis === 'muted' ? 'xs'
				: 'xxs';
	const secondaryType: BaseTextProps['type'] =
		secondaryEmphasis === 'match' ? undefined
			: secondaryEmphasis === 'muted' ? 'secondary'
				: 'discrete';

	if (resolvedDualPricingDisplay === 'inline' && secondaryLabel) {
		return (
			<span
				className={cn(
					'money--display inline-flex items-baseline gap-1.5 tabular-nums whitespace-nowrap',
					justifyClass,
					className,
				)}
				{...(props as React.HTMLAttributes<HTMLSpanElement>)}
			>
				<Text tag="span" size={size} weight={weight}>
					{primaryLabel}
				</Text>
				<Text tag="span" size="xxs" type="discrete" aria-hidden="true">
					·
				</Text>
				<Text tag="span" size={secondarySize} type={secondaryType} weight="regular">
					{secondaryLabel}
				</Text>
			</span>
		);
	}

	return (
		<Text
			tag={tag}
			size={size}
			align={resolvedAlign}
			className={cn(
				'money--display inline-flex flex-col tabular-nums leading-tight',
				alignmentClass,
				className,
			)}
			{...props}
		>
			<Text tag="span" size={size} weight={weight}>
				{primaryLabel}
			</Text>
			{!!secondaryLabel && (
				<Text
					tag="span"
					size={secondarySize}
					align={resolvedAlign}
					type={secondaryType}
					className="block whitespace-nowrap font-normal leading-tight"
				>
					{secondaryLabel}
				</Text>
			)}
		</Text>
	);
}

MoneyDisplay.displayName = 'MoneyDisplay';
