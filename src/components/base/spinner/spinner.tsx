/**
 * Spinner — three-variant loading indicator with optional label.
 *
 * Variants:
 *  - `default` — circular SVG spin (the legacy shape)
 *  - `shimmer` — round shimmer bar
 *  - `progress` — slim animated progress strip
 *
 * `variant` resolves via `useSpinnerConfig().defaultVariant ?? 'default'`,
 * so a consumer can set the library-wide spinner style at the
 * `<UIProvider>` root and override per-mount as needed. Forwards a ref to
 * the outer wrapper so consumers can position/measure the spinner.
 */
import { forwardRef, type CSSProperties } from 'react';

import { Text } from '@/components/typography';
import { useSpinnerConfig } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';

export type SpinnerVariant = 'default' | 'shimmer' | 'progress';

export interface SpinnerProps {
	label?: string;
	className?: string;
	variant?: SpinnerVariant;
	style?: CSSProperties;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(function Spinner(
	{ label, className = '', variant: variantProp, style },
	ref,
) {
	const { defaultVariant } = useSpinnerConfig();
	const variant: SpinnerVariant = variantProp ?? defaultVariant ?? 'default';

	return (
		<div ref={ref} className="flex items-center justify-center p-8" style={style}>
			<div className="flex flex-col items-center justify-center gap-2 text-center">
				{variant === 'default' && <SpinnerDefault className={className} />}
				{variant === 'shimmer' && <SpinnerShimmer className={className} />}
				{variant === 'progress' && <SpinnerProgress className={className} />}
				{!!label && <Text type="secondary">{label}</Text>}
			</div>
		</div>
	);
});

Spinner.displayName = 'Spinner';

function SpinnerDefault({ className = '' }: { className?: string }) {
	return (
		<svg
			className={cn('h-10 w-10 text-primary', className)}
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<path
				d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
				opacity=".25"
			/>
			<path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
				<animateTransform
					attributeName="transform"
					type="rotate"
					dur="0.75s"
					values="0 12 12;360 12 12"
					repeatCount="indefinite"
				/>
			</path>
		</svg>
	);
}

function SpinnerShimmer({ className = '' }: { className?: string }) {
	return (
		<div
			className={cn(
				'h-10 w-10 rounded-full bg-gradient-to-r from-muted via-muted-foreground/30 to-muted bg-[length:200%_100%]',
				'animate-[shimmer_1.5s_ease-in-out_infinite]',
				className,
			)}
			aria-hidden="true"
		/>
	);
}

function SpinnerProgress({ className = '' }: { className?: string }) {
	return (
		<div
			className={cn('h-1 w-32 overflow-hidden rounded bg-muted', className)}
			role="progressbar"
			aria-busy="true"
		>
			<div className="h-full w-1/3 animate-[progress-slide_1.4s_ease-in-out_infinite] rounded bg-primary" />
		</div>
	);
}
