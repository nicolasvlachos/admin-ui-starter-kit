/**
 * ChangelogTimelineCard — code/release changelog rendered through the shared
 * `Timeline` primitive. Each entry maps a semantic kind (added / removed /
 * modified / fixed) to a colour-coded chip (green / red / amber / blue) plus
 * an optional version label and timestamp. Strings overridable for i18n.
 */
import { GitCommit, Minus, Plus, Wrench } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';

import {
	Timeline,
	type TimelineItem,
	type TimelineStatus,
} from '../shared';
import {
	defaultChangelogTimelineStrings,
	type ChangelogEntry,
	type ChangelogEntryKind,
	type ChangelogTimelineCardProps,
} from './types';

import { cn } from '@/lib/utils';
const KIND_TO_STATUS: Record<ChangelogEntryKind, TimelineStatus> = {
	added: 'success',
	removed: 'error',
	modified: 'warning',
	fixed: 'current',
};

const KIND_TO_BADGE: Record<
	ChangelogEntryKind,
	'success' | 'error' | 'warning' | 'info'
> = {
	added: 'success',
	removed: 'error',
	modified: 'warning',
	fixed: 'info',
};

const KIND_ICON = {
	added: Plus,
	removed: Minus,
	modified: Wrench,
	fixed: GitCommit,
} as const;

export function ChangelogTimelineCard({
	entries,
	className,
	strings: stringsProp,
}: ChangelogTimelineCardProps) {
	const strings = useStrings(defaultChangelogTimelineStrings, stringsProp);
	const labelByKind: Record<ChangelogEntryKind, string> = {
		added: strings.added,
		removed: strings.removed,
		modified: strings.modified,
		fixed: strings.fixed,
	};

	const items: TimelineItem[] = entries.map((entry: ChangelogEntry) => ({
		id: entry.id,
		title: (
			<span className="inline-flex flex-wrap items-center gap-1.5">
				<Badge variant={KIND_TO_BADGE[entry.kind]}>
					{labelByKind[entry.kind]}
				</Badge>
				<span>{entry.title}</span>
				{!!entry.version && (
					<Text tag="span" size="xxs" type="secondary" className="font-mono">
						{entry.version}
					</Text>
				)}
			</span>
		),
		description: entry.author ? (
			<>
				{entry.description}
				<Text tag="span" size="xxs" type="discrete" className="ml-2">
					— {entry.author}
				</Text>
			</>
		) : (
			entry.description
		),
		timestamp: entry.timestamp,
		icon: KIND_ICON[entry.kind],
		status: KIND_TO_STATUS[entry.kind],
	}));

	return (
		<SmartCard
			icon={<GitCommit className="size-4" />}
			title={strings.title}
			className={cn('changelog-timeline--component', className)}
		>
			<Timeline items={items} dotSize="base" />
		</SmartCard>
	);
}

ChangelogTimelineCard.displayName = 'ChangelogTimelineCard';
