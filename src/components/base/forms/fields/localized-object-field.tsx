import { useFormContext } from 'react-hook-form';

import { Label } from '@/components/typography';
import { Input } from './input';
import { Textarea } from './textarea';

export interface LocalizedObjectFieldDef {
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
}

export interface LocalizedObjectFieldProps {
    /** Field name (path in form values) - should point to object with locale keys */
    name: string;

    /** Field definitions for the object properties */
    fields: LocalizedObjectFieldDef[];

    /** Primary locale code (e.g., 'en') */
    primaryLocale: string;

    /** Secondary locale code (e.g., 'bg') */
    secondaryLocale: string;

    /** Current active locale ('primary' or 'secondary') */
    activeLocale: 'primary' | 'secondary';

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** Additional class names */
    className?: string;
}

/**
 * LocalizedObjectField - Input for bilingual object fields
 */
export function LocalizedObjectField({
    name,
    fields,
    primaryLocale,
    secondaryLocale,
    activeLocale,
    invalid,
    className,
}: LocalizedObjectFieldProps) {
    const { register } = useFormContext();

    const localeKey = activeLocale === 'primary' ? primaryLocale : secondaryLocale;

    return (
        <div className={`w-full space-y-3 rounded-md border p-4 ${className ?? ''}`}>
            {fields.map((field) => {
                const fieldName = `${name}.${localeKey}.${field.name}`;

                return (
                    <div key={field.name} className="w-full space-y-1.5">
                        <Label htmlFor={fieldName}>
                            {field.label}
                            {!!field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {field.type === 'textarea' ? (
                            <Textarea
                                {...register(fieldName)}
                                placeholder={field.placeholder}
                                minRows={3}
                                invalid={invalid}
                            />
                        ) : (
                            <Input
                                {...register(fieldName)}
                                type={field.type === 'number' ? 'number' : 'text'}
                                placeholder={field.placeholder}
                                invalid={invalid}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

LocalizedObjectField.displayName = 'LocalizedObjectField';
