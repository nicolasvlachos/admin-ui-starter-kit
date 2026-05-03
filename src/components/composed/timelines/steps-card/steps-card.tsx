import { SmartCard } from '@/components/base/cards/smart-card';
import { Text } from '@/components/typography/text';
import { Badge } from '@/components/base/badge/badge';
import { cn } from '@/lib/utils';
import { Check, Circle, Loader2 } from 'lucide-react';
import { type StepStatus, type StepsCardProps, type StepsHorizontalProps } from './types';

const statusStyles: Record<StepStatus, {
    dot: string;
    line: string;
    title: string;
    Icon: typeof Check;
}> = {
    completed: {
        dot: 'bg-success text-success-foreground',
        line: 'bg-success',
        title: 'text-foreground',
        Icon: Check,
    },
    current: {
        dot: 'bg-primary text-white ring-4 ring-primary/20',
        line: 'bg-border',
        title: 'text-foreground',
        Icon: Loader2,
    },
    upcoming: {
        dot: 'bg-muted text-muted-foreground',
        line: 'bg-border',
        title: 'text-muted-foreground',
        Icon: Circle,
    },
};

function StepIndicator({ status }: { status: StepStatus }) {
    const { dot, Icon } = statusStyles[status];
    const isAnimated = status === 'current';

    return (
        <div className={cn('steps-card--component', 
            'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all',
            dot,
        )}>
            <Icon className={cn('h-4 w-4', isAnimated && 'animate-spin')} />
        </div>
    );
}

/* ─── Vertical StepsCard (original) ────────────────────────────────────────── */

export function StepsCard({ title, description, steps, footerText, className }: StepsCardProps) {
    return (
        <SmartCard
            title={title}
            description={description}
            footerText={footerText}
            className={className}
        >
            <div className="relative">
                {steps.map((step, idx) => {
                    const isLast = idx === steps.length - 1;
                    const { line, title: titleColor } = statusStyles[step.status];

                    return (
                        <div key={step.id} className="relative flex gap-4">
                            {/* Vertical line + dot */}
                            <div className="flex flex-col items-center">
                                <StepIndicator status={step.status} />
                                {!isLast && (
                                    <div className={cn('w-0.5 flex-1 min-h-6', line)} />
                                )}
                            </div>

                            {/* Content */}
                            <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
                                <div className="flex items-center gap-2 pt-1">
                                    <Text weight="semibold" className={titleColor}>
                                        {step.title}
                                    </Text>
                                    {!!step.badge && (
                                        <Badge variant={step.badgeVariant ?? 'secondary'}>
                                            {step.badge}
                                        </Badge>
                                    )}
                                </div>
                                {!!step.description && (
                                    <Text size="xs" type="secondary" className="mt-0.5">
                                        {step.description}
                                    </Text>
                                )}
                                {!!step.timestamp && (
                                    <Text size="xxs" type="discrete" className="mt-1">
                                        {step.timestamp}
                                    </Text>
                                )}
                                {!!step.content && (
                                    <div className="mt-2">{step.content}</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </SmartCard>
    );
}

StepsCard.displayName = 'StepsCard';

/*──────────────────────────────────────────────────────────────────────────────
 * STEPS HORIZONTAL — Horizontal step bar with connecting lines
 *────────────────────────────────────────────────────────────────────────────*/

function HorizontalDot({ status, stepNumber }: { status: StepStatus; stepNumber: number }) {
    if (status === 'completed') {
        return (
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success text-success-foreground">
                <Check className="h-4 w-4" />
            </div>
        );
    }

    if (status === 'current') {
        return (
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                <Text weight="bold" className="text-white">
                    {stepNumber}
                </Text>
            </div>
        );
    }

    return (
        <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-muted text-muted-foreground">
            <Text weight="medium" className="text-muted-foreground">
                {stepNumber}
            </Text>
        </div>
    );
}

export function StepsHorizontal({ title, description, steps, footerText, className }: StepsHorizontalProps) {
    return (
        <SmartCard
            title={title}
            description={description}
            footerText={footerText}
            className={className}
        >
            {/* Horizontal scroll wrapper — when total step width exceeds the
                card, this lets users scroll instead of clipping labels. */}
            <div className="overflow-x-auto -mx-1 px-1">
                <div className="flex min-w-fit items-start">
                    {steps.map((step, idx) => {
                        const isLast = idx === steps.length - 1;
                        const lineColor = step.status === 'completed' ? 'bg-success' : 'bg-border';

                        return (
                            <div key={step.id} className="flex min-w-[110px] flex-1 items-start">
                                <div className="flex w-full flex-col items-center">
                                    <div className="flex w-full items-center">
                                        {idx > 0 && (
                                            <div className={cn(
                                                'h-0.5 flex-1',
                                                steps[idx - 1].status === 'completed' ? 'bg-success' : 'bg-border',
                                            )} />
                                        )}
                                        {idx === 0 && <div className="flex-1" />}

                                        <HorizontalDot status={step.status} stepNumber={idx + 1} />

                                        {!isLast && (
                                            <div className={cn('h-0.5 flex-1', lineColor)} />
                                        )}
                                        {!!isLast && <div className="flex-1" />}
                                    </div>

                                    {/* Labels below dot — clamped to 2 lines so long step
                                        names break gracefully instead of pushing the
                                        row taller. */}
                                    <div className="mt-2 flex w-full flex-col items-center px-1 text-center">
                                        <Text
                                            size="xs"
                                            weight="semibold"
                                            className={cn(
                                                'leading-snug line-clamp-2',
                                                step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground',
                                            )}
                                        >
                                            {step.title}
                                        </Text>
                                        {!!step.description && (
                                            <Text size="xxs" type="secondary" className="mt-0.5 leading-snug line-clamp-2">
                                                {step.description}
                                            </Text>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </SmartCard>
    );
}

StepsHorizontal.displayName = 'StepsHorizontal';
