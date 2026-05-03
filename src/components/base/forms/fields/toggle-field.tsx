/**
 * ToggleField — inline label-and-control row for switches and checkboxes.
 *
 * Pattern: a left-aligned descriptive label/description block with the
 * control sitting on the trailing edge. Use for settings rows (e.g. "Email
 * notifications" + switch) where a full SwitchCard is too heavy and a bare
 * `Switch` + `<label>` is too brittle. The whole row is clickable and
 * keyboard-accessible.
 *
 * Two control kinds: `'switch'` (default) and `'checkbox'`. Both honour
 * controlled `value` / `defaultValue` / `onChange`. Strings are passed via
 * standard React props rather than a `strings` object — there are no
 * defaults to override.
 */
import type { ReactNode } from 'react';
import { useCallback, useId, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Switch as SwitchPrimitive } from '@/components/ui/switch';
import { Label, Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export type ToggleFieldKind = 'switch' | 'checkbox';

export interface ToggleFieldProps {
	label: ReactNode;
	description?: ReactNode;
	kind?: ToggleFieldKind;
	value?: boolean;
	defaultValue?: boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	invalid?: boolean;
	name?: string;
	className?: string;
	/** Place the control on the leading edge instead of trailing (default). */
	controlPosition?: 'leading' | 'trailing';
}

export function ToggleField({
	label,
	description,
	kind = 'switch',
	value,
	defaultValue,
	onChange,
	disabled = false,
	invalid = false,
	name,
	className,
	controlPosition = 'trailing',
}: ToggleFieldProps) {
	const isControlled = value !== undefined;
	const [internal, setInternal] = useState<boolean>(defaultValue ?? false);
	const checked = isControlled ? value ?? false : internal;
	const inputId = useId();

	const set = useCallback(
		(next: boolean) => {
			if (disabled) return;
			if (!isControlled) setInternal(next);
			onChange?.(next);
		},
		[disabled, isControlled, onChange],
	);

	const onRowClick = (e: React.MouseEvent) => {
		// Avoid double-toggle when clicking the control itself.
		const target = e.target as HTMLElement;
		if (target.closest('[role="switch"], [role="checkbox"], input[type="checkbox"]')) return;
		set(!checked);
	};

	const Control =
		kind === 'switch' ? (
			<SwitchPrimitive
				id={inputId}
				name={name}
				checked={checked}
				onCheckedChange={(v) => set(v as boolean)}
				disabled={disabled}
				aria-invalid={invalid || undefined}
			/>
		) : (
			<Checkbox
				id={inputId}
				name={name}
				checked={checked}
				onCheckedChange={(v) => set(v === true)}
				disabled={disabled}
				aria-invalid={invalid || undefined}
			/>
		);

	const TextBlock = (
		<div className="min-w-0 flex-1">
			<Label
				htmlFor={inputId}
				className={cn(
					'block leading-snug',
					disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
				)}
			>
				{label}
			</Label>
			{!!description && (
				<Text size="xs" type="secondary" className="mt-0.5 leading-snug">
					{description}
				</Text>
			)}
		</div>
	);

	return (
		<div
			role="group"
			onClick={onRowClick}
			className={cn('toggle-field--component', 
				'flex items-start gap-3 rounded-md py-1',
				disabled && 'pointer-events-none',
				className,
			)}
		>
			{controlPosition === 'leading' && <div className="mt-0.5 flex shrink-0">{Control}</div>}
			{TextBlock}
			{controlPosition === 'trailing' && <div className="mt-0.5 flex shrink-0">{Control}</div>}
		</div>
	);
}

ToggleField.displayName = 'ToggleField';
