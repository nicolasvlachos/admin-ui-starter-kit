/**
 * SmartCard actions menu — `⋮` trigger + dropdown of consumer-supplied
 * `SmartCardAction` items. Always renders a 28×28 square trigger so it
 * reads cleanly as a circle (consumer overrides to `rounded-full`) or
 * a rectangle (default `rounded-md`).
 */
import { MoreHorizontal } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import type { SmartCardAction } from '../smart-card.types';

interface ActionsMenuProps {
	actions: SmartCardAction[];
	actionsLabel: string;
}

export function ActionsMenu({ actions, actionsLabel }: ActionsMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				type="button"
				aria-label={actionsLabel}
				className={cn(
					'inline-flex size-7 shrink-0 items-center justify-center rounded-md p-0',
					'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
					'outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
					'transition-colors',
				)}
			>
				<MoreHorizontal className="size-4" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-[140px]">
				{actions.map((action, index) => (
					<DropdownMenuItem
						key={action.id ?? `${action.label}-${index}`}
						onClick={action.onClick}
						disabled={action.disabled}
						className="gap-1.5 px-2 py-1 text-xs"
					>
						{!!action.icon && (
							<span className="flex shrink-0 items-center">{action.icon}</span>
						)}
						{action.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
