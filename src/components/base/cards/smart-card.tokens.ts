import { cn } from '@/lib/utils';

import type { CardPadding, SmartCardSurface } from './smart-card.types';

/**
 * BEM-style hooks applied to every SmartCard subregion. Library
 * consumers can target them in CSS / tests / analytics without
 * relying on shadcn's data-slot attributes (which are framework
 * internals). Keep these names consistent — they are part of the
 * public DOM contract.
 */
export const CARD_BEM = {
	root: 'card--component',
	header: 'card--header',
	title: 'card--title',
	description: 'card--description',
	content: 'card--content',
	footer: 'card--footer',
	alert: 'card--alert',
} as const;

interface PaddingTokens {
	shell: string;
	headerX: string;
	contentX: string;
	contentY: string;
	footerX: string;
	alertX: string;
	/** Vertical offset applied when alert sits BELOW the header (pulls it up). */
	alertOffsetWithHeader: string;
	/** Vertical spacing applied when alert is the first content (no header). */
	alertOffsetStandalone: string;
}

export const PADDING: Record<CardPadding, PaddingTokens> = {
	sm: {
		shell: 'gap-3 py-4',
		headerX: 'px-4',
		contentX: 'px-4',
		contentY: 'py-2',
		footerX: 'px-4',
		alertX: 'px-4',
		alertOffsetWithHeader: '-mt-2',
		alertOffsetStandalone: 'mt-1',
	},
	base: {
		shell: 'gap-4 py-6',
		headerX: 'px-6',
		contentX: 'px-6',
		contentY: 'py-0',
		footerX: 'px-6',
		alertX: 'px-6',
		alertOffsetWithHeader: '-mt-3',
		alertOffsetStandalone: 'mt-2',
	},
	lg: {
		shell: 'gap-5 py-8',
		headerX: 'px-8',
		contentX: 'px-8',
		contentY: 'py-2',
		footerX: 'px-8',
		alertX: 'px-8',
		alertOffsetWithHeader: '-mt-4',
		alertOffsetStandalone: 'mt-3',
	},
};

/**
 * Surface-specific shell classes. The `framed` variant uses a soft 5px
 * outer border tinted from `--border` plus a 1px hairline inner border
 * drawn via the `before:` pseudo-element. All values flow through theme
 * tokens — no raw hex.
 */
export const SURFACE_CLASSES: Record<SmartCardSurface, string> = {
	card: 'bg-card text-card-foreground rounded-xl border border-border shadow-sm',
	flat: 'bg-transparent text-card-foreground border-none shadow-none',
	framed: cn(
		'relative bg-card text-card-foreground',
		// Outer soft border: 5px, low-alpha tint of theme border.
		'border-[5px] border-border/30 rounded-2xl',
		// Inner hairline border drawn 5px inside the outer (matches the
		// border-thickness offset). Pure shadcn tokens (`border-border`
		// + `bg-card`) so it picks up the active theme.
		'before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:border before:border-border/60 before:shadow-[2px_2px_2px_3px_rgb(0_0_0/0.02)] before:content-[""]',
	),
};
