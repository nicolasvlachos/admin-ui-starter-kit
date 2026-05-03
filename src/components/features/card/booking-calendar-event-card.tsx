import type { ReactNode } from 'react';

import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export type BookingCalendarEventCardItem = {
	id: string;
	label: ReactNode;
	value: ReactNode;
	fullWidth?: boolean;
};

type BookingCalendarEventCardProps = {
	title: ReactNode;
	description?: ReactNode;
	status?: ReactNode;
	items: BookingCalendarEventCardItem[];
	actionLabel: ReactNode;
	onAction: () => void;
	className?: string;
	contentClassName?: string;
};

function renderItemValue(value: ReactNode): ReactNode {
	if (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'bigint'
	) {
		return <Text className="booking-calendar-event-card--component">{String(value)}</Text>;
	}

	return value;
}

export function BookingCalendarEventCard({
	title,
	description,
	status,
	items,
	actionLabel,
	onAction,
	className,
	contentClassName,
}: BookingCalendarEventCardProps) {
	return (
		<SmartCard
			title={title}
			description={description}
			headerEnd={status}
			padding="sm"
			className={cn('shadow-none', className)}
			contentClassName={cn('space-y-4', contentClassName)}
		>
			<div className="grid gap-2 sm:grid-cols-2">
				{items.map((item) => (
					<div
						key={item.id}
						className={cn(item.fullWidth === true && 'sm:col-span-2')}
					>
						<Text
							size="xs"
							type="secondary"
						>
							{item.label}
						</Text>
						{renderItemValue(item.value)}
					</div>
				))}
			</div>

			<div className="flex justify-end">
				<Button
					type="button"
					variant="primary"
					size="xs"
					onClick={onAction}
				>
					{actionLabel}
				</Button>
			</div>
		</SmartCard>
	);
}
