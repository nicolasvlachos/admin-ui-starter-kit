/**
 * LocalizedStringRepeater — bilingual variant of `<StringRepeater>`. The
 * `name` prop points at an object whose keys are locale codes and whose
 * values are string arrays; `activeLocale` selects which locale's array to
 * edit. Built on the shared `<Repeater>` primitive for visual parity with
 * the rest of the repeater family.
 */
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useStrings, type StringsProp } from '@/lib/strings';

import { Repeater } from './repeater';
import { defaultRepeaterStrings } from './repeaters.strings';
import { Textarea } from './textarea';

export interface LocalizedStringRepeaterStrings {
    placeholder: string;
    addButton: string;
    emptyState: string;
    removeAriaLabel: string;
}

export const defaultLocalizedStringRepeaterStrings: LocalizedStringRepeaterStrings = {
    placeholder: 'Enter value',
    addButton: defaultRepeaterStrings.addItem,
    emptyState: defaultRepeaterStrings.emptyState,
    removeAriaLabel: defaultRepeaterStrings.removeAriaLabel,
};

export interface LocalizedStringRepeaterProps {
    /** Field name (path in form values) - should point to object with locale array keys */
    name: string;

    /** @deprecated Use `strings.placeholder` instead. */
    placeholder?: string;

    /** @deprecated Use `strings.addButton` instead. */
    addButtonText?: string;

    /** @deprecated Use `strings.emptyState` instead. */
    emptyMessage?: string;

    /** Primary locale code (e.g., 'en') */
    primaryLocale: string;

    /** Secondary locale code (e.g., 'bg') */
    secondaryLocale: string;

    /** Current active locale ('primary' or 'secondary') */
    activeLocale: 'primary' | 'secondary';

    /** Enable drag-to-reorder. Default `false`. */
    sortable?: boolean;

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** String overrides merged over defaults. */
    strings?: StringsProp<LocalizedStringRepeaterStrings>;
}

export function LocalizedStringRepeater({
    name,
    placeholder,
    addButtonText,
    emptyMessage,
    primaryLocale,
    secondaryLocale,
    activeLocale,
    invalid,
    sortable = false,
    strings: stringsProp,
}: LocalizedStringRepeaterProps) {
    const strings = useStrings(defaultLocalizedStringRepeaterStrings, {
        ...(placeholder !== undefined ? { placeholder } : {}),
        ...(addButtonText !== undefined ? { addButton: addButtonText } : {}),
        ...(emptyMessage !== undefined ? { emptyState: emptyMessage } : {}),
        ...(stringsProp ?? {}),
    });
    const { control, register } = useFormContext();

    const localeKey = activeLocale === 'primary' ? primaryLocale : secondaryLocale;
    const fieldName = `${name}.${localeKey}`;

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: fieldName,
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
                <Textarea
                    {...register(`${fieldName}.${index}`)}
                    placeholder={strings.placeholder}
                    minRows={2}
                    invalid={invalid}
                />
            )}
        />
    );
}

LocalizedStringRepeater.displayName = 'LocalizedStringRepeater';
