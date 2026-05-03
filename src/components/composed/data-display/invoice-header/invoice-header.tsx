/**
 * InvoiceHeaderCard — invoice document header.
 *
 * Top row: invoice number (mono, prominent) + status chip.
 * Middle: Bill-from / Bill-to parties as a 2-col grid that stacks on small
 * screens and uses an uppercase-tracking-wider eyebrow + name + secondary
 * location.
 * Bottom: dates on the leading edge + amount-due block on the trailing edge.
 *
 * Strings overridable for i18n via the `strings` prop.
 */
import { Badge } from '@/components/base/badge/badge';
import { SmartCard } from '@/components/base/cards/smart-card';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { InlineStat } from '@/components/base/display';
import { Separator } from '@/components/base/display/separator';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultInvoiceHeaderStrings, type InvoiceHeaderCardProps } from './types';

function PartyBlock({
	eyebrow,
	name,
	location,
}: {
	eyebrow: string;
	name: string;
	location?: string;
}) {
	return (
		<div className={cn('invoice-header--component', 'space-y-1')}>
			<Text
				size="xxs"
				type="secondary"
				weight="medium"
				className="uppercase tracking-wider"
			>
				{eyebrow}
			</Text>
			<Text weight="semibold" className="leading-snug">
				{name}
			</Text>
			{!!location && (
				<Text size="xs" type="secondary" className="leading-snug">
					{location}
				</Text>
			)}
		</div>
	);
}

export function InvoiceHeaderCard({
	invoiceNumber,
	status,
	statusVariant = 'success',
	from,
	to,
	issuedDate,
	dueDate,
	amount,
	className,
	strings: stringsProp,
}: InvoiceHeaderCardProps) {
	const strings = useStrings(defaultInvoiceHeaderStrings, stringsProp);

	return (
		<SmartCard title={strings.title} className={className}>
			<div className="flex items-center justify-between gap-3">
				<Text
					weight="bold"
					className="font-mono tracking-wide"
				>
					{invoiceNumber}
				</Text>
				<Badge variant={statusVariant}>{status}</Badge>
			</div>

			<div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
				<PartyBlock eyebrow={strings.billFrom} name={from.name} location={from.location} />
				<PartyBlock eyebrow={strings.billTo} name={to.name} location={to.location} />
			</div>

			<Separator className="my-5" />

			<div className="flex flex-wrap items-end justify-between gap-4">
				<div className="space-y-1">
					{!!issuedDate && (
						<InlineStat
							layout="inline"
							label={strings.issued}
							value={issuedDate}
							mono
							labelClassName="text-xxs uppercase tracking-wider font-medium"
							valueClassName="text-xs font-medium"
						/>
					)}
					{!!dueDate && (
						<InlineStat
							layout="inline"
							label={strings.due}
							value={dueDate}
							mono
							labelClassName="text-xxs uppercase tracking-wider font-medium"
							valueClassName="text-xs font-medium"
						/>
					)}
				</div>
				<div className="text-right">
					<Text
						size="xxs"
						type="secondary"
						weight="medium"
						className="uppercase tracking-wider"
					>
						{strings.amountDue}
					</Text>
					<Heading
						tag="h3"
						className={cn('mt-1 text-3xl tabular-nums leading-none tracking-tight border-none pb-0')}
					>
						{amount}
					</Heading>
				</div>
			</div>
		</SmartCard>
	);
}

InvoiceHeaderCard.displayName = 'InvoiceHeaderCard';
