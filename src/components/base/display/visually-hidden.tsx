/**
 * VisuallyHidden — hides content from sighted users while keeping it readable
 * by assistive tech (screen readers, voice). Use to label icon-only buttons,
 * give context to status changes, or expose extra structure for AT users.
 */
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface VisuallyHiddenProps {
	children: React.ReactNode;
	className?: string;
}

export function VisuallyHidden({ children, className }: VisuallyHiddenProps) {
	return (
		<span
			className={cn('visually-hidden--component', 
				'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
				'[clip:rect(0,0,0,0)]',
				className,
			)}
		>
			{children}
		</span>
	);
}

VisuallyHidden.displayName = 'VisuallyHidden';
