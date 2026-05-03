import { Clock } from 'lucide-react';
import * as React from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/base/buttons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/popover';
import { Label, Text } from '@/components/typography';
import { useStrings, type StringsProp } from '@/lib/strings';
import { cn } from '@/lib/utils';
import { Input } from './input';

export interface TimePickerStrings {
    placeholder: string;
    dialogTitle: string;
    hours: string;
    minutes: string;
    seconds: string;
    now: string;
    done: string;
    hoursPlaceholder: string;
    minutesPlaceholder: string;
    secondsPlaceholder: string;
    am: string;
    pm: string;
}

export const defaultTimePickerStrings: TimePickerStrings = {
    placeholder: 'Select time',
    dialogTitle: 'Select Time',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    now: 'Now',
    done: 'Done',
    hoursPlaceholder: 'HH',
    minutesPlaceholder: 'MM',
    secondsPlaceholder: 'SS',
    am: 'AM',
    pm: 'PM',
};

const pad2 = (n: number) => String(n).padStart(2, '0');

const toNumber = (value: string): number | null => {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isFinite(parsed) ? parsed : null;
};

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const sanitize2 = (value: string): string => (value ?? '').replace(/\D/g, '').slice(0, 2);

const snapMinutes = (minutes: number, step: number): number => {
    if (!Number.isFinite(step) || step <= 0) return minutes;
    if (step === 1) return minutes;

    const remainder = minutes % step;
    const threshold = Math.max(1, Math.floor(step * 0.8));
    const shouldRoundUp = remainder >= threshold;
    const base = minutes - remainder;
    const snapped = shouldRoundUp ? base + step : base;
    return snapped >= 60 ? 0 : snapped;
};

export interface TimePickerProps {
    /** Additional class names */
    className?: string;

    /** Current value in HH:MM:SS format */
    value?: string;

    /** Change handler */
    onChange?: (value: string) => void;

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** Disabled state */
    disabled?: boolean;

    /** @deprecated Use `strings.placeholder` instead. */
    placeholder?: string;

    /** @deprecated Use `strings.dialogTitle` instead. */
    dialogTitle?: string;

    /** @deprecated Use `strings.hours` instead. */
    hoursLabel?: string;

    /** @deprecated Use `strings.minutes` instead. */
    minutesLabel?: string;

    /** @deprecated Use `strings.seconds` instead. */
    secondsLabel?: string;

    /** @deprecated Use `strings.now` instead. */
    nowLabel?: string;

    /** @deprecated Use `strings.done` instead. */
    doneLabel?: string;

    /** Time format (12 or 24 hour) */
    format?: '12' | '24';

    /** Minute step increment */
    minuteStep?: number;

    /** Show seconds input */
    showSeconds?: boolean;

    /** String overrides merged over defaults. */
    strings?: StringsProp<TimePickerStrings>;
}

/**
 * TimePicker - Time selection with popover dialog
 */
