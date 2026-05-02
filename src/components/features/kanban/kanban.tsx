/**
 * Kanban — drag-and-drop board with multi-column item sorting and
 * cross-column moves. Headless behavior comes from `@dnd-kit/core` +
 * `@dnd-kit/sortable`; the library wires it into a callback-driven,
 * generic-T API:
 *
 *     <Kanban
 *         value={columns}
 *         onValueChange={setColumns}
 *         getItemValue={(c) => c.id}
 *         onItemMove={(e) => api.persistMove(e)}
 *     >
 *         <KanbanBoard className="grid grid-cols-3 gap-3">
 *             {Object.entries(columns).map(([colId, items]) => (
 *                 <KanbanColumn key={colId} value={colId}>
 *                     <header>{COLUMNS[colId].title}</header>
 *                     <KanbanColumnContent value={colId}>
 *                         {items.map((card) => (
 *                             <KanbanItem key={card.id} value={card.id}>
 *                                 …card body…
 *                             </KanbanItem>
 *                         ))}
 *                     </KanbanColumnContent>
 *                 </KanbanColumn>
 *             ))}
 *         </KanbanBoard>
 *         <KanbanOverlay />
 *     </Kanban>
 *
 * The library never reaches into a router, never persists state — your
 * `onValueChange` is the source of truth. Use `onItemMove` for
 * analytics / optimistic-update plumbing.
 */
import {
	DndContext,
	DragOverlay,
	PointerSensor,
	useDroppable,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragStartEvent,
} from '@dnd-kit/core';
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCallback, useMemo, useState } from 'react';

import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { useKanban } from './hooks/use-kanban';
import {
	KanbanContextProvider,
	KanbanItemContextProvider,
	useKanbanContext,
	useKanbanItemContext,
} from './kanban-context';
import { defaultKanbanStrings } from './kanban.strings';
import type {
	KanbanBoardProps,
	KanbanColumnContentProps,
	KanbanColumnProps,
	KanbanItemHandleProps,
	KanbanItemProps,
	KanbanOverlayProps,
	KanbanProps,
} from './kanban.types';

export function Kanban<T>({
	value,
	onValueChange,
	getItemValue,
	onItemMove,
	strings: stringsProp,
	className,
	children,
}: KanbanProps<T>) {
	const strings = useStrings(defaultKanbanStrings, stringsProp);
	const { findItem, move } = useKanban({
		value,
		onValueChange,
		getItemValue,
		onItemMove,
	});
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
	);

	const activeItem = useMemo(
		() => (activeId ? findItem(activeId)?.item ?? null : null),
		[activeId, findItem],
	);

	const handleDragStart = useCallback(
		(event: DragStartEvent) => {
			setActiveId(String(event.active.id));
		},
		[],
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			setActiveId(null);
			const { active, over } = event;
			if (!over) return;
			const activeData = active.data.current as
				| { columnId?: string; index?: number }
				| undefined;
			const overData = over.data.current as
				| { columnId?: string; index?: number }
				| undefined;
			const overId = String(over.id);

			// Dropping on a column container (not a sortable item) → append.
			const targetColumnId =
				overData?.columnId ?? (Object.prototype.hasOwnProperty.call(value, overId) ? overId : undefined);
			if (!targetColumnId) return;

			const toIndex =
				overData?.columnId !== undefined ? overData.index : value[targetColumnId].length;

			move({
				itemId: String(active.id),
				toColumnId: targetColumnId,
				toIndex,
			});
			void activeData;
		},
		[move, value],
	);

	const ctxValue = useMemo(
		() => ({
			value: value as Record<string, unknown[]>,
			onValueChange: onValueChange as (next: Record<string, unknown[]>) => void,
			getItemValue: getItemValue as (item: unknown) => string,
			activeId,
			activeItem: activeItem as unknown,
			findItem: findItem as (id: string) => { columnId: string; index: number; item: unknown } | undefined,
		}),
		[value, onValueChange, getItemValue, activeId, activeItem, findItem],
	);

	return (
		<KanbanContextProvider value={ctxValue}>
			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragCancel={() => setActiveId(null)}
				accessibility={{
					announcements: {
						onDragStart({ active }) {
							return strings.announceDragStart.replace('{name}', String(active.id));
						},
						onDragOver({ active, over }) {
							if (!over) return undefined;
							return strings.announceDragMove
								.replace('{name}', String(active.id))
								.replace('{from}', '')
								.replace('{to}', String(over.id));
						},
						onDragEnd({ active, over }) {
							return strings.announceDragEnd
								.replace('{name}', String(active.id))
								.replace('{to}', over ? String(over.id) : '');
						},
						onDragCancel({ active }) {
							return strings.announceDragCancel.replace('{name}', String(active.id));
						},
					},
				}}
			>
				<div
					role="application"
					aria-label={strings.boardAria}
					className={cn('w-full', className)}
				>
					{children}
				</div>
			</DndContext>
		</KanbanContextProvider>
	);
}

