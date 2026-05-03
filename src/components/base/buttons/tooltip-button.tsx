import * as React from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/base/display/tooltip';
import { cn } from '@/lib/utils';
import { BaseButton, type BaseButtonProps } from './base-button';

export interface TooltipButtonProps extends BaseButtonProps {
	withTooltip: string;
}

const TooltipButton = React.forwardRef<HTMLButtonElement, TooltipButtonProps>(
	({ withTooltip, ...props }, ref) => {
		return (
			<Tooltip>
				<TooltipTrigger
					render={(triggerProps) => (
						<BaseButton
							{...props}
							{...triggerProps}
							ref={ref}
							// `render` merges props, but className needs manual merge.

							className={cn('tooltip-button--component', (triggerProps as { className?: string }).className, props.className)}
						/>
					)}
				/>
				<TooltipContent className="px-2 py-1 text-xs">
					{withTooltip}
				</TooltipContent>
			</Tooltip>
		);
	},
);

TooltipButton.displayName = 'TooltipButton';

export { TooltipButton };
