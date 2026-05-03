/**
 * Shared types for choice-style form fields (CardRadio, CardCheckbox,
 * ListRadio, PillRadio). Each variant exports its own `Option` type that
 * extends `ChoiceOptionBase`, so consumers see one consistent option shape
 * across the family.
 *
 * Sizes follow the global convention (`sm | base | lg`); CardRadio and
 * CardCheckbox additionally accept `size` to drive padding, icon size, and
 * type scale.
 */
import type { ComponentType, ReactNode } from 'react';

export type ChoiceSize = 'sm' | 'base' | 'lg';

export interface ChoiceOptionBase<TValue extends string = string> {
	value: TValue;
	label: ReactNode;
	description?: ReactNode;
	icon?: ComponentType<{ className?: string }>;
	disabled?: boolean;
}

export interface ChoiceGroupBaseProps {
	/** Form field name (also used for hidden inputs and aria grouping). */
	name?: string;
	/** Disable the entire group. */
	disabled?: boolean;
	/** Show error styling. */
	invalid?: boolean;
	/** Density / control size. Default `'sm'` (resolves through `useFormsConfig().defaultControlSize`). */
	size?: ChoiceSize;
	className?: string;
}

/**
 * Padding / icon-size token map shared across CardRadio + CardCheckbox so the
 * two variants line up visually when placed side-by-side.
 */
export const choiceCardSizeTokens: Record<
	ChoiceSize,
	{ padding: string; iconBox: string; iconSize: string; gap: string }
> = {
	sm: { padding: 'p-3', iconBox: 'h-7 w-7', iconSize: 'size-3.5', gap: 'gap-1' },
	base: { padding: 'p-4', iconBox: 'h-8 w-8', iconSize: 'size-4', gap: 'gap-1.5' },
	lg: { padding: 'p-5', iconBox: 'h-10 w-10', iconSize: 'size-5', gap: 'gap-2' },
};

/**
 * Pill height / horizontal padding tokens. Shared across PillRadioGroup
 * and any future toggle-bar variant so they stack cleanly.
 */
export const choicePillSizeTokens: Record<ChoiceSize, string> = {
	sm: 'h-7 px-2.5 text-xs',
	base: 'h-8 px-3 text-xs',
	lg: 'h-9 px-4 text-sm',
};

/**
 * Row padding tokens for ListRadio and any future inline list variant.
 */
export const choiceListSizeTokens: Record<ChoiceSize, string> = {
	sm: 'px-3 py-2',
	base: 'px-4 py-3',
	lg: 'px-5 py-3.5',
};
