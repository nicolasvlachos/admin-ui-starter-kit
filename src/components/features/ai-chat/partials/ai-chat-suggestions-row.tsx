/**
 * AiChatSuggestionsRow — horizontal scrollable strip of small suggestion
 * chips rendered above the prompt input. Distinct from
 * `<AiPromptSuggestions>` (which is a card-grid of richer suggestions used
 * as a welcome surface): this is the inline, dense variant.
 */
import { Sparkles } from 'lucide-react';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiChatSuggestionsStrings,
	type AiChatSuggestionsStrings,
} from '../ai-chat.strings';
import type { AiChatSuggestion } from '../ai-chat.types';

export interface AiChatSuggestionsRowProps {
	suggestions: ReadonlyArray<AiChatSuggestion>;
	onPick?: (s: AiChatSuggestion) => void;
	hideHeader?: boolean;
	className?: string;
	strings?: Partial<AiChatSuggestionsStrings>;
}

export function AiChatSuggestionsRow({
	suggestions,
	onPick,
	hideHeader = false,
	className,
	strings: stringsProp,
}: AiChatSuggestionsRowProps) {
	const strings = useStrings(defaultAiChatSuggestionsStrings, stringsProp);
	if (suggestions.length === 0) return null;
	return (
		<div className={cn('flex items-center gap-2', className)}>
			{!hideHeader && (
				<div className="inline-flex shrink-0 items-center gap-1.5">
					<Sparkles className="size-3.5 text-muted-foreground" />
					<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wider">
						{strings.header}
					</Text>
				</div>
			)}
			<div className="-mx-1 flex flex-1 items-center gap-1.5 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{suggestions.map((s) => {
					const Icon = s.icon;
					return (
						<button
							key={s.id}
							type="button"
							onClick={() => onPick?.(s)}
							className={cn(
								'inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1',
								'transition-[border-color,background] duration-150',
								'hover:border-foreground/20 hover:bg-muted/40',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
							)}
						>
							{!!Icon && <Icon className="size-3 text-muted-foreground" />}
							<Text tag="span" size="xs" weight="medium">
								{s.label}
							</Text>
						</button>
					);
				})}
			</div>
		</div>
	);
}

AiChatSuggestionsRow.displayName = 'AiChatSuggestionsRow';
