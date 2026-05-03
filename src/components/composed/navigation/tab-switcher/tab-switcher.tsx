import { useState } from 'react';

import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards/smart-card';
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';

import type { TabSwitcherCardProps } from './types';

export function TabSwitcherCard({ title, tabs, defaultTab, className }: TabSwitcherCardProps) {
    const tabKeys = Object.keys(tabs);
    const [activeTab, setActiveTab] = useState<string>(defaultTab ?? tabKeys[0] ?? '');

    return (
        <SmartCard title={title} className={cn('tab-switcher--component', 'bg-gradient-to-b from-muted/30 to-card', className)}>
            {/* Pill tabs */}
            <div className="mt-4 flex gap-1 rounded-full bg-muted/50 p-1">
                {tabKeys.map((t) => (
                    <Button
                        key={t}
                        variant={activeTab === t ? 'light' : 'secondary'}
                        buttonStyle={activeTab === t ? 'solid' : 'ghost'}
                        onClick={() => setActiveTab(t)}
                        className={cn('flex-1 rounded-full capitalize', activeTab === t ? 'shadow-sm' : '')}
                    >
                        {t}
                    </Button>
                ))}
            </div>

            <div className="mt-4 space-y-2">
                {tabs[activeTab]?.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/20">
                        {!!item.icon && (
                            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                                <item.icon className="size-4 text-primary" />
                            </div>
                          )}
                        <Text className="flex-1">{item.name}</Text>
                        <Text weight="bold">{item.value}</Text>
                    </div>
                ))}
            </div>
        </SmartCard>
    );
}

TabSwitcherCard.displayName = 'TabSwitcherCard';
