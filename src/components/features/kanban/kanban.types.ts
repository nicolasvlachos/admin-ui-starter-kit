import type { CSSProperties, ReactNode } from 'react';

import type { StringsProp } from '@/lib/strings';

import type { KanbanStrings } from './kanban.strings';

/**
 * The columns→items map. Keys are column ids; values are arrays of
 * domain items. The library is generic in `T` — pass a `getItemValue`
 * accessor that turns each item into a stable string id.
 */
export type KanbanValue<T = unknown> = Record<string, T[]>;

export interface KanbanContextShape<T = unknown> {
	value: KanbanValue<T>;
	onValueChange: (next: KanbanValue<T>) => void;
	getItemValue: (item: T) => string;
	/** id of the item currently being dragged (null when idle). */
	activeId: string | null;
	/** Direct reference to the active item (null when idle). */
	activeItem: T | null;
	/** Resolve a (columnId, itemId) lookup → the item, or undefined. */
	findItem: (id: string) => { columnId: string; index: number; item: T } | undefined;
}

export interface KanbanProps<T = unknown> {
	value: KanbanValue<T>;
	onValueChange: (next: KanbanValue<T>) => void;
	getItemValue: (item: T) => string;
	/**
	 * Fires when an item is dropped into a different column. Use to mirror
	 * the change to your backend / optimistic update layer.
	 */
	onItemMove?: (event: KanbanItemMoveEvent<T>) => void;
	/** Strings for screen-reader announcements. */
	strings?: StringsProp<KanbanStrings>;
	className?: string;
	children?: ReactNode;
}

export interface KanbanItemMoveEvent<T = unknown> {
	item: T;
	itemId: string;
	from: { columnId: string; index: number };
	to: { columnId: string; index: number };
}

export interface KanbanBoardProps {
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
}

export interface KanbanColumnProps {
	/** Stable column id — must be a key of the `KanbanValue` map. */
	value: string;
	className?: string;
	children?: ReactNode;
}

export interface KanbanColumnContentProps {
	/** Same column id as its parent `<KanbanColumn>`. */
	value: string;
	className?: string;
	children?: ReactNode;
}

export interface KanbanItemProps {
	/** Stable item id (the value returned by `getItemValue`). */
	value: string;
	className?: string;
	/**
	 * Disable dragging on this specific item — useful while a row is
	 * mid-mutation.
	 */
	disabled?: boolean;
	children?: ReactNode;
}

export interface KanbanItemHandleProps {
	className?: string;
	children?: ReactNode;
}

export interface KanbanOverlayProps {
	className?: string;
	/**
	 * Render-prop alternative — receives the active item and column id, lets
	 * the consumer return any node. Defaults to a tinted dashed outline at
	 * the size of the source row.
	 */
	render?: (ctx: { item: unknown; columnId: string | null }) => ReactNode;
}
