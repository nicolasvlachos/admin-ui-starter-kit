import type { ReactNode } from 'react';

export type MilestoneStatus = 'completed' | 'in_progress' | 'upcoming' | 'blocked';

export interface MilestoneItem {
	id: string;
	title: ReactNode;
	description?: ReactNode;
	dueDate?: string;
	status: MilestoneStatus;
	/** 0–100; only used when status is `in_progress`. */
	progress?: number;
}

export interface MilestonesTimelineStrings {
	title: string;
	completed: string;
	in_progress: string;
	upcoming: string;
	blocked: string;
	dueOn: string;
}

export const defaultMilestonesTimelineStrings: MilestonesTimelineStrings = {
	title: 'Milestones',
	completed: 'Completed',
	in_progress: 'In progress',
	upcoming: 'Upcoming',
	blocked: 'Blocked',
	dueOn: 'Due',
};

export interface MilestonesTimelineCardProps {
	milestones: MilestoneItem[];
	className?: string;
	strings?: Partial<MilestonesTimelineStrings>;
}
