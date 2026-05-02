import { type ReactNode } from 'react';

export type GradientPreset = 'coral' | 'ocean' | 'forest' | 'twilight' | 'ember';
export type PatternType = 'none' | 'circles' | 'diagonal';

export interface GradientCardProps {
    gradient?: GradientPreset;
    pattern?: PatternType;
    title?: string;
    subtitle?: string;
    value?: string;
    valueLabel?: string;
    badge?: string;
    icon?: React.ElementType;
    alertText?: string;
    alertCount?: number;
    action?: { label: string; onClick: () => void };
    footer?: ReactNode;
    children?: ReactNode;
    className?: string;
}

export interface GradientCardCompactProps {
    gradient?: GradientPreset;
    pattern?: PatternType;
    title?: string;
    value?: string;
    change?: string;
    subtitle?: string;
    className?: string;
}
