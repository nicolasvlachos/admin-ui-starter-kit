import type React from 'react';

export interface ActivityMetric {
    label: string;
    value: string;
}

export interface ExperienceActivity {
    icon: React.ElementType;
    title: string;
    time: string;
    metrics: ActivityMetric[];
}

export interface ExperienceActivityCardProps {
    completed: number;
    total: number;
    activities: ExperienceActivity[];
    onAdd?: () => void;
    className?: string;
}
