/**
 * GiftcardCard (full) — premium gradient layout with shimmer hover, optional
 * pattern overlay (circles / waves), header status chip, balance / strike-
 * through line, copyable code strip, personal message block, and metadata
 * grid (To / From / Expires). Strings overridable for i18n.
 */
import { Text } from '@/components/typography/text';
import Heading from '@/components/typography/heading';
import { Button } from '@/components/base/buttons';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';
import {
	Gift,
	Copy,
	Eye,
	Calendar,
	User,
	Sparkles,
} from 'lucide-react';
import {
	type GiftcardCommonProps,
	type GiftcardData,
	type GradientVariant,
	type PatternVariant,
	defaultGiftcardStrings,
	giftcardStatusVariant,
	gradientMap,
} from '../types';

export function GiftcardCard({
	code,
	amount,
	remainingAmount,
	status,
	recipientName,
	senderName,
	message,
	expiresAt,
	createdAt: _createdAt,
	template: _template,
	onView,
	gradient = 'purple',
	pattern = 'none',
	className,
	strings: stringsProp,
}: GiftcardData &
	GiftcardCommonProps & {
		gradient?: GradientVariant;
		pattern?: PatternVariant;
		className?: string;
	}) {
	const strings = useStrings(defaultGiftcardStrings, stringsProp);
	const statusLabel = strings.status[status];
	const statusVariant = giftcardStatusVariant[status];
	const isPartiallyUsed = !!remainingAmount && remainingAmount !== amount;
	const displayAmount = isPartiallyUsed ? remainingAmount : amount;

	return (
		<div
			className={cn(
				'group w-full max-w-sm transition-shadow duration-300 ease-out',
				'hover:shadow-xl hover:shadow-black/10',
				className,
			)}
		>
			{/* Gift card header — gradient with shimmer */}
			<div
				className={cn(
					'relative overflow-hidden rounded-t-xl bg-gradient-to-br p-6',
					gradientMap[gradient].card,
				)}
			>
				{/* Shimmer / shine effect */}
				<div
					className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
					aria-hidden="true"
				/>

				{/* Pattern: circles */}
				{pattern === 'circles' && (
					<>
						<div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/5" aria-hidden="true" />
						<div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" aria-hidden="true" />
					</>
				)}

				{/* Pattern: waves */}
				{pattern === 'waves' && (
					<svg
						className="absolute inset-0 h-full w-full opacity-5"
						viewBox="0 0 400 200"
						preserveAspectRatio="none"
						aria-hidden="true"
					>
						<path d="M0 80 C100 20, 200 140, 400 60 L400 200 L0 200 Z" fill="white" />
						<path d="M0 120 C120 60, 280 180, 400 100 L400 200 L0 200 Z" fill="white" />
					</svg>
				)}

				{/* Status badge — top-right overlay with glass effect.
				    Custom inline pill (white text on glass) so the label
				    reads cleanly against any gradient — semantic Badge
				    variants would render dark text and clash. */}
				<div className="absolute top-4 right-4 z-20">
					<span
						className={cn(
							'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xxs font-semibold uppercase tracking-wide',
							'bg-white/20 text-white border border-white/25 shadow-sm backdrop-blur-md',
						)}
						data-status={statusVariant}
					>
						<span className="size-1.5 rounded-full bg-white/85" aria-hidden="true" />
						{statusLabel}
					</span>
				</div>

				<div className="relative z-10">
					<div className="flex items-center gap-2">
						<Gift className="h-5 w-5 text-white/80" />
						<Text weight="medium" className="text-white/80">{strings.giftCard}</Text>
					</div>

					<div className="mt-8 mb-5">
						<Text size="xs" className="text-white/50 uppercase tracking-wider">{strings.balance}</Text>
						<div className="flex items-baseline gap-2.5 mt-1">
							<Heading tag="h2" className="text-4xl border-none pb-0 text-white tabular-nums drop-shadow-sm">
								{displayAmount}
							</Heading>
							{!!isPartiallyUsed && (
								<Text className="text-white/40 line-through tabular-nums">{amount}</Text>
							)}
						</div>
					</div>

					{/* Code strip — premium feel */}
					<div
						className={cn(
							'flex items-center gap-2 rounded-lg px-4 py-2.5',
							'bg-white/10 backdrop-blur-sm',
							'border border-white/15',
							'shadow-[0_0_12px_-3px_rgba(255,255,255,0.15)]',
						)}
					>
						<Text weight="semibold" className="text-white font-mono tracking-[0.2em] flex-1">
							{code}
						</Text>
						<Button
							variant="light"
							buttonStyle="ghost"
							className="p-1 h-auto text-white/50 hover:text-white hover:bg-white/10"
							aria-label={strings.copyCode}
						>
							<Copy className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Details section — structured metadata grid */}
			<div className="rounded-b-xl bg-card p-5 shadow-sm border border-t-0 border-border/50 space-y-4">
				{!!message && (
					<div className="rounded-lg bg-muted/50 p-3 border border-border/30">
						<div className="flex items-center gap-1.5 mb-1">
							<Sparkles className="h-3 w-3 text-warning" />
							<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wide">
								{strings.personalMessage}
							</Text>
						</div>
						<Text type="secondary" className="italic leading-relaxed">
							&ldquo;{message}&rdquo;
						</Text>
					</div>
				)}

				{/* Metadata grid */}
				<div className="grid grid-cols-2 gap-3">
					{!!recipientName && (
						<div className="space-y-0.5">
							<div className="flex items-center gap-1.5">
								<User className="h-3 w-3 text-muted-foreground" />
								<Text size="xxs" type="discrete" weight="medium" className="uppercase tracking-wide">{strings.to}</Text>
							</div>
							<Text weight="medium">{recipientName}</Text>
						</div>
					)}
					{!!senderName && (
						<div className="space-y-0.5">
							<div className="flex items-center gap-1.5">
								<User className="h-3 w-3 text-muted-foreground" />
								<Text size="xxs" type="discrete" weight="medium" className="uppercase tracking-wide">{strings.from}</Text>
							</div>
							<Text weight="medium">{senderName}</Text>
						</div>
					)}
					{!!expiresAt && (
						<div className="space-y-0.5">
							<div className="flex items-center gap-1.5">
								<Calendar className="h-3 w-3 text-muted-foreground" />
								<Text size="xxs" type="discrete" weight="medium" className="uppercase tracking-wide">{strings.expires}</Text>
							</div>
							<Text weight="medium">{expiresAt}</Text>
						</div>
					)}
				</div>

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

GiftcardCard.displayName = 'GiftcardCard';
