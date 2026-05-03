/**
 * Unified Form Field Components
 * =============================
 *
 * Two components sharing the same visual structure for field chrome:
 *
 * 1. `FormField` - Pure presentation wrapper (label, hint, error, required indicator)
 * 2. `ControlledFormField` - FormField + react-hook-form Controller integration
 *
 * ## FormField
 * Use for custom components or non-controlled inputs.
 *
 * ```tsx
 * <FormField label={t('label')} error={error} required hint={t('hint')}>
 *   <CustomAutocomplete value={value} onSelect={onSelect} />
 * </FormField>
 * ```
 *
 * ## ControlledFormField
 * Use with react-hook-form. Auto-merges backend (Inertia) + validation errors.
 *
 * ```tsx
 * <ControlledFormField
 *   name="email"
 *   control={control}
 *   error={getError}
 *   label={t('fields.email.label')}
 *   required
 *   rules={{ required: true, pattern: /^\\S+@\\S+$/i }}
 * >
 *   {(field, error, invalid) => (
 *     <Input
 *       placeholder={t('fields.email.placeholder')}
 *       value={field.value ?? ''}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       invalid={invalid}
 *     />
 *   )}
 * </ControlledFormField>
 * ```
 *
 * ## Render Function Parameters
 * - `field` - Controller props: value, onChange, onBlur, name, ref
 * - `error` - Merged error string (backend || validation) or undefined
 * - `invalid` - Boolean for input styling (border color, etc.)
 * - `fieldState` - Escape hatch: touched, dirty, isTouched, isDirty, etc.
 *
 * ## Error Priority
 * Backend errors (via `error` getter) take priority over validation errors.
 * This ensures server-side validation is authoritative.
 *
 * ## Chrome Props (shared by both components)
 * - `label` - Field label text
 * - `required` - Shows red asterisk after label
 * - `hint` - Secondary text shown below the field when there is no error
 * - `error` - Error message (red text below input)
 * - `helperText` - Helper text (shown when no error)
 * - `className` - Additional wrapper classes
 */

import { type ReactNode } from 'react';
import {
	Controller,
	type Control,
	type ControllerFieldState,
	type ControllerRenderProps,
	type FieldPath,
	type FieldValues,
	type RegisterOptions,
} from 'react-hook-form';

import { Label, Text } from '@/components/typography';
import { cn } from '@/lib/utils';

interface FieldChromeProps {
	label?: string;
	isRequired?: boolean;
	required?: boolean;
	hint?: string;
	error?: string;
	helperText?: string;
	className?: string;
}

interface FormFieldProps extends FieldChromeProps {
	children: ReactNode;
	htmlFor?: string;
}

export function FormField({
	children,
	label,
	isRequired,
	required,
	hint,
	error,
	helperText,
	htmlFor,
	className,
}: FormFieldProps) {
	const hasError = Boolean(error);
	const supportingText = error || helperText || (!hasError ? hint : undefined);
	const showBottomText = Boolean(supportingText);
	const resolvedRequired = isRequired ?? required;

	return (
		<div className={cn('space-y-2', className)}>
			{!!label && (
				<Label htmlFor={htmlFor} className="leading-6">
					{label}
					{!!resolvedRequired && (
						<span className="ml-1 text-destructive">*</span>
					)}
				</Label>
			)}

			{children}

			{!!showBottomText && (
				<Text
					tag="p"
					size="xs"
					type={hasError ? 'error' : 'secondary'}
					{...(hasError ? { role: 'alert', 'aria-live': 'polite' } : {})}
				>
					{supportingText}
				</Text>
			)}
		</div>
	);
}

type ErrorGetter<TName extends string> = (field: TName) => string | undefined;

interface ControlledFormFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> extends Omit<FieldChromeProps, 'error'> {
	name: TName;
	control: Control<TFieldValues>;
	rules?: RegisterOptions<TFieldValues, TName>;
	error?: ErrorGetter<TName>;
	children: (
		field: ControllerRenderProps<TFieldValues, TName>,
		error: string | undefined,
		invalid: boolean,
		fieldState: ControllerFieldState,
	) => ReactNode;
}

export function ControlledFormField<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
>({
	name,
	control,
	rules,
	error: errorGetter,
	children,
	...chromeProps
}: ControlledFormFieldProps<TFieldValues, TName>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field, fieldState }) => {
				const validationError = fieldState.error?.message
					|| (fieldState.error ? (fieldState.error.type === 'required' ? (chromeProps.label ? `${chromeProps.label} is required` : 'This field is required') : 'Invalid value') : undefined);
				const resolvedError = errorGetter?.(name) || validationError || undefined;
				const invalid = Boolean(resolvedError);

				return (
					<FormField {...chromeProps} error={resolvedError} htmlFor={name}>
						{children(field, resolvedError, invalid, fieldState)}
					</FormField>
				);
			}}
		/>
	);
}

FormField.displayName = 'FormField';
ControlledFormField.displayName = 'ControlledFormField';
