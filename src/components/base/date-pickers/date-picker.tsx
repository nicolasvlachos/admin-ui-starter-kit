import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import type { Locale as DateFnsLocale } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { Button, type ButtonVariant, type ButtonStyle } from '@/components/base/buttons';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/base/popover';
import { Separator } from '@/components/base/display/separator';
import { Label, Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { DatePickerFooter } from './date-picker-footer';
import { DatePickerHeader } from './date-picker-header';
import {
	createDateOutput,
	createMultipleDatesOutput,
	createDateRangeOutput,
	applyTimeToDate,
	applyTimeToRange,
	validateDateRange,
	getRangeValidationMessage,
	getMultipleDatesValidationMessage,
	formatDateButtonText,
	formatMultipleDatesButtonText,
	formatRangeButtonText,
	createDefaultNormalizedTime,
	formatNormalizedTimeForDisplay,
	readableFormatIncludesTime,
	alignNormalizedTimeToStep
} from './date-picker-helpers';
import type { NormalizedTime } from './date-picker-helpers';
import { useStrings } from '@/lib/strings';
import { defaultDatePickerStrings } from './date-pickers.strings';
import { enUS } from 'date-fns/locale';
import type {
	DatePickerProps,
	DatepickerProps,
	MultipleDatepickerProps,
	DateRangePickerProps,
	DateOutput,
	MultipleDatesOutput,
	DateRangeOutput,
	DatePickerTranslations,
	PresetDateRange
} from './datepicker.types';
import { SegmentedTimeInput } from './segmented-time-input';

type PickerButtonVariant = 'outline' | 'ghost' | 'secondary';

function resolvePickerButtonVariant(variant: unknown): PickerButtonVariant {
	if (variant === 'ghost') return 'ghost';
	if (variant === 'secondary') return 'secondary';
	return 'outline';
}

function resolvePickerButtonProps(variant: unknown): { variant: ButtonVariant; buttonStyle: ButtonStyle } {
	const resolved = resolvePickerButtonVariant(variant);
	if (resolved === 'ghost') return { variant: 'secondary', buttonStyle: 'ghost' };
	if (resolved === 'secondary') return { variant: 'secondary', buttonStyle: 'solid' };
	return { variant: 'secondary', buttonStyle: 'outline' };
}

// Type guards
function isSingleMode(props: DatePickerProps): props is DatepickerProps {
	return !props.mode || props.mode === 'single';
}

function isMultipleMode(props: DatePickerProps): props is MultipleDatepickerProps {
	return props.mode === 'multiple';
}

function isRangeMode(props: DatePickerProps): props is DateRangePickerProps {
	return props.mode === 'range';
}

// Default preset ranges — labels resolved from DatePickerTranslations.
function getDefaultPresets(t: DatePickerTranslations): PresetDateRange[] {
	return [
		{
			label: t.today,
			getValue: () => ({ from: new Date(), to: new Date() }),
		},
		{
			label: t.thisWeek,
			getValue: () => ({
				from: startOfWeek(new Date(), { weekStartsOn: 1 }),
				to: endOfWeek(new Date(), { weekStartsOn: 1 })
			}),
		},
		{
			label: t.thisMonth,
			getValue: () => ({
				from: startOfMonth(new Date()),
				to: endOfMonth(new Date())
			}),
		},
		{
			label: t.last30Days,
			getValue: () => ({
				from: addDays(new Date(), -30),
				to: new Date()
			}),
		},
	];
}

export function DatePicker(props: DatePickerProps) {
	const [open, setOpen] = React.useState(false);

	// Resolve locale (date-fns Locale object). Defaults to enUS when the
	// consumer doesn't pass one.
	const dateFnsLocale = props.locale ?? enUS;

	// Strings — deep-merge consumer overrides (`strings` preferred,
	// `translations` accepted as legacy alias) over the English defaults.
	const t = useStrings(defaultDatePickerStrings, props.strings ?? props.translations);

	// Resolve year selection config
	const captionLayout = React.useMemo(() => {
		if (props.enableYearDropdown || props.yearSelection?.enabled) {
			return 'dropdown' as const;
		}
		return 'label' as const;
	}, [props.enableYearDropdown, props.yearSelection]);

	// Render based on mode
	if (isSingleMode(props)) {
		return (
			<SingleDatePicker
				{...props}
				open={open}
				setOpen={setOpen}
				t={t}
				dateFnsLocale={dateFnsLocale}
				captionLayout={captionLayout}
			/>
		);
	}

	if (isMultipleMode(props)) {
		return (
			<MultipleDatePicker
				{...props}
				open={open}
				setOpen={setOpen}
				t={t}
				dateFnsLocale={dateFnsLocale}
				captionLayout={captionLayout}
			/>
		);
	}

	if (isRangeMode(props)) {
		return (
			<RangeDatePicker
				{...props}
				open={open}
				setOpen={setOpen}
				t={t}
				dateFnsLocale={dateFnsLocale}
				captionLayout={captionLayout}
			/>
		);
	}

	return null;
}

// Single Date Picker Component
function SingleDatePicker({
	value,
	defaultValue,
	onChange,
	format: dateFormat = 'yyyy-MM-dd',
	readableFormat = 'PPP',
	placeholder,
	closeOnSelect = true,
	withTime,
	disabledDates,
	calendarProps,
	open,
	setOpen,
	t,
	dateFnsLocale,
	captionLayout,
	...baseProps
}: DatepickerProps & {
	open: boolean;
	setOpen: (open: boolean) => void;
	t: typeof defaultDatePickerStrings;
	dateFnsLocale: DateFnsLocale;
	captionLayout: 'label' | 'dropdown';
}) {
	const triggerId = React.useId();
	const describedBy = `${triggerId}-description`;
	const hasError = baseProps.error !== undefined && baseProps.error !== null && baseProps.error !== '';
	const ariaDescribedBy = hasError ? describedBy : undefined;
	const hasHint = baseProps.hint !== undefined && baseProps.hint !== null && baseProps.hint !== '';
	const errorText = typeof baseProps.error === 'string' ? baseProps.error : '';
	const hintText = typeof baseProps.hint === 'string' ? baseProps.hint : '';
	const timeFormat = withTime?.format ?? '24';
	const timeStep = withTime?.step ?? 60;
	const includeSeconds = withTime?.showSeconds ?? false;
	const readableHasTime = readableFormatIncludesTime(readableFormat);
	const showTimeInButton = withTime?.showTimeInButton ?? !readableHasTime;
	const [date, setDate] = React.useState<Date | undefined>(() => {
		return value ?? defaultValue;
	});

	const [time, setTime] = React.useState<NormalizedTime>(() =>
		createDefaultNormalizedTime(value ?? defaultValue, includeSeconds, timeStep)
	);
	const previousValueRef = React.useRef<Date | undefined>(value ?? defaultValue ?? undefined);
	const defaultInitializedRef = React.useRef(false);
	const lastValueDefinedRef = React.useRef(value !== undefined);

	// Create output helper
	const createOutput = React.useCallback(
		(selectedDate: Date | undefined, overrideTime?: NormalizedTime): DateOutput => {
			let finalDate = selectedDate;
			if (selectedDate && withTime?.enabled) {
				const applied = applyTimeToDate(selectedDate, overrideTime ?? time);
				finalDate = Number.isFinite(applied.getTime()) ? applied : undefined;
			}
			return createDateOutput(finalDate, dateFormat, readableFormat, dateFnsLocale);
		},
		[dateFormat, readableFormat, dateFnsLocale, withTime, time]
	);

	React.useEffect(() => {
		const isTimeEnabled = Boolean(withTime?.enabled);
		const wasValueDefined = lastValueDefinedRef.current;
		const isValueDefined = value !== undefined;

		const applyState = (baseDate: Date, emitChange: boolean) => {
			const normalized = alignNormalizedTimeToStep(
				createDefaultNormalizedTime(baseDate, includeSeconds, timeStep),
				timeStep,
				includeSeconds
			);
			setDate((current) => {
				const currentTime = current?.getTime?.();
				const nextTime = baseDate.getTime();
				return currentTime !== nextTime ? baseDate : current;
			});
			setTime((current) => {
				if (
					current.hours === normalized.hours &&
					current.minutes === normalized.minutes &&
					current.seconds === normalized.seconds
				) {
					return current;
				}
				return normalized;
			});
			previousValueRef.current = baseDate;
			defaultInitializedRef.current = true;
			if (emitChange && isTimeEnabled) {
				const applied = applyTimeToDate(baseDate, normalized);
				onChange?.(createDateOutput(applied, dateFormat, readableFormat, dateFnsLocale));
			}
		};

		if (!isTimeEnabled) {
			defaultInitializedRef.current = false;
			previousValueRef.current = value ?? defaultValue ?? undefined;
			setDate(value ?? defaultValue);
			lastValueDefinedRef.current = isValueDefined;
			return;
		}

		const prev = previousValueRef.current;
		const prevTime = prev?.getTime?.();
		const valueTime = value?.getTime?.();

		if (!isValueDefined && wasValueDefined && defaultValue === undefined) {
			defaultInitializedRef.current = false;
			previousValueRef.current = undefined;
		}

		if (value !== undefined && valueTime !== prevTime) {
			applyState(value, false);
			lastValueDefinedRef.current = isValueDefined;
			return;
		}

		if (value === undefined && defaultValue !== undefined) {
			const defaultMillis = defaultValue.getTime();
			if (prevTime !== defaultMillis || !defaultInitializedRef.current) {
				applyState(defaultValue, false);
			}
			lastValueDefinedRef.current = isValueDefined;
			return;
		}

		if (value === undefined && defaultValue === undefined && !defaultInitializedRef.current) {
			defaultInitializedRef.current = true;
			lastValueDefinedRef.current = isValueDefined;
			return;
		}

		lastValueDefinedRef.current = isValueDefined;
	}, [
		withTime?.enabled,
		value,
		defaultValue,
		includeSeconds,
		timeStep,
		onChange,
		dateFormat,
		readableFormat,
		dateFnsLocale,
	]);

	React.useEffect(() => {
		if (!withTime?.enabled) {
			return;
		}
		setTime((current) => {
			const aligned = alignNormalizedTimeToStep(current, timeStep, includeSeconds);
			if (
				current.hours === aligned.hours &&
				current.minutes === aligned.minutes &&
				current.seconds === aligned.seconds
			) {
				return current;
			}
			return aligned;
		});
	}, [withTime?.enabled, timeStep, includeSeconds]);

	// Handle selection
	const handleSelect = React.useCallback(
		(newDate: Date | undefined) => {
			setDate(newDate);
			if (withTime?.enabled && newDate) {
				defaultInitializedRef.current = true;
				previousValueRef.current = newDate;
			}
			if (withTime?.enabled) {
				onChange?.(createOutput(newDate));
				if (closeOnSelect && newDate) {
					setOpen(false);
				}
				return;
			}

			onChange?.(createOutput(newDate));
			if (closeOnSelect && newDate) {
				setOpen(false);
			}
		},
		[onChange, createOutput, closeOnSelect, setOpen, withTime]
	);

	// Handle time change
	const handleTimeChange = React.useCallback(
		(nextTime: NormalizedTime) => {
			setTime(nextTime);
			if (date) {
				onChange?.(createOutput(date, nextTime));
			}
		},
		[date, onChange, createOutput]
	);

	const timeDisplay = React.useMemo(() => {
		if (!withTime?.enabled) {
			return undefined;
		}
		return formatNormalizedTimeForDisplay(time, includeSeconds, timeFormat, {
			am: t.am,
			pm: t.pm,
		});
	}, [withTime?.enabled, time, includeSeconds, timeFormat, t]);

	// Button text
	const buttonText = React.useMemo(
		() => formatDateButtonText(
			date,
			readableFormat,
			placeholder,
			t.selectDate,
			showTimeInButton ? timeDisplay : undefined,
			dateFnsLocale
		),
		[date, readableFormat, placeholder, t, timeDisplay, showTimeInButton, dateFnsLocale]
	);

	const footerSummary = React.useMemo(
		() => (date ? format(date, readableFormat, { locale: dateFnsLocale }) : undefined),
		[date, readableFormat, dateFnsLocale]
	);

	return (
		<div className={cn('space-y-2', baseProps.className)}>
			{!!(baseProps.label || hasHint) && (
    <div className="flex items-center justify-between gap-1">
					{!!baseProps.label && (
      <Label
							htmlFor={triggerId}
							className={cn('leading-6', hasError && 'text-destructive')}
						>
							{baseProps.label}
						</Label>
    )}
					{!hasError && !!hasHint && (
      <Text tag="span" type="secondary">
							{hintText}
						</Text>
    )}
				</div>
  )}

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger
						render={(triggerProps) => {
							const resolved = resolvePickerButtonProps(baseProps.buttonVariant);

							return (
								<Button
									{...triggerProps}
									id={triggerId}
									variant={resolved.variant}
									buttonStyle={resolved.buttonStyle}
									aria-invalid={hasError}
									aria-describedby={ariaDescribedBy}
									className={cn(
										'w-full justify-start text-left font-normal',
										!date && 'text-muted-foreground',
										baseProps.error && 'border-destructive focus-visible:ring-destructive',
										(triggerProps as { className?: string }).className,
									)}
									disabled={baseProps.disabled}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{buttonText}
								</Button>
							);
						}}
					/>

				<PopoverContent
					className="w-auto p-0"
					align="start"
				>
					{/* Header */}
					{!!baseProps.header && <DatePickerHeader config={baseProps.header} />}

					{/* Calendar */}
					<Calendar
						mode="single"
						selected={date}
						onSelect={handleSelect}
						defaultMonth={date}
						numberOfMonths={baseProps.numberOfMonths}
						showOutsideDays={baseProps.showOutsideDays}
						disabled={disabledDates ?? baseProps.disabled}
						locale={dateFnsLocale}
						captionLayout={captionLayout}
						fromYear={baseProps.yearSelection?.fromYear}
						toYear={baseProps.yearSelection?.toYear}
						{...calendarProps}
					/>

					{/* Time Selection */}
					{!!withTime?.enabled && <>
							<Separator />
							<div className="p-3">
								<Label size="sm">{t.startTime}</Label>
								<div className="mt-2 flex items-center gap-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<SegmentedTimeInput
										value={time}
										onChange={handleTimeChange}
										format={timeFormat}
										includeSeconds={includeSeconds}
										step={timeStep}
										disabled={baseProps.disabled}
										labels={{
											hours: t.hours,
											minutes: t.minutes,
											seconds: includeSeconds ? t.seconds : undefined,
										}}
										periodLabels={{ am: t.am, pm: t.pm }}
									/>
								</div>
							</div>
						</>}

					{/* Footer */}
					{!!baseProps.footer && (
      <DatePickerFooter
							config={baseProps.footer}
							output={createOutput(date)}
							hasSelection={!!date}
							autoSummary={footerSummary}
						/>
    )}
				</PopoverContent>
			</Popover>

			{!!hasError && <Text id={describedBy} size="xs" type="error" content={errorText} />}
		</div>
	);
}

// Multiple Date Picker Component
function MultipleDatePicker({
	value,
	defaultValue,
		onChange,
		format: dateFormat = 'yyyy-MM-dd',
		readableFormat = 'PPP',
		placeholder,
		min,
	max,
	required,
	disabledDates,
	calendarProps,
	open,
	setOpen,
	t,
	dateFnsLocale,
	captionLayout,
	...baseProps
}: MultipleDatepickerProps & {
	open: boolean;
	setOpen: (open: boolean) => void;
	t: typeof defaultDatePickerStrings;
	dateFnsLocale: DateFnsLocale;
	captionLayout: 'label' | 'dropdown';
}) {
	const triggerId = React.useId();
	const describedBy = `${triggerId}-description`;
	const hasError = baseProps.error !== undefined && baseProps.error !== null && baseProps.error !== '';
	const ariaDescribedBy = hasError ? describedBy : undefined;
	const hasHint = baseProps.hint !== undefined && baseProps.hint !== null && baseProps.hint !== '';
	const errorText = typeof baseProps.error === 'string' ? baseProps.error : '';
	const hintText = typeof baseProps.hint === 'string' ? baseProps.hint : '';
	const [dates, setDates] = React.useState<Date[]>(value ?? defaultValue ?? []);

	// Sync with controlled value
	React.useEffect(() => {
		if (value !== undefined) {
			setDates(value);
		}
	}, [value]);

	// Create output helper
	const createOutput = React.useCallback(
		(dates: Date[]): MultipleDatesOutput =>
			createMultipleDatesOutput(dates, dateFormat, readableFormat, dateFnsLocale),
		[dateFormat, readableFormat, dateFnsLocale]
	);

	// Handle selection
	const handleSelect = React.useCallback(
		(newDates?: Date[] | Date) => {
			const selectedDates = Array.isArray(newDates) ? newDates : newDates ? [newDates] : [];

			if (max && selectedDates.length > max) {
				return;
			}

			setDates(selectedDates);
			onChange?.(createOutput(selectedDates));
		},
		[onChange, createOutput, max]
	);

	// Button text
	const buttonText = React.useMemo(() =>
		formatMultipleDatesButtonText(dates, readableFormat, placeholder, t.selectDates, t, dateFnsLocale),
		[dates, readableFormat, placeholder, t, dateFnsLocale]
	);

	// Validation message
	const validationMessage = React.useMemo(() =>
		getMultipleDatesValidationMessage(dates, min, max, required, t),
		[dates, min, max, required, t]
	);

	const footerSummary = React.useMemo(
		() => (dates.length > 0 ? t.datesSelected(dates.length) : undefined),
		[dates.length, t]
	);

	return (
		<div className={cn('space-y-2', baseProps.className)}>
			{!!(baseProps.label || hasHint) && (
    <div className="flex items-center justify-between gap-1">
					{!!baseProps.label && (
      <Label
							htmlFor={triggerId}
							className={cn('leading-6', hasError && 'text-destructive')}
						>
							{baseProps.label}
						</Label>
    )}
					{!hasError && !!hasHint && (
      <Text tag="span" type="secondary">
							{hintText}
						</Text>
    )}
				</div>
  )}

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger
						render={(triggerProps) => {
							const resolved = resolvePickerButtonProps(baseProps.buttonVariant);

							return (
								<Button
									{...triggerProps}
									id={triggerId}
									variant={resolved.variant}
									buttonStyle={resolved.buttonStyle}
									aria-invalid={hasError}
									aria-describedby={ariaDescribedBy}
									className={cn(
										'w-full justify-start text-left font-normal',
										dates.length === 0 && 'text-muted-foreground',
										baseProps.error && 'border-destructive focus-visible:ring-destructive',
										(triggerProps as { className?: string }).className,
									)}
									disabled={baseProps.disabled}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									<span className="truncate">{buttonText}</span>
								</Button>
							);
						}}
					/>

				<PopoverContent
					className="w-auto p-0"
					align="start"
				>
					{/* Header */}
					{!!baseProps.header && <DatePickerHeader config={baseProps.header} />}

					{/* Calendar */}
					<Calendar
						mode="multiple"
						selected={dates}
						onSelect={handleSelect}
						defaultMonth={dates[0]}
						numberOfMonths={baseProps.numberOfMonths}
						showOutsideDays={baseProps.showOutsideDays}
						disabled={disabledDates ?? baseProps.disabled}
						locale={dateFnsLocale}
						captionLayout={captionLayout}
						fromYear={baseProps.yearSelection?.fromYear}
						toYear={baseProps.yearSelection?.toYear}
						required={required}
						max={max}
						{...calendarProps}
					/>

					{/* Validation Message */}
					{!!validationMessage && <>
							<Separator />
							<div className="p-3">
								<Text type="secondary">{validationMessage}</Text>
							</div>
						</>}

					{/* Footer */}
					{!!baseProps.footer && (
      <DatePickerFooter
							config={baseProps.footer}
							output={createOutput(dates)}
							hasSelection={dates.length > 0}
							autoSummary={footerSummary}
						/>
    )}
				</PopoverContent>
			</Popover>

			{!!hasError && <Text id={describedBy} size="xs" type="error" content={errorText} />}
		</div>
	);
}

// Range Date Picker Component
function RangeDatePicker({
	value,
	defaultValue,
	onChange,
	format: dateFormat = 'yyyy-MM-dd',
	readableFormat = 'PPP',
	placeholder,
	withConfirm = false,
	min,
	max,
	closeOnSelect = true,
	withTime,
	presets: presetsProp,
	disabledDates,
	calendarProps,
	open,
	setOpen,
	t,
	dateFnsLocale,
	captionLayout,
	...baseProps
}: DateRangePickerProps & {
	open: boolean;
	setOpen: (open: boolean) => void;
	t: typeof defaultDatePickerStrings;
	dateFnsLocale: DateFnsLocale;
	captionLayout: 'label' | 'dropdown';
}) {
	const presets = presetsProp ?? getDefaultPresets(t);
	const triggerId = React.useId();
	const describedBy = `${triggerId}-description`;
	const hasError = baseProps.error !== undefined && baseProps.error !== null && baseProps.error !== '';
	const ariaDescribedBy = hasError ? describedBy : undefined;
	const hasHint = baseProps.hint !== undefined && baseProps.hint !== null && baseProps.hint !== '';
	const errorText = typeof baseProps.error === 'string' ? baseProps.error : '';
	const hintText = typeof baseProps.hint === 'string' ? baseProps.hint : '';
	const timeFormat = withTime?.format ?? '24';
	const timeStep = withTime?.step ?? 60;
	const includeSeconds = withTime?.showSeconds ?? false;
	const readableHasTime = readableFormatIncludesTime(readableFormat);
	const showTimeInButton = withTime?.showTimeInButton ?? !readableHasTime;
	const showTimeInSummary = withTime?.showTimeInSummary ?? !readableHasTime;
	const initialRange = value ?? defaultValue;
	const [range, setRange] = React.useState<DateRange | undefined>(initialRange);
	const [startTime, setStartTime] = React.useState<NormalizedTime>(() =>
		createDefaultNormalizedTime(initialRange?.from, includeSeconds, timeStep)
	);
	const [endTime, setEndTime] = React.useState<NormalizedTime>(() =>
		createDefaultNormalizedTime(initialRange?.to, includeSeconds, timeStep)
	);
	const previousValueRef = React.useRef<DateRange | undefined>(value);

	// Validation message
	const validationMessage = React.useMemo(() =>
		getRangeValidationMessage(range, min, max, t),
		[range, min, max, t]
	);

	const hasValidationMessage = validationMessage !== undefined && validationMessage !== null && validationMessage !== '';
	const validationText = typeof validationMessage === 'string' ? validationMessage : '';

	// Sync with controlled value
	React.useEffect(() => {
		if (value !== undefined) {
			setRange(value);
		}
	}, [value]);

	// Sync time segments when external range changes
	React.useEffect(() => {
		if (!withTime?.enabled) {
			previousValueRef.current = value;
			return;
		}

		const prev = previousValueRef.current;
		const nextFrom = value?.from;
		const nextTo = value?.to;

		if (nextFrom) {
			setStartTime(createDefaultNormalizedTime(nextFrom, includeSeconds, timeStep));
		} else if (prev?.from) {
			setStartTime(createDefaultNormalizedTime(undefined, includeSeconds, timeStep));
		}

		if (nextTo) {
			setEndTime(createDefaultNormalizedTime(nextTo, includeSeconds, timeStep));
		} else if (prev?.to) {
			setEndTime(createDefaultNormalizedTime(undefined, includeSeconds, timeStep));
		}

		previousValueRef.current = value;
	}, [value, withTime?.enabled, includeSeconds, timeStep]);

	React.useEffect(() => {
		if (!withTime?.enabled) {
			return;
		}
		setStartTime((current) => {
			const aligned = alignNormalizedTimeToStep(current, timeStep, includeSeconds);
			if (
				current.hours === aligned.hours &&
				current.minutes === aligned.minutes &&
				current.seconds === aligned.seconds
			) {
				return current;
			}
			return aligned;
		});
		setEndTime((current) => {
			const aligned = alignNormalizedTimeToStep(current, timeStep, includeSeconds);
			if (
				current.hours === aligned.hours &&
				current.minutes === aligned.minutes &&
				current.seconds === aligned.seconds
			) {
				return current;
			}
			return aligned;
		});
	}, [withTime?.enabled, timeStep, includeSeconds]);

	// Create output helper
	const createOutput = React.useCallback(
		(currentRange: DateRange | undefined): DateRangeOutput => {
			let finalRange = currentRange;
			if (currentRange && withTime?.enabled) {
				finalRange = applyTimeToRange(currentRange, startTime, endTime);
			}
			return createDateRangeOutput(finalRange, dateFormat, readableFormat, dateFnsLocale);
		},
		[dateFormat, readableFormat, dateFnsLocale, withTime, startTime, endTime]
	);

	const handleStartTimeChange = React.useCallback((next: NormalizedTime) => {
		setStartTime(next);
	}, []);

	const handleEndTimeChange = React.useCallback((next: NormalizedTime) => {
		setEndTime(next);
	}, []);

	// Handle selection
	const handleSelect = React.useCallback(
		(newRange: DateRange | undefined) => {
			const validation = validateDateRange(newRange, min, max);
			if (newRange && !validation.isValid) {
				return;
			}

			setRange(newRange);

			if (!withConfirm && !withTime?.enabled) {
				onChange?.(createOutput(newRange));
				if (closeOnSelect && newRange?.from && newRange?.to) {
					setOpen(false);
				}
			}
		},
		[withConfirm, withTime, onChange, createOutput, min, max, closeOnSelect, setOpen]
	);

	// Handle preset selection
	const handlePresetSelect = React.useCallback(
		(preset: PresetDateRange) => {
			const range = preset.getValue();
			handleSelect(range);
		},
		[handleSelect]
	);

	// Handle confirm
	const handleConfirm = React.useCallback(() => {
		onChange?.(createOutput(range));
		setOpen(false);
	}, [range, onChange, createOutput, setOpen]);

	const startTimeDisplay = React.useMemo(() => {
		if (!withTime?.enabled) {
			return undefined;
		}
		return formatNormalizedTimeForDisplay(startTime, includeSeconds, timeFormat, {
			am: t.am,
			pm: t.pm,
		});
	}, [withTime?.enabled, startTime, includeSeconds, timeFormat, t]);

	const endTimeDisplay = React.useMemo(() => {
		if (!withTime?.enabled) {
			return undefined;
		}
		return formatNormalizedTimeForDisplay(endTime, includeSeconds, timeFormat, {
			am: t.am,
			pm: t.pm,
		});
	}, [withTime?.enabled, endTime, includeSeconds, timeFormat, t]);

	// Button text
	const buttonText = React.useMemo(() => {
		if (withTime?.enabled && range?.from) {
			const fromBase = format(range.from, readableFormat, { locale: dateFnsLocale });
			const fromText = showTimeInButton && startTimeDisplay ? `${fromBase} ${startTimeDisplay}` : fromBase;
			if (range.to) {
				const toBase = format(range.to, readableFormat, { locale: dateFnsLocale });
				const toText = showTimeInButton && endTimeDisplay ? `${toBase} ${endTimeDisplay}` : toBase;
				return `${fromText} - ${toText}`;
			}
			return fromText;
		}
		return formatRangeButtonText(range, readableFormat, placeholder, t.selectDateRange, dateFnsLocale);
	}, [withTime?.enabled, range, readableFormat, showTimeInButton, startTimeDisplay, endTimeDisplay, placeholder, t, dateFnsLocale]);

	const footerSummary = React.useMemo(() => {
		if (!range?.from || !range?.to) {
			return undefined;
		}

		const fromBase = format(range.from, readableFormat, { locale: dateFnsLocale });
		const toBase = format(range.to, readableFormat, { locale: dateFnsLocale });
		const fromText = showTimeInSummary && startTimeDisplay ? `${fromBase} ${startTimeDisplay}` : fromBase;
		const toText = showTimeInSummary && endTimeDisplay ? `${toBase} ${endTimeDisplay}` : toBase;

		return `${fromText} - ${toText}`;
	}, [range, readableFormat, dateFnsLocale, showTimeInSummary, startTimeDisplay, endTimeDisplay]);

	return (
		<div className={cn('space-y-2', baseProps.className)}>
			{!!(baseProps.label || hasHint) && (
    <div className="flex items-center justify-between gap-1">
					{!!baseProps.label && (
      <Label
							htmlFor={triggerId}
							className={cn('leading-6', hasError && 'text-destructive')}
						>
							{baseProps.label}
						</Label>
    )}
					{!hasError && !!hasHint && (
      <Text tag="span" type="secondary">
							{hintText}
						</Text>
    )}
				</div>
  )}

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger
						render={(triggerProps) => {
							const resolved = resolvePickerButtonProps(baseProps.buttonVariant);

							return (
								<Button
									{...triggerProps}
									id={triggerId}
									variant={resolved.variant}
									buttonStyle={resolved.buttonStyle}
									aria-invalid={hasError}
									aria-describedby={ariaDescribedBy}
									className={cn(
										'w-full justify-start text-left font-normal',
										!range && 'text-muted-foreground',
										baseProps.error && 'border-destructive focus-visible:ring-destructive',
										(triggerProps as { className?: string }).className,
									)}
									disabled={baseProps.disabled}
								>
									<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
									<span className="truncate">{buttonText}</span>
								</Button>
							);
						}}
					/>

				<PopoverContent
					className="w-auto p-0"
					align="start"
				>
					{/* Header */}
					{!!baseProps.header && <DatePickerHeader config={baseProps.header} />}

					<div className="flex">
						{/* Presets sidebar */}
						{presets.length > 0 && (
							<div className="flex flex-col gap-0.5 border-r p-2 min-w-[7.5rem]">
								{presets.map((preset) => (
									<Button
										key={preset.label}
										variant="secondary"
										buttonStyle="ghost"
										onClick={() => handlePresetSelect(preset)}
										className="justify-start font-normal text-muted-foreground hover:text-foreground"
									>
										{preset.label}
									</Button>
								))}
							</div>
						)}

						{/* Calendar */}
						<div className="flex flex-col">
							<Calendar
								mode="range"
								selected={range}
								onSelect={handleSelect}
								defaultMonth={range?.from}
								numberOfMonths={baseProps.numberOfMonths ?? 2}
								showOutsideDays={baseProps.showOutsideDays}
								disabled={disabledDates ?? baseProps.disabled}
								locale={dateFnsLocale}
								captionLayout={captionLayout}
								fromYear={baseProps.yearSelection?.fromYear}
								toYear={baseProps.yearSelection?.toYear}
								{...calendarProps}
							/>

							{/* Footer section */}
							{!!(range?.from || validationMessage || withConfirm || withTime?.enabled || baseProps.footer) && <>
									<Separator />
									<div className="flex flex-col gap-3 p-3">
										{/* Date display (only show if no custom footer or if explicitly building default summary) */}
										{!!range?.from && !baseProps.footer && (
           <div className="flex items-center justify-between gap-4 text-sm">
												<div className="flex items-center gap-2">
													<Text tag="span" type="secondary">{t.from}:</Text>
													<Text tag="span" weight="medium">
														{format(range.from, readableFormat, { locale: dateFnsLocale })}
														{showTimeInSummary && startTimeDisplay ? ` ${startTimeDisplay}` : ''}
													</Text>
												</div>
												{!!range.to && (
             <div className="flex items-center gap-2">
														<Text tag="span" type="secondary">{t.to}:</Text>
														<Text tag="span" weight="medium">
															{format(range.to, readableFormat, { locale: dateFnsLocale })}
															{showTimeInSummary && endTimeDisplay ? ` ${endTimeDisplay}` : ''}
														</Text>
													</div>
           )}
											</div>
         )}

										{/* Time inputs */}
										{!!withTime?.enabled && !!range?.from && (
           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
												<div>
													<Label size="xs">{t.startTime}</Label>
													<div className="mt-1 flex items-center gap-2">
														<Clock className="h-3 w-3 text-muted-foreground" />
														<SegmentedTimeInput
															value={startTime}
															onChange={handleStartTimeChange}
															format={timeFormat}
															includeSeconds={includeSeconds}
															step={timeStep}
															disabled={baseProps.disabled}
															labels={{
																hours: t.hours,
																minutes: t.minutes,
																seconds: includeSeconds ? t.seconds : undefined,
															}}
															periodLabels={{ am: t.am, pm: t.pm }}
														/>
													</div>
												</div>
												{!!range.to && (
             <div>
														<Label size="xs">{t.endTime}</Label>
														<div className="mt-1 flex items-center gap-2">
															<Clock className="h-3 w-3 text-muted-foreground" />
															<SegmentedTimeInput
																value={endTime}
																onChange={handleEndTimeChange}
																format={timeFormat}
																includeSeconds={includeSeconds}
																step={timeStep}
																disabled={baseProps.disabled}
																labels={{
																	hours: t.hours,
																	minutes: t.minutes,
																	seconds: includeSeconds ? t.seconds : undefined,
																}}
																periodLabels={{ am: t.am, pm: t.pm }}
															/>
														</div>
													</div>
           )}
											</div>
         )}

										{/* Validation */}
										<Text type="error" content={validationText} hidden={!hasValidationMessage} />

										{/* Confirm button (only if no custom footer) */}
										{!!(withConfirm || withTime?.enabled) && !baseProps.footer && (
           <Button
												onClick={handleConfirm}
												disabled={!range?.from || !range?.to || !!validationMessage}
												className="w-full"
											>
												{t.confirm}
											</Button>
         )}

										{/* Custom footer */}
										{!!baseProps.footer && (
           <div className="-mx-3 -mb-3">
												<DatePickerFooter
													config={baseProps.footer}
													output={createOutput(range)}
													hasSelection={!!(range?.from && range?.to)}
													autoSummary={footerSummary}
												/>
											</div>
         )}
									</div>
								</>}
						</div>
					</div>
				</PopoverContent>
			</Popover>

			{!!hasError && <Text id={describedBy} size="xs" type="error" content={errorText} />}
		</div>
	);
}

export default DatePicker;

DatePicker.displayName = 'DatePicker';
