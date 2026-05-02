import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useStrings, type StringsProp } from '@/lib/strings';
import { BaseButton, type BaseButtonProps, type ButtonSize } from './base-button';

export interface LoaderButtonStrings {
	loading: string;
	completed: string;
}

export const defaultLoaderButtonStrings: LoaderButtonStrings = {
	loading: 'Loading...',
	completed: 'Completed',
};

/** @deprecated Use `strings` instead. */
export interface LoadingLabels {
	loading?: string;
	completed?: string;
}

export interface LoaderButtonProps extends BaseButtonProps {
	loading?: boolean;
	handlesLoading?: boolean;
	strings?: StringsProp<LoaderButtonStrings>;
	/** @deprecated Use `strings` instead. */
	loadingLabels?: LoadingLabels;
}

const LoaderButton = React.forwardRef<HTMLButtonElement, LoaderButtonProps>(
	(
		{
			loading = false,
			handlesLoading,
			strings: stringsProp,
			loadingLabels,
			icon: Icon,
			iconPosition = 'left',
			children,
			disabled,
			...props
		},
		ref,
	) => {
		const strings = useStrings(defaultLoaderButtonStrings, {
			...(loadingLabels ?? {}),
			...(stringsProp ?? {}),
		});
		const [isLoading, setIsLoading] = useState(loading);
		const [, setShowCompletedState] = useState(false);

		useEffect(() => {
			if (loading) {
				setIsLoading(true);
			}
		}, [loading]);

		useEffect(() => {
			if (handlesLoading && loading) {
				setIsLoading(true);
			}
		}, [loading, handlesLoading]);

		useEffect(() => {
			let timeoutId: ReturnType<typeof setTimeout>;
			if (!loading && isLoading) {
				setShowCompletedState(true);
				timeoutId = setTimeout(() => {
					setIsLoading(false);
					setShowCompletedState(false);
				}, 300);
			}
			return () => {
				if (timeoutId) clearTimeout(timeoutId);
			};
		}, [loading, isLoading]);

		const getIconSize = (size?: ButtonSize) => {
			if (size === 'xs') return 12;
			if (size === 'sm') return 14;
			if (size === 'lg') return 20;
			return 16;
		};

		return (
			<BaseButton
				{...props}
				ref={ref}
				disabled={disabled || isLoading}
			>
				{!!isLoading && (
     <Loader2
						className="animate-spin mr-2"
						size={getIconSize(props.size)}
						aria-hidden="true"
					/>
   )}
				{!!Icon && iconPosition === 'left' && !isLoading && (
     <Icon
						className={cn('opacity-60', children && '-ms-1 me-2')}
						size={getIconSize(props.size)}
						aria-hidden="true"
					/>
   )}
				<span>
					{!!isLoading && strings.loading}
					{!isLoading && children}
				</span>
				{!!Icon && iconPosition === 'right' && !isLoading && (
     <Icon
						className={cn('opacity-60', children && '-me-1 ms-2')}
						size={getIconSize(props.size)}
						aria-hidden="true"
					/>
   )}
			</BaseButton>
		);
	},
);

LoaderButton.displayName = 'LoaderButton';

export { LoaderButton };
