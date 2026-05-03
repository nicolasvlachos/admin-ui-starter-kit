/**
 * ListRadioGroup — single-select radio group rendered as a vertical list with
 * dividers between rows. Use when options have descriptive secondary text and
 * read better as a stack than a grid (e.g. plan tiers, role definitions).
 *
 * Pairs with `CardRadioGroup` for grid-style choices and `PillRadioGroup` for
 * inline compact toggles.
 */
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { Circle } from 'lucide-react';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import { useFormsConfig } from '@/lib/ui-provider';
import { resolveFormControlSize } from '../form-sizing';
import {
	choiceListSizeTokens,
	type ChoiceGroupBaseProps,
	type ChoiceOptionBase,
} from './choice-types';

export interface ListRadioOption extends ChoiceOptionBase {}

export interface ListRadioGroupProps extends ChoiceGroupBaseProps {
	options: ListRadioOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
}

export function ListRadioGroup({
	options,
	value,
	defaultValue,
	onChange,
	name,
	invalid,
	disabled,
	size: sizeProp,
	className,
}: ListRadioGroupProps) {
	const { defaultControlSize } = useFormsConfig();
	const size = resolveFormControlSize(sizeProp, defaultControlSize);

	const rowPadding = choiceListSizeTokens[size];
	return (
		<RadioGroupPrimitive
			value={value}
			defaultValue={defaultValue}
			onValueChange={(val) => val && onChange?.(val)}
			name={name}
			disabled={disabled}
			aria-invalid={invalid || undefined}
			className={cn(
				'overflow-hidden rounded-md border [&>[role=radio]~[role=radio]]:border-t',
				'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
				disabled && 'pointer-events-none opacity-50',
				className,
			)}
		>
			{options.map((option) => (
				<RadioPrimitive.Root
					key={option.value}
					value={option.value}
					disabled={disabled || option.disabled}
					className={cn(
						'group flex w-full items-start gap-3 text-start outline-none cursor-pointer',
						'transition-colors hover:bg-muted/40 focus-visible:bg-muted/40',
						'data-[checked]:bg-primary/5',
						'disabled:cursor-not-allowed disabled:opacity-50',
						rowPadding,
					)}
				>
					<div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary group-data-[checked]:border-primary group-not-data-[checked]:border-muted-foreground/50">
						<RadioPrimitive.Indicator
							render={<Circle className="h-2.5 w-2.5 fill-primary text-primary" />}
						/>
					</div>
					<div className="flex-1 min-w-0">
						<Text tag="span" weight="medium" lineHeight="tight" className="block">
							{option.label}
						</Text>
						{!!option.description && (
							<Text tag="span" size="xs" type="secondary" className="block mt-0.5">
								{option.description}
							</Text>
						)}
					</div>
				</RadioPrimitive.Root>
			))}
		</RadioGroupPrimitive>
	);
}

ListRadioGroup.displayName = 'ListRadioGroup';
