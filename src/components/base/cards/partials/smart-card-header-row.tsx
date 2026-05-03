/**
 * SmartCardHeaderRow — the chrome above the card body. Combines icon /
 * title / description / tooltip / suffix on the leading side with the
 * trailing `headerEnd` / `headerAction` slots and the actions menu.
 *
 * `TooltipTrigger_Info` is colocated here because it's only used by the
 * header — keeping it private avoids polluting the public partial
 * surface.
 */
import { Info } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/base/buttons';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/base/display/tooltip';
import { cn } from '@/lib/utils';

import { PADDING } from '../smart-card.tokens';
import type { CardPadding, SmartCardAction } from '../smart-card.types';

import { CardHeader, CardTitle, CardDescription } from './card-primitives';
import { hasRenderableContent } from './has-renderable-content';
import { ActionsMenu } from './smart-card-actions-menu';

function TooltipTrigger_Info({ tooltipLabel }: { tooltipLabel: string }) {
	return (
		<TooltipTrigger
			render={(triggerProps) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const passthrough = triggerProps as Record<string, any>;
				return (
					<Button
						{...passthrough}
						type="button"
						variant="secondary"
						buttonStyle="ghost"
						size="icon-xs"
						className={cn(
							'h-5 w-5 text-muted-foreground',
							passthrough.className,
						)}
						aria-label={tooltipLabel}
					>
						<Info className="size-3.5" />
					</Button>
				);
			}}
		/>
	);
}

interface HeaderProps {
	icon?: ReactNode;
	title?: ReactNode;
	titleSuffix?: ReactNode;
	description?: ReactNode;
	tooltip?: ReactNode;
	tooltipLabel: string;
	headerStart?: ReactNode;
	headerEnd?: ReactNode;
	headerAction?: ReactNode;
	actions?: SmartCardAction[];
	actionsLabel: string;
	padding: CardPadding;
	className?: string;
}

export function SmartCardHeaderRow({
	icon,
	title,
	titleSuffix,
	description,
	tooltip,
	tooltipLabel,
	headerStart,
	headerEnd,
	headerAction,
	actions,
	actionsLabel,
	padding,
	className,
}: HeaderProps) {
	const cardActions = Array.isArray(actions) ? actions : [];
	const hasActions = cardActions.length > 0;

	const hasIcon = hasRenderableContent(icon);
	const hasTitle = hasRenderableContent(title);
	const hasTitleSuffix = hasRenderableContent(titleSuffix);
	const hasDescription = hasRenderableContent(description);
	const hasTooltip = hasRenderableContent(tooltip);
	const hasHeaderStart = hasRenderableContent(headerStart);
	const hasHeaderEnd = hasRenderableContent(headerEnd);
	const hasHeaderAction = hasRenderableContent(headerAction);

	const showTitleRow = hasIcon || hasTitle || hasTitleSuffix || hasTooltip;
	const showTrailing = hasHeaderEnd || hasHeaderAction || hasActions;

	return (
		<CardHeader
			className={cn(
				'flex-row items-start justify-between gap-3 pb-0',
				PADDING[padding].headerX,
				className,
			)}
		>
			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				{!!hasHeaderStart && headerStart}

				{!!showTitleRow && (
					<div className="flex items-center gap-2">
						{!!hasIcon && (
							<span className="flex shrink-0 items-center text-muted-foreground">
								{icon}
							</span>
						)}
						<CardTitle>{title}</CardTitle>
						{!!hasTitleSuffix && (
							<div className="flex items-center gap-2">{titleSuffix}</div>
						)}
						{!!hasTooltip && (
							<Tooltip>
								<TooltipTrigger_Info tooltipLabel={tooltipLabel} />
								<TooltipContent>{tooltip}</TooltipContent>
							</Tooltip>
						)}
					</div>
				)}

				{!!hasDescription && (
					<CardDescription className="text-left">{description}</CardDescription>
				)}
			</div>

			{!!showTrailing && (
				<div className="flex items-center gap-2">
					{!!hasHeaderEnd && headerEnd}
					{!!hasHeaderAction && headerAction}
					{!!hasActions && (
						<ActionsMenu actions={cardActions} actionsLabel={actionsLabel} />
					)}
				</div>
			)}
		</CardHeader>
	);
}
