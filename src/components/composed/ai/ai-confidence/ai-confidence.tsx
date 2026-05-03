/**
 * AiConfidenceCard — visualises an AI model's overall confidence with a circular
 * progress dial and a list of weighted contributing factors. Strings are overridable.
 */
import { Sparkles } from 'lucide-react';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { Badge } from '@/components/base/badge';
import { InlineStat } from '@/components/base/display';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultAiConfidenceCardStrings, type AiConfidenceCardProps } from './types';

function levelLabel(score: number) {
	if (score >= 0.85) return { label: 'High', variant: 'success' as const };
	if (score >= 0.6) return { label: 'Medium', variant: 'warning' as const };
	return { label: 'Low', variant: 'error' as const };
}

export function AiConfidenceCard({ score, model, factors, className, strings: stringsProp }: AiConfidenceCardProps) {
	const strings = useStrings(defaultAiConfidenceCardStrings, stringsProp);
	const pct = Math.round(score * 100);
	const { label, variant } = levelLabel(score);
	const c = 2 * Math.PI * 28;
	const dash = c - (pct / 100) * c;

	return (
		<SmartCard
			icon={<Sparkles className="size-4" />}
			title={strings.title}
			titleSuffix={!!model && <Badge variant="secondary">{model}</Badge>}
			className={cn('ai-confidence--component', className)}
		>
			<div className="flex items-center gap-4">
				<div className="relative shrink-0">
					<svg width="72" height="72" viewBox="0 0 72 72">
						<circle cx="36" cy="36" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/40" />
						<circle
							cx="36"
							cy="36"
							r="28"
							fill="none"
							stroke="currentColor"
							strokeWidth="6"
							strokeLinecap="round"
							strokeDasharray={c}
							strokeDashoffset={dash}
							transform="rotate(-90 36 36)"
							className={cn(
								variant === 'success' && 'text-success',
								variant === 'warning' && 'text-success',
								variant === 'error' && 'text-destructive',
							)}
						/>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<Text size="lg" weight="bold" className="tabular-nums leading-none">{pct}%</Text>
					</div>
				</div>
				<div className="flex-1 min-w-0">
					<Text size="xs" type="secondary" weight="medium" className="uppercase tracking-wider">{strings.confidenceLabel}</Text>
					<Badge variant={variant} size="sm" className="mt-1">{label}</Badge>
				</div>
			</div>

			{!!factors && factors.length > 0 && (
				<div className="mt-4 space-y-2">
					<Text size="xs" type="secondary" weight="medium" className="uppercase tracking-wider">{strings.factorsLabel}</Text>
					{factors.map((f) => (
						<div key={f.label}>
							<InlineStat
								label={f.label}
								value={`${Math.round(f.score * 100)}%`}
								mono
								labelClassName="text-xs"
								valueClassName="text-xs font-semibold"
							/>
							<div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
								<div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(f.score * 100)}%` }} />
							</div>
						</div>
					))}
				</div>
			)}
		</SmartCard>
	);
}

AiConfidenceCard.displayName = 'AiConfidenceCard';
