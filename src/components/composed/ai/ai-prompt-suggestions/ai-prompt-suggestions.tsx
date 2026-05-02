/**
 * AiPromptSuggestions — grid of clickable prompt cards.
 * Use to seed a chat or assistant input with curated starting prompts.
 */
import { Sparkles } from 'lucide-react';
import { SmartCard } from '@/components/base/cards';
import { IconBadge } from '@/components/base/display';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import { useStrings } from '@/lib/strings';

import {
	defaultAiPromptSuggestionsStrings,
	type AiPromptSuggestionsProps,
} from './types';

export function AiPromptSuggestions({ suggestions, onPick, className, strings: stringsProp }: AiPromptSuggestionsProps) {
	const strings = useStrings(defaultAiPromptSuggestionsStrings, stringsProp);

	return (
		<SmartCard
			icon={<Sparkles className="size-4" />}
			title={strings.title}
			description={strings.hint}
			className={className}
		>
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
				{suggestions.map((s) => {
					const Icon = s.icon;
					return (
						<button
							key={s.id}
							type="button"
							onClick={() => onPick?.(s)}
							className={cn(
								'flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-left transition-[border-color,background] duration-150',
								'hover:border-foreground/20 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
							)}
						>
							{!!Icon && (
								<IconBadge icon={Icon} tone="primary" size="sm" shape="square" />
							)}
							<div className="min-w-0">
								<Text weight="semibold">{s.label}</Text>
								{!!s.description && (
									<Text size="xs" type="secondary" className="mt-0.5 line-clamp-2">{s.description}</Text>
								)}
							</div>
						</button>
					);
				})}
			</div>
		</SmartCard>
	);
}

AiPromptSuggestions.displayName = 'AiPromptSuggestions';
