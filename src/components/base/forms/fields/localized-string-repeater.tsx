import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useStrings, type StringsProp } from '@/lib/strings';
import { defaultRepeaterStrings } from './repeaters.strings';
import { Textarea } from './textarea';

export interface LocalizedStringRepeaterStrings {
    placeholder: string;
    addButton: string;
    emptyState: string;
}

export const defaultLocalizedStringRepeaterStrings: LocalizedStringRepeaterStrings = {
    placeholder: 'Enter value',
    addButton: defaultRepeaterStrings.addItem,
    emptyState: defaultRepeaterStrings.emptyState,
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

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** String overrides merged over defaults. */
    strings?: StringsProp<LocalizedStringRepeaterStrings>;
}

/**
 * LocalizedStringRepeater - Repeater for bilingual string arrays
 */
export function LocalizedStringRepeater({
    name,
    placeholder,
    addButtonText,
    emptyMessage,
    primaryLocale,
    secondaryLocale,
    activeLocale,
    invalid,
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

    const { fields, append, remove } = useFieldArray({
        control,
        name: fieldName,
    });

    return (
        <div className="space-y-3">
            {fields.length === 0 ? (
                <div className={`rounded-md border border-dashed p-4 ${invalid ? 'border-destructive' : ''}`}>
                    <Text type="secondary">
                        {strings.emptyState}
                    </Text>
                </div>
            ) : (
                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-start">
                            <Textarea
                                {...register(`${fieldName}.${index}`)}
                                placeholder={strings.placeholder}
                                className="flex-1"
                                minRows={2}
                                invalid={invalid}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                buttonStyle="outline"
                                onClick={() => remove(index)}
                                className="shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Button type="button" variant="secondary" buttonStyle="outline" onClick={() => append('')}>
                <Plus className="h-4 w-4 mr-2" />
                {strings.addButton}
            </Button>
        </div>
    );
}

LocalizedStringRepeater.displayName = 'LocalizedStringRepeater';
