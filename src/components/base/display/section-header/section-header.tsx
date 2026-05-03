/**
 * SectionHeader — title row for in-card sections and standalone groupings:
 *
 *   <Text weight="semibold">{title}</Text>
 *   {optional Badge | description on the next line}
 *   {optional trailing action button on the right}
 *
 * Distinct from `SmartCard.title` (which is the *card's* primary header) —
 * use SectionHeader for nested sections inside a card body, or for grouping
 * blocks on a page that aren't full cards.
 *
 * `dense` tightens vertical spacing and sizes the title down to `xs` for
 * sub-section labels (e.g. "Recent activity" stripes inside a longer card).
 */
import type { ReactNode } from 'react';

import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
	title: ReactNode;
	description?: ReactNode;
	badge?: ReactNode;
	action?: ReactNode;
	dense?: boolean;
	className?: string;
}

export function SectionHeader({
	title,
	description,
	badge,
	action,
	dense = false,
	className,
}: SectionHeaderProps) {
	return (
		<div
			className={cn('section-header--component', 
				'flex items-start justify-between',
				dense ? 'gap-2' : 'gap-3',
				className,
			)}
		>
			<div className="min-w-0 flex-1">
				<div className={cn('flex items-center', dense ? 'gap-1.5' : 'gap-2')}>
					<Text
						size={dense ? 'xs' : 'sm'}
						weight="semibold"
						className="truncate"
					>
						{title}
					</Text>
					{!!badge && <span className="shrink-0">{badge}</span>}
				</div>
				{!!description && (
					<Text
						size={dense ? 'xxs' : 'xs'}
						type="secondary"
						className={dense ? 'mt-0.5' : 'mt-1'}
					>
						{description}
					</Text>
				)}
			</div>
			{!!action && <div className="shrink-0">{action}</div>}
		</div>
	);
}

SectionHeader.displayName = 'SectionHeader';
