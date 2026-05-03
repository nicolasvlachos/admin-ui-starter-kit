/**
 * PlaceholderPattern — diagonal-stripe SVG fill suitable as a skeleton or
 * empty-region indicator. Uses a unique pattern id per instance so multiple
 * copies on the same page don't collide.
 */
import { useId } from 'react';

import { cn } from '@/lib/utils';
export interface PlaceholderPatternProps {
	className?: string;
}

export function PlaceholderPattern({ className }: PlaceholderPatternProps) {
	const patternId = useId();

	return (
		<svg
			className={cn('placeholder-pattern--component', className)}
			fill="none"
			stroke="currentColor"
			aria-hidden="true"
		>
			<defs>
				<pattern
					id={patternId}
					x="0"
					y="0"
					width="10"
					height="10"
					patternUnits="userSpaceOnUse"
				>
					<path
						d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"
						stroke="currentColor"
						strokeWidth="0.75"
						strokeLinecap="square"
						vectorEffect="non-scaling-stroke"
					/>
				</pattern>
			</defs>
			<rect
				stroke="none"
				fill={`url(#${patternId})`}
				width="100%"
				height="100%"
			/>
		</svg>
	);
}

PlaceholderPattern.displayName = 'PlaceholderPattern';

