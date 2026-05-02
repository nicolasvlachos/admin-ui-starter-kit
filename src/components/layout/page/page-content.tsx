/**
 * PageContent — `<main>` wrapper for the body region of an app shell.
 *
 * Provides consistent padding and an optional width clamp. Lighter-weight
 * than `Page` — use directly inside an `AppShell` flexbox where the surrounding
 * structure (header, sidebar) is already in place.
 */
import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type PageContentMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface PageContentProps extends HTMLAttributes<HTMLElement> {
	/** Body content. */
	children?: ReactNode;
	/** When true, removes default `p-4 md:p-6` padding. */
	noPadding?: boolean;
	/** Optional max-width clamp (centers when set). */
	maxWidth?: PageContentMaxWidth;
}

const MAX_WIDTH_CLASS: Record<PageContentMaxWidth, string> = {
	sm: 'max-w-screen-sm',
	md: 'max-w-screen-md',
	lg: 'max-w-screen-lg',
	xl: 'max-w-screen-xl',
	'2xl': 'max-w-screen-2xl',
	full: 'max-w-full',
};

export function PageContent({
	noPadding = false,
	maxWidth,
	className,
	children,
	...props
}: PageContentProps) {
	return (
		<main
			className={cn(
				'flex-1',
				!noPadding && 'p-4 md:p-6',
				maxWidth && cn('mx-auto w-full', MAX_WIDTH_CLASS[maxWidth]),
				className,
			)}
			{...props}
		>
			{children}
		</main>
	);
}
