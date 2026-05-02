import type { LucideIcon } from 'lucide-react';

export interface AiPromptSuggestion {
	id: string;
	label: string;
	description?: string;
	icon?: LucideIcon;
}

export interface AiPromptSuggestionsStrings {
	title: string;
	hint: string;
}

export const defaultAiPromptSuggestionsStrings: AiPromptSuggestionsStrings = {
	title: 'Try asking',
	hint: 'Tap a prompt to start',
};

export interface AiPromptSuggestionsProps {
	suggestions: AiPromptSuggestion[];
	onPick?: (suggestion: AiPromptSuggestion) => void;
	className?: string;
	strings?: Partial<AiPromptSuggestionsStrings>;
}
