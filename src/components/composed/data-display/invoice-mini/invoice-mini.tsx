/**
 * InvoiceMiniCard — compact invoice tile for lists / dashboards. Header
 * (number + status chip), customer name, footer split between items-count /
 * due date and the total amount. Strings (status labels, "Due", item count
 * pluralisation) overridable for i18n via the `strings` prop.
 */
import { Badge } from '@/components/base/badge/badge';
import { SmartCard } from '@/components/base/cards/smart-card';
import { Text } from '@/components/typography/text';
import { mergeStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultInvoiceMiniStrings,
	invoiceStatusVariant,
	type InvoiceMiniCardProps,
	type InvoiceStatus,
} from './types';

export function InvoiceMiniCard({
	invoice,
	className,
	strings: stringsProp,
}: InvoiceMiniCardProps) {
	const strings = mergeStrings(defaultInvoiceMiniStrings, stringsProp);
	const labelByStatus: Record<InvoiceStatus, string> = {
		paid: strings.paid,
		pending: strings.pending,
		overdue: strings.overdue,
	};

	return (
		<SmartCard padding="sm" className={className}>
			<div className="space-y-2.5">
				<div className="flex items-center justify-between gap-3">
					<Text
						weight="semibold"
						className="font-mono tracking-wide truncate"
					>
						{invoice.invoiceNumber}
					</Text>
					<Badge variant={invoiceStatusVariant[invoice.status]} dot>
						{labelByStatus[invoice.status]}
					</Badge>
				</div>

				<Text type="secondary" className="truncate">
					{invoice.customerName}
				</Text>

				<div className="flex items-end justify-between gap-3 pt-1">
					<div className="space-y-0.5">
						<Text size="xs" type="secondary">
							{strings.items(invoice.lineItemsCount)}
						</Text>
						<Text size="xxs" type="discrete" className="tabular-nums">
							{strings.due} {invoice.dueDate}
						</Text>
					</div>
					<Text
						size="lg"
						weight="bold"
						className={cn('shrink-0 tabular-nums leading-none')}
					>
						{invoice.totalAmount}
					</Text>
				</div>
			</div>
		</SmartCard>
	);
}

InvoiceMiniCard.displayName = 'InvoiceMiniCard';
