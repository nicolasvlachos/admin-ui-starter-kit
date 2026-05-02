import type { ComposedBadgeVariant } from '@/components/base/badge/badge';

export interface CourseParticipant {
	/** Display name (used for tooltip + initials extraction). */
	name?: string;
	/** Pre-computed initials override. */
	initials?: string;
	/** Optional photo. */
	imageUrl?: string;
}

export interface CourseBadge {
	label: string;
	variant: ComposedBadgeVariant;
}

export type CourseCardVariant = 'default' | 'minimal' | 'gradient';

export interface CourseCardStrings {
	participants: string;
	progress: string;
}

export const defaultCourseCardStrings: CourseCardStrings = {
	participants: 'Participants',
	progress: 'Progress',
};

export interface CourseCardProps {
	title: string;
	description?: string;
	badges?: CourseBadge[];
	participants?: CourseParticipant[];
	extraParticipants?: number;
	progressPercent?: number;
	actionLabel?: string;
	onAction?: () => void;
	className?: string;
	strings?: Partial<CourseCardStrings>;
	/** Visual variant. Default `default`. */
	variant?: CourseCardVariant;
	/** Optional gradient (`from-... via-... to-...` Tailwind tokens) for `gradient` variant. */
	gradient?: string;
}
