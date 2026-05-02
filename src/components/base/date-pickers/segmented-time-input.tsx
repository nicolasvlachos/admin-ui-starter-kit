import * as React from 'react';

import { Input } from '@/components/base/forms/fields';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import type { NormalizedTime, DisplayTimeSegments, TimePeriod } from './date-picker-helpers';
import {
	alignNormalizedTimeToStep,
	displaySegmentsToNormalizedTime,
	HOURS_12_MAX,
	HOURS_24_MAX,
	MINUTES_MAX,
	normalizedTimeToDisplaySegments,
	SECONDS_MAX,
} from './date-picker-helpers';

type TimeSegmentKey = 'hours' | 'minutes' | 'seconds';

interface SegmentedTimeInputLabels {
	hours: string;
	minutes: string;
	seconds?: string;
}

interface SegmentedTimeInputProps {
	value: NormalizedTime;
	onChange: (time: NormalizedTime) => void;
	format: '12' | '24';
	includeSeconds: boolean;
	step: number;
	disabled?: boolean;
	className?: string;
	labels: SegmentedTimeInputLabels;
	periodLabels: { am: string; pm: string };
}

const SEGMENT_ORDER: TimeSegmentKey[] = ['hours', 'minutes', 'seconds'];
const DEFAULT_24H = '00';
const DEFAULT_12H = '12';

function sanitizeNumeric(value: string): string {
	return value.replace(/\D/g, '').slice(-2);
}

function ensureTwoDigits(value: string): string {
	if (value.length === 0) return '00';
	if (value.length === 1) return `0${value}`;
	return value;
}

function getNextKey(key: TimeSegmentKey, includeSeconds: boolean): TimeSegmentKey | null {
	const activeOrder = includeSeconds ? SEGMENT_ORDER : SEGMENT_ORDER.slice(0, 2);
	const idx = activeOrder.indexOf(key);
	return idx > -1 && idx < activeOrder.length - 1 ? activeOrder[idx + 1] : null;
}

function getPreviousKey(key: TimeSegmentKey, includeSeconds: boolean): TimeSegmentKey | null {
	const activeOrder = includeSeconds ? SEGMENT_ORDER : SEGMENT_ORDER.slice(0, 2);
	const idx = activeOrder.indexOf(key);
	return idx > 0 ? activeOrder[idx - 1] : null;
}

function hoursToDisplay(hours: number, format: '12' | '24'): number {
	if (format === '24') {
		return hours;
	}
	return hours % 12 || 12;
}

function determinePeriodFromHours(hours: number): TimePeriod {
	return hours >= 12 ? 'PM' : 'AM';
}

function segmentsWithDefaults(
	segments: DisplayTimeSegments,
	format: '12' | '24'
): DisplayTimeSegments {
	if (format === '12') {
		return { ...segments, period: segments.period ?? 'AM' };
	}
	return { ...segments, period: undefined };
}

