/**
 * VoucherEntryCard — gift-card / voucher redemption entry.
 *
 * Empty state — leading gift icon input + check button, helper line surfacing
 * errors. Applied state — success-tinted row with check medallion, code,
 * balance amount, and a destructive remove icon.
 */
import { useState } from 'react';
import { Check, Gift, X } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards';
import { IconBadge } from '@/components/base/display';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';
import { Input } from '@/components/base/forms/fields';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';

import { defaultVoucherEntryStrings, type VoucherEntryCardProps } from './types';

import { cn } from '@/lib/utils';
export function VoucherEntryCard({
	appliedCode,
	balance,
	error,
	loading,
	onCheck,
	onRemove,
	className,
	strings: stringsProp,
}: VoucherEntryCardProps) {
	const strings = useStrings(defaultVoucherEntryStrings, stringsProp);
	const [code, setCode] = useState('');

	if (appliedCode) {
		return (
			<SmartCard
				icon={<Gift className="size-4" />}
				title={strings.title}
				className={cn('voucher-entry--component', className)}
			>
				<Item variant="muted" className="border border-success/30 bg-success/8">
					<ItemMedia>
						<IconBadge icon={Check} tone="success" size="md" className="ring-1 ring-success/20" />
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="font-mono tracking-wider">
							{appliedCode}
						</ItemTitle>
						<ItemDescription className="uppercase tracking-wide" clamp={1}>
							{strings.balance}
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						{!!balance && (
							<Text tag="span" size="base" weight="semibold" type="success" className="tabular-nums shrink-0">
								{balance}
							</Text>
						)}
						{!!onRemove && (
							<Button
								type="button"
								variant="error"
								buttonStyle="ghost"
								size="icon-xs"
								onClick={onRemove}
								aria-label={strings.remove}
								className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
							>
								<X className="size-3.5" />
							</Button>
						)}
					</ItemActions>
				</Item>
			</SmartCard>
		);
	}

	return (
		<SmartCard
			icon={<Gift className="size-4" />}
			title={strings.title}
			className={className}
		>
			<div className="flex flex-col gap-2">
				<div className="flex gap-2">
					<Input
						value={code}
						onChange={(e) => setCode((e.target as HTMLInputElement).value)}
						placeholder={strings.placeholder}
						startIcon={Gift}
						className="flex-1 font-mono uppercase tracking-wider"
						invalid={Boolean(error)}
					/>
					<Button
						onClick={() => onCheck?.(code)}
						loading={loading}
						disabled={!code.trim()}
					>
						{strings.check}
					</Button>
				</div>
				{!!error && (
					<Text size="xs" type="error">
						{error || strings.notFound}
					</Text>
				)}
			</div>
		</SmartCard>
	);
}

VoucherEntryCard.displayName = 'VoucherEntryCard';
