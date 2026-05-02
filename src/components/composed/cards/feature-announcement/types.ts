import type React from 'react';

export interface FeatureAnnouncementCardProps {
    icon?: React.ElementType;
    title: string;
    description: string;
    tags?: string[];
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}
