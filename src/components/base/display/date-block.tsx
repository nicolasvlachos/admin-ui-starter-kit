/**
 * DateBlock — compact "boxed" date display showing weekday + day-of-month
 * + optional month and time. Built on `date-fns` so locales propagate
 * naturally (`enGB`, `bg`, …).
 *
 * Two layouts:
 *  - `stacked` (default) — three lines: weekday / day / month
 *  - `inline` — single row: weekday + day + month + optional time
 *
 * Time can render `inline` (right of the date), `below` (under the date
 * block), or `hidden`. Compact rooms (booking lists) typically use
 * `stacked` with `time="below"`.
 */
import { format, type Locale } from 'date-fns';

import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

export type DateBlockLayout = 'stacked' | 'inline';
export type DateBlockTimePlacement = 'inline' | 'below' | 'hidden';
export type DateBlockTone = 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'destructive' | 'info';

export interface DateBlockStrings {
	/** Used by `inline` layout when month is hidden (e.g. "Apr 30 · 14:00"). */
	separator: string;
}

export const defaultDateBlockStrings: DateBlockStrings = {
	separator: '·',
};

export interface DateBlockProps {
	/** Date instance, ISO string, or unix timestamp. */
	date: Date | string | number;
	/** ISO time string (`HH:mm`) or already-formatted time string. */
	time?: string | null;
	/** date-fns `Locale` (e.g. `enGB`, `bg`). Defaults to user-agent. */
	locale?: Locale;
	/** Layout. Default `stacked`. */
	layout?: DateBlockLayout;
	/** Where to place the time. Default `inline` for `inline` layout, `below` for `stacked`. */
	timePlacement?: DateBlockTimePlacement;
	/** Tone of the boxed block. Default `default` (card surface). */
	tone?: DateBlockTone;
	/** Whether to render a card-like box around the block. Default `true` for stacked, `false` for inline. */
	boxed?: boolean;
	/** Show month label. Default `true`. */
	showMonth?: boolean;
	/** Custom format for the day-of-month token (date-fns format). Default `'d'`. */
	dayFormat?: string;
	/** Custom format for the weekday token. Default `'EEE'`. */
	weekdayFormat?: string;
	/** Custom format for the month token. Default `'MMM'`. */
	monthFormat?: string;
	className?: string;
	strings?: Partial<DateBlockStrings>;
}

const toneClassMap: Record<DateBlockTone, { bg: string; text: string; border: string; accent: string }> = {
	default: { bg: 'bg-card', text: 'text-foreground', border: 'border-border', accent: 'text-foreground' },
	muted: { bg: 'bg-muted/50', text: 'text-foreground', border: 'border-border', accent: 'text-foreground' },
	primary: { bg: 'bg-primary/10', text: 'text-foreground', border: 'border-primary/30', accent: 'text-primary' },
	success: { bg: 'bg-success/10', text: 'text-foreground', border: 'border-success/30', accent: 'text-success' },
	warning: { bg: 'bg-warning/15', text: 'text-foreground', border: 'border-warning/40', accent: 'text-warning-foreground' },
	destructive: { bg: 'bg-destructive/10', text: 'text-foreground', border: 'border-destructive/30', accent: 'text-destructive' },
	info: { bg: 'bg-info/10', text: 'text-foreground', border: 'border-info/30', accent: 'text-info' },
};

function resolveDate(input: Date | string | number): Date {
	if (input instanceof Date) return input;
	const d = typeof input === 'number' ? new Date(input) : new Date(input);
	return d;
}

export function DateBlock({
	date,
	time,
	locale,
	layout = 'stacked',
	timePlacement,
	tone = 'default',
	boxed,
	showMonth = true,
	dayFormat = 'd',
	weekdayFormat = 'EEE',
	monthFormat = 'MMM',
	className,
	strings: stringsProp,
}: DateBlockProps) {
	const resolved = resolveDate(date);
	const strings = useStrings(defaultDateBlockStrings, stringsProp);
	const tones = toneClassMap[tone];
	const dateValid = !Number.isNaN(resolved.getTime());

	const weekday = dateValid ? format(resolved, weekdayFormat, locale ? { locale } : undefined) : '';
	const day = dateValid ? format(resolved, dayFormat, locale ? { locale } : undefined) : '';
	const month = dateValid ? format(resolved, monthFormat, locale ? { locale } : undefined) : '';

	const resolvedTimePlacement: DateBlockTimePlacement =
		timePlacement ?? (layout === 'inline' ? 'inline' : 'below');
	const useBox = boxed ?? layout === 'stacked';

	if (layout === 'inline') {
		return (
			<span
				className={cn('date-block--component', 
					'inline-flex items-center gap-1.5 tabular-nums',
					useBox && cn('rounded-md border px-2 py-1', tones.bg, tones.border),
					className,
				)}
			>
				<Text size="xs" weight="semibold" className={cn(tones.accent, 'uppercase tracking-wide')}>
					{weekday}
				</Text>
				<Text weight="semibold">{day}</Text>
				{!!showMonth && (
					<Text size="xs" type="secondary" className="uppercase tracking-wide">
						{month}
					</Text>
				)}
				{!!time && resolvedTimePlacement === 'inline' && (
					<>
						<Text size="xs" type="discrete" aria-hidden>
							{strings.separator}
						</Text>
						<Text size="xs" type="secondary">{time}</Text>
					</>
				)}
			</span>
		);
	}

	return (
		<div className={cn('inline-flex flex-col items-center gap-0.5', className)}>
			<div
				className={cn(
					'flex flex-col items-center justify-center leading-none tabular-nums',
					useBox && cn('rounded-md border px-2.5 py-1.5 min-w-[3rem]', tones.bg, tones.border),
				)}
			>
				<Text
					size="xxs"
					weight="semibold"
					className={cn(tones.accent, 'uppercase tracking-wider')}
				>
					{weekday}
				</Text>
				<Text size="lg" weight="semibold" className={cn(tones.text, 'leading-none')}>
					{day}
				</Text>
				{!!showMonth && (
					<Text
						size="xxs"
						type="secondary"
						className="uppercase tracking-wider"
					>
						{month}
					</Text>
				)}
			</div>
			{!!time && resolvedTimePlacement === 'below' && (
				<Text size="xxs" type="secondary" className="tabular-nums">
					{time}
				</Text>
			)}
			{!!time && resolvedTimePlacement === 'inline' && (
				<Text size="xxs" type="secondary" className="tabular-nums">
					{time}
				</Text>
			)}
		</div>
	);
}

DateBlock.displayName = 'DateBlock';
