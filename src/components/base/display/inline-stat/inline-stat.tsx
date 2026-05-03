/**
 * InlineStat — label + value pair, the workhorse of detail panels and card
 * footers. Three layouts:
 *
 *  - `between` (default): label and value pushed to opposite ends of the row.
 *  - `inline`: label sits immediately before the value, separator-style.
 *  - `stacked`: label above (xxs secondary), value below (sm).
 *
 * `mono` toggles `tabular-nums` on the value side for amounts and counters.
 * Use `valueClassName` for one-off colour/weight overrides; the surrounding
 * row is intentionally plain so consumers can stack many of these without
 * visual clutter.
 */
import type { ReactNode } from 'react';

import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export type InlineStatLayout = 'between' | 'inline' | 'stacked';

export interface InlineStatProps {
	label: ReactNode;
	value: ReactNode;
	layout?: InlineStatLayout;
	mono?: boolean;
	className?: string;
	labelClassName?: string;
	valueClassName?: string;
}

export function InlineStat({
	label,
	value,
	layout = 'between',
	mono = false,
	className,
	labelClassName,
	valueClassName,
}: InlineStatProps) {
	if (layout === 'stacked') {
		return (
			<div className={cn('inline-stat--component', 'flex flex-col gap-0.5', className)}>
				<Text tag="span" size="xxs" type="secondary" className={labelClassName}>
					{label}
				</Text>
				<Text
					tag="span"
					className={cn(mono && 'tabular-nums', valueClassName)}
				>
					{value}
				</Text>
			</div>
		);
	}

	const justify = layout === 'between' ? 'justify-between' : 'justify-start';

	return (
		<div className={cn('flex items-center gap-2', justify, className)}>
			<Text tag="span" size="xs" type="secondary" className={labelClassName}>
				{label}
			</Text>
			<Text
				tag="span"
				className={cn(mono && 'tabular-nums', valueClassName)}
			>
				{value}
			</Text>
		</div>
	);
}

InlineStat.displayName = 'InlineStat';
