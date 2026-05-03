/**
 * LoadingMore Component
 */

import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingMoreProps {
	isLoading: boolean;
	text: string;
	className?: string;
}

export function LoadingMore({
	isLoading,
	text,
	className,
}: LoadingMoreProps): React.ReactElement | null {
	if (!isLoading) {
		return null;
	}

	return (
		<div
			className={cn('loading-more--component', 
				'flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground',
				className
			)}
			role="status"
			aria-live="polite"
		>
			<Loader2 className="size-4 animate-spin" aria-hidden="true" />
			<span>{text}</span>
		</div>
	);
}

LoadingMore.displayName = 'LoadingMore';
