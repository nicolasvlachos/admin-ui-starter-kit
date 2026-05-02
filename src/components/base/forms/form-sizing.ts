import type { FormControlSize, FormLabelSize } from '@/lib/ui-provider';

export const formControlSizeClasses: Record<FormControlSize, string> = {
	sm: 'h-8 text-sm',
	base: 'h-9 text-base md:text-sm',
	lg: 'h-10 text-base',
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
