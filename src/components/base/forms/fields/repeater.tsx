/**
 * Repeater — shared chrome for any list-style form field. Renders a list of
 * rows with optional drag handle and a per-row remove icon, plus an empty
 * state and a trailing "+ add" button. The row body is consumer-rendered via
 * `children` (or `renderRow`), so this primitive is the visual contract that
 * `StringRepeater`, `ObjectRepeater`, `LocalizedStringRepeater`, and
 * `KeyValueEditor` all share — without locking down what each row is editing.
 *
 * Sortable is opt-in (`sortable`); when enabled the rows are wired up
 * through `@dnd-kit/sortable` and the consumer can render the supplied
 * `dragHandleProps` on whichever element is the visual handle.
 *
 * The `<Repeater>` is intentionally headless on the value side — it does not
 * own the items array. Consumers (RHF callers via `useFieldArray`, manual
 * controlled state, etc.) pass `items`, `onAdd`, `onRemove`, and
 * (optionally) `onMove` callbacks. This keeps the primitive framework- and
 * state-shape-agnostic.
 */
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, X } from 'lucide-react';
import {
    type CSSProperties,
    type ReactNode,
    useCallback,
    useMemo,
} from 'react';

import { Button } from '@/components/base/buttons';
import Text from '@/components/typography/text';
import { useStrings, type StringsProp } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultRepeaterStrings } from './repeaters.strings';

export interface RepeaterStrings {
    /** Empty state copy — shown when `items` is empty. */
    emptyState: string;
    /** Label of the trailing "+" button. */
    addButton: string;
    /** Per-row remove button aria-label. */
    removeAriaLabel: string;
    /** Drag-handle aria-label (only relevant when `sortable`). */
    dragHandleAriaLabel: string;
}

export const defaultRepeaterPrimitiveStrings: RepeaterStrings = {
    emptyState: defaultRepeaterStrings.emptyState,
    addButton: defaultRepeaterStrings.addItem,
    removeAriaLabel: defaultRepeaterStrings.removeAriaLabel,
    dragHandleAriaLabel: 'Drag to reorder',
};

/**
 * Visual density of a row. `inline` is the canonical compact admin row
 * (single input + remove icon). `card` wraps richer content in a
 * bordered surface — used by `ObjectRepeater` and any consumer with
 * multi-field rows that need their own delete affordance.
 */
export type RepeaterRowVariant = 'inline' | 'card';

export type RepeaterRemoveVariant = 'ghost' | 'icon-button';

export interface RepeaterItem {
    /** Stable id (RHF `field.id`, generated UUID, etc.) — used as React key
     *  and as the drag handle id when sortable. */
    id: string;
}

interface RepeaterRowRenderContext {
    /** Index of the row in the items array. */
    index: number;
    /** True while the row is being actively dragged. */
    isDragging: boolean;
}

export interface RepeaterProps<T extends RepeaterItem> {
    items: ReadonlyArray<T>;
    /** Render the body of a single row. */
    renderRow: (item: T, ctx: RepeaterRowRenderContext) => ReactNode;
    /** Called when the consumer presses the "+ add" button. */
    onAdd: () => void;
    /** Called when the consumer presses a per-row remove button. */
    onRemove: (index: number) => void;
    /** Called when a row is dragged to a new position. Required when
     *  `sortable` is true; ignored otherwise. */
    onMove?: (fromIndex: number, toIndex: number) => void;
    /** Enable drag-to-reorder. Default `false`. */
    sortable?: boolean;
    /** Visual style of each row's outer chrome. Default `'inline'`. */
    rowVariant?: RepeaterRowVariant;
    /** Remove button style. Default `'ghost'` (subtle X icon, hover →
     *  destructive tint). `'icon-button'` mirrors `<Button icon={Trash2}>`
     *  — used by card rows that need a more prominent affordance. */
    removeVariant?: RepeaterRemoveVariant;
    /** Hide the per-row remove button. Default `false`. Useful when the
     *  consumer renders its own remove inside the row body. */
    hideRemove?: boolean;
    /** Disable add + remove + drag affordances. */
    disabled?: boolean;
    /** Hide the trailing "+ add" button. Useful when the consumer composes
     *  it elsewhere or has a maxItems cap. */
    hideAdd?: boolean;
    /** Override default strings. */
    strings?: StringsProp<RepeaterStrings>;
    /** Class applied to the outer wrapper. */
    className?: string;
}

interface RowProps<T extends RepeaterItem> {
    item: T;
    index: number;
    sortable: boolean;
    rowVariant: RepeaterRowVariant;
    removeVariant: RepeaterRemoveVariant;
    hideRemove: boolean;
    disabled: boolean;
    strings: RepeaterStrings;
    onRemove: (index: number) => void;
    renderRow: RepeaterProps<T>['renderRow'];
}

