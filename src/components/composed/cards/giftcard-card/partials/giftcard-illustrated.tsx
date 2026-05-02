/**
 * GiftcardCardIllustrated — gradient header with diagonal-line + decorative
 * circles overlay, overlapping gift icon, balance + status row, code strip,
 * details (recipient / expires), and an outline footer button. Strings
 * overridable for i18n.
 */
import { Text } from '@/components/typography/text';
import Heading from '@/components/typography/heading';
import { Badge } from '@/components/base/badge/badge';
import { Button } from '@/components/base/buttons';
import {
	Item,
	ItemContent,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';
import { Gift, Copy, Eye, Calendar, User } from 'lucide-react';
import {
	type GiftcardCommonProps,
	type GiftcardData,
	type HeaderColor,
	defaultGiftcardStrings,
	giftcardStatusVariant,
	headerGradientMap,
	headerIconBgMap,
} from '../types';

export function GiftcardCardIllustrated({
	code,
	amount,
	remainingAmount,
	status,
	recipientName,
	expiresAt,
	onView,
	headerColor = 'green',
	className,
	strings: stringsProp,
}: GiftcardData & GiftcardCommonProps & { headerColor?: HeaderColor; className?: string }) {
	const strings = useStrings(defaultGiftcardStrings, stringsProp);
	const statusLabel = strings.status[status];
	const statusVariant = giftcardStatusVariant[status];
	const isPartiallyUsed = !!remainingAmount && remainingAmount !== amount;
	const displayAmount = isPartiallyUsed ? remainingAmount : amount;

	return (
		<div
			className={cn(
				'w-full max-w-sm rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden',
				className,
			)}
		>
			{/* Gradient header with pattern */}
			<div className={cn('relative h-24 bg-gradient-to-br', headerGradientMap[headerColor])}>
				<div
					className="absolute inset-0"
					style={{
						backgroundImage:
							'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)',
					}}
					aria-hidden="true"
				/>
				<div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/[0.06]" aria-hidden="true" />
				<div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/[0.04]" aria-hidden="true" />
			</div>

			{/* Overlapping icon */}
			<div className="relative -mt-7 px-6">
				<div
					className={cn(
						'flex h-14 w-14 items-center justify-center rounded-xl',
						headerIconBgMap[headerColor],
					)}
				>
					<Gift className="h-6 w-6 text-white" />
				</div>
			</div>

			{/* Body */}
			<div className="px-6 pt-4 pb-6 space-y-4">
				<div className="flex items-start justify-between">
					<div>
						<div className="flex items-baseline gap-2">
							<Heading tag="h2" className="text-3xl border-none pb-0 tabular-nums">
								{displayAmount}
							</Heading>
							{!!isPartiallyUsed && (
								<Text type="discrete" className="line-through tabular-nums">
									{amount}
								</Text>
							)}
						</div>
						<Text size="xs" type="secondary" className="mt-0.5">
							{strings.giftCard} · {strings.balance}
						</Text>
					</div>
					<Badge variant={statusVariant}>{statusLabel}</Badge>
				</div>

				<div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3.5 py-2.5 border border-border/30">
					<Text weight="medium" className="font-mono tracking-[0.15em] flex-1">
						{code}
					</Text>
					<Button
						variant="secondary"
						buttonStyle="ghost"
						className="p-1 h-auto"
						aria-label={strings.copyCode}
					>
						<Copy className="h-3.5 w-3.5" />
					</Button>
				</div>

				<ItemGroup className="gap-1">
					{!!recipientName && (
						<Item size="xs" className="px-0">
							<ItemMedia variant="icon" className="text-muted-foreground">
								<User />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>{recipientName}</ItemTitle>
							</ItemContent>
						</Item>
					)}
					{!!expiresAt && (
						<Item size="xs" className="px-0">
							<ItemMedia variant="icon" className="text-muted-foreground">
								<Calendar />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>{expiresAt}</ItemTitle>
							</ItemContent>
						</Item>
					)}
				</ItemGroup>

				{!!onView && (
					<Button
						variant="secondary"
						buttonStyle="outline"
						icon={Eye}
						fullWidth
						onClick={onView}
					>
						{strings.viewDetails}
					</Button>
				)}
			</div>
		</div>
	);
}

GiftcardCardIllustrated.displayName = 'GiftcardCardIllustrated';
