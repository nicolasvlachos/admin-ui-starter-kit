export type { StepStatus, StepItem, StepsCardProps, StepsHorizontalProps } from './steps-card';
export { StepsCard, StepsHorizontal } from './steps-card';

export type { OrderTimelineEvent, OrderTimelineCardProps } from './order-timeline';
export { OrderTimelineCard } from './order-timeline';

export type { PaymentEvent, PaymentTimelineCardProps } from './payment-timeline';
export { PaymentTimelineCard } from './payment-timeline';

export {
	ActivityStreamCard,
	defaultActivityStreamStrings,
	type ActivityStreamCardProps,
	type ActivityStreamStrings,
	type ActivityStreamItem,
} from './activity-stream';

// Shared base primitive (use directly to build new timeline variants)
export {
	Timeline,
	type TimelineProps,
	type TimelineItem,
	type TimelineStatus,
	type TimelineDotSize,
} from './shared';

// New Phase C timeline variants
export {
	ChangelogTimelineCard,
	defaultChangelogTimelineStrings,
	type ChangelogTimelineCardProps,
	type ChangelogTimelineStrings,
	type ChangelogEntry,
	type ChangelogEntryKind,
} from './changelog';

export {
	MilestonesTimelineCard,
	defaultMilestonesTimelineStrings,
	type MilestonesTimelineCardProps,
	type MilestonesTimelineStrings,
	type MilestoneItem,
	type MilestoneStatus,
} from './milestones';
