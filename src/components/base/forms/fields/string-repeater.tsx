/**
 * StringRepeater — RHF-driven repeater for arrays of plain strings. Use under
 * a `FormProvider`; the `name` prop must point at a `string[]` path in the
 * form values. Pair with `useFieldArray` semantics: rows can be added,
 * removed, and (optionally) reordered. Strings overridable for i18n.
 *
 * Built on the shared `<Repeater>` primitive so it stays visually
 * consistent with `ObjectRepeater`, `LocalizedStringRepeater`, and
 * `KeyValueEditor`.
 */
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useStrings } from '@/lib/strings';

import { Input } from './input';
import { Repeater } from './repeater';
import { defaultRepeaterStrings } from './repeaters.strings';

export interface StringRepeaterStrings {
    placeholder: string;
    addButton: string;
    emptyState: string;
    removeAriaLabel: string;
}

export const defaultStringRepeaterStrings: StringRepeaterStrings = {
    placeholder: 'Enter value',
    addButton: 'Add item',
    ...defaultRepeaterStrings,
};

export interface StringRepeaterProps {
    name: string;
    invalid?: boolean;
    /** Enable drag-to-reorder. Default `false`. */
    sortable?: boolean;
    /** Override default strings (placeholder, button, empty state). */
    strings?: Partial<StringRepeaterStrings>;
    /** @deprecated Use `strings.placeholder` instead. */
    placeholder?: string;
    /** @deprecated Use `strings.addButton` instead. */
    addButtonText?: string;
    /** @deprecated Use `strings.emptyState` instead. */
    emptyMessage?: string;
}

export function StringRepeater({
    name,
    placeholder,
    addButtonText,
    emptyMessage,
    invalid,
    sortable = false,
    strings: stringsProp,
}: StringRepeaterProps) {
    const strings = useStrings(defaultStringRepeaterStrings, {
        ...(placeholder !== undefined ? { placeholder } : {}),
        ...(addButtonText !== undefined ? { addButton: addButtonText } : {}),
        ...(emptyMessage !== undefined ? { emptyState: emptyMessage } : {}),
        ...stringsProp,
    });
    const { control, register } = useFormContext();
    const { fields, append, remove, move } = useFieldArray({
        control,
        name,
    });

    return (
        <Repeater
            items={fields}
            sortable={sortable}
            onAdd={() => append('')}
            onRemove={(index) => remove(index)}
            onMove={(from, to) => move(from, to)}
            strings={{
                emptyState: strings.emptyState,
                addButton: strings.addButton,
                removeAriaLabel: strings.removeAriaLabel,
            }}
            renderRow={(_field, { index }) => (
                <Input
                    {...register(`${name}.${index}`)}
                    placeholder={strings.placeholder}
                    invalid={invalid}
                />
            )}
        />
    );
}

StringRepeater.displayName = 'StringRepeater';