export function SegmentedTimeInput({
	value,
	onChange,
	format,
	includeSeconds,
	step,
	disabled,
	className,
	labels,
	periodLabels
}: SegmentedTimeInputProps) {
	const activeOrder = React.useMemo(
		() => (includeSeconds ? SEGMENT_ORDER : SEGMENT_ORDER.slice(0, 2)),
		[includeSeconds]
	);

	const [segments, setSegments] = React.useState<DisplayTimeSegments>(() =>
		segmentsWithDefaults(
			normalizedTimeToDisplaySegments(value, format, includeSeconds),
			format
		)
	);

	// Ref always holds the latest segments so rapid keystrokes read fresh values.
	const segmentsRef = React.useRef(segments);
	// Flag to skip the value-sync useEffect when we emit raw values ourselves.
	const isLocalEditRef = React.useRef(false);
	const updateSegments = React.useCallback((next: DisplayTimeSegments) => {
		segmentsRef.current = next;
		setSegments(next);
	}, []);

	const inputRefs = React.useRef<Record<TimeSegmentKey, HTMLInputElement | null>>({
		hours: null,
		minutes: null,
		seconds: null,
	});

	// Sync from parent prop (e.g. external reset or date selection).
	// Skip when the change originated from our own emitRaw call to avoid
	// snapping the display to the aligned value mid-typing.
	React.useEffect(() => {
		if (isLocalEditRef.current) {
			isLocalEditRef.current = false;
			return;
		}
		updateSegments(
			segmentsWithDefaults(
				normalizedTimeToDisplaySegments(value, format, includeSeconds),
				format
			)
		);
	}, [value, format, includeSeconds, updateSegments]);

	// Emit unaligned time to the parent so the form value stays current even
	// before blur. Does NOT align — the display segments are left as-is so
	// intermediate keystrokes (e.g. "03" on the way to "30") aren't snapped.
	const emitRaw = React.useCallback(
		(segs: DisplayTimeSegments) => {
			isLocalEditRef.current = true;
			const normalized = displaySegmentsToNormalizedTime(segs, format, includeSeconds);
			onChange(normalized);
		},
		[format, includeSeconds, onChange]
	);

	// Commit: align to step, notify parent, and snap the display.
	// Called on blur so the user sees the rounded value when done typing.
	const commitSegments = React.useCallback(
		(segs: DisplayTimeSegments) => {
			const normalized = displaySegmentsToNormalizedTime(segs, format, includeSeconds);
			const aligned = alignNormalizedTimeToStep(normalized, step, includeSeconds);
			onChange(aligned);
			const alignedDisplay = segmentsWithDefaults(
				normalizedTimeToDisplaySegments(aligned, format, includeSeconds),
				format
			);
			updateSegments(alignedDisplay);
		},
		[format, includeSeconds, onChange, step, updateSegments]
	);

	const focusSegment = React.useCallback(
		(key: TimeSegmentKey | null) => {
			if (!key) return;
			const ref = inputRefs.current[key];
			if (ref) {
				ref.focus();
				ref.select();
			}
		},
		[]
	);

	// Digit-by-digit input: shifts the last digit left and appends the new one.
	// Updates display only — does NOT align or emit to parent.
	const applyDigitInput = React.useCallback(
		(segmentKey: TimeSegmentKey, digit: number) => {
			const current = segmentsRef.current;
			const currentValue = current[segmentKey] ??
				(segmentKey === 'hours' && format === '12' ? DEFAULT_12H : DEFAULT_24H);
			const ones = Number.parseInt(currentValue.slice(-1), 10) || 0;
			const candidate = (ones * 10) + digit;
			const next: DisplayTimeSegments = { ...current };
			let nextPeriod = next.period ?? 'AM';

			if (segmentKey === 'hours') {
				if (format === '24') {
					const clamped = Math.min(Math.max(candidate, 0), HOURS_24_MAX);
					next.hours = ensureTwoDigits(clamped.toString());
				} else {
					if (candidate === 0) {
						nextPeriod = 'AM';
						next.hours = DEFAULT_12H;
					} else if (candidate > 12) {
						nextPeriod = determinePeriodFromHours(candidate);
						next.hours = ensureTwoDigits(hoursToDisplay(candidate, '12').toString());
					} else {
						const clamped = Math.min(Math.max(candidate, 1), HOURS_12_MAX);
						next.hours = ensureTwoDigits(clamped.toString());
						nextPeriod = current.period ?? determinePeriodFromHours(candidate);
					}
				}
			} else if (segmentKey === 'minutes') {
				next.minutes = ensureTwoDigits(Math.min(Math.max(candidate, 0), MINUTES_MAX).toString());
			} else if (segmentKey === 'seconds') {
				next.seconds = ensureTwoDigits(Math.min(Math.max(candidate, 0), SECONDS_MAX).toString());
			}

			const updated = { ...next, period: nextPeriod };
			updateSegments(updated);
			emitRaw(updated);
		},
		[format, updateSegments, emitRaw]
	);

	// Fallback for paste / IME: parses the raw input string.
	const handleNumericChange = React.useCallback(
		(key: TimeSegmentKey, rawValue: string) => {
			const sanitized = sanitizeNumeric(rawValue);
			const next: DisplayTimeSegments = { ...segmentsRef.current };
			let nextPeriod = next.period ?? 'AM';

			if (key === 'hours') {
				if (format === '24') {
					const v = Number.parseInt(sanitized || '0', 10);
					const clamped = Number.isNaN(v) ? 0 : Math.min(Math.max(v, 0), HOURS_24_MAX);
					next.hours = ensureTwoDigits(clamped.toString());
				} else {
					const v = Number.parseInt(sanitized || '0', 10);
					if (Number.isNaN(v)) {
						next.hours = '12';
						nextPeriod = segmentsRef.current.period ?? 'AM';
					} else if (sanitized.length === 2 && v > 12) {
						nextPeriod = determinePeriodFromHours(v);
						next.hours = ensureTwoDigits(hoursToDisplay(v, '12').toString());
					} else if (v === 0) {
						nextPeriod = 'AM';
						next.hours = '12';
					} else {
						const clamped = Math.min(Math.max(v, 1), HOURS_12_MAX);
						next.hours = ensureTwoDigits(clamped.toString());
						if (sanitized.length === 2) {
							nextPeriod = segmentsRef.current.period ?? determinePeriodFromHours(v);
						}
					}
				}
			} else if (key === 'minutes') {
				const v = Number.parseInt(sanitized || '0', 10);
				const clamped = Number.isNaN(v) ? 0 : Math.min(Math.max(v, 0), MINUTES_MAX);
				next.minutes = ensureTwoDigits(clamped.toString());
			} else if (key === 'seconds') {
				const v = Number.parseInt(sanitized || '0', 10);
				const clamped = Number.isNaN(v) ? 0 : Math.min(Math.max(v, 0), SECONDS_MAX);
				next.seconds = ensureTwoDigits(clamped.toString());
			}

			const updated = { ...next, period: nextPeriod };
			updateSegments(updated);
			emitRaw(updated);
		},
		[format, updateSegments, emitRaw]
	);

	const handlePeriodChange = React.useCallback(
		(period: TimePeriod) => {
			if (format !== '12') return;
			const next = { ...segmentsRef.current, period };
			commitSegments(next);
		},
		[commitSegments, format]
	);

	// On blur: commit the current segments (align to step + notify parent).
	const handleBlur = React.useCallback(() => {
		commitSegments(segmentsRef.current);
	}, [commitSegments]);

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>, key: TimeSegmentKey) => {
			const isDigitKey = event.key.length === 1 && /\d/.test(event.key);
			if (isDigitKey && !event.metaKey && !event.ctrlKey && !event.altKey) {
				event.preventDefault();
				applyDigitInput(key, Number.parseInt(event.key, 10));
				return;
			}
			if (event.key === 'ArrowRight') {
				focusSegment(getNextKey(key, includeSeconds));
				return;
			}
			if (event.key === 'ArrowLeft') {
				focusSegment(getPreviousKey(key, includeSeconds));
				return;
			}
			if (event.key === 'Backspace') {
				const target = event.currentTarget;
				if (target.selectionStart === 0 && target.selectionEnd === 0) {
					focusSegment(getPreviousKey(key, includeSeconds));
				}
			}
		},
		[applyDigitInput, focusSegment, includeSeconds]
	);

	const periodToggleValue = React.useMemo<TimePeriod[] | undefined>(() => {
		if (format !== '12') return undefined;
		return segments.period ? [segments.period] : undefined;
	}, [format, segments.period]);

	return (
		<div className={cn('flex items-center gap-2', className)}>
			{activeOrder.map((segmentKey, index) => {
				const fallbackValue = segmentKey === 'hours' && format === '12' ? DEFAULT_12H : DEFAULT_24H;
				const displayValue = segments[segmentKey] ?? fallbackValue;
				const ariaLabel = segmentKey === 'hours'
					? labels.hours
					: segmentKey === 'minutes'
						? labels.minutes
						: labels.seconds ?? labels.minutes;

				return (
					<React.Fragment key={segmentKey}>
						<Input
							ref={(node) => {
								inputRefs.current[segmentKey] = node;
							}}
							value={displayValue}
							onChange={(event) => handleNumericChange(segmentKey, event.target.value)}
							onFocus={(event) => event.target.select()}
							onBlur={handleBlur}
							onKeyDown={(event) => handleKeyDown(event, segmentKey)}
							inputMode="numeric"
							pattern="\d*"
							maxLength={2}
							showCharacterCount={false}
							disabled={disabled}
							aria-label={ariaLabel}
							className="h-8 w-12 text-center text-sm"
						/>
						{index < activeOrder.length - 1 && (
							<Text tag="span" type="secondary">:</Text>
						)}
					</React.Fragment>
				);
			})}

			{format === '12' && (
				<ToggleGroup
					value={periodToggleValue}
					onValueChange={(values) => {
						const period = values[0];
						if (!period) return;
						handlePeriodChange(period as TimePeriod);
					}}
					disabled={disabled}
					size="sm"
					className="ml-1"
				>
					<ToggleGroupItem
						value="AM"
						aria-label={periodLabels.am}
					>
						{periodLabels.am}
					</ToggleGroupItem>
					<ToggleGroupItem
						value="PM"
						aria-label={periodLabels.pm}
					>
						{periodLabels.pm}
					</ToggleGroupItem>
				</ToggleGroup>
			)}
		</div>
	);
}

SegmentedTimeInput.displayName = 'SegmentedTimeInput';
