/**
 * ActivityActionsMenu — inline overflow menu rendered on rich rows.
 *
 * Backed by the shadcn DropdownMenu primitive; each item fires the
 * activity's per-row `onClick` and forwards `actionId` through `onAction` so
 * consumers can route actions centrally.
 */
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/base/buttons';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/base/navigation';

import type { ActivityAction, ActivityItem } from '../activities.types';

export interface ActivityActionsMenuProps<TData = unknown> {
    activity: ActivityItem<TData>;
    actions: readonly ActivityAction<TData>[];
    onAction?: (actionId: string, activity: ActivityItem<TData>) => void;
    label: string;
}

export function ActivityActionsMenu<TData = unknown>({
    activity,
    actions,
    onAction,
    label,
}: ActivityActionsMenuProps<TData>) {
    if (actions.length === 0) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={(triggerProps) => (
                    <Button
                        {...(triggerProps as Record<string, unknown>)}
                        type="button"
                        variant="secondary"
                        buttonStyle="ghost"
                        size="icon-sm"
                        aria-label={label}
                        className="h-7 w-7 text-muted-foreground"
                    >
                        <MoreHorizontal className="size-4" />
                    </Button>
                )}
            />
            <DropdownMenuContent align="end" className="min-w-[160px]">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <DropdownMenuItem
                            key={action.id}
                            onClick={() => {
                                if (action.disabled) return;
                                action.onClick(activity);
                                onAction?.(action.id, activity);
                            }}
                            disabled={action.disabled}
                            variant={action.tone === 'destructive' ? 'destructive' : 'default'}
                            className="gap-2 px-2 py-1.5 text-xs"
                        >
                            {!!Icon && <Icon className="size-3.5" />}
                            {action.label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