Kanban.displayName = 'Kanban';

export function KanbanBoard({ className, style, children }: KanbanBoardProps) {
	return (
		<div className={cn('grid w-full gap-3', className)} style={style}>
			{children}
		</div>
	);
}

KanbanBoard.displayName = 'KanbanBoard';

export function KanbanColumn({ value, className, children }: KanbanColumnProps) {
	const { setNodeRef, isOver } = useDroppable({ id: value });
	return (
		<div
			ref={setNodeRef}
			data-slot="kanban-column"
			data-column-id={value}
			data-over={isOver ? 'true' : undefined}
			className={cn('flex min-w-0 flex-col', className)}
		>
			{children}
		</div>
	);
}

KanbanColumn.displayName = 'KanbanColumn';

export function KanbanColumnContent({
	value,
	className,
	children,
}: KanbanColumnContentProps) {
	const ctx = useKanbanContext();
	const items = ctx.value[value] ?? [];
	const ids = items.map((item) => ctx.getItemValue(item));
	return (
		<SortableContext items={ids} strategy={verticalListSortingStrategy}>
			<div
				data-slot="kanban-column-content"
				className={cn('flex flex-col gap-2', className)}
			>
				{children}
			</div>
		</SortableContext>
	);
}

KanbanColumnContent.displayName = 'KanbanColumnContent';

export function KanbanItem({
	value,
	className,
	disabled = false,
	children,
}: KanbanItemProps) {
	const ctx = useKanbanContext();
	const found = ctx.findItem(value);
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: value,
		disabled,
		data: { columnId: found?.columnId, index: found?.index },
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : undefined,
	};

	const itemCtx = useMemo(
		() => ({
			listeners,
			attributes,
			setActivatorNodeRef,
		}),
		[listeners, attributes, setActivatorNodeRef],
	);

	// When no <KanbanItemHandle> is used, the whole row is the activator.
	// We attach listeners + attributes here as the default — KanbanItemHandle
	// can then override by wiring them to a more specific element.
	return (
		<KanbanItemContextProvider value={itemCtx}>
			<div
				ref={setNodeRef}
				style={style}
				data-slot="kanban-item"
				data-dragging={isDragging ? 'true' : undefined}
				className={cn('touch-none select-none', className)}
				{...attributes}
				{...listeners}
			>
				{children}
			</div>
		</KanbanItemContextProvider>
	);
}

KanbanItem.displayName = 'KanbanItem';

export function KanbanItemHandle({ className, children }: KanbanItemHandleProps) {
	const { setActivatorNodeRef, listeners, attributes } = useKanbanItemContext();
	return (
		<button
			type="button"
			ref={setActivatorNodeRef}
			data-slot="kanban-item-handle"
			className={cn(
				'inline-flex cursor-grab items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:cursor-grabbing',
				className,
			)}
			{...(attributes as Record<string, unknown>)}
			{...(listeners as Record<string, unknown>)}
		>
			{children}
		</button>
	);
}

KanbanItemHandle.displayName = 'KanbanItemHandle';

export function KanbanOverlay({ className, render }: KanbanOverlayProps) {
	const { activeItem, activeId, findItem } = useKanbanContext();
	return (
		<DragOverlay>
			{activeId
				? render
					? render({
							item: activeItem,
							columnId: findItem(activeId)?.columnId ?? null,
						})
					: (
						<div
							className={cn(
								'pointer-events-none rounded-md border-2 border-dashed border-primary/40 bg-primary/5 p-3 shadow-lg',
								className,
							)}
						>
							<span className="text-xs font-medium text-primary/80">{activeId}</span>
						</div>
					)
				: null}
		</DragOverlay>
	);
}

KanbanOverlay.displayName = 'KanbanOverlay';
