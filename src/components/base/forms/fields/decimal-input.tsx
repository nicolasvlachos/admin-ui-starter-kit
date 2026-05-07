/**
 * DecimalInput — text-based numeric input with decimal-place enforcement,
 * locale-friendly comma → dot normalisation, optional min/max clamping,
 * rounding mode (`round` / `floor` / `ceil` / `half-even`), and optional
 * stepper buttons when `step` is set.
 *
 * Wraps the base `Input` so all add-on / icon / clear / loading features
 * still work. Extra features layered on top:
 *
 *  - `step` — when set, renders − / + stepper buttons that snap the value
 *    to a multiple of `step` (anchored at `min` if provided, else 0).
 *  - `roundingMode` — controls how stepper / blur normalisation rounds
 *    half values; default `'round'` (round-half-up).
 *  - `normalizeOnBlur` (default `true`) — pads the displayed value to the
 *    full `decimalPlaces` count and clamps to `[min, max]` when the field
 *    loses focus.
 *
 * The `value` prop is always a plain string (consumers parse it as needed)
 * so RHF / Inertia can treat it like any other input.
 */
import * as React from 'react';
import { useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useStrings, type StringsProp } from '@/lib/strings';
import { useFormsConfig, type FormControlSize } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';
import { resolveFormControlSize } from '../form-sizing';
import { Input, type InputProps } from './input';

export type DecimalRoundingMode = 'round' | 'floor' | 'ceil' | 'half-even';

export interface DecimalInputStrings {
	decrement: string;
	increment: string;
}

export const defaultDecimalInputStrings: DecimalInputStrings = {
	decrement: 'Decrement',
	increment: 'Increment',
};

export interface DecimalInputProps extends Omit<InputProps, 'type' | 'inputMode' | 'strings'> {
	decimalPlaces?: number;
	min?: number;
	max?: number;
	allowNegative?: boolean;
	allowEmpty?: boolean;
	/** When set, renders − / + steppers and snaps the value to multiples of `step`. */
	step?: number;
	/** How to round when normalising on blur or stepping. Default `'round'`. */
	roundingMode?: DecimalRoundingMode;
	/** Pad to full decimalPlaces and clamp to [min, max] on blur. Default `true`. */
	normalizeOnBlur?: boolean;
	/** String overrides for stepper aria-labels. */
	strings?: StringsProp<DecimalInputStrings>;
}

const formatDecimalValue = (
	value: string,
	decimalPlaces: number,
	allowNegative: boolean,
): string => {
	if (!value) return '';

	let formatted = value;
	formatted = formatted.replace(/,/g, '.');

	if (allowNegative) {
		formatted = formatted.replace(/[^\d.-]/g, '');
	} else {
		formatted = formatted.replace(/[^\d.]/g, '');
	}

	if (allowNegative && formatted.includes('-')) {
		const hasLeadingMinus = formatted.startsWith('-');
		formatted = formatted.replace(/-/g, '');
		if (hasLeadingMinus) formatted = '-' + formatted;
	}

	const parts = formatted.split('.');
	if (parts.length > 2) {
		formatted = parts[0] + '.' + parts.slice(1).join('');
	}

	if (parts.length === 2 && parts[1].length > decimalPlaces) {
		formatted = parts[0] + '.' + parts[1].substring(0, decimalPlaces);
	}

	return formatted;
};

const isWithinBounds = (value: string, min?: number, max?: number): boolean => {
	if (!value || value === '-') return true;
	const numValue = parseFloat(value);
	if (Number.isNaN(numValue)) return true;
	if (min !== undefined && numValue < min) return false;
	if (max !== undefined && numValue > max) return false;
	return true;
};

