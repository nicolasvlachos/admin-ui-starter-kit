/**
 * StringRepeater — RHF-driven repeater for arrays of plain strings. Use under
 * a `FormProvider`; the `name` prop must point at a `string[]` path in the
 * form values. Pair with `useFieldArray` semantics: rows can be added,
 * removed, and reordered. Strings overridable for i18n.
 */
import { Trash2, Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/base/buttons';
import Text from '@/components/typography/text';
import { useStrings } from '@/lib/strings';
import { Input } from './input';
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
    stacked?: boolean;
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
    stacked = false,
    strings: stringsProp,
}: StringRepeaterProps) {
    const strings = useStrings(defaultStringRepeaterStrings, {
        ...(placeholder !== undefined ? { placeholder } : {}),
        ...(addButtonText !== undefined ? { addButton: addButtonText } : {}),
        ...(emptyMessage !== undefined ? { emptyState: emptyMessage } : {}),
        ...stringsProp,
    });
    const { control, register } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name,
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
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        stacked ? (
                            <div
                                key={field.id}
                                className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
                            >
                                <Input
                                    {...register(`${name}.${index}`)}
                                    placeholder={strings.placeholder}
                                    invalid={invalid}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    buttonStyle="outline"
                                    aria-label={strings.removeAriaLabel}
                                    onClick={() => remove(index)}
                                    className="shrink-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div key={field.id} className="flex gap-2">
                                <Input {...register(`${name}.${index}`)} placeholder={strings.placeholder} invalid={invalid} className="flex-1" />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    buttonStyle="outline"
                                    aria-label={strings.removeAriaLabel}
                                    onClick={() => remove(index)}
                                    className="shrink-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )
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

StringRepeater.displayName = 'StringRepeater';
