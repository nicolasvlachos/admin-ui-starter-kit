 
/** Sidebar — responsive shell around the shadcn sidebar primitive pieces. */
import * as React from 'react';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/base/sheet';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { useSidebar } from './sidebar.context';
import { SIDEBAR_WIDTH_MOBILE } from './sidebar.settings';

export interface SidebarStrings {
	mobileTitle: string;
	mobileDescription: string;
}

export const defaultSidebarStrings: SidebarStrings = {
	mobileTitle: 'Sidebar',
	mobileDescription: 'Displays the mobile sidebar.',
};

export type SidebarProps = React.ComponentProps<'div'> & {
	side?: 'left' | 'right';
	variant?: 'sidebar' | 'floating' | 'inset';
	collapsible?: 'offcanvas' | 'icon' | 'none';
	strings?: Partial<SidebarStrings>;
	surfaceClassName?: string;
};

export function Sidebar({
	side = 'left',
	variant = 'sidebar',
	collapsible = 'offcanvas',
	className,
	surfaceClassName,
	children,
	strings: stringsProp,
	...props
}: SidebarProps) {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
	const strings = useStrings(defaultSidebarStrings, stringsProp);

	if (collapsible === 'none') {
		return (
			<div
				data-slot="sidebar"
				className={cn('flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground', surfaceClassName, className)}
				{...props}
			>
				{children}
			</div>
		);
	}

	if (isMobile) {
		return (
			<Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
				<SheetContent
					data-sidebar="sidebar"
					data-slot="sidebar"
					data-mobile="true"
					className={cn('w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden', surfaceClassName)}
					style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
					side={side}
				>
					<SheetHeader className="sr-only">
						<SheetTitle>{strings.mobileTitle}</SheetTitle>
						<SheetDescription>{strings.mobileDescription}</SheetDescription>
					</SheetHeader>
					<div className="flex h-full w-full flex-col">{children}</div>
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<div
			className="group peer sticky top-0 hidden h-full border-r border-solid border-border text-sidebar-foreground md:block"
			data-state={state}
			data-collapsible={state === 'collapsed' ? collapsible : ''}
			data-variant={variant}
			data-side={side}
			data-slot="sidebar"
		>
			<div
				className={cn(
					'inset-y-0 z-10 hidden h-full w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
					side === 'left'
						? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
						: 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
					variant === 'floating' || variant === 'inset'
						? 'px-2 py-3 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
						: 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
					className,
				)}
				{...props}
			>
				<div
					data-sidebar="sidebar"
					className={cn(
						'sidebar flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm',
						surfaceClassName,
					)}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
