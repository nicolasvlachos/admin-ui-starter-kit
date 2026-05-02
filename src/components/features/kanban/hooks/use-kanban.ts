import { useCallback, useMemo } from 'react';

import type { KanbanItemMoveEvent, KanbanValue } from '../kanban.types';

/**
 * Headless hook — exposes the same state machine `<Kanban>` uses
 * internally so consumers can build a fully custom UI against it.
 *
 *   const { findItem, move } = useKanban({ value, onValueChange,
 *     getItemValue });
 *   move({ itemId: 'card-1', toColumnId: 'shipped', toIndex: 0 });
 */
export interface UseKanbanOptions<T> {
	value: KanbanValue<T>;
	onValueChange: (next: KanbanValue<T>) => void;
	getItemValue: (item: T) => string;
	onItemMove?: (event: KanbanItemMoveEvent<T>) => void;
}

export interface UseKanbanResult<T> {
	findItem: (id: string) => { columnId: string; index: number; item: T } | undefined;
	/**
	 * Move an item between columns / within the same column. Idempotent:
	 * a no-op move is safe.
	 */
	move: (input: { itemId: string; toColumnId: string; toIndex?: number }) => void;
}

export function useKanban<T>({
	value,
	onValueChange,
	getItemValue,
	onItemMove,
}: UseKanbanOptions<T>): UseKanbanResult<T> {
	const findItem = useCallback(
		(id: string) => {
			for (const [columnId, items] of Object.entries(value)) {
				const index = items.findIndex((item) => getItemValue(item) === id);
				if (index >= 0) return { columnId, index, item: items[index] };
			}
			return undefined;
		},
		[value, getItemValue],
	);

	const move = useCallback(
		({ itemId, toColumnId, toIndex }: { itemId: string; toColumnId: string; toIndex?: number }) => {
			const found = findItem(itemId);
			if (!found) return;
			if (!Object.prototype.hasOwnProperty.call(value, toColumnId)) return;

			const { columnId: fromColumnId, index: fromIndex, item } = found;

			// Same column, same slot — nothing to do.
			const targetItems = value[toColumnId];
			const resolvedToIndex =
				toIndex === undefined
					? targetItems.length
					: Math.max(0, Math.min(toIndex, targetItems.length));

			if (fromColumnId === toColumnId && fromIndex === resolvedToIndex) return;

			const next: KanbanValue<T> = { ...value };
			const sourceCopy = [...next[fromColumnId]];
			sourceCopy.splice(fromIndex, 1);
			next[fromColumnId] = sourceCopy;

			const targetCopy = [...(fromColumnId === toColumnId ? sourceCopy : next[toColumnId])];
			// When moving within the same column to a later index, the splice
			// above shifted everything left — re-resolve the destination.
			let landingIndex = resolvedToIndex;
			if (fromColumnId === toColumnId && fromIndex < resolvedToIndex) {
				landingIndex = Math.max(0, resolvedToIndex - 1);
			}
			targetCopy.splice(landingIndex, 0, item);
			next[toColumnId] = targetCopy;

			onValueChange(next);
			onItemMove?.({
				item,
				itemId,
				from: { columnId: fromColumnId, index: fromIndex },
				to: { columnId: toColumnId, index: landingIndex },
			});
		},
		[value, findItem, onValueChange, onItemMove],
	);

	return useMemo(() => ({ findItem, move }), [findItem, move]);
}
