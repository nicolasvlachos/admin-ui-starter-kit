import type React from 'react';

export interface TabItem {
    name: string;
    value: string;
    icon?: React.ElementType;
}

export interface TabSwitcherCardProps {
    title?: string;
    tabs: Record<string, TabItem[]>;
    defaultTab?: string;
    className?: string;
}
