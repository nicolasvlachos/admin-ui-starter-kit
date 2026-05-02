/**
 * Label — design-system label primitive for form fields and discrete UI captions.
 * Carries `data-typography="label"` so the global `--label-font-scale` knob
 * scales every label without per-instance overrides. Pair with form fields and
 * any `peer` input pattern; the built-in disabled styles propagate from sibling.
 */
import type { LabelHTMLAttributes, ReactNode } from 'react';

import { useFormsConfig, type FormLabelSize } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';

const labelSizeClasses: Record<FormLabelSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	base: 'text-base',
};

function resolveLabelSize(
	sizeProp: FormLabelSize | undefined,
	defaultLabelSize: FormLabelSize | undefined,
): FormLabelSize {
	return sizeProp ?? defaultLabelSize ?? 'sm';
}

type LabelProps = {
	content?: ReactNode;
	className?: string;
	size?: FormLabelSize;
} & LabelHTMLAttributes<HTMLLabelElement>;

function Label({ content, className = '', children, size: sizeProp, ...props }: LabelProps) {
	const { defaultLabelSize } = useFormsConfig();
	const size = resolveLabelSize(sizeProp, defaultLabelSize);

	return (
		<label
			{...props}
			data-typography="label"
			className={cn(
				'font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
				labelSizeClasses[size],
				className,
			)}
		>
			{children || content}
		</label>
	);
}

Label.displayName = 'Label';

export default Label;
