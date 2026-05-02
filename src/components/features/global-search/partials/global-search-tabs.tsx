/**
 * GlobalSearchTabs — segmented filter strip above the result list.
 *
 * Wraps `base/navigation/tabs` for app-consistent styling and adds a
 * subtle count pill next to each label.
 */
import { Tabs, TabsList, TabsTrigger } from '@/components/base/navigation/tabs';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export interface GlobalSearchTabsProps<TGroup extends string = string> {
    /** Currently-selected tab. */
    value: 'all' | TGroup;
    onValueChange: (value: 'all' | TGroup) => void;
    tabs: ReadonlyArray<{ value: 'all' | TGroup; label: string }>;
    counts: Record<string, number>;
}

export function GlobalSearchTabs<TGroup extends string = string>({
    value,
    onValueChange,
    tabs,
    counts,
}: GlobalSearchTabsProps<TGroup>) {
    return (
        <div className="border-b border-border/60 px-3 py-2">
            <Tabs
                value={value as string}
                onValueChange={(v) => onValueChange(v as 'all' | TGroup)}
            >
                <TabsList className="h-8 w-fit">
                    {tabs.map((tab) => {
                        const isActive = value === tab.value;
                        const count = counts[tab.value as string] ?? 0;
                        return (
                            <TabsTrigger
                                key={tab.value as string}
                                value={tab.value as string}
                                className="gap-1.5 px-2.5 text-xs"
                            >
                                <span>{tab.label}</span>
                                <Text
                                    tag="span"
                                    size="xxs"
                                    weight="medium"
                                    className={cn(
                                        'rounded px-1 py-0 tabular-nums',
                                        isActive
                                            ? 'bg-muted text-muted-foreground'
                                            : 'bg-transparent text-muted-foreground/70',
                                    )}
                                >
                                    {count}
                                </Text>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
            </Tabs>
        </div>
    );
}
