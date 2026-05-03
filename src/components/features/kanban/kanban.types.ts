import type { CSSProperties, ReactNode } from 'react';

import type { StringsProp } from '@/lib/strings';

import type { KanbanStrings } from './kanban.strings';

/**
 * The columns→items map. Keys are column ids; values are arrays of
 * domain items. The library is generic in `T` — pass a `getItemValue`
 * accessor that turns each item into a stable string id.
 */
export type KanbanValue<T = unknown> = Record<string, T[]>;

/**
 * A single action available on a Kanban item — surfaces inside the
 * `<KanbanItemActions>` (`⋮`) popover. Mirrors the `ActionItem` shape
 * used by `DataTable.rowActions` so consumers can re-use the same
 * action definitions across both surfaces.
 */
export interface KanbanItemAction<T = unknown> {
	/** Stable id used as React key + data-action attribute. */
	id: string;
	/** Visible label inside the popover. */
	label: string;
	/** Optional leading icon node. */
	icon?: ReactNode;
	/** Visual variant. `destructive` tints the row red. */
	variant?: 'default' | 'destructive';
	/** Click handler — receives the item that owns this action. */
	onSelect: (item: T) => void;
	/** Hide this action for some items (defaults to always visible). */
	isVisible?: (item: T) => boolean;
	/** Disable this action for some items. */
	isDisabled?: (item: T) => boolean;
}

/**
 * Static array OR factory that produces actions per item — same
 * pattern as `DataTable.rowActions`. Use the factory form when the
 * available actions depend on item state (e.g. a "Reopen" action only
 * for items in the `done` column).
 *
 * (The exported name is `KanbanItemActionsConfig` so it doesn't clash
 * with the runtime component `<KanbanItemActions>`.)
 */
export type KanbanItemActionsConfig<T = unknown> =
	| ReadonlyArray<KanbanItemAction<T>>
	| ((item: T) => ReadonlyArray<KanbanItemAction<T>>);

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
	/** Item-level actions registered at the `<Kanban>` root, if any. */
	itemActions?: KanbanItemActionsConfig<T>;
	/** Item-level click handler. Fires on whole-card click; the drag
	 *  handle and action menu stop propagation so they don't trigger it. */
	onItemClick?: (item: T) => void;
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
	/**
	 * Item-level actions surfaced through `<KanbanItemActions>`. Pass a
	 * static array for actions that always appear, or a factory for
	 * per-item conditional actions (e.g. "Reopen" only on shipped items).
	 */
	itemActions?: KanbanItemActionsConfig<T>;
	/**
	 * Fires when the consumer clicks anywhere on a `<KanbanItem>` other
	 * than the drag handle or actions menu. Use to open a detail
	 * drawer, navigate, etc.
	 */
	onItemClick?: (item: T) => void;
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
	/**
	 * Per-item override for the root-level `onItemClick`. Falls back to
	 * the `onItemClick` registered on `<Kanban>` if omitted.
	 */
	onClick?: () => void;
	children?: ReactNode;
}

export interface KanbanItemHandleProps {
	className?: string;
	children?: ReactNode;
}

export interface KanbanItemActionsProps {
	/** Optional class on the trigger button. */
	className?: string;
	/** Override the trigger icon (defaults to a `⋮` MoreHorizontal). */
	icon?: ReactNode;
	/** aria-label on the trigger button. Defaults to `strings.itemActionsAria`. */
	ariaLabel?: string;
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
