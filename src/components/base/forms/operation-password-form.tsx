import { useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { ControlledFormField } from './form-field';
import { Input } from './fields';
import { Text } from '@/components/typography';

export type ErrorBag = Record<string, string | string[] | undefined>;

export interface OperationPasswordFormProps {
	formId: string;
	onSubmit: (data: { password: string }) => Promise<void>;
	errors?: ErrorBag;
	isLoading?: boolean;
	label: string;
}

interface PasswordFormValues {
	password: string;
}

export function OperationPasswordForm(props: OperationPasswordFormProps) {
	const { formId, onSubmit, errors, isLoading, label } = props;

	const getError = (field: keyof PasswordFormValues): string | undefined => {
		const value = errors?.[field];
		return Array.isArray(value) ? value[0] : value;
	};
	const passwordError = getError('password');
	const passwordErrorFn = passwordError ? () => passwordError : undefined;

	const topLevelError =
		(Array.isArray(errors?.general) ? errors.general[0] : errors?.general) ||
		(Array.isArray(errors?.server) ? errors.server[0] : errors?.server);

	const defaultValues = useMemo<PasswordFormValues>(() => ({ password: '' }), []);

	const { handleSubmit, control } = useForm<PasswordFormValues>({ defaultValues });

	const submit: SubmitHandler<PasswordFormValues> = async (values) => {
		await onSubmit({ password: values.password });
	};

	const disabled = Boolean(isLoading);

	return (
		<form
			id={formId}
			onSubmit={handleSubmit(submit)}
			className="space-y-4"
		>
			{Boolean(topLevelError) && (
				<Text
					type="error"
				>
					{topLevelError}
				</Text>
			)}

			<ControlledFormField
				name="password"
				control={control}
				error={passwordErrorFn}
				label={label}
				required
			>
				{(field, _error, invalid) => (
					<Input
						type="password"
						value={field.value ?? ''}
						onChange={field.onChange}
						onBlur={field.onBlur}
						name={field.name}
						invalid={invalid}
						disabled={disabled}
						autoFocus
					/>
				)}
			</ControlledFormField>
		</form>
	);
}

OperationPasswordForm.displayName = 'OperationPasswordForm';
