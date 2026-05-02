/**
 * TaxBreakdownCard — itemised tax breakdown for an order or invoice. Shows a
 * subtotal, one row per tax line (with optional rate suffix), an optional
 * "Total tax" rollup, and a final total. Pairs with `CartSummaryCard` when
 * consumers need to expose VAT / regional tax detail. Strings overridable
 * for i18n.
 */
import { Receipt } from 'lucide-react';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { InlineStat } from '@/components/base/display';
import { Separator } from '@/components/base/display/separator';
import { useStrings } from '@/lib/strings';

import { defaultTaxBreakdownStrings, type TaxBreakdownCardProps } from './types';

export function TaxBreakdownCard({
	subtotal,
	taxes,
	totalTax,
	total,
	className,
	strings: stringsProp,
}: TaxBreakdownCardProps) {
	const strings = useStrings(defaultTaxBreakdownStrings, stringsProp);

	return (
		<SmartCard
			icon={<Receipt className="size-4" />}
			title={strings.title}
			className={className}
		>
			<InlineStat
				label={strings.subtotal}
				value={subtotal}
				mono
				labelClassName="text-sm"
				valueClassName="text-sm font-medium"
			/>

			<div className="mt-3 space-y-1.5 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
				{taxes.map((tax, i) => (
					<div
						key={tax.id ?? `${tax.label}-${i}`}
						className="flex items-baseline justify-between gap-3"
					>
						<div className="flex items-baseline gap-1.5 min-w-0">
							<Text size="xs" className="truncate">{tax.label}</Text>
							{!!tax.rate && (
								<Text tag="span" size="xxs" type="discrete" className="shrink-0">
									{tax.rate}
								</Text>
							)}
						</div>
						<Text tag="span" size="xs" weight="medium" className="tabular-nums shrink-0">
							{tax.amount}
						</Text>
					</div>
				))}
				{!!totalTax && taxes.length > 1 && (
					<InlineStat
						label={strings.totalTax}
						value={totalTax}
						mono
						className="border-t border-border/50 pt-1.5 mt-0.5"
						labelClassName="text-xs font-medium"
						valueClassName="text-xs font-semibold"
					/>
				)}
			</div>

			<Separator className="my-3" />

			<InlineStat
				label={strings.total}
				value={total}
				mono
				labelClassName="text-sm font-semibold"
				valueClassName="text-lg font-bold"
			/>
		</SmartCard>
	);
}

TaxBreakdownCard.displayName = 'TaxBreakdownCard';
