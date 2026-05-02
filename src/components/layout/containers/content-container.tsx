/**
 * Container — page-level content wrapper.
 *
 * Wraps the page body in a flexbox column with consistent padding and an
 * optional max-width clamp. Use as the outer wrapper inside a `<Page>`, or
 * standalone for content panes that need a centered, padded surface.
 *
 * `bare` skips the padded inner column for edge-to-edge children, while
 * `innerClassName` customizes the clamped column without affecting the outer
 * scroll/container-query wrapper.
 */
import { cn } from '@/lib/utils';

import type { ContainerProps } from './containers.types';

const WIDTH_CLASS: Record<NonNullable<ContainerProps['width']>, string> = {
	narrow: 'max-w-7xl mx-auto',
	default: '',
	wide: 'max-w-screen-2xl mx-auto',
	full: '',
};

const PADDING_CLASS: Record<NonNullable<ContainerProps['padding']>, string> = {
	none: 'p-0',
	sm: 'p-4 md:p-5',
	default: 'p-5 md:p-7',
	lg: 'p-6 md:p-8',
};

export function Container({
	children,
	as: Component = 'div',
	width = 'default',
	padding = 'default',
	bare = false,
	className,
	innerClassName,
	...props
}: ContainerProps) {
	const widthClass = WIDTH_CLASS[width];
	const paddingClass = PADDING_CLASS[padding];

	if (bare) {
		return (
			<Component
				className={cn(
					'w-full flex-1 relative overflow-hidden @container/main h-full',
					widthClass,
					className,
				)}
				{...props}
			>
				{children}
			</Component>
		);
	}

	return (
		<Component
			className={cn(
				'w-full flex-1 relative overflow-hidden @container/main h-full',
				className,
			)}
			{...props}
		>
			<div
				className={cn(
					'flex min-h-full flex-1 flex-col gap-6 rounded-xl',
					widthClass,
					paddingClass,
					innerClassName,
				)}
			>
				{children}
			</div>
		</Component>
	);
}
