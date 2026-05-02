import type { StringsProp } from '@/lib/strings';

import type { AiSummaryStrings } from '../ai.strings';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface AiSummaryData {
    summary: string;
    entities: string[];
    confidence: ConfidenceLevel;
    model: string;
    generatedAt: string;
    onRegenerate?: () => void;
}

export interface AiSummaryBlockProps {
    data: AiSummaryData;
    strings?: StringsProp<AiSummaryStrings>;
}
