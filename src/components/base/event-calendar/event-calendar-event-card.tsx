/**
 * EventCalendarEventCard — detailed event view rendered in popovers and
 * agenda lists. Reads optional `metadata.customer_name`, `guest_count`, and
 * `service_name` to render a richer summary; falls back gracefully when any
 * of those are absent. Strings (guest / guests pluralization) overridable.
 */
import { format } from 'date-fns';
import { User, Users, ExternalLink, Calendar } from 'lucide-react';
import Heading from '@/components/typography/heading';
import Text from '@/components/typography/text';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';
import type { EventCalendarEventCardProps } from './event-calendar.types';

export interface EventCalendarEventCardStrings {
	guest: string;
	guests: string;
}

export const defaultEventCalendarEventCardStrings: EventCalendarEventCardStrings = {
	guest: 'guest',
	guests: 'guests',
};

interface EventCalendarEventCardPropsWithStrings extends EventCalendarEventCardProps {
	strings?: Partial<EventCalendarEventCardStrings>;
}

export function EventCalendarEventCard({
	event,
	category,
	onClick,
	strings: stringsProp,
}: EventCalendarEventCardPropsWithStrings) {
	const strings = useStrings(defaultEventCalendarEventCardStrings, stringsProp);
	const isClickable = !!onClick;

	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	const metadata = event.metadata || {};
	const customerName = metadata.customer_name as string | undefined;
	const guestCount = metadata.guest_count as number | undefined;
	const serviceName = metadata.service_name as string | undefined;

	const cardContent = (
		<>
			<div className="flex items-start justify-between gap-3 mb-3">
				<div className="flex items-center gap-2">
					<Heading tag="h5">
						{event.title}
					</Heading>
					{!!category && (
						<div className="inline-flex items-center gap-1">
							<span className={cn('h-1.5 w-1.5 rounded-full', category.color.replace('border-', 'bg-'))} />
							<Text size="xs" weight="medium">
								{category.label}
							</Text>
						</div>
					)}
				</div>
				{!!isClickable && !!event.url && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
				{!!customerName && (
					<div className="flex items-center gap-1.5">
						<User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
						<Text className="truncate">
							{customerName}
						</Text>
					</div>
				)}
				{guestCount !== undefined && guestCount > 0 && (
					<div className="flex items-center gap-1.5">
						<Users className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
						<Text>
							{guestCount} {guestCount === 1 ? strings.guest : strings.guests}
						</Text>
					</div>
				)}
			</div>

			{!!serviceName && (
				<Text type="secondary" className="mb-2 line-clamp-1">
					{serviceName}
				</Text>
			)}

			<div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
				<Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
				<Text size="xs" type="secondary">
					{!!event.allDay && format(event.startDate, 'EEEE, MMM d, yyyy')}
				</Text>
			</div>
		</>
	);

	const commonClassName = cn(
		'w-full text-left p-4 border border-border rounded-lg bg-card transition-none',
		isClickable ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' : ''
	);

	if (isClickable) {
		return (
			<button type="button" onClick={handleClick} className={commonClassName}>
				{cardContent}
			</button>
		);
	}

	return <div className={commonClassName}>{cardContent}</div>;
}

EventCalendarEventCard.displayName = 'EventCalendarEventCard';