function applyRounding(value: number, decimals: number, mode: DecimalRoundingMode): number {
	const factor = Math.pow(10, decimals);
	const shifted = value * factor;
	switch (mode) {
		case 'floor':
			return Math.floor(shifted) / factor;
		case 'ceil':
			return Math.ceil(shifted) / factor;
		case 'half-even': {
			const floor = Math.floor(shifted);
			const diff = shifted - floor;
			if (diff > 0.5) return (floor + 1) / factor;
			if (diff < 0.5) return floor / factor;
			return (floor % 2 === 0 ? floor : floor + 1) / factor;
		}
		case 'round':
		default:
			return Math.round(shifted) / factor;
	}
}

function clamp(n: number, min?: number, max?: number): number {
	let next = n;
	if (min !== undefined) next = Math.max(min, next);
	if (max !== undefined) next = Math.min(max, next);
	return next;
}

function snapToStep(
	current: number,
	delta: number,
	step: number,
	min?: number,
	mode: DecimalRoundingMode = 'round',
): number {
	const anchor = min ?? 0;
	const stepsFromAnchor = (current - anchor) / step;
	const rounded =
		mode === 'floor'
			? Math.floor(stepsFromAnchor)
			: mode === 'ceil'
				? Math.ceil(stepsFromAnchor)
				: Math.round(stepsFromAnchor);
	const stepped = anchor + (rounded + delta) * step;
	return Number(stepped.toFixed(12));
}

function fireChange(
	target: HTMLInputElement,
	value: string,
	onChange?: InputProps['onChange'],
) {
	if (!onChange) return;
	const event = {
		target: { ...target, value } as unknown as HTMLInputElement,
		currentTarget: { ...target, value } as unknown as HTMLInputElement,
		type: 'change',
		bubbles: false,
		cancelable: false,
	} as unknown as React.ChangeEvent<HTMLInputElement>;
	onChange(event);
}

const STEPPER_SIZE_CLASS: Record<FormControlSize, string> = {
	sm: 'w-8',
	base: 'w-9',
	lg: 'w-10',
};

