import type { ReactNode } from 'react';

export type ChangelogEntryKind = 'added' | 'removed' | 'modified' | 'fixed';

export interface ChangelogEntry {
	id: string;
	kind: ChangelogEntryKind;
	title: ReactNode;
	description?: ReactNode;
	version?: string;
	timestamp?: string;
	author?: string;
}

export interface ChangelogTimelineStrings {
	title: string;
	added: string;
	removed: string;
	modified: string;
	fixed: string;
}

export const defaultChangelogTimelineStrings: ChangelogTimelineStrings = {
	title: 'Changelog',
	added: 'Added',
	removed: 'Removed',
	modified: 'Modified',
	fixed: 'Fixed',
};

export interface ChangelogTimelineCardProps {
	entries: ChangelogEntry[];
	className?: string;
	strings?: Partial<ChangelogTimelineStrings>;
}
