/**
 * GiftcardCompact — single-row compact layout. Square gradient gift icon on
 * the left, code + recipient in the middle, amount + status badge on the
 * right. Use for inline lists / tables of giftcards. Strings overridable.
 */
import { Text } from '@/components/typography/text';
import { Badge } from '@/components/base/badge/badge';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';
import { Gift } from 'lucide-react';
import {
	type GiftcardCommonProps,
	type GiftcardData,
	type GradientVariant,
	compactGradientMap,
	defaultGiftcardStrings,
	giftcardStatusVariant,
} from '../types';

export function GiftcardCompact({
	code,
	amount,
	remainingAmount,
	status,
	recipientName,
	gradient = 'purple',
	className,
	strings: stringsProp,
}: GiftcardData & GiftcardCommonProps & { gradient?: GradientVariant; className?: string }) {
	const strings = useStrings(defaultGiftcardStrings, stringsProp);
	const statusLabel = strings.status[status];
	const statusVariant = giftcardStatusVariant[status];
	const isPartiallyUsed = !!remainingAmount && remainingAmount !== amount;
	const displayAmount = isPartiallyUsed ? remainingAmount : amount;

	return (
		<Item
			variant="outline"
			className={cn('shadow-sm transition-colors duration-150 hover:border-border', className)}
		>
			<ItemMedia variant="image">
				<div
					className={cn(
						'flex size-full items-center justify-center bg-gradient-to-br',
						compactGradientMap[gradient],
					)}
				>
					<Gift className="h-4 w-4 text-white" />
				</div>
			</ItemMedia>

			<ItemContent>
				<ItemTitle className="font-mono">{code}</ItemTitle>
				{!!recipientName && <ItemDescription clamp={1}>{recipientName}</ItemDescription>}
			</ItemContent>

			<ItemActions>
				<div className="flex shrink-0 flex-col items-end gap-0.5">
					<div className="flex items-baseline gap-1">
						<Text size="base" weight="bold" className="tabular-nums">
							{displayAmount}
						</Text>
						{!!isPartiallyUsed && (
							<Text size="xxs" type="discrete" className="line-through tabular-nums">
								{amount}
							</Text>
						)}
					</div>
					<Badge variant={statusVariant}>{statusLabel}</Badge>
				</div>
			</ItemActions>
		</Item>
	);
}

GiftcardCompact.displayName = 'GiftcardCompact';