export function TimePicker({
    className,
    value = '00:00:00',
    onChange,
    invalid,
    disabled,
    placeholder,
    dialogTitle,
    hoursLabel,
    minutesLabel,
    secondsLabel,
    nowLabel,
    doneLabel,
    format = '24',
    minuteStep = 5,
    showSeconds = true,
    strings: stringsProp,
}: TimePickerProps) {
    const triggerId = useId();
    const strings = useStrings(defaultTimePickerStrings, {
        ...(placeholder !== undefined ? { placeholder } : {}),
        ...(dialogTitle !== undefined ? { dialogTitle } : {}),
        ...(hoursLabel !== undefined ? { hours: hoursLabel } : {}),
        ...(minutesLabel !== undefined ? { minutes: minutesLabel } : {}),
        ...(secondsLabel !== undefined ? { seconds: secondsLabel } : {}),
        ...(nowLabel !== undefined ? { now: nowLabel } : {}),
        ...(doneLabel !== undefined ? { done: doneLabel } : {}),
        ...(stringsProp ?? {}),
    });

    const normalizeHoursSegment = useCallback(
        (raw: string | undefined, currentMeridiem: 'AM' | 'PM'): { hours: string; meridiem: 'AM' | 'PM' } => {
            const parsed = toNumber(raw ?? '') ?? 0;

            if (format === '12') {
                const hours12 = parsed > 12 ? 12 : clamp(parsed === 0 ? 12 : parsed, 1, 12);
                return { hours: pad2(hours12), meridiem: currentMeridiem };
            }

            const hours24 = parsed > 24 ? 24 : clamp(parsed, 0, 24);
            return { hours: pad2(hours24), meridiem: currentMeridiem };
        },
        [format]
    );

    const normalizeMinutesSegment = useCallback(
        (raw: string | undefined): string => {
            let minutesParsed = toNumber(raw ?? '') ?? 0;
            if (minutesParsed > 59) minutesParsed = 0;
            minutesParsed = snapMinutes(clamp(minutesParsed, 0, 59), minuteStep);
            return pad2(minutesParsed);
        },
        [minuteStep]
    );

    const normalizeSecondsSegment = useCallback((raw: string | undefined): string => {
        let secondsParsed = toNumber(raw ?? '') ?? 0;
        if (secondsParsed > 59) secondsParsed = 0;
        secondsParsed = clamp(secondsParsed, 0, 59);
        return pad2(secondsParsed);
    }, []);

    const normalizeTime = useCallback(
        (hoursRaw: string, minutesRaw: string, secondsRaw: string, meridiem: 'AM' | 'PM'): string => {
            const rawHours = toNumber(hoursRaw) ?? 0;

            let minutesParsed = toNumber(minutesRaw) ?? 0;
            if (minutesParsed > 59) minutesParsed = 0;
            minutesParsed = snapMinutes(clamp(minutesParsed, 0, 59), minuteStep);

            let secondsParsed = showSeconds ? (toNumber(secondsRaw) ?? 0) : 0;
            if (secondsParsed > 59) secondsParsed = 0;
            secondsParsed = showSeconds ? clamp(secondsParsed, 0, 59) : 0;

            if (format === '12') {
                const hours12 = rawHours > 12 ? 12 : clamp(rawHours === 0 ? 12 : rawHours, 1, 12);
                const hours24 = meridiem === 'AM' ? (hours12 === 12 ? 0 : hours12) : hours12 === 12 ? 12 : hours12 + 12;

                return `${pad2(hours24)}:${pad2(minutesParsed)}:${pad2(secondsParsed)}`;
            }

            const cappedHours = rawHours > 24 ? 24 : clamp(rawHours, 0, 24);
            return `${pad2(cappedHours)}:${pad2(minutesParsed)}:${pad2(secondsParsed)}`;
        },
        [format, minuteStep, showSeconds]
    );

    const parseTime = useCallback(
        (timeString: string) => {
            const [hours = '00', minutes = '00', seconds = '00'] = (timeString ?? '').split(':');
            const normalizedSeconds = showSeconds ? seconds : '00';
            return {
                hours: sanitize2(hours),
                minutes: sanitize2(minutes),
                seconds: sanitize2(normalizedSeconds),
            };
        },
        [showSeconds]
    );

    const [open, setOpen] = useState(false);
    const [time, setTime] = useState(() => parseTime(value));
    const [meridiem, setMeridiem] = useState<'AM' | 'PM'>(() => {
        const [h = '00'] = (value ?? '').split(':');
        const hour = toNumber(h) ?? 0;
        return hour >= 12 ? 'PM' : 'AM';
    });
    const debounceTimers = useRef<{ hours?: number; minutes?: number; seconds?: number }>({});

    useEffect(() => {
        if (open) {
            return;
        }
        setTime(parseTime(value));
        const [h = '00'] = (value ?? '').split(':');
        const hour = toNumber(h) ?? 0;
        setMeridiem(hour >= 12 ? 'PM' : 'AM');
    }, [open, parseTime, value]);

    const handleTimeChange = (type: 'hours' | 'minutes' | 'seconds', newValue: string) => {
        const nextValue = sanitize2(newValue);
        setTime((current) => ({ ...current, [type]: nextValue }));

        if (debounceTimers.current[type]) {
            window.clearTimeout(debounceTimers.current[type]);
        }
        debounceTimers.current[type] = window.setTimeout(() => {
            setTime((current) => {
                const next = { ...current } as typeof current;

                if (type === 'hours') {
                    const raw = (next.hours ?? '').trim();
                    if (raw.length === 1) {
                        next.hours = `0${raw}`;
                    }
                    if ((next.hours ?? '').trim().length === 2) {
                        next.hours = normalizeHoursSegment(next.hours, meridiem).hours;
                    }
                }

                if (type === 'minutes') {
                    const raw = (next.minutes ?? '').trim();
                    if (raw.length === 1) {
                        next.minutes = `0${raw}`;
                    }
                    if ((next.minutes ?? '').trim().length === 2) {
                        next.minutes = normalizeMinutesSegment(next.minutes);
                    }
                }

                if (type === 'seconds') {
                    const raw = (next.seconds ?? '').trim();
                    if (raw.length === 1) {
                        next.seconds = `0${raw}`;
                    }
                    if ((next.seconds ?? '').trim().length === 2) {
                        next.seconds = normalizeSecondsSegment(next.seconds);
                    }
                }

                const normalized = normalizeTime(next.hours, next.minutes, next.seconds, meridiem);
                onChange?.(normalized);

                const [h = '00', m = '00', s = '00'] = normalized.split(':');
                if (format === '12') {
                    next.hours = pad2(((toNumber(h) ?? 0) % 12) || 12);
                } else {
                    next.hours = h;
                }
                next.minutes = m;
                next.seconds = s;

                return next;
            });
        }, 400);
    };

    const handleBlur = (type: 'hours' | 'minutes' | 'seconds') => {
        if (debounceTimers.current[type]) {
            window.clearTimeout(debounceTimers.current[type]);
        }

        setTime((current) => {
            const next = { ...current } as typeof current;
            next.hours = normalizeHoursSegment(next.hours, meridiem).hours;
            next.minutes = normalizeMinutesSegment(next.minutes);
            next.seconds = normalizeSecondsSegment(next.seconds);

            const normalized = normalizeTime(next.hours, next.minutes, next.seconds, meridiem);
            onChange?.(normalized);

            const [h = '00', m = '00', s = '00'] = normalized.split(':');
            return {
                hours: format === '12' ? sanitize2(String(((toNumber(h) ?? 0) % 12) || 12)) : h,
                minutes: m,
                seconds: s,
            };
        });
    };

    const displayValue = useMemo(() => {
        const normalized = normalizeTime(time.hours, time.minutes, time.seconds, meridiem);
        if (!showSeconds) {
            const [h = '00', m = '00'] = normalized.split(':');
            return `${h}:${m}`;
        }
        return normalized;
    }, [meridiem, normalizeTime, showSeconds, time.hours, time.minutes, time.seconds]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={(triggerProps) => (
                    <Button
                        {...triggerProps}
                        id={triggerId}
                        variant="secondary"
                        buttonStyle="outline"
                        aria-expanded={open}
                        aria-invalid={invalid}
                        disabled={disabled}
                        className={cn(
                            'w-full justify-between text-left font-normal',
                            !value && 'text-muted-foreground',
                            invalid && 'border-destructive ring-2 ring-destructive/20',
										(triggerProps as { className?: string }).className,
                            className
                        )}
                    >
                        { }
                        {(triggerProps as { children?: React.ReactNode }).children}
                    </Button>
                )}
            >
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{displayValue || strings.placeholder}</span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-4">
                    <Text tag="div" weight="medium" align="center">{strings.dialogTitle}</Text>
                    <div className="flex items-center gap-2">
                        <div className="text-center">
                            <Label size="xs" className="text-muted-foreground">{strings.hours}</Label>
                            <Input
                                inputMode="numeric"
                                value={time.hours}
                                onChange={(e) => handleTimeChange('hours', e.target.value)}
                                onFocus={(e) => e.currentTarget.select()}
                                onClick={(e) => e.currentTarget.select()}
                                onBlur={() => handleBlur('hours')}
                                placeholder={strings.hoursPlaceholder}
                                className="w-16 text-center"
                            />
                        </div>
                        <Text tag="div" className="text-2xl">:</Text>
                        <div className="text-center">
                            <Label size="xs" className="text-muted-foreground">{strings.minutes}</Label>
                            <Input
                                inputMode="numeric"
                                value={time.minutes}
                                onChange={(e) => handleTimeChange('minutes', e.target.value)}
                                onFocus={(e) => e.currentTarget.select()}
                                onClick={(e) => e.currentTarget.select()}
                                onBlur={() => handleBlur('minutes')}
                                placeholder={strings.minutesPlaceholder}
                                className="w-16 text-center"
                            />
                        </div>
                        {!!showSeconds && <>
                                <Text tag="div" className="text-2xl">:</Text>
                                <div className="text-center">
                                    <Label size="xs" className="text-muted-foreground">{strings.seconds}</Label>
                                    <Input
                                        inputMode="numeric"
                                        value={time.seconds}
                                        onChange={(e) => handleTimeChange('seconds', e.target.value)}
                                        onFocus={(e) => e.currentTarget.select()}
                                        onClick={(e) => e.currentTarget.select()}
                                        onBlur={() => handleBlur('seconds')}
                                        placeholder={strings.secondsPlaceholder}
                                        className="w-16 text-center"
                                    />
                                </div>
                            </>}

                        {format === '12' && (
                            <div className="flex items-end gap-1 pb-0.5">
                                <Button
                                    type="button"
                                    variant={meridiem === 'AM' ? 'primary' : 'secondary'}
                                    buttonStyle={meridiem === 'AM' ? 'solid' : 'outline'}
                                    onClick={() => setMeridiem('AM')}
                                >
                                    {strings.am}
                                </Button>
                                <Button
                                    type="button"
                                    variant={meridiem === 'PM' ? 'primary' : 'secondary'}
                                    buttonStyle={meridiem === 'PM' ? 'solid' : 'outline'}
                                    onClick={() => setMeridiem('PM')}
                                >
                                    {strings.pm}
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            buttonStyle="outline"
                            className="flex-1"
                            onClick={() => {
                                const now = new Date();
                                const newTime = {
                                    hours:
                                        format === '12'
                                            ? String((now.getHours() % 12) || 12)
                                            : String(now.getHours()),
                                    minutes: String(now.getMinutes()),
                                    seconds: '',
                                };
                                setTime(newTime);
                                setMeridiem(now.getHours() >= 12 ? 'PM' : 'AM');
                                onChange?.(
                                    normalizeTime(
                                        newTime.hours,
                                        newTime.minutes,
                                        newTime.seconds,
                                        now.getHours() >= 12 ? 'PM' : 'AM'
                                    )
                                );
                            }}
                        >
                            {strings.now}
                        </Button>
                        <Button
                            variant="primary"
                            buttonStyle="solid"
                            className="flex-1"
                            onClick={() => {
                                onChange?.(normalizeTime(time.hours, time.minutes, time.seconds, meridiem));
                                setOpen(false);
                            }}
                        >
                            {strings.done}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

TimePicker.displayName = 'TimePicker';
