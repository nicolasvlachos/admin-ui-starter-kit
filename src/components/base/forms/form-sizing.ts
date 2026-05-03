import type { FormControlSize, FormLabelSize } from '@/lib/ui-provider';

// `!h-{n}` so our resolved height wins against shadcn primitives that
// bake their own `data-[size=*]:h-{n}` defaults (Select, DatePicker
// trigger via Button, etc.). Without `!`, the primitive's
// attribute-selector specificity beats our class-selector and every
// non-Input field renders 4px taller than Input.
export const formControlSizeClasses: Record<FormControlSize, string> = {
	sm: '!h-8 text-sm',
	base: '!h-9 text-base md:text-sm',
	lg: '!h-10 text-base',
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

/**
 * Canonical "input-shaped trigger" chrome — used by any control that
 * renders as a button-style trigger but visually has to read as a form
 * field (DatePicker, TimePicker, the inner Select inside composite
 * fields, etc.). Mirrors `Input`'s `border-input rounded-md
 * bg-transparent focus-visible:ring` chrome (no shadow — the library
 * is intentionally flat) plus the size-driven height + horizontal
 * padding.
 *
 * Kept here so the chrome lives in exactly one place — when we tweak
 * the canonical input look, every trigger picks it up.
 */
export function formFieldTriggerClasses(size: FormControlSize): string {
	return [
		'flex w-full items-center justify-between gap-2',
		'rounded-md border border-input bg-transparent text-left font-normal',
		'shadow-none transition-[color,box-shadow] outline-none',
		formControlSizeClasses[size],
		'px-3',
		'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
		'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
		'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
		'hover:bg-transparent',
	].join(' ');
}

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
