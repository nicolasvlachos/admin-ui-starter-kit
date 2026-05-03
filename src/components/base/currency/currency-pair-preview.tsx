/**
 * CurrencyPairPreview — inline rendering of a `source → target` currency
 * pair using `useCurrency().formatAmount` for each side. Shows the shared
 * EMPTY placeholder when either leg is missing. Provide a custom `separator`
 * (default `→`) for direction or styling variations.
 */
import { ArrowRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { Text } from '@/components/typography';
import { useCurrency } from '@/components/base/currency/hooks';
import { EMPTY } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useTypographyConfig } from '@/lib/ui-provider';
/**
 * Currency-pair shape rendered by `<CurrencyPairPreview>`.
 *
 * `value` is the numeric amount; `currency` is the ISO 4217 code;
 * `symbol` is an optional pre-resolved symbol the consumer can pass when
 * they don't want the library to look one up.
 */
export interface CurrencyPairLeg {
	value?: number | string | null;
	currency?: string | null;
	symbol?: string | null;
}

export interface CurrencyPairData {
	source?: CurrencyPairLeg | null;
	target?: CurrencyPairLeg | null;
}

type BaseTextProps = ComponentProps<typeof Text>;

const DEFAULT_SEPARATOR = (
	<ArrowRight className="size-3 shrink-0 opacity-60" aria-hidden="true" />
);

export interface CurrencyPairPreviewProps extends Omit<BaseTextProps, 'children' | 'content'> {
	pair?: CurrencyPairData | null;
	emptyLabel?: ReactNode;
	separator?: ReactNode;
}

export function CurrencyPairPreview({
	pair,
	emptyLabel = EMPTY,
	separator = DEFAULT_SEPARATOR,
	className,
	size: sizeProp,
	tag = 'span',
	...props
}: CurrencyPairPreviewProps) {
	const { defaultTextSize } = useTypographyConfig();
	const size = sizeProp ?? defaultTextSize ?? 'sm';

	const { formatAmount } = useCurrency();

	const source = pair?.source?.value ?? null;
	const sourceCurrency = pair?.source?.currency ?? null;
	const sourceSymbol = pair?.source?.symbol ?? null;
	const target = pair?.target?.value ?? null;
	const targetCurrency = pair?.target?.currency ?? null;
	const targetSymbol = pair?.target?.symbol ?? null;

	if (!source || !target) {
		return (
			<Text
				tag={tag}
				size={size}
				type="secondary"
				className={cn('currency-pair-preview--component', 'tabular-nums', className)}
				{...props}
			>
				{emptyLabel}
			</Text>
		);
	}

	return (
		<Text
			tag={tag}
			size={size}
			className={cn('inline-flex items-center gap-1.5 tabular-nums', className)}
			{...props}
		>
			<span>
				{formatAmount(source, String(sourceCurrency ?? ''), sourceSymbol ?? undefined)}
			</span>
			<span className="inline-flex items-center text-muted-foreground" aria-hidden="true">
				{separator}
			</span>
			<span>
				{formatAmount(target, String(targetCurrency ?? ''), targetSymbol ?? undefined)}
			</span>
		</Text>
	);
}

CurrencyPairPreview.displayName = 'CurrencyPairPreview';
