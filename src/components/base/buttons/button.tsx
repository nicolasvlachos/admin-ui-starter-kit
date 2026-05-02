/**
 * Button — combo wrapper around BaseButton. Opts in to:
 *  - `loading` / `handlesLoading` → wraps in LoaderButton
 *  - `withTooltip` → wraps in TooltipButton
 *  - `href` → renders an `<a>` around the button
 * Mix freely; only the relevant wrappers are added.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { BaseButton, type BaseButtonProps } from './base-button';
import { LoaderButton, type LoaderButtonProps } from './loader-button';
import { TooltipButton, type TooltipButtonProps } from './tooltip-button';

export type ButtonProps = BaseButtonProps &
	Partial<LoaderButtonProps & TooltipButtonProps> & {
		href?: string;
	};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
	href,
	withTooltip,
	loading,
	handlesLoading,
	...props
}, ref) => {
	const inner = (() => {
		if (loading !== undefined || handlesLoading) {
			if (withTooltip) {
				return (
					<TooltipButton ref={ref} withTooltip={withTooltip} {...props}>
						<LoaderButton loading={loading} handlesLoading={handlesLoading} {...props} />
					</TooltipButton>
				);
			}
			return <LoaderButton ref={ref} loading={loading} handlesLoading={handlesLoading} {...props} />;
		}

		if (withTooltip) {
			return <TooltipButton ref={ref} withTooltip={withTooltip} {...props} />;
		}

		return <BaseButton ref={ref} {...props} />;
	})();

	if (href) {
		return (
			<a
				href={href}
				className={cn('inline-flex', props.fullWidth && 'w-full')}
			>
				{inner}
			</a>
		);
	}

	return inner;
});

Button.displayName = 'Button';

export { Button };
