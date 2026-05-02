import type { ReactNode } from 'react';

export interface AiSourceItem {
	id: string;
	title: ReactNode;
	url?: string;
	/** Hostname / publisher / "doc-section" — rendered under the title. */
	publisher?: string;
	/** Favicon / logo URL — rendered as a small avatar; falls back to a globe. */
	faviconUrl?: string;
	/** Optional short snippet shown only in the expanded variant. */
	snippet?: ReactNode;
}

export interface AiSourcesStrings {
	/** Header title — `{{count}}` placeholder for the source count. */
	title: string;
	expand: string;
	collapse: string;
	visit: string;
}

export const defaultAiSourcesStrings: AiSourcesStrings = {
	title: '{{count}} sources',
	expand: 'Show all sources',
	collapse: 'Hide sources',
	visit: 'Visit source',
};

export type AiSourcesVariant = 'list' | 'avatars';

export interface AiSourcesProps {
	/** Source list. Order is significant — index drives the displayed number. */
	sources: ReadonlyArray<AiSourceItem>;
	/** `list` is a vertical row layout; `avatars` is a stacked-favicons strip. */
	variant?: AiSourcesVariant;
	/** Number of sources rendered in the avatar strip before the "+N" overflow. */
	maxAvatars?: number;
	/** Render the list expanded by default (only applies to `list` variant). */
	defaultExpanded?: boolean;
	/** Click handler — preferred over `url` for SPA routing. */
	onSelect?: (source: AiSourceItem, index: number) => void;
	className?: string;
	strings?: Partial<AiSourcesStrings>;
}
