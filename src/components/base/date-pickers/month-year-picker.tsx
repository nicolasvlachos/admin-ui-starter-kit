import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/base/buttons';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/base/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Label, Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { useStrings } from '@/lib/strings';

import { DatePickerFooter } from './date-picker-footer';
import { DatePickerHeader } from './date-picker-header';
import { PICKER_TRIGGER_CHROME } from './date-picker';
import { defaultDatePickerStrings } from './date-pickers.strings';
import type { MonthYearPickerProps, MonthYearOutput } from './datepicker.types';
import { enUS } from 'date-fns/locale';

export function MonthYearPicker({
	value,
	defaultValue,
	onChange,
	format: dateFormat = 'yyyy-MM',
	readableFormat = 'MMMM yyyy',
	placeholder,
	label,
	hint,
	error,
	disabled = false,
	className,
	closeOnSelect = true,
	translations,
	strings,
	locale,
	header,
	footer,
	fromYear,
	toYear
}: MonthYearPickerProps) {
	const currentYear = new Date().getFullYear();
	const [open, setOpen] = React.useState(false);
	const [selection, setSelection] = React.useState<{
		month: number;
		year: number;
	} | undefined>(value ?? defaultValue);

	const dateFnsLocale = locale ?? enUS;
	const t = useStrings(defaultDatePickerStrings, strings ?? translations);

	// Year range
	const yearRange = React.useMemo(() => {
		const start = fromYear ?? 2017;
		const end = toYear ?? 2035;
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}, [fromYear, toYear]);

	// Month names (localized)
	const monthNames = React.useMemo(() => {
		return Array.from({ length: 12 }, (_, i) => {
			const date = new Date(2000, i, 1);
			return format(date, 'MMMM', { locale: dateFnsLocale });
		});
	}, [dateFnsLocale]);

	// Sync internal state with controlled value
	React.useEffect(() => {
		if (value !== undefined) {
			setSelection(value);
		}
	}, [value]);

	// Helper to create the output object
	const createOutput = React.useCallback(
		(month: number, year: number): MonthYearOutput => {
			const date = new Date(year, month, 1);
			return {
				month,
				year,
				formatted: format(date, dateFormat),
				readable: format(date, readableFormat, { locale: dateFnsLocale }),
				date
			};
		},
		[dateFormat, readableFormat, dateFnsLocale]
	);

	// Handle selection change
	const handleMonthChange = React.useCallback(
		(monthValue: unknown) => {
			const monthStr = String(monthValue);
			const month = parseInt(monthStr, 10);
			const year = selection?.year ?? currentYear;
			setSelection({ month, year });
		},
		[selection?.year, currentYear]
	);

	const handleYearChange = React.useCallback(
		(yearValue: unknown) => {
			const yearStr = String(yearValue);
			const year = parseInt(yearStr, 10);
			const month = selection?.month ?? 0;
			setSelection({ month, year });
		},
		[selection?.month]
	);

	// Handle confirm button click
	const handleConfirm = React.useCallback(() => {
		if (selection) {
			onChange?.(createOutput(selection.month, selection.year));
			if (closeOnSelect) {
				setOpen(false);
			}
		}
	}, [selection, onChange, createOutput, closeOnSelect]);

	// Button display text
	const buttonText = React.useMemo(() => {
		if (selection) {
			const date = new Date(selection.year, selection.month, 1);
			return format(date, readableFormat, { locale: dateFnsLocale });
		}
		return placeholder ?? t.selectMonthYear;
	}, [selection, readableFormat, dateFnsLocale, placeholder, t.selectMonthYear]);

	return (
		<div className={cn('month-year-picker--component', 'flex flex-col gap-2', className)}>
			{!!label && (
    <Label
					htmlFor="month-year-picker-trigger"
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
							id="month-year-picker-trigger"
							variant="secondary"
							buttonStyle="outline"
							aria-invalid={!!error}
							className={cn(
								'w-full justify-start text-left font-normal',
								PICKER_TRIGGER_CHROME,
								!selection && 'text-muted-foreground',
										(triggerProps as { className?: string }).className,
							)}
							disabled={disabled}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{buttonText}
						</Button>
					)}
				/>

				<PopoverContent
					className="w-80 p-0"
					align="start"
				>
					{/* Header */}
					{!!header && <DatePickerHeader config={header} />}

					{/* Month and Year Selectors */}
					<div className="p-4 space-y-4">
						{/* Month Selector */}
						<div className="space-y-2">
							<Label htmlFor="month-select">{t.month}</Label>
							<Select
								value={selection?.month?.toString()}
								onValueChange={handleMonthChange}
								disabled={disabled}
							>
								<SelectTrigger id="month-select" className="w-full">
									<SelectValue placeholder={t.month} />
								</SelectTrigger>
								<SelectContent>
									{monthNames.map((name, index) => (
										<SelectItem key={name} value={index.toString()}>
											{name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Year Selector */}
						<div className="space-y-2">
							<Label htmlFor="year-select">{t.year}</Label>
							<Select
								value={selection?.year?.toString()}
								onValueChange={handleYearChange}
								disabled={disabled}
							>
								<SelectTrigger id="year-select" className="w-full">
									<SelectValue placeholder={t.year} />
								</SelectTrigger>
								<SelectContent>
									{yearRange.map((year) => (
										<SelectItem key={year} value={year.toString()}>
											{year}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Confirm Button */}
					<div className="p-4 pt-0">
						<Button
							className="w-full"
							onClick={handleConfirm}
							disabled={disabled || !selection}
						>
							{t.confirm}
						</Button>
					</div>

					{/* Footer */}
					{!!footer && !!selection && (
      <DatePickerFooter
							config={footer}
							output={createOutput(selection.month, selection.year)}
							hasSelection={!!selection}
							autoSummary={buttonText}
						/>
    )}
				</PopoverContent>
			</Popover>

			{!!error && <Text type="error">{error}</Text>}

			{!!hint && !error && <Text type="secondary">{hint}</Text>}
		</div>
	);
}

// Convenience export for type
export type { MonthYearPickerProps, MonthYearOutput };

MonthYearPicker.displayName = 'MonthYearPicker';
