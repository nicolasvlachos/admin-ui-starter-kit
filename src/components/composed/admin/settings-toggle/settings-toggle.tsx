/**
 * SettingsToggleRow — vertically-stacked list of settings with icon, name,
 * description, and a `<Switch>` per row. Controlled when `values`/`onChange`
 * are passed; otherwise self-managed via local state.
 */
import { useState } from 'react';

import { SmartCard } from '@/components/base/cards/smart-card';
import { ToggleSwitch } from '@/components/base/forms/fields/switch';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
} from '@/components/base/item';

import type { SettingsToggleRowProps } from './types';

import { cn } from '@/lib/utils';
export function SettingsToggleRow({ settings, values, onChange, className }: SettingsToggleRowProps) {
    const [internalValues, setInternalValues] = useState<Record<string, boolean>>(() => {
        const defaults: Record<string, boolean> = {};
        for (const s of settings) {
            defaults[s.key] = s.defaultValue ?? false;
        }
        return defaults;
    });

    const isControlled = onChange !== undefined;
    const resolvedValues = isControlled && values ? values : internalValues;

    const handleToggle = (key: string, next: boolean) => {
        if (isControlled && onChange) {
            onChange(key, next);
        } else {
            setInternalValues((prev) => ({ ...prev, [key]: next }));
        }
    };

    return (
        <SmartCard className={cn('settings-toggle--component', className)}>
            <ItemGroup>
                {settings.map((s) => {
                    const Icon = s.icon;
                    const checked = resolvedValues[s.key] ?? false;
                    return (
                        <Item key={s.key}>
                            <ItemMedia variant="icon" className="bg-muted text-muted-foreground rounded-full size-9">
                                <Icon />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle>{s.name}</ItemTitle>
                                <ItemDescription>{s.desc}</ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <ToggleSwitch
                                    aria-label={s.name}
                                    checked={checked}
                                    onCheckedChange={(next) => handleToggle(s.key, next)}
                                />
                            </ItemActions>
                        </Item>
                    );
                })}
            </ItemGroup>
        </SmartCard>
    );
}

SettingsToggleRow.displayName = 'SettingsToggleRow';
