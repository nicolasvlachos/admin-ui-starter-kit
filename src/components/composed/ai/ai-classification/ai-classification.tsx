import { BrainCircuit } from 'lucide-react';

import { Badge } from '@/components/base/badge/badge';
import { SmartCard } from '@/components/base/cards/smart-card';
import { InlineStat } from '@/components/base/display';
import { Separator } from '@/components/base/display/separator';
import { Text } from '@/components/typography/text';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultAiClassificationStrings } from '../ai.strings';
import type { AiClassificationPanelProps } from './types';

export function AiClassificationPanel({ data, strings: stringsProp }: AiClassificationPanelProps) {
	const strings = useStrings(defaultAiClassificationStrings, stringsProp);
	const confidenceLabel =
		data.confidence >= 0.9
			? strings.confidenceBands.high
			: data.confidence >= 0.7
				? strings.confidenceBands.medium
				: strings.confidenceBands.low;

	return (
		<SmartCard
			title={
				<div className={cn('ai-classification--component', 'flex items-center gap-2')}>
					<BrainCircuit className="h-4 w-4 text-muted-foreground" />
					<Text tag="span">{strings.title}</Text>
				</div>
			}
		>
			<div className="space-y-3">
				<div className="flex flex-wrap items-center gap-1.5">
					<Badge
						variant="primary"
					>
						{data.requestType}
					</Badge>
					<Badge
						variant={data.urgencyVariant}
					>
						{data.urgency}
					</Badge>
					<Badge
						variant={data.toneVariant}
						dot
					>
						{data.tone}
					</Badge>
				</div>

				<InlineStat
					label={strings.complexityLabel}
					labelClassName="text-xs"
					value={
						<span className="flex items-center gap-1">
							{Array.from({ length: 5 }, (_, i) => (
								<span
									key={`cx-${String(i)}`}
									className={cn(
										'h-1.5 w-3 rounded-sm',
										i < data.complexityScore
											? 'bg-foreground/60'
											: 'bg-muted',
									)}
								/>
							))}
							<Text tag="span" size="xs" type="secondary" className="ml-1">
								{String(data.complexityScore)}/5
							</Text>
						</span>
					}
				/>

				{data.flags.length > 0 && (
					<InlineStat
						label={strings.flagsLabel}
						labelClassName="text-xs"
						value={
							<span className="flex gap-1">
								{data.flags.map((flag) => (
									<Badge key={flag} variant="warning">
										{flag}
									</Badge>
								))}
							</span>
						}
					/>
				)}

				<InlineStat
					label={strings.nextStepLabel}
					labelClassName="text-xs"
					value={<Badge variant="info">{data.suggestedAction}</Badge>}
				/>

				<Text
					lineHeight="relaxed"
					type="secondary"
				>
					{data.summary}
				</Text>

				<Separator />

				<div className="flex items-center gap-2">
					<Badge
						variant="secondary"
					>
						{strings.confidencePrefix}: {confidenceLabel}
					</Badge>
					<Text
						size="xs"
						type="discrete"
						tag="span"
					>
						{data.model}
					</Text>
				</div>
			</div>
		</SmartCard>
	);
}
