import { type ReactNode } from 'react';
import type { ComposedBadgeVariant as BadgeVariant } from '@/components/base/badge/badge';

export type StepStatus = 'completed' | 'current' | 'upcoming';

export interface StepItem {
    id: string;
    title: string;
    description?: string;
    status: StepStatus;
    timestamp?: string;
    badge?: string;
    badgeVariant?: BadgeVariant;
    content?: ReactNode;
}

export interface StepsCardProps {
    title: string;
    description?: string;
    steps: StepItem[];
    footerText?: ReactNode;
    className?: string;
}

export interface StepsHorizontalProps {
    title: string;
    description?: string;
    steps: StepItem[];
    footerText?: ReactNode;
    className?: string;
}
