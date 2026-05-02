import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type AiTaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'skipped';

export interface AiTaskItem {
	id: string;
	title: ReactNode;
	/** Status — drives the marker pill and icon. */
	status?: AiTaskStatus;
	/** Optional sub-task list rendered nested. */
	children?: ReadonlyArray<AiTaskItem>;
	/** Decorative icon override. */
	icon?: LucideIcon;
	/** Right-aligned slot — duration, byte count, etc. */
	rightSlot?: ReactNode;
	/** Free-form body rendered under the title (logs, code, …). */
	body?: ReactNode;
}

export interface AiTaskStrings {
	statusLabels: Record<AiTaskStatus, string>;
}

export const defaultAiTaskStrings: AiTaskStrings = {
	statusLabels: {
		queued: 'Queued',
		running: 'Running',
		completed: 'Done',
		failed: 'Failed',
		cancelled: 'Cancelled',
		skipped: 'Skipped',
	},
};

export interface AiTaskProps {
	/** Top-level task. */
	task: AiTaskItem;
	/** Compact = single row with collapsible children; expanded = always show. */
	density?: 'compact' | 'expanded';
	/** Indentation width per nesting level (px). */
	indent?: number;
	className?: string;
	strings?: Partial<AiTaskStrings>;
}
