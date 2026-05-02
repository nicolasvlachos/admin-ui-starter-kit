import type { StringsProp } from '@/lib/strings';

export interface TimeDistributionRulerStrings {
    /** Density-band legend labels. */
    legendNone: string;
    legendLow: string;
    legendMedium: string;
    legendHigh: string;
    /** "Now" marker label. */
    legendNow: string;
    /** Format function for the per-hour `title` tooltip ("08:00 - 5 bookings"). */
    formatHourTitle: (hourLabel: string, count: number) => string;
}

export const defaultTimeDistributionRulerStrings: TimeDistributionRulerStrings = {
    legendNone: 'None',
    legendLow: 'Low',
    legendMedium: 'Medium',
    legendHigh: 'High',
    legendNow: 'Now',
    formatHourTitle: (hourLabel, count) => `${hourLabel}:00 - ${count} bookings`,
};

export interface TimeDistributionRulerProps {
    hours: number[];
    currentHour?: number;
    className?: string;
    strings?: StringsProp<TimeDistributionRulerStrings>;
}
