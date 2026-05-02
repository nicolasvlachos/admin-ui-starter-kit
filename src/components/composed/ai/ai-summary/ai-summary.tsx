import { BrainCircuit, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/base/badge/badge';
import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards/smart-card';
import { Text } from '@/components/typography/text';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultAiSummaryStrings } from '../ai.strings';
import type { AiSummaryBlockProps, ConfidenceLevel } from './types';

const confidenceBars: Record<ConfidenceLevel, number> = {
    low: 1,
    medium: 2,
    high: 3,
};

function ConfidenceBars({ level, label }: { level: ConfidenceLevel; label: string }) {
    const filled = confidenceBars[level];
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 3 }, (_, i) => (
                    <div
                        key={`bar-${String(i)}`}
                        className={cn(
                            'h-2.5 w-1 rounded-sm',
                            i < filled ? 'bg-foreground/60' : 'bg-muted-foreground/20',
                        )}
                    />
                ))}
            </div>
            <Text size="xs" type="secondary" tag="span" className="capitalize">
                {label}
            </Text>
        </div>
    );
}

export function AiSummaryBlock({ data, strings: stringsProp }: AiSummaryBlockProps) {
    const strings = useStrings(defaultAiSummaryStrings, stringsProp);
    return (
        <SmartCard
            title={
                <div className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                    <Text tag="span">{strings.title}</Text>
                </div>
            }
            titleSuffix={
                <Badge variant="secondary">
                    {strings.badgeLabel}
                </Badge>
            }
            footerText={
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Text size="xs" type="secondary" tag="span">
                            {data.generatedAt}
                        </Text>
                        <Text size="xs" type="discrete" tag="span">
                            {data.model}
                        </Text>
                    </div>
                    {!!data.onRegenerate && (
                        <Button variant="secondary" buttonStyle="ghost" size="xs" onClick={data.onRegenerate}>
                            <RefreshCw className="mr-1 h-3 w-3" />
                            {strings.regenerate}
                        </Button>
                    )}
                </div>
            }
        >
            <div className="space-y-3">
                <Text lineHeight="relaxed">
                    {data.summary}
                </Text>

                {data.entities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {data.entities.map((entity) => (
                            <Badge key={entity} variant="secondary">
                                {entity}
                            </Badge>
                        ))}
                    </div>
                )}

                <ConfidenceBars level={data.confidence} label={strings.confidenceLevels[data.confidence]} />
            </div>
        </SmartCard>
    );
}