function DecimalInputImpl(
	{
		decimalPlaces = 2,
		min,
		max,
		allowNegative = true,
		allowEmpty = true,
		step,
		roundingMode = 'round',
		normalizeOnBlur = true,
		onChange,
		onBlur,
		placeholder,
		className,
		value: controlledValue,
		defaultValue,
		disabled,
		size: sizeProp,
		strings: stringsProp,
		...props
	}: DecimalInputProps,
	forwardedRef: React.ForwardedRef<HTMLInputElement>,
) {
	const { defaultControlSize } = useFormsConfig();
	const size: FormControlSize = resolveFormControlSize(sizeProp, defaultControlSize);
	const strings = useStrings(defaultDecimalInputStrings, stringsProp);
	const validDecimalPlaces = Math.min(12, Math.max(0, decimalPlaces));
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;

			if (!newValue && allowEmpty) {
				onChange?.(e);
				return;
			}

			const formatted = formatDecimalValue(newValue, validDecimalPlaces, allowNegative);
			if (!isWithinBounds(formatted, min, max)) return;

			if (formatted !== newValue) {
				const modifiedEvent = {
					...e,
					target: { ...e.target, value: formatted },
					currentTarget: { ...e.currentTarget, value: formatted },
				} as React.ChangeEvent<HTMLInputElement>;
				onChange?.(modifiedEvent);
			} else {
				onChange?.(e);
			}
		},
		[onChange, validDecimalPlaces, allowNegative, allowEmpty, min, max],
	);

	const handleBlur = useCallback(
		(e: React.FocusEvent<HTMLInputElement>) => {
			onBlur?.(e);
			if (!normalizeOnBlur) return;
			const raw = e.target.value;
			if (!raw && allowEmpty) return;
			const num = Number.parseFloat(raw.replace(',', '.'));
			if (!Number.isFinite(num)) return;
			const clamped = clamp(num, min, max);
			const rounded = applyRounding(clamped, validDecimalPlaces, roundingMode);
			const next = rounded.toFixed(validDecimalPlaces);
			if (next !== raw && inputRef.current) {
				fireChange(inputRef.current, next, onChange);
			}
		},
		[onBlur, onChange, normalizeOnBlur, allowEmpty, min, max, validDecimalPlaces, roundingMode],
	);

	const adjust = useCallback(
		(delta: number) => {
			if (disabled || step === undefined) return;
			const target = inputRef.current;
			if (!target) return;
			const raw = target.value;
			const current = Number.parseFloat(raw.replace(',', '.'));
			const base = Number.isFinite(current) ? current : (min ?? 0);
			const snapped = clamp(snapToStep(base, delta, step, min, roundingMode), min, max);
			const next = applyRounding(snapped, validDecimalPlaces, roundingMode).toFixed(validDecimalPlaces);
			fireChange(target, next, onChange);
		},
		[disabled, step, min, max, roundingMode, validDecimalPlaces, onChange],
	);

	const showSteppers = typeof step === 'number' && step > 0;
	const placeholderResolved =
		placeholder ?? (validDecimalPlaces > 0 ? `0.${'0'.repeat(validDecimalPlaces)}` : '0');

	if (showSteppers) {
		return (
			<div
				className={cn('decimal-input--component', 
					// Stepper segmented group — input + adjacent − / + buttons
					// share a single border radius so the group reads as one
					// control instead of three loose chips.
					'flex items-stretch overflow-hidden rounded-md border border-input bg-transparent',
					'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
					props['aria-invalid'] && 'border-destructive ring-destructive/20',
					disabled && 'opacity-50 cursor-not-allowed',
				)}
			>
				<button
					type="button"
					tabIndex={-1}
					aria-label={strings.decrement}
					disabled={disabled}
					onClick={() => adjust(-1)}
					className={cn(
						'inline-flex shrink-0 items-center justify-center border-r border-input text-muted-foreground transition-colors',
						STEPPER_SIZE_CLASS[size],
						'hover:bg-muted hover:text-foreground',
						'disabled:cursor-not-allowed disabled:opacity-50',
					)}
				>
					<Minus className="size-3.5" />
				</button>
				<Input
					size={size}
					ref={(node) => { inputRef.current = node; if (typeof forwardedRef === "function") forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; }}
					type="text"
					inputMode={validDecimalPlaces > 0 ? 'decimal' : 'numeric'}
					placeholder={placeholderResolved}
					onChange={handleChange}
					onBlur={handleBlur}
					value={controlledValue}
					defaultValue={defaultValue}
					disabled={disabled}
					className={cn(
						'flex-1 tabular-nums text-center border-0 shadow-none rounded-none focus-visible:ring-0 focus-visible:border-0',
						className,
					)}
					{...props}
				/>
				<button
					type="button"
					tabIndex={-1}
					aria-label={strings.increment}
					disabled={disabled}
					onClick={() => adjust(1)}
					className={cn(
						'inline-flex shrink-0 items-center justify-center border-l border-input text-muted-foreground transition-colors',
						STEPPER_SIZE_CLASS[size],
						'hover:bg-muted hover:text-foreground',
						'disabled:cursor-not-allowed disabled:opacity-50',
					)}
				>
					<Plus className="size-3.5" />
				</button>
			</div>
		);
	}

	return (
		<Input
			size={size}
			ref={(node) => { inputRef.current = node; if (typeof forwardedRef === "function") forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; }}
			type="text"
			inputMode={validDecimalPlaces > 0 ? 'decimal' : 'numeric'}
			placeholder={placeholderResolved}
			onChange={handleChange}
			onBlur={handleBlur}
			value={controlledValue}
			defaultValue={defaultValue}
			disabled={disabled}
			className={cn('tabular-nums text-end', className)}
			{...props}
		/>
	);
}

const DecimalInput = React.forwardRef<HTMLInputElement, DecimalInputProps>(DecimalInputImpl);
DecimalInput.displayName = 'DecimalInput';

export { DecimalInput };
