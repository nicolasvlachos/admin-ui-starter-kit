import type React from 'react';

export interface SettingItem {
    key: string;
    icon: React.ElementType;
    name: string;
    desc: string;
    defaultValue?: boolean;
}

export interface SettingsToggleRowProps {
    settings: SettingItem[];
    values?: Record<string, boolean>;
    onChange?: (key: string, value: boolean) => void;
    className?: string;
}
