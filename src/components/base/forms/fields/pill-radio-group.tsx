/**
 * PillRadioGroup — compact, inline single-select rendered as connected pill
 * buttons. Best for 2–4 options where a full `<Select>` is too heavy and
 * cards are too tall (e.g. timeframe toggles, view-mode switchers).
 *
 * Custom-styled buttons rather than the shadcn ToggleGroup primitive: the
 * primitive strips inner rounding when spacing=0, which doesn't match this
 * design system's pill connector style.
 */
import * as React from 'react';

import { cn } from '@/lib/utils';
import { useFormsConfig } from '@/lib/ui-provider';
import { resolveFormControlSize } from '../form-sizing';
import {
	choicePillSizeTokens,
	type ChoiceGroupBaseProps,
	type ChoiceOptionBase,
} from './choice-types';

export interface PillRadioGroupOption extends ChoiceOptionBase {}

export interface PillRadioGroupProps
	extends Omit<ChoiceGroupBaseProps, 'name'> {
	name: string;
	value: string | null | undefined;
	options: PillRadioGroupOption[];
	onChange: (value: string | null) => void;
	/** Allow deselecting (click active pill to clear). Default false. */
	allowClear?: boolean;
	/** Stretch pills to fill the container. */
	fullWidth?: boolean;
}

export function PillRadioGroup({
	name,
	value,
	options,
	onChange,
	allowClear = false,
	size: sizeProp,
	fullWidth = false,
	disabled = false,
	invalid = false,
	className,
}: PillRadioGroupProps) {
	const { defaultControlSize } = useFormsConfig();
	const size = resolveFormControlSize(sizeProp, defaultControlSize);

	const handleClick = React.useCallback(
		(optionValue: string) => {
			if (optionValue === value) {
				if (allowClear) onChange(null);
			} else {
				onChange(optionValue);
			}
		},
		[allowClear, onChange, value],
	);

	return (
		<div
			data-name={name}
			role="radiogroup"
			aria-invalid={invalid || undefined}
			className={cn(
				'border-input inline-flex items-center overflow-hidden rounded-lg border',
				fullWidth && 'w-full',
				'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
				disabled && 'pointer-events-none opacity-50',
				className,
			)}
		>
			{options.map((option, index) => {
				const isSelected = option.value === value;
				const Icon = option.icon;
				const optionLabel =
					typeof option.label === 'string' ? option.label : undefined;
				return (
					<button
						key={option.value}
						type="button"
						role="radio"
						aria-checked={isSelected}
						aria-label={optionLabel || option.value}
						disabled={disabled || option.disabled}
						onClick={() => handleClick(option.value)}
						className={cn(
							'inline-flex select-none items-center justify-center font-medium transition-colors',
							'focus-visible:ring-ring/50 outline-none focus-visible:z-10 focus-visible:ring-2',
							'disabled:pointer-events-none disabled:opacity-50',
							choicePillSizeTokens[size],
							fullWidth && 'flex-1',
							index > 0 && 'border-input border-l',
							isSelected
								? 'bg-primary text-primary-foreground'
								: 'bg-background text-foreground hover:bg-muted',
						)}
					>
						{!!Icon && <Icon className={cn('size-3.5', option.label && 'mr-1.5')} />}
						{option.label}
					</button>
				);
			})}
		</div>
	);
}

PillRadioGroup.displayName = 'PillRadioGroup';
