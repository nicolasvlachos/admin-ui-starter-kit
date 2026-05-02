import type { ComposedBadgeVariant } from '@/components/base/badge/badge';
import type { StringsProp } from '@/lib/strings';

import type { AiClassificationStrings } from '../ai.strings';

export interface AiClassificationData {
    requestType: string;
    urgency: string;
    urgencyVariant: ComposedBadgeVariant;
    tone: string;
    toneVariant: ComposedBadgeVariant;
    flags: string[];
    complexityScore: number;
    suggestedAction: string;
    summary: string;
    confidence: number;
    model: string;
}

export interface AiClassificationPanelProps {
    data: AiClassificationData;
    strings?: StringsProp<AiClassificationStrings>;
}
