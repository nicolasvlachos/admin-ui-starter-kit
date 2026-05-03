/**
 * CardCheckboxGroup — multi-select group rendered as a grid of card-shaped
 * options with title, optional description, and optional leading icon.
 * Use for a small set of feature flags / preferences where each option
 * benefits from extra context that a flat checkbox list can't carry.
 *
 * Pairs with `CardRadioGroup` (single-select). Both share spacing tokens
 * from `./choice-types` so they line up when used side-by-side.
 */
import { CircleCheck, type LucideIcon } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import { useFormsConfig } from '@/lib/ui-provider';
import { resolveFormControlSize } from '../form-sizing';
import {
	choiceCardSizeTokens,
	type ChoiceGroupBaseProps,
	type ChoiceOptionBase,
} from './choice-types';

export interface CardCheckboxOption extends Omit<ChoiceOptionBase, 'label'> {
	label?: ChoiceOptionBase['label'];
	/** @deprecated Use `label` instead. */
	title?: string;
	icon?: LucideIcon;
}

export interface CardCheckboxGroupProps extends ChoiceGroupBaseProps {
	options: CardCheckboxOption[];
	value?: string[];
	defaultValue?: string[];
	onChange?: (values: string[]) => void;
	columns?: 1 | 2 | 3 | 4;
}

const GRID_COLS: Record<NonNullable<CardCheckboxGroupProps['columns']>, string> = {
	1: 'grid grid-cols-1 gap-2',
	2: 'grid grid-cols-1 gap-2 sm:grid-cols-2',
	3: 'grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3',
	4: 'grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4',
};

export function CardCheckboxGroup({
	options,
	value,
	defaultValue,
	onChange,
	name,
	columns = 3,
	invalid,
	disabled,
	size: sizeProp,
	className,
}: CardCheckboxGroupProps) {
	const { defaultControlSize } = useFormsConfig();
	const size = resolveFormControlSize(sizeProp, defaultControlSize);

	const isControlled = value !== undefined;
	const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
	const selected = useMemo(
		() => (isControlled ? value ?? [] : internal),
		[internal, isControlled, value],
	);
	const tokens = choiceCardSizeTokens[size];

	const toggle = useCallback(
		(val: string) => {
			if (disabled) return;
			if (options.find((o) => o.value === val)?.disabled) return;
			const exists = selected.includes(val);
			const next = exists ? selected.filter((v) => v !== val) : [...selected, val];
			if (!isControlled) setInternal(next);
			onChange?.(next);
		},
		[disabled, options, selected, isControlled, onChange],
	);

	return (
		<div
			className={cn(GRID_COLS[columns], className)}
			role="group"
			aria-invalid={invalid || undefined}
			aria-disabled={disabled || undefined}
		>
			{options.map((option) => {
				const Icon = option.icon;
				const optionLabel = option.label ?? option.title;
				const isSelected = selected.includes(option.value);
				const isDisabled = disabled || option.disabled;
				const shouldIncludeHidden = Boolean(name) && isSelected;
				const nameAttr = name ? `${name}[]` : undefined;

				return (
					<div key={option.value} className="relative">
						<input
							type="hidden"
							name={nameAttr}
							value={option.value}
							aria-hidden="true"
							hidden
							disabled={!shouldIncludeHidden}
						/>

						<button
							type="button"
							aria-pressed={isSelected}
							aria-invalid={invalid || undefined}
							onClick={() => toggle(option.value)}
							disabled={isDisabled}
							data-selected={isSelected}
							className={cn(
								'group relative flex w-full flex-col items-start text-start outline-none cursor-pointer',
								'rounded-md border bg-card transition-[color,box-shadow,background,border-color] duration-150',
								'border-input hover:border-foreground/30',
								'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
								'data-[selected=true]:border-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary/20',
								tokens.padding,
								tokens.gap,
								'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
								'disabled:cursor-not-allowed disabled:opacity-50',
							)}
						>
							<CircleCheck
								className={cn(
									'absolute top-2 right-2 size-4 text-primary-foreground fill-primary stroke-primary-foreground',
									!isSelected && 'hidden',
								)}
							/>

							{!!Icon && (
								<span
									className={cn(
										'inline-flex items-center justify-center rounded-md bg-muted text-muted-foreground',
										'group-data-[selected=true]:bg-primary/10 group-data-[selected=true]:text-primary',
										tokens.iconBox,
									)}
								>
									<Icon className={tokens.iconSize} />
								</span>
							)}
							<Text tag="span" weight="medium">
								{optionLabel}
							</Text>
							{!!option.description && (
								<Text size="xs" type="secondary">
									{option.description}
								</Text>
							)}
						</button>
					</div>
				);
			})}
		</div>
	);
}

CardCheckboxGroup.displayName = 'CardCheckboxGroup';
