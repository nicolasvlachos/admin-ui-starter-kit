/**
 * List — RHF-driven sortable list of plain strings. Identical use-case to
 * `<StringRepeater sortable>` and now built on the same `<Repeater>`
 * primitive so the visual chrome (drag handle, ghost X remove, dashed
 * empty state, "+ add" button) matches the rest of the repeater family
 * exactly. Kept as a separate export because it ships with `sortable`
 * on by default — `<StringRepeater>` ships with sortable off.
 */
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useStrings, type StringsProp } from '@/lib/strings';

import { Input } from './input';
import { Repeater } from './repeater';
import { defaultRepeaterStrings } from './repeaters.strings';

export interface ListStrings {
    addButton: string;
    emptyState: string;
    dragHandle: string;
    removeAriaLabel: string;
}

export const defaultListStrings: ListStrings = {
    addButton: 'Add item',
    emptyState: defaultRepeaterStrings.emptyState,
    dragHandle: 'Drag to reorder',
    removeAriaLabel: defaultRepeaterStrings.removeAriaLabel,
};

export interface ListProps {
    /** Field name in form */
    name: string;

    /** Input placeholder */
    placeholder?: string;

    /** @deprecated Use `strings.addButton` instead. */
    addButtonText?: string;

    /** @deprecated Use `strings.emptyState` instead. */
    emptyMessage?: string;

    /** Disable drag-to-reorder. Default `false` (sortable on). */
    disableSort?: boolean;

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
    disableSort = false,
    invalid,
    strings: stringsProp,
}: ListProps) {
    const strings = useStrings(defaultListStrings, {
        ...(addButtonText !== undefined ? { addButton: addButtonText } : {}),
        ...(emptyMessage !== undefined ? { emptyState: emptyMessage } : {}),
        ...(stringsProp ?? {}),
    });
    const { control, register } = useFormContext();
    const { fields, append, remove, move } = useFieldArray({ control, name });

    return (
        <Repeater className="list--component"
            items={fields}
            sortable={!disableSort}
            onAdd={() => append('')}
            onRemove={(index) => remove(index)}
            onMove={(from, to) => move(from, to)}
            strings={{
                emptyState: strings.emptyState,
                addButton: strings.addButton,
                removeAriaLabel: strings.removeAriaLabel,
                dragHandleAriaLabel: strings.dragHandle,
            }}
            renderRow={(_field, { index }) => (
                <Input
                    {...register(`${name}.${index}`)}
                    placeholder={placeholder}
                    invalid={invalid}
                />
            )}
        />
    );
}

List.displayName = 'List';
