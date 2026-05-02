/**
 * AiTokenUsageCard — input + output token counts with a usage bar
 * relative to a max context window, plus optional cost estimate.
 */
import { Cpu } from 'lucide-react';
import { useStrings } from '@/lib/strings';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { Badge } from '@/components/base/badge';
import { InlineStat } from '@/components/base/display';

import { defaultAiTokenUsageStrings, type AiTokenUsageCardProps } from './types';

export function AiTokenUsageCard({
	model,
	inputTokens,
	outputTokens,
	cost,
	maxTokens,
	className,
	strings: stringsProp,
}: AiTokenUsageCardProps) {
	const strings = useStrings(defaultAiTokenUsageStrings, stringsProp);
	const total = inputTokens + outputTokens;
	const pct = maxTokens ? Math.min(100, Math.round((total / maxTokens) * 100)) : 0;

	return (
		<SmartCard
			icon={<Cpu className="size-4" />}
			title={strings.title}
			titleSuffix={!!model && <Badge variant="secondary">{model}</Badge>}
			className={className}
		>
			<div className="grid grid-cols-3 gap-2">
				{[
					{ label: strings.input, value: inputTokens },
					{ label: strings.output, value: outputTokens },
					{ label: strings.total, value: total },
				].map((cell) => (
					<div key={cell.label} className="rounded-md bg-muted/40 px-3 py-2">
						<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wider">{cell.label}</Text>
						<Text size="lg" weight="semibold" className="tabular-nums">{cell.value.toLocaleString()}</Text>
					</div>
				))}
			</div>
			{!!maxTokens && (
				<div className="mt-3">
					<InlineStat
						label={`${total.toLocaleString()} / ${maxTokens.toLocaleString()}`}
						value={`${pct}%`}
						mono
						labelClassName="text-xs"
						valueClassName="text-xs font-semibold"
					/>
					<div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
						<div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
					</div>
				</div>
			)}
			{!!cost && (
				<InlineStat
					className="mt-3 rounded-md bg-primary/5 px-3 py-2"
					label={strings.cost}
					value={cost}
					mono
					labelClassName="text-xs"
					valueClassName="text-sm font-bold"
				/>
			)}
		</SmartCard>
	);
}

AiTokenUsageCard.displayName = 'AiTokenUsageCard';
