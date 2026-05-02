/**
 * ObjectRepeater — RHF-driven repeater for arrays of homogeneous objects.
 * Field definitions describe the shape of each row (label, type, placeholder,
 * required, hint); the repeater wires each cell through `useFieldArray`.
 * Rows render as bordered cards with a top-right delete affordance.
 * Strings overridable for i18n.
 */
import { Trash2, Plus } from 'lucide-react';
import { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/base/buttons';
import { FormField } from '@/components/base/forms/form-field';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { Input } from './input';
import { Textarea } from './textarea';
import { defaultRepeaterStrings } from './repeaters.strings';

export interface ObjectRepeaterStrings {
    addButton: string;
    emptyState: string;
    removeAriaLabel: string;
}

export const defaultObjectRepeaterStrings: ObjectRepeaterStrings = {
    addButton: 'Add item',
    ...defaultRepeaterStrings,
};

export interface ObjectFieldDef {
    /** Field name within the object */
    name: string;

    /** Label for the field */
    label: string;

    /** Input type */
    type?: 'text' | 'textarea' | 'number';

    /** Placeholder text */
    placeholder?: string;

    /** Whether the field is required */
    required?: boolean;

    /** Hint text (shown right of label) */
    hint?: string;
}

export interface ObjectRepeaterProps {
    name: string;
    fields: ObjectFieldDef[];
    invalid?: boolean;
    /** Override default strings (button labels, empty state). */
    strings?: Partial<ObjectRepeaterStrings>;
    /** @deprecated Use `strings.addButton` instead. */
    addButtonText?: string;
    /** @deprecated Use `strings.emptyState` instead. */
    emptyMessage?: string;
}

export function ObjectRepeater({
    name,
    fields: fieldDefs,
    addButtonText,
    emptyMessage,
    invalid,
    strings: stringsProp,
}: ObjectRepeaterProps) {
    const strings = useStrings(defaultObjectRepeaterStrings, {
        ...(addButtonText !== undefined ? { addButton: addButtonText } : {}),
        ...(emptyMessage !== undefined ? { emptyState: emptyMessage } : {}),
        ...stringsProp,
    });
    const { control, register } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    const createEmptyObject = useCallback(() => {
        return fieldDefs.reduce(
            (acc, field) => {
                acc[field.name] = '';
                return acc;
            },
            {} as Record<string, string>
        );
    }, [fieldDefs]);

    return (
        <div className="space-y-3">
            {fields.length === 0 ? (
                <div className={`rounded-md border border-dashed p-4 ${invalid ? 'border-destructive' : ''}`}>
                    <Text type="secondary">
                        {strings.emptyState}
                    </Text>
                </div>
            ) : (
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="relative rounded-md border p-4 pt-10">
                            {/* Delete button - positioned in top right */}
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
                                aria-label={strings.removeAriaLabel}
                                title={strings.removeAriaLabel}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>

                            {/* Fields */}
                            <div className="space-y-4">
                                {fieldDefs.map((fieldDef) => {
                                    const fieldPath = `${name}.${index}.${fieldDef.name}`;
                                    return (
                                        <FormField
                                            key={fieldDef.name}
                                            label={fieldDef.label}
                                            required={fieldDef.required}
                                            hint={fieldDef.hint}
                                            htmlFor={fieldPath}
                                        >
                                            {fieldDef.type === 'textarea' ? (
                                                <Textarea
                                                    {...register(fieldPath)}
                                                    id={fieldPath}
                                                    placeholder={fieldDef.placeholder}
                                                    minRows={3}
                                                    invalid={invalid}
                                                />
                                            ) : (
                                                <Input
                                                    {...register(fieldPath)}
                                                    id={fieldPath}
                                                    type={fieldDef.type || 'text'}
                                                    placeholder={fieldDef.placeholder}
                                                    invalid={invalid}
                                                />
                                            )}
                                        </FormField>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Button type="button" variant="secondary" buttonStyle="outline" onClick={() => append(createEmptyObject())}>
                <Plus className="h-4 w-4 mr-2" />
                {strings.addButton}
            </Button>
        </div>
    );
}

ObjectRepeater.displayName = 'ObjectRepeater';
