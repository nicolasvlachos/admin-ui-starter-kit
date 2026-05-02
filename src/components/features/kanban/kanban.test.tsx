// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useKanban } from './hooks/use-kanban';
import {
	Kanban,
	KanbanBoard,
	KanbanColumn,
	KanbanColumnContent,
	KanbanItem,
} from './kanban';
import type { KanbanValue } from './kanban.types';

afterEach(() => {
	cleanup();
});

interface Card {
	id: string;
	title: string;
}

const initial: KanbanValue<Card> = {
	planned: [
		{ id: 'a', title: 'Card A' },
		{ id: 'b', title: 'Card B' },
	],
	building: [{ id: 'c', title: 'Card C' }],
	shipped: [],
};

describe('useKanban', () => {
	it('finds an item by its id and reports source columnId + index', () => {
		const { result } = renderHook(() =>
			useKanban<Card>({
				value: initial,
				onValueChange: () => {},
				getItemValue: (c) => c.id,
			}),
		);
		const found = result.current.findItem('c');
		expect(found?.columnId).toBe('building');
		expect(found?.index).toBe(0);
		expect(found?.item.title).toBe('Card C');
	});

	it('move() emits a new value with the item relocated', () => {
		const onValueChange = vi.fn();
		const { result } = renderHook(() =>
			useKanban<Card>({
				value: initial,
				onValueChange,
				getItemValue: (c) => c.id,
			}),
		);
		result.current.move({ itemId: 'a', toColumnId: 'shipped' });
		expect(onValueChange).toHaveBeenCalledTimes(1);
		const next = onValueChange.mock.calls[0][0] as KanbanValue<Card>;
		expect(next.shipped.map((c) => c.id)).toEqual(['a']);
		expect(next.planned.map((c) => c.id)).toEqual(['b']);
	});

	it('move() into an explicit toIndex inserts at that slot', () => {
		const onValueChange = vi.fn();
		const { result } = renderHook(() =>
			useKanban<Card>({
				value: initial,
				onValueChange,
				getItemValue: (c) => c.id,
			}),
		);
		result.current.move({ itemId: 'c', toColumnId: 'planned', toIndex: 1 });
		const next = onValueChange.mock.calls[0][0] as KanbanValue<Card>;
		expect(next.planned.map((c) => c.id)).toEqual(['a', 'c', 'b']);
	});

	it('move() is a no-op when item is dropped at its current slot', () => {
		const onValueChange = vi.fn();
		const { result } = renderHook(() =>
			useKanban<Card>({
				value: initial,
				onValueChange,
				getItemValue: (c) => c.id,
			}),
		);
		result.current.move({ itemId: 'a', toColumnId: 'planned', toIndex: 0 });
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('move() correctly handles same-column shifts past the source', () => {
		const onValueChange = vi.fn();
		const { result } = renderHook(() =>
			useKanban<Card>({
				value: { col: [{ id: '1', title: '1' }, { id: '2', title: '2' }, { id: '3', title: '3' }] },
				onValueChange,
				getItemValue: (c) => c.id,
			}),
		);
		// Move "1" from index 0 to index 2 — should land at the end after splice-shift.
		result.current.move({ itemId: '1', toColumnId: 'col', toIndex: 2 });
		const next = onValueChange.mock.calls[0][0] as KanbanValue<Card>;
		expect(next.col.map((c) => c.id)).toEqual(['2', '1', '3']);
	});

	it('onItemMove fires with from/to + the moved item', () => {
		const onItemMove = vi.fn();
		const { result } = renderHook(() =>
			useKanban<Card>({
				value: initial,
				onValueChange: () => {},
				getItemValue: (c) => c.id,
				onItemMove,
			}),
		);
		result.current.move({ itemId: 'b', toColumnId: 'building' });
		expect(onItemMove).toHaveBeenCalledTimes(1);
		const event = onItemMove.mock.calls[0][0];
		expect(event.itemId).toBe('b');
		expect(event.from).toEqual({ columnId: 'planned', index: 1 });
		expect(event.to.columnId).toBe('building');
	});
});

describe('Kanban (smoke render)', () => {
	it('renders all columns and items', () => {
		render(
			<Kanban<Card>
				value={initial}
				onValueChange={() => {}}
				getItemValue={(c) => c.id}
			>
				<KanbanBoard className="grid grid-cols-3">
					{Object.entries(initial).map(([colId, cards]) => (
						<KanbanColumn key={colId} value={colId}>
							<header>{colId}</header>
							<KanbanColumnContent value={colId}>
								{cards.map((card) => (
									<KanbanItem key={card.id} value={card.id}>
										<span>{card.title}</span>
									</KanbanItem>
								))}
							</KanbanColumnContent>
						</KanbanColumn>
					))}
				</KanbanBoard>
			</Kanban>,
		);
		expect(screen.getByText('Card A')).toBeInTheDocument();
		expect(screen.getByText('Card B')).toBeInTheDocument();
		expect(screen.getByText('Card C')).toBeInTheDocument();
		expect(screen.getAllByRole('application').length).toBe(1);
	});

	it('uses the configured aria-label on the board landmark', () => {
		render(
			<Kanban<Card>
				value={initial}
				onValueChange={() => {}}
				getItemValue={(c) => c.id}
				strings={{ boardAria: 'Roadmap board' }}
			>
				<KanbanBoard />
			</Kanban>,
		);
		expect(screen.getByRole('application')).toHaveAttribute('aria-label', 'Roadmap board');
	});
});
