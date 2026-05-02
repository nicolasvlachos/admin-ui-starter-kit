export { ActivityFeed } from './activities-feed';
export { ActivityFeedCard } from './partials/activities-feed-card';
export {
    defaultActivitiesStrings,
    interpolate as interpolateActivityString,
    type ActivitiesStrings,
} from './activities.strings';
export {
    defaultActivityEventConfig,
    defaultEventConfig,
    resolveEventConfig,
} from './activities.config';
export type {
    ActivityAction,
    ActivityActor,
    ActivityChange,
    ActivityDensity,
    ActivityEventConfig,
    ActivityEventConfigMap,
    ActivityFeedAccessors,
    ActivityFeedCallbacks,
    ActivityFeedCardProps,
    ActivityFeedProps,
    ActivityFeedSlots,
    ActivityHeadlineSegment,
    ActivityItem,
    ActivityRenderRowContext,
    ActivityResourceConfig,
    ActivityResourceRef,
    ActivityResourcesProps,
    ActivityTone,
} from './activities.types';
export {
    ACTIVITY_TONE,
    ActivityActionsMenu,
    ActivityChanges,
    ActivityDateLabel,
    ActivityEmptyState,
    ActivityHeadline,
    ActivityMarker,
    ActivityResourceTag,
    ActivityRow,
    TONE_TO_BADGE_VARIANT,
    type ActivityActionsMenuProps,
    type ActivityChangesProps,
    type ActivityDateLabelProps,
    type ActivityEmptyStateProps,
    type ActivityHeadlineProps,
    type ActivityMarkerProps,
    type ActivityResourceTagProps,
    type ActivityRowProps,
    type ActivityToneStyle,
} from './partials';
export {
    useActivityFeed,
    useActivityResources,
    type ActivityDateGroup,
    type ActivityKeyedItem,
    type ActivityResourceRegistry,
    type UseActivityFeedOptions,
    type UseActivityFeedReturn,
    type UseActivityResourcesOptions,
    type UseActivityResourcesReturn,
} from './hooks';

// NOTE: this feature is framework-agnostic. The library no longer ships
// `adapters/$framework/` folders. Consumers wire fetching / pagination /
// router calls at the call site by passing `fetcher`, `onLoadMore`,
// `onFilterChange`, etc. directly to `<ActivityFeedCard>`.
