import type { ParamHTMLAttributes } from 'react';

import { sanitizeHtml } from '@/lib/sanitize-html';
import { cn } from '@/lib/utils';

export type Variants = 'primary' | 'success' | 'warning' | 'error';

export interface IVariant {
	variant?: Variants;
	content: string;
}

const highlightTypes = {
	primary: 'bg-primary text-primary-foreground',
	success: 'bg-success text-success-foreground',
	error: 'bg-destructive text-destructive-foreground',
	warning: 'bg-warning text-warning-foreground',
};

const underlineTypes = {
	primary: 'decoration-primary',
	success: 'decoration-success',
	error: 'decoration-destructive',
	warning: 'decoration-warning',
};

export function HighLight({ content, variant = 'primary' }: IVariant) {
	const highlightClassNames = cn('px-1.5 py-0.5 rounded-sm', highlightTypes[variant]);
	return <span className={highlightClassNames}>{content}</span>;
};

export function Underline({ content, variant = 'primary' }: IVariant) {
	const underlineClassNames = cn(
		'underline underline-offset-4 decoration-2',
		underlineTypes[variant],
	);
	return <span className={underlineClassNames}>{content}</span>;
};

export function DangerousHTML({ children, ...props }: ParamHTMLAttributes<HTMLParagraphElement>) {
	const sanitized = sanitizeHtml(typeof children === 'string' ? children : '');
	return (
		<p
			className="__html_content"
			dangerouslySetInnerHTML={{ __html: sanitized }}
			{...props}
		/>
	);
}
