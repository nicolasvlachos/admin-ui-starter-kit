/**
 * ActionMenu — dropdown trigger + grouped menu items. Use `MenuAction`
 * children to define each menu entry; `variant="error"` actions are
 * automatically grouped at the bottom for visual separation. Optional
 * `closeOnSelect` closes the menu after each selection. The `density="table"`
 * variant tightens type and spacing for use inside DataTable rows.
 */
import type { LucideIcon } from 'lucide-react';
import { MoreVertical } from 'lucide-react';
import React, { type ReactElement } from 'react';

import { Button } from '@/components/base/buttons';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLinkItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type ActionMenuButtonProps = Partial<React.ComponentPropsWithoutRef<typeof Button>>;
type ActionMenuDensity = 'default' | 'table';

export interface ActionMenuProps {
	label?: string;
	icon?: LucideIcon;
	srText?: string;
	buttonProps?: ActionMenuButtonProps;
	align?: 'center' | 'start' | 'end';
	children?: React.ReactNode;
	contentClassName?: string;
	width?: string;
	closeOnSelect?: boolean;
	density?: ActionMenuDensity;
}

export interface MenuActionProps {
	onClick?: () => void;
	href?: string;
	prefetch?: boolean;
	disabled?: boolean;
	icon?: LucideIcon;
	label?: string;
	variant?: 'primary' | 'secondary' | 'error';
	className?: string;
	children?: React.ReactNode;
	density?: ActionMenuDensity;
}

export const ActionMenu = ({
	label,
	icon: IconComponent = MoreVertical,
	srText = 'Open menu',
	buttonProps,
	align = 'center',
	children,
	contentClassName = '',
	width = 'w-auto',
	closeOnSelect = false,
	density = 'default',
}: ActionMenuProps) => {
	const [open, setOpen] = React.useState(false);

	const processedChildren = React.useMemo(() => {
		const childrenArray = React.Children.toArray(children);

		const clonedChildren = childrenArray.map((child) => {
			if (!React.isValidElement(child)) return child;

			const childType = child.type as React.ComponentType & { displayName?: string };
			if (childType.displayName !== 'MenuAction') return child;

			const menuActionChild = child as React.ReactElement<MenuActionProps>;
			const onClick = menuActionChild.props.onClick;

			return React.cloneElement(menuActionChild, {
				onClick: () => {
					if (onClick) onClick();
					if (closeOnSelect) setOpen(false);
				},
				density: menuActionChild.props.density ?? density,
			});
		});

		const standardActions = clonedChildren.filter((child): child is ReactElement<MenuActionProps> => {
			if (!React.isValidElement(child)) return false;
			return (child.props as MenuActionProps).variant !== 'error';
		});

		const destructiveActions = clonedChildren.filter((child): child is ReactElement<MenuActionProps> => {
			if (!React.isValidElement(child)) return false;
			return (child.props as MenuActionProps).variant === 'error';
		});

		return [...standardActions, ...destructiveActions];
	}, [children, closeOnSelect, density]);

	const defaultButtonProps: ActionMenuButtonProps = {
		variant: 'secondary',
		buttonStyle: 'ghost',
		size: 'icon',
		className: 'h-8 w-8 p-0',
	};

	const mergedButtonProps = {
		...defaultButtonProps,
		...buttonProps,
		className: cn(defaultButtonProps.className, buttonProps?.className),
	};

	const {
		variant = 'secondary',
		buttonStyle = 'ghost',
		size = 'icon',
		className: triggerClassName,
		...triggerProps
	} = mergedButtonProps;

	const buttonContent = label ? (
		<>
			<IconComponent className="h-4 w-4 mr-2" />
			{label}
		</>
	) : (
		<>
			<IconComponent className="h-4 w-4" />
			<span className="sr-only">{srText}</span>
		</>
	);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger
				render={(dropdownTriggerProps) => (
					<Button
						{...triggerProps}
						{...dropdownTriggerProps}
						type="button"
						variant={variant}
						buttonStyle={buttonStyle}
						size={size}
						className={cn(
							'action-menu--component',
							triggerClassName,

							(dropdownTriggerProps as { className?: string }).className,
						)}
					>
						{buttonContent}
					</Button>
				)}
			/>
			<DropdownMenuContent
				align={align}
				className={cn(
					width,
					'min-w-[140px] p-2',
					density === 'table' && 'text-xxs leading-4',
					contentClassName,
				)}
			>
				{processedChildren}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

ActionMenu.displayName = 'ActionMenu';

export const MenuAction = React.forwardRef<HTMLDivElement, MenuActionProps>(
	(
		{
			onClick,
			href,
			prefetch,
			disabled = false,
			icon: IconComponent,
			label,
			variant = 'secondary',
			className = '',
			children,
			density = 'default',
		},
		ref,
	) => {
		const renderLink = href && !disabled;
		void prefetch;
		const linkRenderer = renderLink
			? (renderProps: React.ComponentPropsWithoutRef<'a'>) => (
					<a
						{...renderProps}
						href={href}
						className={cn(renderProps.className)}
					/>
				)
			: undefined;

		if (children) {
			if (renderLink) {
				return (
					<DropdownMenuLinkItem
						href={href}
						onClick={onClick}
						render={linkRenderer}
						className={cn(
							'text-xs px-2 py-1.5 gap-1.5',
							density === 'table' && 'text-inherit leading-4',
							className,
						)}
					>
						{children}
					</DropdownMenuLinkItem>
				);
			}

			return (
				<DropdownMenuItem
					ref={ref}
					disabled={disabled}
					onClick={onClick}
					className={cn(
						'text-xs px-2 py-1.5 gap-1.5',
						density === 'table' && 'text-inherit leading-4',
						className,
					)}
				>
					{children}
				</DropdownMenuItem>
			);
		}

		if (renderLink) {
			return (
				<DropdownMenuLinkItem
					href={href}
					variant={variant === 'error' ? 'destructive' : 'default'}
					onClick={onClick}
					render={linkRenderer}
					className={cn(
						'text-xs px-2 py-1.5 gap-1.5',
						density === 'table' && 'leading-4',
						className,
					)}
				>
					{!!IconComponent && <IconComponent className="h-3.5 w-3.5" />}
					{label}
				</DropdownMenuLinkItem>
			);
		}

		return (
			<DropdownMenuItem
				ref={ref}
				disabled={disabled}
				variant={variant === 'error' ? 'destructive' : 'default'}
				onClick={onClick}
				className={cn(
					'text-xs px-2 py-1.5 gap-1.5',
					density === 'table' && 'leading-4',
					className,
				)}
			>
				{!!IconComponent && <IconComponent className="h-3.5 w-3.5" />}
				{label}
			</DropdownMenuItem>
		);
	},
);

MenuAction.displayName = 'MenuAction';
