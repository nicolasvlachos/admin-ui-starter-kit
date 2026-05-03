import type { FormControlSize, FormLabelSize } from '@/lib/ui-provider';

export const formControlSizeClasses: Record<FormControlSize, string> = {
	sm: 'h-8 text-sm',
	base: 'h-9 text-base md:text-sm',
	lg: 'h-10 text-base',
};

/**
 * Min-heights matching `formControlSizeClasses` so multi-line trigger
 * variants (e.g. `RichSelect` showing wrapped descriptions) can keep the
 * size's vertical rhythm without locking to a fixed `h-{n}`.
 */
export const formControlMinHeightClasses: Record<FormControlSize, string> = {
	sm: 'min-h-8',
	base: 'min-h-9',
	lg: 'min-h-10',
};

export const formTextareaSizeClasses: Record<FormControlSize, string> = {
	sm: 'min-h-14 text-sm',
	base: 'min-h-[60px] text-base md:text-sm',
	lg: 'min-h-20 text-base',
};

export const formLabelSizeClasses: Record<FormLabelSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	base: 'text-base',
};

export function resolveFormControlSize(
	sizeProp: FormControlSize | undefined,
	defaultControlSize: FormControlSize | undefined,
): FormControlSize {
	return sizeProp ?? defaultControlSize ?? 'sm';
}

export function resolveFormLabelSize(
	sizeProp: FormLabelSize | undefined,
	defaultLabelSize: FormLabelSize | undefined,
): FormLabelSize {
	return sizeProp ?? defaultLabelSize ?? 'sm';
}
