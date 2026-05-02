/**
 * TextLink — anchor variant of Text. Mirrors Text's `size`, `type`, `weight`,
 * `align`, and `lineHeight` props for consistency, with an optional `underline`
 * (default true). Carries `data-typography="link"` so the global
 * `--link-font-scale` knob applies cleanly.
 */
import type { AnchorHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const sizes = {
	inherit: 'text-inherit',
	sm: 'text-sm',
	xs: 'text-xs',
	base: 'text-base',
	lg: 'text-lg',
	xl: 'text-xl',
};

const types = {
	main: 'text-foreground',
	inverse: 'text-background',
	secondary: 'text-muted-foreground',
	discrete: 'text-muted-foreground/50',
	error: 'text-destructive',
	success: 'text-success',
	primary: 'text-primary',
};

const lineHeights = {
	normal: 'leading-normal',
	relaxed: 'leading-relaxed',
	loose: 'leading-loose',
	tight: 'leading-tight',
	snug: 'leading-snug',
	none: 'leading-none',
};

const weights = {
	regular: 'font-normal',
	medium: 'font-medium',
	semibold: 'font-semibold',
	bold: 'font-bold',
};

const alignment = { center: 'text-center', right: 'text-right', left: 'text-left' };

export interface TextLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> {
	type?: keyof typeof types;
	size?: keyof typeof sizes;
	align?: keyof typeof alignment;
	lineHeight?: keyof typeof lineHeights;
	weight?: keyof typeof weights;
	className?: string;
	underline?: boolean;
}

function TextLink({
	type = 'main',
	size = 'sm',
	align = 'left',
	lineHeight = 'normal',
	weight = 'regular',
	className = '',
	underline = true,
	children,
	...linkProps
}: TextLinkProps) {
	const textClassnames = cn(
		types[type],
		sizes[size],
		alignment[align],
		lineHeights[lineHeight],
		weights[weight],
		underline &&
			'underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500',
		className,
	);

	return (
		<a className={textClassnames} data-typography="link" {...linkProps}>
			{children}
		</a>
	);
}

TextLink.displayName = 'TextLink';

export default TextLink;
