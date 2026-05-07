import { useState } from 'react';
import { Heart, Star, Sparkles } from 'lucide-react';
import { bg } from 'date-fns/locale';
import { EventCalendar } from '@/components/base/event-calendar/event-calendar';
import type { CalendarEvent, EventCategory } from '@/components/base/event-calendar/event-calendar.types';

const today = new Date();
function offset(days: number, hour = 10) {
	const d = new Date(today);
	d.setDate(d.getDate() + days);
	d.setHours(hour, 0, 0, 0);
	return d;
}

const categories: EventCategory[] = [
	{ id: 'spa', label: 'Spa & Wellness', color: 'green', icon: Heart },
	{ id: 'wine', label: 'Wine & Dine', color: 'purple', icon: Star },
	{ id: 'adventure', label: 'Adventure', color: 'amber', icon: Sparkles },
];

const events: CalendarEvent[] = [
	{ id: '1', title: 'Couples Spa', category: 'spa', startDate: offset(0, 14) },
	{ id: '2', title: 'Wine Tasting', category: 'wine', startDate: offset(2, 18) },
	{ id: '3', title: 'Hot Air Balloon', category: 'adventure', startDate: offset(4, 6) },
	{ id: '4', title: 'Hot Stone Massage', category: 'spa', startDate: offset(7, 10) },
	{ id: '5', title: 'Sommelier Tour', category: 'wine', startDate: offset(7, 18) },
	{ id: '6', title: 'Paragliding', category: 'adventure', startDate: offset(11, 9) },
	{ id: '7', title: 'Aroma Therapy', category: 'spa', startDate: offset(14, 11) },
];

export function Default() {
	const [visible, setVisible] = useState<string[]>([]);
	return (
		<>
			<EventCalendar
								events={events}
								categories={categories}
								enableCategoryFilter
								visibleCategories={visible}
								onVisibleCategoriesChange={setVisible}
							/>
		</>
	);
}

export function RangeModeMonthYearCompactMonthYearJump() {
	return (
		<>
			<EventCalendar
								events={events}
								categories={categories}
								rangeMode="month-year"
							/>
		</>
	);
}

export function NavigationLimitsDisabledDates() {
	return (
		<>
			<EventCalendar
								events={events}
								categories={categories}
								minDate={offset(-30)}
								maxDate={offset(60)}
								disabledDates={(date) => date.getDay() === 0}
							/>
		</>
	);
}

export function FilterEventRenderEventCustomEventRendering() {
	return (
		<>
			<EventCalendar
								events={events}
								categories={categories}
								filterEvent={(e) => e.category !== 'wine'}
								renderEvent={(event, category) => (
									<div className="px-1.5 py-0.5 text-[10px] rounded bg-foreground/8 text-foreground truncate">
										{category?.label?.split(' ')[0] ?? ''} · {event.title}
									</div>
								)}
							/>
		</>
	);
}

export function DayHeadingVariantTinted() {
	return (
		<>
			<EventCalendar events={events} categories={categories} dayHeadingVariant="tinted" />
		</>
	);
}

export function DayHeadingVariantBordered() {
	return (
		<>
			<EventCalendar events={events} categories={categories} dayHeadingVariant="bordered" />
		</>
	);
}

export function DayHeadingVariantAccent() {
	return (
		<>
			<EventCalendar events={events} categories={categories} dayHeadingVariant="accent" />
		</>
	);
}

export function WithCustomStringsBG() {
	return (
		<>
			<EventCalendar
								events={events}
								categories={categories}
								locale={bg}
								strings={{
									today: 'Днес',
									previous: 'Назад',
									next: 'Напред',
									loading: 'Зарежда…',
									booking: 'резервация',
									bookings: 'резервации',
									viewMode: { month: 'Месец', week: 'Седмица', agenda: 'Списък' },
									weekdaysShort: ['Нед', 'Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб'],
								}}
							/>
		</>
	);
}
