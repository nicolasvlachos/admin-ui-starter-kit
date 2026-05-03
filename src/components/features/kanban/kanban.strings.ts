/**
 * Strings for the Kanban — drag-and-drop screen-reader announcements
 * + accessibility labels. The library never renders user-visible copy
 * that the consumer hasn't already supplied via column headers / item
 * children, so the strings here are exclusively for assistive tech.
 */
export interface KanbanStrings {
	/** Read by screen readers when a drag begins. `{name}` = item id. */
	announceDragStart: string;
	/** Read when an item moves over a column. `{from}` / `{to}` are column ids. */
	announceDragMove: string;
	/** Read when an item is dropped into a column. */
	announceDragEnd: string;
	/** Read when the user cancels a drag with Escape. */
	announceDragCancel: string;
	/** Aria label on the drag handle. */
	dragHandleAria: string;
	/** Aria label on the board landmark. */
	boardAria: string;
	/** Aria label on the per-item actions trigger (`⋮`). */
	itemActionsAria: string;
}

export const defaultKanbanStrings: KanbanStrings = {
	announceDragStart: 'Picked up item {name}.',
	announceDragMove: 'Moving {name} from {from} to {to}.',
	announceDragEnd: 'Dropped {name} into {to}.',
	announceDragCancel: 'Cancelled drag of {name}.',
	dragHandleAria: 'Drag handle',
	boardAria: 'Kanban board',
	itemActionsAria: 'Item actions',
};

export function interpolateKanbanString(
	template: string,
	params: Record<string, string>,
): string {
	return Object.entries(params).reduce(
		(acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
		template,
	);
}
