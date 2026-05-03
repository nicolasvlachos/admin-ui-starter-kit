/**
 * Timeline — shared base primitive for the composed timeline family.
 *
 * Renders a vertical, dot-and-line list of events. Each item supports an
 * icon (Lucide component), a status that maps to dot tone, a title row, an
 * optional description block, an optional timestamp, and free-form content
 * via `children`. Use this primitive directly for new timeline variants
 * instead of reinventing the dot/line geometry — see `ChangeLogTimeline`,
 * `MilestonesTimeline`, and the existing OrderTimeline / PaymentTimeline /
 * ActivityStream consumers for examples.
 */
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export type TimelineStatus =
	| 'completed'
	| 'current'
	| 'pending'
	| 'success'
	| 'warning'
	| 'error'
	| 'neutral';

export type TimelineDotSize = 'sm' | 'base' | 'lg';

export interface TimelineItem {
	id: string;
	title: ReactNode;
	description?: ReactNode;
	timestamp?: ReactNode;
	icon?: LucideIcon;
	status?: TimelineStatus;
	children?: ReactNode;
}

export interface TimelineProps {
	items: TimelineItem[];
	dotSize?: TimelineDotSize;
	className?: string;
}

const DOT_PX: Record<TimelineDotSize, string> = {
	sm: 'size-2.5',
	base: 'size-3.5',
	lg: 'size-5',
};

const ICON_PX: Record<TimelineDotSize, string> = {
	sm: 'size-2',
	base: 'size-2.5',
	lg: 'size-3',
};

const STATUS_TONE: Record<TimelineStatus, { bg: string; text: string; ring: string; line: string }> = {
	completed: { bg: 'bg-success', text: 'text-success-foreground', ring: 'ring-success/20', line: 'bg-success/40' },
	current: { bg: 'bg-primary', text: 'text-primary-foreground', ring: 'ring-primary/30', line: 'bg-primary/40' },
	pending: { bg: 'bg-muted', text: 'text-muted-foreground', ring: 'ring-border', line: 'bg-border' },
	success: { bg: 'bg-success', text: 'text-success-foreground', ring: 'ring-success/20', line: 'bg-success/40' },
	warning: { bg: 'bg-warning', text: 'text-warning-foreground', ring: 'ring-warning/30', line: 'bg-warning/40' },
	error: { bg: 'bg-destructive', text: 'text-destructive-foreground', ring: 'ring-destructive/30', line: 'bg-destructive/40' },
	neutral: { bg: 'bg-card', text: 'text-foreground', ring: 'ring-border', line: 'bg-border' },
};

export function Timeline({ items, dotSize = 'base', className }: TimelineProps) {
	return (
		<ol className={cn('timeline--component', 'relative space-y-4', className)}>
			{items.map((item, i) => {
				const status = item.status ?? 'neutral';
				const tone = STATUS_TONE[status];
				const Icon = item.icon;
				const isLast = i === items.length - 1;

				return (
					<li key={item.id} className="relative flex gap-3">
						{/* Connector line — fills available space below dot until last */}
						{!isLast && (
							<span
								aria-hidden="true"
								className={cn(
									'absolute left-[7px] top-4 bottom-[-1rem] w-px',
									tone.line,
									dotSize === 'lg' && 'left-[10px]',
									dotSize === 'sm' && 'left-[5px]',
								)}
							/>
						)}

						<div className="relative z-[1] mt-0.5 flex shrink-0 items-start">
							<span
								className={cn(
									'inline-flex items-center justify-center rounded-full ring-2',
									tone.bg,
									tone.text,
									tone.ring,
									DOT_PX[dotSize],
								)}
							>
								{!!Icon && <Icon className={ICON_PX[dotSize]} />}
							</span>
						</div>

						<div className="min-w-0 flex-1 pb-2">
							<div className="flex items-baseline justify-between gap-2">
								<Text weight="medium" className="leading-tight">
									{item.title}
								</Text>
								{!!item.timestamp && (
									<Text size="xs" type="secondary" className="shrink-0 tabular-nums">
										{item.timestamp}
									</Text>
								)}
							</div>
							{!!item.description && (
								<Text size="xs" type="secondary" className="mt-0.5">
									{item.description}
								</Text>
							)}
							{!!item.children && <div className="mt-2">{item.children}</div>}
						</div>
					</li>
				);
			})}
		</ol>
	);
}

Timeline.displayName = 'Timeline';
