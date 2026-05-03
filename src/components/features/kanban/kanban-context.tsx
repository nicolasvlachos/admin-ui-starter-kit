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
 * wire to the dedicated drag handle. Also carries the resolved
 * domain item so `<KanbanItemActions>` (and any other item-aware
 * subcomponent) can render per-item content without prop drilling.
 *
 * The dnd-kit shapes are widened to `unknown` so consumers can spread
 * them onto any HTMLElement.
 */
interface KanbanItemContextShape {
	listeners: unknown;
	attributes: unknown;
	setActivatorNodeRef: (node: HTMLElement | null) => void;
	/** Stable id (the value returned by `getItemValue`). */
	itemId: string;
	/** The domain item itself — null if it can't be resolved. */
	item: unknown;
}

const KanbanItemContext = createContext<KanbanItemContextShape | null>(null);

export const KanbanItemContextProvider = KanbanItemContext.Provider;

export function useKanbanItemContext(): KanbanItemContextShape {
	const ctx = useContext(KanbanItemContext);
	if (!ctx) {
		throw new Error(
			'<KanbanItemHandle> / <KanbanItemActions> must be rendered inside a <KanbanItem>.',
		);
	}
	return ctx;
}
