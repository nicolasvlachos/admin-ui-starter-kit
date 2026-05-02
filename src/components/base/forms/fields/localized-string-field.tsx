import { useFormContext } from 'react-hook-form';

import { Input } from './input';
import { Textarea } from './textarea';

export interface LocalizedStringFieldProps {
    /** Field name (path in form values) - should point to object with locale keys (e.g., 'en' and 'bg') */
    name: string;

    /** Input type */
    type?: 'text' | 'textarea' | 'number';

    /** Placeholder text */
    placeholder?: string;

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
 * LocalizedStringField - Input for bilingual string fields
 */
export function LocalizedStringField({
    name,
    type = 'text',
    placeholder,
    primaryLocale,
    secondaryLocale,
    activeLocale,
    invalid,
    className,
}: LocalizedStringFieldProps) {
    const { register } = useFormContext();

    const localeKey = activeLocale === 'primary' ? primaryLocale : secondaryLocale;
    const fieldName = `${name}.${localeKey}`;

    if (type === 'textarea') {
        return (
            <Textarea
                {...register(fieldName)}
                placeholder={placeholder}
                minRows={3}
                invalid={invalid}
                className={className}
            />
        );
    }

    return (
        <Input
            {...register(fieldName)}
            type={type === 'number' ? 'number' : 'text'}
            placeholder={placeholder}
            invalid={invalid}
            className={className}
        />
    );
}

LocalizedStringField.displayName = 'LocalizedStringField';
