/**
 * CardRadioGroup — single-select radio group rendered as a grid of card-shaped
 * options with title, optional description, and optional leading icon. Built
 * on `@base-ui/react/radio` for accessibility (keyboard navigation, focus
 * management, native form participation).
 *
 * Pairs with `CardCheckboxGroup` (multi-select). Shares spacing tokens from
 * `./choice-types`.
 */
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { CircleCheck, type LucideIcon } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import { useFormsConfig } from '@/lib/ui-provider';
import { resolveFormControlSize } from '../form-sizing';
import {
	choiceCardSizeTokens,
	type ChoiceGroupBaseProps,
	type ChoiceOptionBase,
} from './choice-types';

export interface CardRadioOption extends Omit<ChoiceOptionBase, 'label'> {
	label?: ChoiceOptionBase['label'];
	/** @deprecated Use `label` instead. */
	title?: string;
	icon?: LucideIcon;
}

export interface CardRadioGroupProps extends ChoiceGroupBaseProps {
	options: CardRadioOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	columns?: 1 | 2 | 3 | 4;
}

const GRID_COLS: Record<NonNullable<CardRadioGroupProps['columns']>, string> = {
	1: 'grid grid-cols-1 gap-2',
	2: 'grid grid-cols-1 gap-2 sm:grid-cols-2',
	3: 'grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3',
	4: 'grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4',
};

function CardRadioGroupImpl({
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
}: CardRadioGroupProps) {
	const { defaultControlSize } = useFormsConfig();
	const size = resolveFormControlSize(sizeProp, defaultControlSize);

	const tokens = choiceCardSizeTokens[size];
	const gridClassName = useMemo(() => cn(GRID_COLS[columns], className), [columns, className]);

	return (
		<RadioGroupPrimitive
			value={value}
			defaultValue={defaultValue}
			onValueChange={(val) => val && onChange?.(val)}
			name={name}
			disabled={disabled}
			aria-invalid={invalid || undefined}
			className={gridClassName}
		>
			{options.map((option) => {
				const Icon = option.icon;
				const optionLabel = option.label ?? option.title;
				return (
					<RadioPrimitive.Root
						key={option.value}
						value={option.value}
						disabled={disabled || option.disabled}
						aria-invalid={invalid || undefined}
						className={cn(
							'relative group flex flex-col text-start outline-none cursor-pointer',
							'rounded-md border bg-card transition-[color,box-shadow,background,border-color] duration-150',
							'border-input hover:border-foreground/30',
							'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
							'data-[checked]:border-primary data-[checked]:ring-2 data-[checked]:ring-primary/20',
							tokens.padding,
							tokens.gap,
							'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
							'disabled:cursor-not-allowed disabled:opacity-50',
						)}
					>
						<RadioPrimitive.Indicator
							render={
								<CircleCheck className="absolute top-2 right-2 size-4 text-primary-foreground fill-primary stroke-primary-foreground" />
							}
						/>

						{!!Icon && (
							<span
								className={cn(
									'inline-flex items-center justify-center rounded-md bg-muted text-muted-foreground',
									'group-data-[checked]:bg-primary/10 group-data-[checked]:text-primary',
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
					</RadioPrimitive.Root>
				);
			})}
		</RadioGroupPrimitive>
	);
}

export const CardRadioGroup = memo(CardRadioGroupImpl);
CardRadioGroup.displayName = 'CardRadioGroup';
