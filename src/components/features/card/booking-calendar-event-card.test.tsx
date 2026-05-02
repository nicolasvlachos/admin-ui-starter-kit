// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Badge } from '@/components/base/badge';
import { BookingCalendarEventCard } from './booking-calendar-event-card';

describe('BookingCalendarEventCard', () => {
	it('renders a compact SmartCard-backed event detail surface and triggers the action', async () => {
		const user = userEvent.setup();
		const onAction = vi.fn();

		render(
			<BookingCalendarEventCard
				title="Reservation #1"
				description="Romantic dinner"
				status={
					<Badge
						variant="secondary"
					>
						Confirmed
					</Badge>
				}
				items={[
					{
						id: 'date',
						label: 'Date',
						value: '2026-04-04 12:30',
					},
					{
						id: 'customer',
						label: 'Customer',
						value: 'Ada Lovelace',
					},
				]}
				actionLabel="Open booking"
				onAction={onAction}
			/>,
		);

		expect(screen.getByText('Reservation #1')).toBeInTheDocument();
		expect(screen.getByText('Romantic dinner')).toBeInTheDocument();
		expect(screen.getByText('Confirmed')).toBeInTheDocument();
		expect(screen.getByText('Date')).toBeInTheDocument();
		expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Open booking' }));

		expect(onAction).toHaveBeenCalledTimes(1);
	});
});
