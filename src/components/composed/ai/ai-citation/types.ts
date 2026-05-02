import type { ReactNode } from 'react';

export interface AiCitationSource {
	id: string;
	title: ReactNode;
	url?: string;
	snippet?: ReactNode;
	publisher?: string;
	publishedAt?: string;
	relevance?: number; // 0–1
}

export interface AiCitationStrings {
	title: string;
	sourceCount: (n: number) => string;
	expand: string;
	collapse: string;
	visit: string;
	relevance: string;
}

export const defaultAiCitationStrings: AiCitationStrings = {
	title: 'Sources',
	sourceCount: (n: number) => (n === 1 ? '1 source' : `${n} sources`),
	expand: 'Show sources',
	collapse: 'Hide sources',
	visit: 'Visit',
	relevance: 'Relevance',
};

export interface AiCitationProps {
	sources: AiCitationSource[];
	defaultExpanded?: boolean;
	maxCollapsedRows?: number;
	className?: string;
	strings?: Partial<AiCitationStrings>;
}
