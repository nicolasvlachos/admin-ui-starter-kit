import type { Locale } from 'date-fns';
import type { DateBlockTone } from '@/components/base/display/date-block';

/**
 * Booking entry. Either pass a `Date` (preferred — handles locale formatting
 * automatically via DateBlock) OR the legacy split `day`/`month` strings for
 * backwards compatibility.
 */
export interface BookingEntry {
	id?: string;
	/** Preferred: a real Date (or ISO string / unix). DateBlock formats it. */
	date?: Date | string | number;
	/** Legacy: pre-formatted day-of-month token (e.g. "30"). */
	day?: string;
	/** Legacy: pre-formatted month token (e.g. "Apr"). */
	month?: string;
	service: string;
	customer: string;
	/** Pre-formatted time (e.g. "14:00"). */
	time: string;
	/** Pre-formatted amount (e.g. "120 BGN"). */
	amount: string;
}

export interface UpcomingBookingRowProps {
	bookings: BookingEntry[];
	className?: string;
	/** Locale for DateBlock formatting (date-fns). */
	locale?: Locale;
	/** Tone of the date block. Default `primary`. */
	dateTone?: DateBlockTone;
	/** Where to render the booking time. Default `below`. */
	timePlacement?: 'below' | 'inline-trailing';
}
