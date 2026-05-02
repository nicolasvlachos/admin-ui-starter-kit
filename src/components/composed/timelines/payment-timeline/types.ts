import type React from 'react';

export interface PaymentEvent {
    label: string;
    date: string;
    amount?: string;
    done: boolean;
    icon: React.ElementType;
}

export interface PaymentTimelineCardProps {
    events: PaymentEvent[];
    className?: string;
}
