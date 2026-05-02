/**
 * Text — design-system text primitive. Use `size` (xxs–xl), `type` (main / inverse /
 * secondary / discrete / error / success / primary), `weight`, `align`, `lineHeight`, `tag`
 * (p / div / span). Supports `content` and `asHTML` (sanitised). Carries `data-typography="text"`
 * so the global `--base-font-scale` knob applies cleanly.
 */
import { createElement, useMemo } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { useTypographyConfig, type TextSize } from '@/lib/ui-provider';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { cn } from '@/lib/utils';

const sizes = {
    inherit: '[font-size:inherit]',
    xxs: 'text-xxs',
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

export interface TextProps extends Omit<ComponentPropsWithoutRef<'p'>, 'children'> {
	content?: string;
	type?: keyof typeof types;
	size?: TextSize;
	align?: keyof typeof alignment;
	lineHeight?: keyof typeof lineHeights;
	invert?: boolean;
	weight?: keyof typeof weights;
	children?: ReactNode;
	tag?: 'div' | 'p' | 'span';
	asHTML?: boolean;
}

export function Text({
	content,
	type = 'main',
	size: sizeProp,
	align = 'left',
	lineHeight = 'normal',
	weight = 'regular',
	className = '',
	children,
	asHTML = false,
	tag: Tag = 'p',
	...props
}: TextProps) {
	const { defaultTextSize } = useTypographyConfig();
	const size = sizeProp ?? defaultTextSize ?? 'sm';
	const textClassnames = cn(
		types[type],
		sizes[size],
		alignment[align],
		lineHeights[lineHeight],
		weights[weight],
		className,
	);

	const htmlSource = useMemo(() => {
		if (typeof content === 'string' && content.length > 0) {
			return content;
		}

		if (typeof children === 'string' || typeof children === 'number') {
			return String(children);
		}

		return '';
	}, [children, content]);

	if (asHTML) {
		const sanitized = sanitizeHtml(htmlSource);
		return createElement(Tag, {
			className: textClassnames,
			'data-typography': 'text',
			dangerouslySetInnerHTML: { __html: sanitized },
			...props,
		});
	}

	if (content && content.length > 0) {
		return (
			<Tag className={textClassnames} data-typography="text" {...props}>
				{content}
			</Tag>
		);
	}

	if (children !== undefined && children !== null) {
		return (
			<Tag className={textClassnames} data-typography="text" {...props}>
				{children}
			</Tag>
		);
	}

	return null;
}

Text.displayName = 'Text';

export default Text;
