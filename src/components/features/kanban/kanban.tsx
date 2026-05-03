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
import { MoreHorizontal } from 'lucide-react';
import { forwardRef, useCallback, useMemo, useState, type MouseEvent } from 'react';

import { PopoverMenu } from '@/components/base/popover-menu';
import { Text } from '@/components/typography';
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
	KanbanItemAction,
	KanbanItemActionsConfig,
	KanbanItemActionsProps,
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
	itemActions,
	onItemClick,
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
			itemActions: itemActions as KanbanItemActionsConfig<unknown> | undefined,
			onItemClick: onItemClick as ((item: unknown) => void) | undefined,
		}),
		[value, onValueChange, getItemValue, activeId, activeItem, findItem, itemActions, onItemClick],
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
	onClick,
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
			itemId: value,
			item: found?.item ?? null,
		}),
		[listeners, attributes, setActivatorNodeRef, value, found?.item],
	);

	const rootClick = ctx.onItemClick;
	const handleClick = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			// `<KanbanItemHandle>` and `<KanbanItemActions>` mark themselves
			// with `data-stop-item-click` so a click on the drag handle or
			// the actions menu doesn't bubble up as a card click.
			const target = event.target as HTMLElement | null;
			if (target?.closest('[data-stop-item-click]')) return;
			if (onClick) {
				onClick();
				return;
			}
			if (rootClick && found?.item !== undefined) {
				rootClick(found.item);
			}
		},
		[onClick, rootClick, found?.item],
	);

	const isClickable = Boolean(onClick || rootClick);

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
				className={cn(
					'touch-none select-none',
					isClickable && 'cursor-pointer',
					className,
				)}
				onClick={isClickable ? handleClick : undefined}
				{...attributes}
				{...listeners}
			>
				{children}
			</div>
		</KanbanItemContextProvider>
	);
}

KanbanItem.displayName = 'KanbanItem';

export const KanbanItemHandle = forwardRef<HTMLButtonElement, KanbanItemHandleProps>(function KanbanItemHandle({ className, children }, forwardedRef) {
	const { setActivatorNodeRef, listeners, attributes } = useKanbanItemContext();
	// Merge dnd-kit's activator ref with the consumer's forwarded ref so a
	// `<Tooltip><KanbanItemHandle ref={…}/></Tooltip>` wiring still gets a
	// real ref to the button element.
	const setMergedRef = useCallback(
		(node: HTMLButtonElement | null) => {
			setActivatorNodeRef(node);
			if (typeof forwardedRef === 'function') {
				forwardedRef(node);
			} else if (forwardedRef) {
				forwardedRef.current = node;
			}
		},
		[setActivatorNodeRef, forwardedRef],
	);
	return (
		<button
			type="button"
			ref={setMergedRef}
			data-slot="kanban-item-handle"
			data-stop-item-click
			onClick={(event) => event.stopPropagation()}
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
});

KanbanItemHandle.displayName = 'KanbanItemHandle';

/**
 * Per-item actions menu (`⋮` trigger → popover with the actions
 * registered at the `<Kanban itemActions>` root). Place inside any
 * `<KanbanItem>` — typically in the card's top-right corner.
 *
 * The trigger marks itself with `data-stop-item-click` so opening the
 * menu doesn't fire the parent `onItemClick` callback.
 */
export function KanbanItemActions({
	className,
	icon,
	ariaLabel,
}: KanbanItemActionsProps) {
	const [open, setOpen] = useState(false);
	const ctx = useKanbanContext();
	const itemCtx = useKanbanItemContext();
	const strings = useStrings(defaultKanbanStrings, undefined);

	const item = itemCtx.item;
	const rawActions = ctx.itemActions;
	const actions = useMemo(() => {
		if (!rawActions || item === null || item === undefined) return [] as ReadonlyArray<KanbanItemAction<unknown>>;
		const list = typeof rawActions === 'function' ? rawActions(item) : rawActions;
		return list.filter((action) =>
			action.isVisible ? action.isVisible(item) : true,
		);
	}, [rawActions, item]);

	if (actions.length === 0) return null;

	return (
		<PopoverMenu
			open={open}
			onOpenChange={setOpen}
			search={false}
			contentClassName="w-44"
			trigger={
				<button
					type="button"
					data-slot="kanban-item-actions-trigger"
					data-stop-item-click
					aria-label={ariaLabel ?? strings.itemActionsAria}
					onClick={(event) => event.stopPropagation()}
					onPointerDown={(event) => event.stopPropagation()}
					className={cn(
						'inline-flex size-7 items-center justify-center rounded-md',
						'text-muted-foreground/70 hover:bg-muted hover:text-foreground',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
						'transition-colors',
						className,
					)}
				>
					{icon ?? <MoreHorizontal className="size-4" aria-hidden="true" />}
				</button>
			}
			items={actions.map((action) => ({
				value: action.id,
				label: action.label,
				icon: action.icon,
				disabled: action.isDisabled?.(item) ?? false,
				data: action,
			}))}
			renderItem={(menuItem) => {
				const action = menuItem.data as KanbanItemAction<unknown>;
				const isDestructive = action.variant === 'destructive';
				return (
					<>
						{!!action.icon && (
							<span
								className={cn(
									'shrink-0',
									isDestructive ? 'text-destructive' : 'text-muted-foreground',
								)}
							>
								{action.icon}
							</span>
						)}
						<Text
							tag="span"
							size="xs"
							className={cn(
								'truncate',
								isDestructive && 'text-destructive',
							)}
						>
							{action.label}
						</Text>
					</>
				);
			}}
			onSelect={(menuItem) => {
				const action = menuItem.data as KanbanItemAction<unknown> | undefined;
				action?.onSelect(item);
				setOpen(false);
			}}
		/>
	);
}

KanbanItemActions.displayName = 'KanbanItemActions';

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
							<Text tag="span" size="xs" weight="medium" className="text-primary/80">{activeId}</Text>
						</div>
					)
				: null}
		</DragOverlay>
	);
}

KanbanOverlay.displayName = 'KanbanOverlay';
