/**
 * Hook for grouping items by category
 */

import { useMemo } from 'react';

export interface UseGroupedItemsOptions<T> {
	items: T[];
	getItemGroup: ((item: T) => string) | undefined;
}

export type GroupedItemsResult<T> = Map<string, T[]> | null;

export function useGroupedItems<T>({
	items,
	getItemGroup,
}: UseGroupedItemsOptions<T>): GroupedItemsResult<T> {
	return useMemo(() => {
		if (!getItemGroup) {
			return null;
		}

		const groups = new Map<string, T[]>();

		for (const item of items) {
			const groupKey = getItemGroup(item);
			const existing = groups.get(groupKey);

			if (existing) {
				existing.push(item);
			} else {
				groups.set(groupKey, [item]);
			}
		}

		return groups;
	}, [items, getItemGroup]);
}
