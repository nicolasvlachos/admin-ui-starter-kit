/**
 * UpcomingBookingRow — compact booking list. Each row shows a `DateBlock`
 * (weekday / day / month / time) on the left, service + customer in the
 * middle, and trailing amount. Locale and date-tone are configurable.
 *
 * Time is placed BELOW the date block by default (matches the date block
 * vertical rhythm); pass `timePlacement="inline-trailing"` to use a
 * separate trailing time column.
 */
import { Text } from '@/components/typography/text';
import { DateBlock } from '@/components/base/display/date-block';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';

import type { BookingEntry, UpcomingBookingRowProps } from './types';

import { cn } from '@/lib/utils';
function resolveDate(entry: BookingEntry): Date | string | number | null {
	if (entry.date != null) return entry.date;
	if (entry.day && entry.month) {
		const year = new Date().getFullYear();
		const synth = new Date(`${entry.month} ${entry.day}, ${year}`);
		if (!Number.isNaN(synth.getTime())) return synth;
	}
	return null;
}

export function UpcomingBookingRow({
	bookings,
	className,
	locale,
	dateTone = 'primary',
	timePlacement = 'below',
}: UpcomingBookingRowProps) {
	return (
		<ItemGroup className={cn('upcoming-booking--component', className)}>
			{bookings.map((b, idx) => {
				const dateInput = resolveDate(b);
				return (
					<Item key={b.id ?? `${b.service}-${b.time}-${idx}`}>
						{!!dateInput && (
							<ItemMedia>
								<DateBlock
									date={dateInput}
									time={timePlacement === 'below' ? b.time : undefined}
									tone={dateTone}
									locale={locale}
									timePlacement="below"
									layout="stacked"
								/>
							</ItemMedia>
						)}
						<ItemContent>
							<ItemTitle>{b.service}</ItemTitle>
							<ItemDescription clamp={1}>{b.customer}</ItemDescription>
						</ItemContent>
						<ItemActions>
							{timePlacement === 'inline-trailing' && (
								<Text size="xs" type="secondary" className="shrink-0 tabular-nums">
									{b.time}
								</Text>
							)}
							<Text weight="semibold" className="shrink-0 tabular-nums">
								{b.amount}
							</Text>
						</ItemActions>
					</Item>
				);
			})}
		</ItemGroup>
	);
}

UpcomingBookingRow.displayName = 'UpcomingBookingRow';
