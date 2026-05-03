/**
 * CartSummaryCard — line-item list with optional subtotal / tax / shipping /
 * discount breakdown and a primary "Checkout" action. Items render through
 * `<ItemGroup>` for density consistency; the breakdown rows sit in a tight
 * summary block above the total. The discount value is shown as a signed
 * delta in success colour.
 */
import { ShoppingBag } from 'lucide-react';
import { SmartCard } from '@/components/base/cards';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { InlineStat } from '@/components/base/display';
import { Separator } from '@/components/base/display/separator';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';
import { useStrings } from '@/lib/strings';

import { defaultCartSummaryStrings, type CartSummaryCardProps } from './types';

import { cn } from '@/lib/utils';
const stripLeadingMinus = (value: string): string => value.replace(/^[\s−-]+/, '');

export function CartSummaryCard({
	items,
	subtotal,
	tax,
	shipping,
	discount,
	total,
	onCheckout,
	className,
	strings: stringsProp,
}: CartSummaryCardProps) {
	const strings = useStrings(defaultCartSummaryStrings, stringsProp);
	const hasBreakdown = !!(subtotal || tax || shipping || discount);

	return (
		<SmartCard icon={<ShoppingBag className="size-4" />} title={strings.title} className={cn('cart-summary--component', className)}>
			<ItemGroup>
				{items.map((it) => (
					<Item key={it.id} size="xs" className="px-0">
						<ItemMedia variant="image">
							{it.imageUrl ? (
								<img src={it.imageUrl} alt={it.name} />
							) : (
								<ShoppingBag />
							)}
						</ItemMedia>
						<ItemContent>
							<ItemTitle>{it.name}</ItemTitle>
							<ItemDescription clamp={1} className="tabular-nums">x{it.qty}</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Text tag="span" weight="semibold" className="tabular-nums shrink-0">{it.price}</Text>
						</ItemActions>
					</Item>
				))}
			</ItemGroup>

			{!!hasBreakdown && (
				<div className="mt-3 space-y-1.5 rounded-lg bg-muted/30 px-3 py-2.5">
					{!!subtotal && (
						<InlineStat label={strings.subtotal} value={subtotal} mono valueClassName="text-xs font-medium" labelClassName="text-xs" />
					)}
					{!!tax && (
						<InlineStat label={strings.tax} value={tax} mono valueClassName="text-xs font-medium" labelClassName="text-xs" />
					)}
					{!!shipping && (
						<InlineStat label={strings.shipping} value={shipping} mono valueClassName="text-xs font-medium" labelClassName="text-xs" />
					)}
					{!!discount && (
						<InlineStat
							label={strings.discount}
							value={`−${stripLeadingMinus(discount)}`}
							mono
							labelClassName="text-xs"
							valueClassName="text-xs font-semibold text-success"
						/>
					)}
				</div>
			)}

			<Separator className="my-3" />

			<InlineStat
				label={strings.total}
				value={total}
				mono
				labelClassName="text-sm font-semibold"
				valueClassName="text-lg font-bold"
			/>

			{!!onCheckout && (
				<Button onClick={onCheckout} fullWidth className="mt-4">{strings.checkout}</Button>
			)}
		</SmartCard>
	);
}

CartSummaryCard.displayName = 'CartSummaryCard';
