import { MoreHorizontal, type LucideIcon } from 'lucide-react';
import { isValidElement, useEffect, useMemo, useState } from 'react';
import { Button, type ButtonVariant, type ButtonStyle } from '@/components/base/buttons';
import {
    ActionMenu,
    MenuAction,
    type MenuActionProps
} from '@/components/base/navigation/action-menu';
import { cn } from '@/lib/utils';
import { defaultDataTableStrings } from './table.strings';
import { type DataTableActionsProps, type ActionItem, type ActionVariant } from './table.types';

export function DataTableActions<TData>(props: DataTableActionsProps<TData>) {
    const {
        row,
        actions,
        menuLabel,
        displayMode = 'menu', // preserve existing behavior
        responsiveBreakpoint = 1040,
        strings: providedStrings
    } = props;

    const strings = providedStrings ?? defaultDataTableStrings;
    const resolvedMenuLabel = menuLabel ?? strings.actions.triggerLabel;

    // Resolve actions array
    const resolvedActions = useMemo<ActionItem<TData>[]>(() => {
        const base = typeof actions === 'function' ? actions(row) : actions;
        return Array.isArray(base) ? base : [];
    }, [actions, row]);

    // Filter visibility and compute disabled by predicate/boolean
    const visibleActions = useMemo(() => {
        const evalFlag = (flag: boolean | ((r: TData) => boolean) | undefined): boolean | undefined => {
            if (typeof flag === 'function') return flag(row);
            return flag;
        };
        return resolvedActions
            .filter(a => {
                const v = evalFlag(a.isVisible);
                return v === undefined ? true : v;
            })
            .map(a => ({
                ...a,
                disabled: evalFlag(a.isDisabled) ?? a.disabled ?? false
            }));
    }, [resolvedActions, row]);

    // No actions to render
    const hasVisibleActions = visibleActions.length > 0;

    // Responsive auto mode: inline over breakpoint, menu under
    const [isNarrow, setIsNarrow] = useState(false);

    // 1. Split by variant
    const nonDestructive = visibleActions.filter((action) => action.variant !== 'destructive');
    const destructive = visibleActions.filter((action) => action.variant === 'destructive');

    // 2. Combine them (non-destructive first, destructive last)
    const sortedActions = [...nonDestructive, ...destructive];

    useEffect(() => {
        if (displayMode !== 'auto' || !hasVisibleActions) {
            setIsNarrow(false);
            return;
        }

        const handleResize = () => {
            try {
                setIsNarrow(window.innerWidth <= responsiveBreakpoint);
            } catch {
                setIsNarrow(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [displayMode, hasVisibleActions, responsiveBreakpoint]);

    if (!hasVisibleActions) return null;

    const mode: 'menu' | 'inline' = displayMode === 'auto' ? (isNarrow ? 'menu' : 'inline') : displayMode;

    // Navigation helper
    const navigateTo = (href?: string) => {
        if (!href) return;
        if (typeof window !== 'undefined') {
            window.location.assign(href);
        }
    };

    const resolveMenuIcon = (icon: ActionItem<TData>['icon']): LucideIcon | undefined => {
        if (!icon) return undefined;
        if (typeof icon === 'function') {
            return icon as LucideIcon;
        }

        if (isValidElement(icon) && typeof icon.type === 'function') {
            return icon.type as LucideIcon;
        }

        return undefined;
    };

    const resolveActionButtonVariant = (variant?: ActionVariant): {
        variant: ButtonVariant;
        buttonStyle: ButtonStyle;
        className?: string
    } => {
        switch (variant) {
            case 'destructive':
                return { variant: 'error', buttonStyle: 'solid' };
            case 'outline':
                return { variant: 'secondary', buttonStyle: 'outline' };
            case 'secondary':
                return { variant: 'secondary', buttonStyle: 'solid' };
            case 'ghost':
                return { variant: 'secondary', buttonStyle: 'ghost' };
            case 'link':
                return { variant: 'secondary', buttonStyle: 'ghost', className: 'underline underline-offset-4' };
            case 'default':
            default:
                return { variant: 'primary', buttonStyle: 'solid' };
        }
    };

    const resolveMenuActionVariant = (
        variant?: ActionVariant
    ): NonNullable<MenuActionProps['variant']> => {
        switch (variant) {
            case 'default':
                return 'primary';
            case 'destructive':
                return 'error';
            default:
                return 'secondary';
        }
    };

    if (mode === 'inline') {
        return (
            <div className="flex items-center gap-1">
                {sortedActions.map((action, idx) => {
                    const key = action.id || `${action.label}-${idx}`;
                    const resolved = resolveActionButtonVariant(action.variant ?? 'ghost');
                    const onClick = () => {
                        if (action.onClick) action.onClick(row);
                        else if (action.href) navigateTo(action.href);
                    };
                    return (
                        <Button
                            key={key}
                            variant={resolved.variant}
                            buttonStyle={resolved.buttonStyle}
                            className={cn('h-8 text-inherit leading-4', resolved.className)}
                            disabled={!!action.disabled}
                            onClick={onClick}
                        >
                            {!!action.icon && <span className="mr-2 inline-flex">{action.icon}</span>}
                            {action.label}
                        </Button>
                    );
                })}
            </div>
        );
    }


    // menu mode (default) using our ActionMenu implementation
    return (
        <ActionMenu
            label={undefined}
            icon={MoreHorizontal}
            srText={resolvedMenuLabel || strings.actions.srLabel}
            closeOnSelect={true}
            align="end"
            density="table"
        >
            {sortedActions.map((action, idx) => {
                const key = action.id || `${action.label}-${idx}`;
                const onClick = () => {
                    if (action.onClick) action.onClick(row);
                    else if (action.href) navigateTo(action.href);
                };
                const menuIcon = resolveMenuIcon(action.icon);
                const inlineIcon = action.icon
                    ? <span className="inline-flex items-center">{action.icon}</span>
                    : null;
                const fallbackContent = menuIcon ? null : (
                    <div className="flex w-full items-center gap-2">
                        {inlineIcon}
                        <span>{action.label}</span>
                    </div>
                );

                const menuActionVariant = resolveMenuActionVariant(
                    action.variant
                );

                return (
                    <MenuAction
                        key={key}
                        label={action.label}
                        icon={menuIcon}
                        variant={menuActionVariant}
                        disabled={!!action.disabled}
                        onClick={onClick}
                    >
                        {fallbackContent}
                    </MenuAction>
                );
            })}
        </ActionMenu>
    );
}

DataTableActions.displayName = 'DataTableActions';
