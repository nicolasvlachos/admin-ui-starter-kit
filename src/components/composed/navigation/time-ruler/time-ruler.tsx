import { Text } from '@/components/typography/text';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultTimeDistributionRulerStrings, type TimeDistributionRulerProps } from './types';

export function TimeDistributionRuler({ hours, currentHour, className, strings: stringsProp }: TimeDistributionRulerProps) {
    const strings = useStrings(defaultTimeDistributionRulerStrings, stringsProp);
    const maxVal = Math.max(...hours, 1);
    const peakHour = hours.indexOf(Math.max(...hours));

    function getDensityClass(count: number): string {
        if (count === 0) return 'bg-muted';
        const ratio = count / maxVal;
        if (ratio < 0.33) return 'bg-primary/25';
        if (ratio < 0.66) return 'bg-primary/55';
        return 'bg-primary';
    }

    return (
        <div className={cn('time-ruler--component', 'space-y-1.5', className)}>
            {/* Ruler bar */}
            <div className="relative flex h-8 gap-[1px] rounded-md overflow-hidden">
                {hours.map((count, hour) => (
                    <div
                        key={hour}
                        className={cn(
                            'relative flex-1 transition-colors duration-200',
                            getDensityClass(count),
                            hour === peakHour && 'ring-1 ring-primary ring-inset',
                        )}
                        title={strings.formatHourTitle(String(hour).padStart(2, '0'), count)}
                    />
                ))}
            </div>
            {/* Hour labels + now marker */}
            <div className="relative flex">
                {hours.map((_, hour) => (
                    <div key={hour} className="flex-1 text-center">
                        {hour % 4 === 0 && (
                            <Text size="xxs" type="secondary" className="tabular-nums">
                                {String(hour).padStart(2, '0')}
                            </Text>
                        )}
                    </div>
                ))}
            </div>
            {/* Now marker */}
            {currentHour !== undefined && currentHour >= 0 && currentHour < 24 && (
                <div className="relative h-0">
                    <div
                        className="absolute -top-[42px] flex flex-col items-center"
                        style={{ left: `${(currentHour / 24) * 100}%`, transform: 'translateX(-50%)' }}
                    >
                        <div
                            className="h-0 w-0 border-x-[4px] border-b-[5px] border-x-transparent border-b-destructive"
                        />
                    </div>
                </div>
            )}
            {/* Legend */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <div className="h-2 w-3 rounded-sm bg-muted" />
                    <Text size="xxs" type="secondary">{strings.legendNone}</Text>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-2 w-3 rounded-sm bg-primary/25" />
                    <Text size="xxs" type="secondary">{strings.legendLow}</Text>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-2 w-3 rounded-sm bg-primary/55" />
                    <Text size="xxs" type="secondary">{strings.legendMedium}</Text>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-2 w-3 rounded-sm bg-primary" />
                    <Text size="xxs" type="secondary">{strings.legendHigh}</Text>
                </div>
                {currentHour !== undefined && (
                    <div className="flex items-center gap-1">
                        <div className="h-0 w-0 border-x-[3px] border-b-[4px] border-x-transparent border-b-destructive" />
                        <Text size="xxs" type="secondary">{strings.legendNow}</Text>
                    </div>
                )}
            </div>
        </div>
    );
}

TimeDistributionRuler.displayName = 'TimeDistributionRuler';
