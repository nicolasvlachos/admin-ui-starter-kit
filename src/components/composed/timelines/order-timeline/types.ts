import { type ReactNode } from 'react';

export interface OrderTimelineEvent {
    id: string;
    title: string;
    description?: string;
    timestamp: string;
    status: 'completed' | 'current' | 'pending';
}

export interface OrderTimelineCardProps {
    title: string;
    description?: string;
    events: OrderTimelineEvent[];
    footerText?: ReactNode;
    className?: string;
}
