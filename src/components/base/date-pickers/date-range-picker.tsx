import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/base/buttons';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/base/popover';
import { Separator } from '@/components/base/display/separator';
import { Label, Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { useStrings } from '@/lib/strings';

import { DatePickerFooter } from './date-picker-footer';
import { DatePickerHeader } from './date-picker-header';
import { PICKER_TRIGGER_CHROME } from './date-picker';
import { defaultDatePickerStrings } from './date-pickers.strings';
import type { DateRangePickerProps, DateRangeOutput } from './datepicker.types';
import { enUS } from 'date-fns/locale';

export function DateRangePicker({
	value,
	defaultValue,
	onChange,
	format: dateFormat = 'yyyy-MM-dd',
	readableFormat = 'PPP',
	placeholder,
	label,
	hint,
	error,
	disabled = false,
	className,
	withConfirm = false,
	numberOfMonths = 2,
	min,
	max,
	closeOnSelect = true,
	calendarProps,
	translations,
	strings,
	locale,
	header,
	footer,
	enableYearDropdown,
	yearSelection
}: DateRangePickerProps) {
	const [open, setOpen] = React.useState(false);
	const [range, setRange] = React.useState<DateRange | undefined>(
		value ?? defaultValue
	);

	const dateFnsLocale = locale ?? enUS;
	const t = useStrings(defaultDatePickerStrings, strings ?? translations);

	// Resolve year selection config
	const captionLayout = React.useMemo(() => {
		if (enableYearDropdown || yearSelection?.enabled) {
			return 'dropdown' as const;
		}
		return 'label' as const;
	}, [enableYearDropdown, yearSelection]);

	// Sync internal state with controlled value
	React.useEffect(() => {
		if (value !== undefined) {
			setRange(value);
		}
	}, [value]);

	// Helper to create the output object
	const createOutput = React.useCallback(
		(range: DateRange | undefined): DateRangeOutput => {
			const options = dateFnsLocale ? { locale: dateFnsLocale } : undefined;
			return {
				range,
				formatted: {
					from: range?.from ? format(range.from, dateFormat, options) : undefined,
					to: range?.to ? format(range.to, dateFormat, options) : undefined,
				},
				readable: {
					from: range?.from ? format(range.from, readableFormat, options) : undefined,
					to: range?.to ? format(range.to, readableFormat, options) : undefined,
				},
			};
		},
		[dateFormat, readableFormat, dateFnsLocale]
	);

	// Handle calendar selection
	const handleSelect = React.useCallback(
		(newRange: DateRange | undefined) => {
			// Validate min/max constraints if provided
			if (newRange?.from && newRange?.to) {
				const daysDiff = Math.ceil(
					(newRange.to.getTime() - newRange.from.getTime()) / (1000 * 60 * 60 * 24)
				) + 1;

				if (min && daysDiff < min) {
					return;
				}

				if (max && daysDiff > max) {
					return;
				}
			}

			setRange(newRange);

			if (!withConfirm) {
				onChange?.(createOutput(newRange));

				if (closeOnSelect && newRange?.from && newRange?.to) {
					setOpen(false);
				}
			}
		},
		[withConfirm, onChange, createOutput, min, max, closeOnSelect]
	);

	// Handle confirm button click
	const handleConfirm = React.useCallback(() => {
		onChange?.(createOutput(range));
		setOpen(false);
	}, [range, onChange, createOutput]);

	// Generate button text
	const buttonText = React.useMemo(() => {
		if (range?.from) {
			if (range.to) {
				return `${format(range.from, readableFormat, { locale: dateFnsLocale })} - ${format(range.to, readableFormat, { locale: dateFnsLocale })}`;
			}
			return format(range.from, readableFormat, { locale: dateFnsLocale });
		}
		return placeholder ?? t.selectDateRange;
	}, [range, readableFormat, dateFnsLocale, placeholder, t.selectDateRange]);

	// Calculate validation message if needed
	const validationMessage = React.useMemo(() => {
		if (!range?.from || !range?.to) return null;

		const daysDiff = Math.ceil(
			(range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
		) + 1;

		if (min && daysDiff < min) {
			return t.minimumDays(min);
		}

		if (max && daysDiff > max) {
			return t.maximumDays(max);
		}

		return null;
	}, [range, min, max, t]);

	const footerSummary = React.useMemo(() => {
		if (!range?.from || !range?.to) {
			return undefined;
		}

		const fromText = format(range.from, readableFormat, { locale: dateFnsLocale });
		const toText = format(range.to, readableFormat, { locale: dateFnsLocale });

		return `${fromText} - ${toText}`;
	}, [range, readableFormat, dateFnsLocale]);

	return (
		<div className={cn('date-range-picker--component', 'flex flex-col gap-2', className)}>
			{!!label && (
    <Label
					htmlFor="date-range-picker-trigger"
					className={cn(error && 'text-destructive')}
				>
					{label}
				</Label>
  )}

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger
					render={(triggerProps) => (
						<Button
							{...triggerProps}
							id="date-range-picker-trigger"
							variant="secondary"
							buttonStyle="outline"
							aria-invalid={!!error}
							className={cn(
								'w-full justify-start text-left font-normal',
								PICKER_TRIGGER_CHROME,
								!range && 'text-muted-foreground',
										(triggerProps as { className?: string }).className,
							)}
							disabled={disabled}
						>
							<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
							<span className="truncate">{buttonText}</span>
						</Button>
					)}
				/>

				<PopoverContent
					className="w-auto p-0"
					align="start"
				>
					{/* Header */}
					{!!header && <DatePickerHeader config={header} />}

					<div className="flex flex-col">
						<Calendar
							mode="range"
							selected={range}
							onSelect={handleSelect}
							defaultMonth={range?.from}
							numberOfMonths={numberOfMonths}
							disabled={disabled}
							locale={dateFnsLocale}
							captionLayout={captionLayout}
							fromYear={yearSelection?.fromYear}
							toYear={yearSelection?.toYear}
							{...calendarProps}
						/>

						{/* Display selected dates and validation */}
						{!!(range?.from || validationMessage || withConfirm || footer) && <>
								<Separator />
								<div className="flex flex-col gap-3 p-3">
									{/* Selected date display (only if no footer) */}
									{!!range?.from && !footer && (
          <div className="flex items-center justify-between gap-4">
											<div className="flex items-center gap-2">
												<Text tag="span" type="secondary">{t.from}:</Text>
												<Text tag="span" weight="medium">
													{format(range.from, readableFormat, { locale: dateFnsLocale })}
												</Text>
											</div>
											{!!range.to && (
            <div className="flex items-center gap-2">
													<Text tag="span" type="secondary">{t.to}:</Text>
													<Text tag="span" weight="medium">
														{format(range.to, readableFormat, { locale: dateFnsLocale })}
													</Text>
												</div>
          )}
										</div>
        )}

									{/* Validation message */}
									{!!validationMessage && <Text type="error">{validationMessage}</Text>}

									{/* Confirm button (only if no footer) */}
									{!!withConfirm && !footer && (
          <Button
											onClick={handleConfirm}
											disabled={!range?.from || !range?.to || !!validationMessage}
											className="w-full"
										>
											{t.confirm}
										</Button>
        )}

									{/* Custom footer */}
									{!!footer && (
          <div className="-mx-3 -mb-3">
											<DatePickerFooter
												config={footer}
												output={createOutput(range)}
												hasSelection={!!(range?.from && range?.to)}
												autoSummary={footerSummary}
											/>
										</div>
        )}
								</div>
							</>}
					</div>
				</PopoverContent>
			</Popover>

			{!!error && <Text type="error">{error}</Text>}

			{!!hint && !error && <Text type="secondary">{hint}</Text>}
		</div>
	);
}

// Convenience exports
export default DateRangePicker;
export type { DateRangePickerProps, DateRangeOutput };

DateRangePicker.displayName = 'DateRangePicker';
