/**
 * ActivityFeedCard — `<ActivityFeed />` wrapped in `SmartCard`.
 *
 * Use this when you want the canonical card chrome (title + description +
 * actions menu + content padding). For embedded surfaces (sidebars, panels)
 * use `<ActivityFeed />` directly.
 */
import { Activity } from 'lucide-react';

import { SmartCard } from '@/components/base/cards';

import { ActivityFeed } from '../activities-feed';
import {
    defaultActivitiesStrings,
    type ActivitiesStrings,
} from '../activities.strings';
import type { ActivityFeedCardProps } from '../activities.types';

export function ActivityFeedCard<TData = unknown>({
    title,
    titleSuffix,
    description,
    padding = 'base',
    composerSlot,
    className,
    strings: stringsProp,
    slots,
    ...feedProps
}: ActivityFeedCardProps<TData>) {
    const strings: ActivitiesStrings = {
        ...defaultActivitiesStrings,
        ...stringsProp,
        sources: {
            ...defaultActivitiesStrings.sources,
            ...(stringsProp?.sources ?? {}),
        },
        events: {
            ...defaultActivitiesStrings.events,
            ...(stringsProp?.events ?? {}),
        },
    };

    const cardTitle = title ?? strings.title;

    return (
        <SmartCard
            icon={<Activity className="size-4" />}
            title={cardTitle}
            titleSuffix={titleSuffix}
            description={description}
            padding={padding}
            className={className}
        >
            <ActivityFeed<TData>
                {...feedProps}
                strings={stringsProp}
                slots={{
                    ...slots,
                    header: composerSlot ?? slots?.header,
                }}
            />
        </SmartCard>
    );
}

ActivityFeedCard.displayName = 'ActivityFeedCard';
