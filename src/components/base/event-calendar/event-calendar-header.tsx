/**
 * EventCalendarHeader — title, month/year picker, optional action buttons,
 * Today button, prev/next stepper, and a view-mode select. Designed to sit
 * above `EventCalendar`'s grid; can be reused independently for custom
 * layouts.
 */
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { Button, type ButtonVariant, type ButtonStyle } from '@/components/base/buttons';
import { DatePicker, MonthYearPicker } from '@/components/base/date-pickers';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import Heading from '@/components/typography/heading';
import { cn } from '@/lib/utils';
import { defaultEventCalendarStrings, type EventCalendarHeaderProps, type CalendarActionItem } from './event-calendar.types';

function resolveActionButtonVariant(actionVariant?: CalendarActionItem['variant']): {
	variant: ButtonVariant;
	buttonStyle: ButtonStyle;
	className?: string;
} {
	switch (actionVariant) {
		case 'destructive':
			return { variant: 'error', buttonStyle: 'solid' };
		case 'outline':
			return { variant: 'secondary', buttonStyle: 'outline' };
		case 'secondary':
			return { variant: 'secondary', buttonStyle: 'solid' };
		case 'ghost':
			return { variant: 'secondary', buttonStyle: 'ghost' };
		case 'default':
		default:
			return { variant: 'primary', buttonStyle: 'solid' };
	}
}

/**
 * Render a single action item
 */
const renderAction = (action: CalendarActionItem, index: number) => {
	if (!action) return null;

	if (action.element) {
		return <div className="event-calendar-header--component" key={action.id || index}>{action.element}</div>;
	}

	const IconComponent = action.icon;
	const key = action.id || `action-${index}`;

	const handleClick = () => {
		action.onClick?.();
	};

	const resolved = resolveActionButtonVariant(action.variant);

	return (
		<Button
			key={key}
			variant={resolved.variant}
			buttonStyle={resolved.buttonStyle}
			onClick={handleClick}
			className={cn('h-8 gap-2', resolved.className)}
			disabled={!!action.disabled}
		>
			{!!IconComponent && <IconComponent className="h-4 w-4" />}
			{action.label}
		</Button>
	);
};

/**
 * Calendar header component
 */
export function EventCalendarHeader({
	currentDate,
	viewMode,
	displayLabel,
	onPrevious,
	onNext,
	onToday,
	onViewModeChange,
	onDateChange,
	locale,
	actions,
	strings: stringsProp,
	rangeMode = 'date',
	minDate,
	maxDate,
	prevDisabled = false,
	nextDisabled = false,
}: EventCalendarHeaderProps) {
	const strings = {
		today: stringsProp?.today ?? defaultEventCalendarStrings.today,
		previous: stringsProp?.previous ?? defaultEventCalendarStrings.previous,
		next: stringsProp?.next ?? defaultEventCalendarStrings.next,
		viewMode: { ...defaultEventCalendarStrings.viewMode, ...(stringsProp?.viewMode ?? {}) },
	};
	const visibleActions = useMemo(() => {
		return (actions || []).filter(a => a.isVisible !== false);
	}, [actions]);

	return (
		<div className="flex items-center justify-between gap-4 mb-4">
			<div className="flex items-center gap-3">
				<Heading tag="h3" className="text-lg font-semibold">
					{displayLabel}
				</Heading>

				{rangeMode === 'month-year' ? (
					<MonthYearPicker
						value={{ month: currentDate.getMonth(), year: currentDate.getFullYear() }}
						onChange={(output) => {
							if (output.date) {
								onDateChange?.(output.date);
							}
						}}
						fromYear={minDate?.getFullYear()}
						toYear={maxDate?.getFullYear()}
						locale={locale}
					/>
				) : (
					<DatePicker
						mode="single"
						value={currentDate}
						onChange={(output) => {
							if (output.date) {
								onDateChange?.(output.date);
							}
						}}
						enableYearDropdown
						locale={locale}
						buttonVariant="ghost"
					/>
				)}
			</div>

			<div className="flex items-center gap-2">
				{visibleActions.length > 0 && (
					<>
						{visibleActions.map((action, index) => renderAction(action, index))}
						<div className="h-6 w-px bg-border mx-1" />
					</>
				)}

				<Button
					variant="secondary"
					buttonStyle="outline"
					onClick={onToday}
					className="hidden sm:inline-flex"
				>
					{strings.today}
				</Button>

				<div className="flex items-center border border-border rounded-md">
					<Button
						variant="secondary"
						buttonStyle="ghost"
						size="icon"
						onClick={onPrevious}
						disabled={prevDisabled}
						className="h-8 w-8 rounded-r-none border-r"
						aria-label={strings.previous}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>

					<Button
						variant="secondary"
						buttonStyle="ghost"
						size="icon"
						onClick={onNext}
						disabled={nextDisabled}
						className="h-8 w-8 rounded-l-none"
						aria-label={strings.next}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>

				{!!onViewModeChange && (
					<Select
						value={viewMode}
						onValueChange={(value) => {
							if (value) {
								onViewModeChange(value);
							}
						}}
					>
						<SelectTrigger className="w-28 h-8">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="month">{strings.viewMode.month}</SelectItem>
							<SelectItem value="week">{strings.viewMode.week}</SelectItem>
							<SelectItem value="agenda">{strings.viewMode.agenda}</SelectItem>
						</SelectContent>
					</Select>
				)}
			</div>
		</div>
	);
}

EventCalendarHeader.displayName = 'EventCalendarHeader';
