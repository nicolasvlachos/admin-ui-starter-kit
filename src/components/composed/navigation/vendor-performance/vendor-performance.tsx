import { SmartCard } from '@/components/base/cards/smart-card';
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';

import type { VendorPerformanceCardProps } from './types';

function RatingStars({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) {
    return (
        <div className={cn('vendor-performance--component', 'flex items-center gap-0.5')}>
            {Array.from({ length: maxRating }, (_, i) => (
                <svg
                    key={`star-${String(i)}`}
                    className={cn(
                        'h-3.5 w-3.5',
                        i < rating ? 'text-warning' : 'text-muted',
                    )}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    );
}

function performanceBarColor(score: number): string {
    if (score >= 80) return 'bg-success';
    if (score >= 50) return 'bg-warning';
    return 'bg-destructive';
}

export function VendorPerformanceCard({
    vendorName,
    rating,
    maxRating = 5,
    metrics,
    performanceScore,
    lastActive,
    joinedDate,
    className,
}: VendorPerformanceCardProps) {
    return (
        <SmartCard
            title={vendorName}
            className={className}
            footerText={
                <div className="flex items-center justify-between gap-4">
                    <Text size="xxs" type="secondary">Last active: {lastActive}</Text>
                    <Text size="xxs" type="secondary">Joined: {joinedDate}</Text>
                </div>
            }
        >
            <div className="space-y-4">
                <RatingStars rating={rating} maxRating={maxRating} />

                <div className="grid grid-cols-2 gap-2">
                    {([
                        { label: 'Bookings', value: String(metrics.bookings) },
                        { label: 'Revenue', value: metrics.revenue },
                        { label: 'Avg Rating', value: String(metrics.avgRating) },
                        { label: 'Response', value: metrics.responseTime },
                    ] as const).map((metric) => (
                        <div
                            key={metric.label}
                            className="rounded-lg bg-muted/50 p-3 text-center"
                        >
                            <Text size="lg" weight="bold" className="tabular-nums">
                                {metric.value}
                            </Text>
                            <Text size="xxs" type="secondary">
                                {metric.label}
                            </Text>
                        </div>
                    ))}
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Text>Performance</Text>
                        <Text weight="semibold" className="tabular-nums">
                            {performanceScore}%
                        </Text>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all duration-500',
                                performanceBarColor(performanceScore),
                            )}
                            style={{ width: `${String(performanceScore)}%` }}
                        />
                    </div>
                </div>
            </div>
        </SmartCard>
    );
}

VendorPerformanceCard.displayName = 'VendorPerformanceCard';
