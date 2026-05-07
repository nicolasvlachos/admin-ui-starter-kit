import type { ReactNode } from 'react';

export type DocsLayer = 'ui' | 'base' | 'composed' | 'features' | 'layout' | 'common';

export interface DocsPageProps {
	title: string;
	description?: string;
	layer?: DocsLayer;
	status?: 'ready' | 'wip' | 'broken';
	sourcePath?: string;
	children: ReactNode;
}

export interface SectionProps {
	title: string;
	id: string;
	description?: string;
	children: ReactNode;
}
