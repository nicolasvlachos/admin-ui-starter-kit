/**
 * ObjectRepeater — RHF-driven repeater for arrays of homogeneous objects.
 * Field definitions describe the shape of each row (label, type, placeholder,
 * required, hint); the repeater wires each cell through `useFieldArray` and
 * renders rows as bordered cards via the shared `<Repeater>` primitive.
 * Strings overridable for i18n.
 */
import { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { FormField } from '@/components/base/forms/form-field';
import { useStrings } from '@/lib/strings';

import { Input } from './input';
import { Repeater } from './repeater';
import { defaultRepeaterStrings } from './repeaters.strings';
import { Textarea } from './textarea';

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
    /** Enable drag-to-reorder. Default `false`. */
    sortable?: boolean;
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
    sortable = false,
    strings: stringsProp,
}: ObjectRepeaterProps) {
    const strings = useStrings(defaultObjectRepeaterStrings, {
        ...(addButtonText !== undefined ? { addButton: addButtonText } : {}),
        ...(emptyMessage !== undefined ? { emptyState: emptyMessage } : {}),
        ...stringsProp,
    });
    const { control, register } = useFormContext();
    const { fields, append, remove, move } = useFieldArray({
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
        <Repeater
            items={fields}
            sortable={sortable}
            rowVariant="card"
            removeVariant="ghost"
            onAdd={() => append(createEmptyObject())}
            onRemove={(index) => remove(index)}
            onMove={(from, to) => move(from, to)}
            strings={{
                emptyState: strings.emptyState,
                addButton: strings.addButton,
                removeAriaLabel: strings.removeAriaLabel,
            }}
            renderRow={(_field, { index }) => (
                <div className="space-y-3">
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
            )}
        />
    );
}

ObjectRepeater.displayName = 'ObjectRepeater';
