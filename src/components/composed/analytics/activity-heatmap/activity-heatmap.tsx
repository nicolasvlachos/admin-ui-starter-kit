/**
 * ActivityHeatmap — GitHub-style daily-activity calendar grid. Renders the
 * provided range as Monday-aligned columns with per-day intensity tinted
 * via the success palette. Month labels float above the grid; the legend
 * sits on the trailing edge.
 *
 * The layout uses absolute month labels with a 3-week minimum gap rule
 * so labels don't collide when a month starts mid-week.
 */
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultAnalyticsStrings } from '../analytics.strings';
import type { ActivityHeatmapDay, ActivityHeatmapProps, ActivityLevel } from './types';

const LEVEL_COLOR: Record<ActivityLevel, string> = {
	0: 'bg-muted',
	1: 'bg-success/20',
	2: 'bg-success/40',
	3: 'bg-success/65',
	4: 'bg-success',
};

interface BuiltCalendar {
	weeks: (ActivityHeatmapDay | null)[][];
	monthLabels: { label: string; weekIndex: number }[];
}

function buildCalendar(
	data: readonly ActivityHeatmapDay[],
	monthNames: readonly string[],
): BuiltCalendar {
	if (data.length === 0) return { weeks: [], monthLabels: [] };

	const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
	const startDate = new Date(sorted[0].date + 'T00:00:00');
	const endDate = new Date(sorted[sorted.length - 1].date + 'T00:00:00');

	const dayOfWeek = startDate.getDay();
	const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
	const alignedStart = new Date(startDate);
	alignedStart.setDate(alignedStart.getDate() + mondayOffset);

	const dateMap = new Map<string, ActivityLevel>();
	for (const d of sorted) dateMap.set(d.date, d.level);

	const weeks: (ActivityHeatmapDay | null)[][] = [];
	const monthLabels: { label: string; weekIndex: number }[] = [];
	let lastMonth = -1;
	let currentWeek: (ActivityHeatmapDay | null)[] = [];

	const cursor = new Date(alignedStart);
	while (cursor <= endDate) {
		const dateStr = cursor.toISOString().slice(0, 10);
		const dayIdx = (cursor.getDay() + 6) % 7;

		if (dayIdx === 0 && currentWeek.length > 0) {
			weeks.push(currentWeek);
			currentWeek = [];
		}

		const month = cursor.getMonth();
		if (month !== lastMonth) {
			const labelWeekIndex = dayIdx === 0 ? weeks.length : weeks.length + 1;
			const existing = monthLabels.find((m) => m.weekIndex === labelWeekIndex);
			if (!existing) monthLabels.push({ label: monthNames[month], weekIndex: labelWeekIndex });
			lastMonth = month;
		}

		const level = dateMap.get(dateStr) ?? 0;
		currentWeek.push({ date: dateStr, level });
		cursor.setDate(cursor.getDate() + 1);
	}

	if (currentWeek.length > 0) {
		while (currentWeek.length < 7) currentWeek.push(null);
		weeks.push(currentWeek);
	}

	return { weeks, monthLabels };
}

export function ActivityHeatmap({
	title,
	description,
	data,
	className,
	strings: stringsProp,
}: ActivityHeatmapProps) {
	const strings = useStrings(defaultAnalyticsStrings, stringsProp);
	const { weeks, monthLabels } = buildCalendar(data, strings.heatmapMonthNames);

	return (
		<SmartCard title={title} description={description} className={cn('activity-heatmap--component', className)}>
			<div className="overflow-x-auto">
				<div className="relative mb-1" style={{ paddingLeft: '28px', height: '12px' }}>
					<div className="relative flex" style={{ width: `${weeks.length * 15}px` }}>
						{monthLabels
							.filter((m, idx, arr) => idx === 0 || m.weekIndex - arr[idx - 1].weekIndex >= 3)
							.map((m) => (
								<Text
									key={`${m.label}-${m.weekIndex}`}
									size="xxs"
									type="secondary"
									className="absolute leading-none whitespace-nowrap"
									style={{ left: `${m.weekIndex * 15}px`, top: 0 }}
								>
									{m.label}
								</Text>
							))}
					</div>
				</div>

				<div className="flex gap-0">
					<div className="mr-1 flex flex-col gap-[3px]">
						{strings.heatmapDayLabels.map((label, i) => (
							<div key={`day-${i}`} className="flex h-3 w-6 items-center justify-end">
								{!!label && (
									<Text size="xxs" type="secondary" className="leading-none">{label}</Text>
								)}
							</div>
						))}
					</div>

					<div className="flex gap-[3px]">
						{weeks.map((week, weekIdx) => (
							<div key={`w-${weekIdx}`} className="flex flex-col gap-[3px]">
								{week.map((day, dayIdx) => {
									const dayTitle = day ? `${day.date}: Level ${day.level}` : undefined;
									return (
										<div
											key={`d-${weekIdx}-${dayIdx}`}
											className={cn(
												'size-3 rounded-sm',
												day ? LEVEL_COLOR[day.level] : 'bg-transparent',
											)}
											title={dayTitle}
										/>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="mt-4 flex items-center justify-end gap-1.5">
				<Text size="xxs" type="secondary">{strings.heatmapLegendLess}</Text>
				{([0, 1, 2, 3, 4] as ActivityLevel[]).map((level) => (
					<div key={`legend-${level}`} className={cn('size-3 rounded-sm', LEVEL_COLOR[level])} />
				))}
				<Text size="xxs" type="secondary">{strings.heatmapLegendMore}</Text>
			</div>
		</SmartCard>
	);
}

ActivityHeatmap.displayName = 'ActivityHeatmap';
