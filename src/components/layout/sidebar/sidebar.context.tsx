 
/** SidebarProvider — layout-scoped wrapper around the shadcn sidebar context. */
import * as React from 'react';

import { TooltipProvider } from '@/components/base/display/tooltip';
import {
	SidebarProvider as PrimitiveSidebarProvider,
	useSidebar as primitiveUseSidebar,
} from '@/components/base/sidebar';
import { cn } from '@/lib/utils';

export const useSidebar = primitiveUseSidebar;
export type SidebarContext = ReturnType<typeof primitiveUseSidebar>;

export type SidebarProviderProps = React.ComponentProps<'div'> & {
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

export function SidebarProvider({
	defaultOpen = true,
	open,
	onOpenChange,
	className,
	style,
	children,
	...props
}: SidebarProviderProps) {
	return (
		<TooltipProvider delayDuration={0}>
			<PrimitiveSidebarProvider
				defaultOpen={defaultOpen}
				open={open}
				onOpenChange={onOpenChange}
				style={style}
				className={cn('min-h-svh', className)}
				{...props}
			>
				{children}
			</PrimitiveSidebarProvider>
		</TooltipProvider>
	);
}
