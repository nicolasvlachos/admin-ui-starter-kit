/**
 * Section — vertical-spaced wrapper for grouping content blocks inside a page.
 *
 * Use between cards or content groups when you want a consistent vertical
 * rhythm without nesting another `Container`. Three densities scale the
 * top/bottom spacing.
 */
import { cn } from '@/lib/utils';

import type { SectionProps } from './containers.types';

const DENSITY_CLASS: Record<NonNullable<SectionProps['density']>, string> = {
	tight: 'space-y-3',
	default: 'space-y-5',
	loose: 'space-y-8',
};

export function Section({
	children,
	as: Component = 'section',
	density = 'default',
	className,
	...props
}: SectionProps) {
	return (
		<Component className={cn(DENSITY_CLASS[density], className)} {...props}>
			{children}
		</Component>
	);
}
