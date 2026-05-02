/**
 * NumericValue — displays a number with `tabular-nums` and a chosen alignment.
 * Use for amounts, counters, percentages, durations — anywhere the value
 * benefits from monospace digits and consistent column alignment.
 *
 * Pass `value` as a primitive (auto-formatted via `Intl.NumberFormat`) or
 * pre-format upstream and pass a string. When `currency` is set, the value
 * is rendered with a currency symbol via `formatAmount` from `useCurrency()`
 * — defer to `MoneyDisplay` for richer money rendering (pair display, empty
 * fallback, large display sizes); this component is the leaf primitive.
 */
import type { ComponentProps, ReactNode } from 'react';

import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import { useTypographyConfig } from '@/lib/ui-provider';

export type NumericValueAlign = 'left' | 'right' | 'center';

type TextProps = ComponentProps<typeof Text>;
type TextSize = NonNullable<TextProps['size']>;
type TextWeight = NonNullable<TextProps['weight']>;
type TextType = NonNullable<TextProps['type']>;

export interface NumericValueProps extends Omit<TextProps, 'children' | 'content' | 'align'> {
	value: number | string | null | undefined;
	align?: NumericValueAlign;
	/** When set, formats `value` via `Intl.NumberFormat`; ignored if `value` is already a string. */
	locale?: string;
	/** Forwarded to `Intl.NumberFormat` when `value` is numeric. */
	formatOptions?: Intl.NumberFormatOptions;
	/** Rendered when `value` is `null`/`undefined`/empty. Defaults to `'—'`. */
	emptyLabel?: ReactNode;
	size?: TextSize;
	weight?: TextWeight;
	type?: TextType;
}

const DEFAULT_EMPTY = '—';

const formatValue = (
	value: NumericValueProps['value'],
	locale: string | undefined,
	options: Intl.NumberFormatOptions | undefined,
): string | null => {
	if (value === null || value === undefined || value === '') return null;
	if (typeof value === 'string') return value;
	if (Number.isNaN(value)) return null;
	try {
		return new Intl.NumberFormat(locale, options).format(value);
	} catch {
		return String(value);
	}
};

export function NumericValue({
	value,
	align = 'right',
	locale,
	formatOptions,
	emptyLabel = DEFAULT_EMPTY,
	size: sizeProp,
	weight,
	type,
	className,
	...props
}: NumericValueProps) {
	const { defaultTextSize } = useTypographyConfig();
	const size = sizeProp ?? defaultTextSize ?? 'sm';

	const formatted = formatValue(value, locale, formatOptions);
	const alignClass =
		align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

	if (formatted === null) {
		return (
			<Text
				size={size}
				weight={weight}
				type={type ?? 'secondary'}
				className={cn('tabular-nums', alignClass, className)}
				{...props}
			>
				{emptyLabel}
			</Text>
		);
	}

	return (
		<Text
			size={size}
			weight={weight}
			type={type}
			className={cn('tabular-nums', alignClass, className)}
			{...props}
		>
			{formatted}
		</Text>
	);
}

NumericValue.displayName = 'NumericValue';
