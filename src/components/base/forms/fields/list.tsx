import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import React, { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useStrings, type StringsProp } from '@/lib/strings';
import { Input } from './input';
import { defaultRepeaterStrings } from './repeaters.strings';

export interface ListStrings {
    addButton: string;
    emptyState: string;
    dragHandle: string;
    removeAriaLabel: string;
    removeTitle: string;
}

export const defaultListStrings: ListStrings = {
    addButton: 'Add item',
    emptyState: defaultRepeaterStrings.emptyState,
    dragHandle: 'Drag to reorder',
    removeAriaLabel: 'Remove item',
    removeTitle: 'Remove',
};

interface SortableItemProps {
    id: string;
    name: string;
    index: number;
    placeholder?: string;
    invalid?: boolean;
    onRemove: () => void;
    strings: ListStrings;
}

function SortableItem({ id, name, index, placeholder, invalid, onRemove, strings }: SortableItemProps) {
    const { register } = useFormContext();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 ${isDragging ? 'opacity-50' : ''}`}
        >
            <button
                type="button"
                className="inline-flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
                aria-label={strings.dragHandle}
                {...attributes}
                {...listeners}
            >
                <GripVertical className="h-4 w-4" />
            </button>

            <div className="min-w-0 flex-1">
                <Input {...register(`${name}.${index}`)} placeholder={placeholder} invalid={invalid} className="w-full" />
            </div>

            <Button
                type="button"
                variant="error"
                buttonStyle="ghost"
                size="icon-sm"
                icon={Trash2}
                onClick={onRemove}
                aria-label={strings.removeAriaLabel}
                title={strings.removeTitle}
            >{''}</Button>
        </div>
    );
}

export interface ListProps {
    /** Field name in form */
    name: string;

    /** Input placeholder */
    placeholder?: string;

    /** @deprecated Use `strings.addButton` instead. */
    addButtonText?: string;

    /** @deprecated Use `strings.emptyState` instead. */
    emptyMessage?: string;

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** String overrides merged over defaults. */
    strings?: StringsProp<ListStrings>;
}

export function List({
    name,
    placeholder,
    addButtonText,
    emptyMessage,
    invalid,
    strings: stringsProp,
}: ListProps) {
    const strings = useStrings(defaultListStrings, {
        ...(addButtonText !== undefined ? { addButton: addButtonText } : {}),
        ...(emptyMessage !== undefined ? { emptyState: emptyMessage } : {}),
        ...(stringsProp ?? {}),
    });
    const { control } = useFormContext();
    const { fields, append, remove, move } = useFieldArray({ control, name });

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

    const items = fields.map((field) => field.id);

    const onDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const fromIndex = items.indexOf(String(active.id));
            const toIndex = items.indexOf(String(over.id));
            if (fromIndex === -1 || toIndex === -1) return;

            move(fromIndex, toIndex);
        },
        [items, move]
    );

    return (
        <div className="space-y-3">
            {fields.length === 0 ? (
                <div className={`rounded-md border border-dashed p-4 ${invalid ? 'border-destructive' : ''}`}>
                    <Text type="secondary">
                        {strings.emptyState}
                    </Text>
                </div>
            ) : (
                <DndContext sensors={sensors} onDragEnd={onDragEnd}>
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <SortableItem
                                    key={field.id}
                                    id={field.id}
                                    name={name}
                                    index={index}
                                    placeholder={placeholder}
                                    invalid={invalid}
                                    onRemove={() => remove(index)}
                                    strings={strings}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <Button type="button" variant="secondary" buttonStyle="outline" onClick={() => append('')}>
                <Plus className="h-4 w-4 mr-2" />
                {strings.addButton}
            </Button>
        </div>
    );
}

List.displayName = 'List';
