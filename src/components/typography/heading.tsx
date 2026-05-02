/**
 * Heading — semantic h1–h6 with consistent sizing, optional `subHeading` (rendered as
 * a Text below), alignment, and CSS-var driven `--heading-font-scale` for global scaling.
 */
import type { HTMLAttributes, ReactNode } from 'react';

import { type TextSize } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';

import Text from './text';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const headingVariants: Record<HeadingTag, string> = {
	h1: 'scroll-m-20 text-2xl font-semibold text-balance',
	h2: 'scroll-m-20 border-b pb-2 text-xl font-semibold first:mt-0',
	h3: 'scroll-m-20 text-lg font-semibold',
	h4: 'scroll-m-20 text-base font-semibold',
	h5: 'text-sm font-semibold',
	h6: 'text-xs font-semibold',
};

const alignmentClasses = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
} as const;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
	tag?: HeadingTag;
	subHeading?: ReactNode;
	subHeadingClassName?: string;
	subHeadingSize?: TextSize;
	containerClassName?: string;
	align?: 'left' | 'center' | 'right';
}

function Heading({
	tag: Tag = 'h3',
	className,
	children,
	subHeading,
	subHeadingClassName,
	subHeadingSize,
	containerClassName,
	align = 'left',
	...headingProps
}: HeadingProps) {
	const headingClasses = cn(
		'text-foreground antialiased',
		headingVariants[Tag],
		alignmentClasses[align],
		className,
	);

	const wrapperClasses = cn(
		'space-y-1',
		alignmentClasses[align],
		containerClassName,
	);

	return (
		<div className={wrapperClasses}>
			{!!children && (
				<Tag className={headingClasses} data-typography="heading" {...headingProps}>
					{children}
				</Tag>
			)}

			{!!subHeading && (
				<Text
					size={subHeadingSize ?? 'xs'}
					type="secondary"
					align={align}
					className={subHeadingClassName}
				>
					{subHeading}
				</Text>
			)}
		</div>
	);
}

Heading.displayName = 'Heading';

export default Heading;
