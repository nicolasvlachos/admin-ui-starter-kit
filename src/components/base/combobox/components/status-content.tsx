/**
 * StatusContent Component
 */

import { Loader2 } from 'lucide-react';
import * as React from 'react';
import type { ComboboxStrings } from '../types';

export interface StatusContentProps {
	isLoading?: boolean;
	searchValue: string;
	minSearchLength: number;
	itemCount: number;
	strings: ComboboxStrings;
}

export function StatusContent({
	isLoading,
	searchValue,
	minSearchLength,
	itemCount,
	strings,
}: StatusContentProps): React.ReactNode {
	const trimmed = searchValue.trim();

	if (isLoading) {
		return (
			<>
				<Loader2 className="size-4 animate-spin" />
				{strings.searching}
			</>
		);
	}

	if (trimmed === '') {
		if (strings.typeToSearch.includes('{min}')) {
			return strings.typeToSearch.replace('{min}', String(minSearchLength));
		}
		return strings.typeToSearch;
	}

	if (trimmed.length < minSearchLength) {
		const remaining = minSearchLength - trimmed.length;
		if (strings.typeMore.includes('{remaining}') || strings.typeMore.includes('{s}')) {
			return strings.typeMore
				.replace('{remaining}', String(remaining))
				.replace('{s}', remaining !== 1 ? 's' : '');
		}
		return strings.typeMore;
	}

	if (itemCount === 0) {
		return null;
	}

	return null;
}

StatusContent.displayName = 'StatusContent';
