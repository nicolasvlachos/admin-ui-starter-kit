/**
 * TextButton — link-styled button (underline, primary tint, no padding).
 *
 * Wraps `BaseButton` with `variant="primary" buttonStyle="ghost"`. Sizes map
 * 1:1 onto BaseButton's `xs | sm | default` so the `<UIProvider button>`
 * resolution chain reaches through unchanged. Pass `size` only when you
 * intentionally pin against the provider default; otherwise let
 * `useButtonConfig().defaultSize` flow through.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useButtonConfig } from '@/lib/ui-provider';
import { BaseButton } from './base-button';

type TextButtonSize = 'xs' | 'sm' | 'base';

const baseButtonSizeMap: Record<TextButtonSize, 'xs' | 'sm' | 'default'> = {
	xs: 'xs',
	sm: 'sm',
	base: 'default',
};

const providerSizeMap: Record<string, TextButtonSize> = {
	xs: 'xs',
	sm: 'sm',
	default: 'base',
	lg: 'base',
};

const sizeClasses: Record<TextButtonSize, string> = {
	xs: 'text-xs h-auto px-0',
	sm: 'text-sm h-auto px-0',
	base: 'text-base h-auto px-0',
};

export type TextButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> & {
	size?: TextButtonSize;
	children: React.ReactNode;
};

export const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
	({ className, type = 'button', size, disabled, ...props }, ref) => {
		const { defaultSize: providerDefault } = useButtonConfig();
		const resolvedSize: TextButtonSize =
			size ?? providerSizeMap[providerDefault ?? 'sm'] ?? 'xs';
		return (
			<BaseButton
				ref={ref}
				type={type}
				variant="primary"
				buttonStyle="ghost"
				size={baseButtonSizeMap[resolvedSize]}
				disabled={disabled}
				className={cn(
					'inline-flex items-center justify-center underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current',
					'text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
					'disabled:pointer-events-none disabled:opacity-50',
					sizeClasses[resolvedSize],
					className,
				)}
				{...props}
			/>
		);
	},
);

TextButton.displayName = 'TextButton';
