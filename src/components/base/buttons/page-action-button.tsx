import * as React from 'react';
import { cn } from '@/lib/utils';
import { BaseButton, type ButtonStyle, type ButtonVariant } from './base-button';

export type PageActionButtonVariant =
	| 'primary'
	| 'secondary'
	| 'error';

type PageActionButtonSize = 'xs' | 'sm' | 'base';
const baseButtonSizeMap: Record<PageActionButtonSize, 'xs' | 'sm' | 'default'> = {
	xs: 'xs',
	sm: 'sm',
	base: 'default',
};

export type PageActionButtonProps = Omit<
	React.ComponentPropsWithoutRef<typeof BaseButton>,
	'variant' | 'buttonStyle' | 'size'
> & {
	variant?: PageActionButtonVariant;
	size?: PageActionButtonSize;
};

const sizeClasses: Record<PageActionButtonSize, string> = {
	xs: 'h-7 px-2.5 text-xs',
	sm: 'h-8 px-3 text-xs',
	base: 'h-9 px-3.5 text-sm',
};

export const PageActionButton = React.forwardRef<
	HTMLButtonElement,
	PageActionButtonProps
>(({ variant = 'secondary', size, className, ...props }, ref) => {
	const resolvedVariant: ButtonVariant = variant === 'error' ? 'error' : variant;
	const resolvedStyle: ButtonStyle = 'solid';
	const resolvedSize: PageActionButtonSize = size ?? 'sm';

	return (
		<BaseButton
			ref={ref}
			variant={resolvedVariant}
			buttonStyle={resolvedStyle}
			size={baseButtonSizeMap[resolvedSize]}
			className={cn('page-action-button--component', sizeClasses[resolvedSize], 'shadow-none', className)}
			{...props}
		/>
	);
});

PageActionButton.displayName = 'PageActionButton';
