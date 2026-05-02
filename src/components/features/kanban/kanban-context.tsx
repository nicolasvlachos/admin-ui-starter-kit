import { createContext, useContext } from 'react';

import type { KanbanContextShape } from './kanban.types';

/**
 * Internal context for the Kanban — the parts use this to read
 * shared state (current value, getItemValue, active drag id).
 */
const KanbanContext = createContext<KanbanContextShape | null>(null);

export const KanbanContextProvider = KanbanContext.Provider;

export function useKanbanContext<T = unknown>(): KanbanContextShape<T> {
	const ctx = useContext(KanbanContext);
	if (!ctx) {
		throw new Error(
			'Kanban subcomponents must be rendered inside a <Kanban> root.',
		);
	}
	return ctx as unknown as KanbanContextShape<T>;
}

/**
 * Internal context exposed by `<KanbanItem>` so the optional
 * `<KanbanItemHandle>` knows which listeners + accessibility props to
 * wire to the dedicated drag handle. The shapes match @dnd-kit's own
 * `useSortable()` return values; we widen them to the unknown
 * superset so the consuming component can spread them onto an
 * arbitrary HTMLElement.
 */
interface KanbanItemContextShape {
	listeners: unknown;
	attributes: unknown;
	setActivatorNodeRef: (node: HTMLElement | null) => void;
}

const KanbanItemContext = createContext<KanbanItemContextShape | null>(null);

export const KanbanItemContextProvider = KanbanItemContext.Provider;

export function useKanbanItemContext(): KanbanItemContextShape {
	const ctx = useContext(KanbanItemContext);
	if (!ctx) {
		throw new Error(
			'<KanbanItemHandle> must be rendered inside a <KanbanItem>.',
		);
	}
	return ctx;
}
