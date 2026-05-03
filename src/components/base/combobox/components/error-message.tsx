/**
 * ErrorMessage Component
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { ComboboxSize } from '../types';

export interface ErrorMessageProps {
	error?: string;
	size: ComboboxSize;
	className?: string;
}

const sizeClasses: Record<ComboboxSize, string> = {
	sm: 'text-xs mt-1',
	md: 'text-sm mt-1.5',
	lg: 'text-base mt-2',
};

export function ErrorMessage({
	error,
	size,
	className,
}: ErrorMessageProps): React.ReactElement | null {
	if (!error) {
		return null;
	}

	return (
		<p
			className={cn('error-message--component', 'text-destructive', sizeClasses[size], className)}
			role="alert"
			aria-live="polite"
		>
			{error}
		</p>
	);
}

ErrorMessage.displayName = 'ErrorMessage';
