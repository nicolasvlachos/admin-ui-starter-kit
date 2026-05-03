/**
 * EventCalendarLegend — category chips with optional click-to-filter. When
 * `enableFiltering` is true the whole chip toggles the category's visibility
 * (instead of a free-floating checkbox alongside a swatch — that pattern was
 * cluttered). Inactive categories desaturate to muted; active categories use
 * the colour-token swatch + body text.
 */
import { type LucideIcon } from 'lucide-react';

import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import { getCalendarColorClasses } from './colors';
import type { EventCalendarLegendProps } from './event-calendar.types';

export function EventCalendarLegend({
	categories,
	visibleCategories,
	onToggleCategory,
	enableFiltering = false,
}: EventCalendarLegendProps) {
	const isAllVisible = !visibleCategories || visibleCategories.length === 0;

	const isCategoryVisible = (categoryId: string) => {
		if (!enableFiltering) return true;
		return isAllVisible || visibleCategories?.includes(categoryId);
	};

	const handleToggle = (categoryId: string) => {
		if (!enableFiltering || !onToggleCategory) return;
		onToggleCategory(categoryId);
	};

	if (categories.length === 0) return null;

	return (
		<div
			role={enableFiltering ? 'group' : undefined}
			aria-label={enableFiltering ? 'Filter event categories' : undefined}
			className={cn('event-calendar-legend--component', 'flex flex-wrap items-center gap-1.5 py-1')}
		>
			{categories.map((category) => {
				const isVisible = isCategoryVisible(category.id);
				const colors = getCalendarColorClasses(category);
				const Icon = category.icon as LucideIcon | undefined;

				const chipBase =
					'group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors';

				const inner = (
					<>
						<span
							className={cn(
								'inline-block size-2 rounded-full',
								isVisible ? colors.swatch : 'bg-muted-foreground/40',
							)}
							aria-hidden="true"
						/>
						{!!Icon && (
							<Icon
								className={cn(
									'size-3',
									isVisible ? 'text-foreground' : 'text-muted-foreground',
								)}
								aria-hidden="true"
							/>
						)}
						<Text tag="span" size="xs" weight="medium" type={isVisible ? 'main' : 'secondary'}>
							{category.label}
						</Text>
					</>
				);

				if (!enableFiltering) {
					return (
						<span
							key={category.id}
							className={cn(chipBase, 'border-border bg-card cursor-default')}
						>
							{inner}
						</span>
					);
				}

				return (
					<button
						key={category.id}
						type="button"
						aria-pressed={isVisible}
						onClick={() => handleToggle(category.id)}
						className={cn(
							chipBase,
							'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
							isVisible
								? 'border-border bg-card hover:bg-muted/40'
								: 'border-dashed border-border/60 bg-transparent text-muted-foreground hover:bg-muted/30',
						)}
					>
						{inner}
					</button>
				);
			})}
		</div>
	);
}

EventCalendarLegend.displayName = 'EventCalendarLegend';