function Row<T extends RepeaterItem>({
    item,
    index,
    sortable,
    rowVariant,
    removeVariant,
    hideRemove,
    disabled,
    strings,
    onRemove,
    renderRow,
}: RowProps<T>) {
    const sortableState = useSortable({ id: item.id, disabled: disabled || !sortable });
    const isDragging = sortable ? sortableState.isDragging : false;

    const style: CSSProperties | undefined = sortable
        ? {
              transform: CSS.Transform.toString(sortableState.transform),
              transition: sortableState.transition,
              opacity: isDragging ? 0.6 : 1,
          }
        : undefined;

    const ref = sortable ? sortableState.setNodeRef : undefined;
    const dragAttributes = sortable ? sortableState.attributes : {};
    const dragListeners = sortable ? sortableState.listeners : undefined;

    const dragHandle = sortable ? (
        <button
            type="button"
            aria-label={strings.dragHandleAriaLabel}
            className={cn(
                'inline-flex size-9 shrink-0 items-center justify-center rounded-md',
                'text-muted-foreground/50 hover:text-foreground hover:bg-muted',
                'cursor-grab active:cursor-grabbing',
                'outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                'transition-colors',
                disabled && 'pointer-events-none opacity-50',
            )}
            {...dragAttributes}
            {...dragListeners}
        >
            <GripVertical className="size-4" aria-hidden="true" />
        </button>
    ) : null;

    const removeButton = hideRemove ? null : removeVariant === 'icon-button' ? (
        <Button
            type="button"
            variant="secondary"
            buttonStyle="outline"
            size="sm"
            aria-label={strings.removeAriaLabel}
            disabled={disabled}
            onClick={() => onRemove(index)}
            className="shrink-0"
        >
            <Trash2 className="size-4" aria-hidden="true" />
        </Button>
    ) : (
        <button
            type="button"
            aria-label={strings.removeAriaLabel}
            disabled={disabled}
            onClick={() => onRemove(index)}
            className={cn(
                'inline-flex size-9 shrink-0 items-center justify-center rounded-md',
                'text-muted-foreground/70 hover:bg-destructive/10 hover:text-destructive',
                'outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                'transition-colors',
                'disabled:pointer-events-none disabled:opacity-50',
            )}
        >
            <X className="size-4" aria-hidden="true" />
        </button>
    );

    if (rowVariant === 'card') {
        return (
            <div
                ref={ref}
                style={style}
                className={cn(
                    'relative rounded-md border border-input bg-card p-4',
                    sortable && 'pl-2',
                )}
            >
                <div className="flex items-start gap-2">
                    {dragHandle}
                    <div className="min-w-0 flex-1">
                        {renderRow(item, { index, isDragging })}
                    </div>
                    {removeButton}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            style={style}
            className="flex items-start gap-2"
        >
            {dragHandle}
            <div className="min-w-0 flex-1">
                {renderRow(item, { index, isDragging })}
            </div>
            {removeButton}
        </div>
    );
}

export function Repeater<T extends RepeaterItem>({
    items,
    renderRow,
    onAdd,
    onRemove,
    onMove,
    sortable = false,
    rowVariant = 'inline',
    removeVariant = 'ghost',
    hideRemove = false,
    hideAdd = false,
    disabled = false,
    strings: stringsProp,
    className,
}: RepeaterProps<T>) {
    const strings = useStrings(defaultRepeaterPrimitiveStrings, stringsProp);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;
            const fromIndex = items.findIndex((item) => item.id === active.id);
            const toIndex = items.findIndex((item) => item.id === over.id);
            if (fromIndex < 0 || toIndex < 0) return;
            onMove?.(fromIndex, toIndex);
        },
        [items, onMove],
    );

    const itemIds = useMemo(() => items.map((item) => item.id), [items]);

    const list = (
        <div className="space-y-2">
            {items.map((item, index) => (
                <Row<T>
                    key={item.id}
                    item={item}
                    index={index}
                    sortable={sortable}
                    rowVariant={rowVariant}
                    removeVariant={removeVariant}
                    hideRemove={hideRemove}
                    disabled={disabled}
                    strings={strings}
                    onRemove={onRemove}
                    renderRow={renderRow}
                />
            ))}
        </div>
    );

    return (
        <div className={cn('space-y-3', className)}>
            {items.length === 0 ? (
                <div className="rounded-md border border-dashed border-input p-4">
                    <Text type="secondary">{strings.emptyState}</Text>
                </div>
            ) : sortable ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                        {list}
                    </SortableContext>
                </DndContext>
            ) : (
                list
            )}

            {!hideAdd && (
                <Button
                    type="button"
                    variant="secondary"
                    buttonStyle="outline"
                    size="sm"
                    disabled={disabled}
                    onClick={onAdd}
                >
                    <Plus className="size-4 mr-1.5" />
                    {strings.addButton}
                </Button>
            )}
        </div>
    );
}

Repeater.displayName = 'Repeater';

/** Re-export `arrayMove` from `@dnd-kit/sortable` so consumers using
 *  the headless shape don't need to add the dep import themselves. */
export { arrayMove };
