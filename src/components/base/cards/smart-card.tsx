/**
 * SmartCard — composed card with header (icon, title, suffix, description,
 * tooltip), actions menu, alert banner (default / destructive / warning),
 * header / content / footer slots, and 3 padding sizes (sm / base / lg).
 *
 * The single card primitive everything else builds on — never reach past it
 * to shadcn `Card` directly. Re-exports the underlying CardShell / CardHeader
 * etc. for advanced composition (deeply customised layouts that still want
 * the design-system surface tokens).
 */
import { Info, MoreHorizontal } from 'lucide-react';
import {
	type ComponentPropsWithoutRef,
	type ReactNode,
	Fragment,
	isValidElement,
} from 'react';

import { Button } from '@/components/base/buttons';
import { Alert, AlertDescription } from '@/components/base/display/alert';
import { buttonVariants } from '@/components/ui/button';
import {
	Card as CardPrimitive,
	CardContent as CardContentPrimitive,
	CardDescription as CardDescriptionPrimitive,
	CardFooter as CardFooterPrimitive,
	CardHeader as CardHeaderPrimitive,
	CardTitle as CardTitlePrimitive,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/base/display/tooltip';
import Text from '@/components/typography/text';
import { useCardConfig } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type CardPadding = 'sm' | 'base' | 'lg';
type CardAlertVariant = 'default' | 'destructive' | 'warning' | 'success' | 'info';

export type SmartCardAction = {
	id?: string;
	label: string;
	onClick: () => void;
	icon?: ReactNode;
	disabled?: boolean;
};

export interface SmartCardProps {
	icon?: ReactNode;
	title?: ReactNode;
	titleSuffix?: ReactNode;
	description?: ReactNode;
	tooltip?: ReactNode;
	tooltipAriaLabel?: string;
	footerText?: ReactNode;
	alert?: ReactNode | string;
	alertVariant?: CardAlertVariant;
	transparent?: boolean;
	padding?: CardPadding;
	actions?: SmartCardAction[];
	actionsLabel?: string;
	headerAction?: ReactNode;
	headerStart?: ReactNode;
	headerEnd?: ReactNode;
	contentTop?: ReactNode;
	contentBottom?: ReactNode;
	children: ReactNode;
	className?: string;
	headerClassName?: string;
	contentClassName?: string;
	footerClassName?: string;
}

// ──────────────────────────────────────────────────────────────────────────
// Padding tokens (single source of truth, keyed by region)
// ──────────────────────────────────────────────────────────────────────────

interface PaddingTokens {
	shell: string;
	headerX: string;
	contentX: string;
	contentY: string;
	footerX: string;
	alertX: string;
	/** Vertical offset applied when alert sits BELOW the header (pulls it up) */
	alertOffsetWithHeader: string;
	/** Vertical spacing applied when alert is the first content (no header) */
	alertOffsetStandalone: string;
}

const PADDING: Record<CardPadding, PaddingTokens> = {
	sm: {
		shell: 'gap-3 py-4',
		headerX: 'px-4',
		contentX: 'px-4',
		contentY: 'py-2',
		footerX: 'px-4',
		alertX: 'px-4',
		alertOffsetWithHeader: '-mt-2',
		alertOffsetStandalone: 'mt-1',
	},
	base: {
		shell: 'gap-4 py-6',
		headerX: 'px-6',
		contentX: 'px-6',
		contentY: 'py-0',
		footerX: 'px-6',
		alertX: 'px-6',
		alertOffsetWithHeader: '-mt-3',
		alertOffsetStandalone: 'mt-2',
	},
	lg: {
		shell: 'gap-5 py-8',
		headerX: 'px-8',
		contentX: 'px-8',
		contentY: 'py-2',
		footerX: 'px-8',
		alertX: 'px-8',
		alertOffsetWithHeader: '-mt-4',
		alertOffsetStandalone: 'mt-3',
	},
};

// ──────────────────────────────────────────────────────────────────────────
// hasRenderableContent — predicate used to decide whether each slot warrants
// rendering its wrapper. Numbers (incl. 0) and JSX always render; falsy /
// empty-string content is treated as absent.
// ──────────────────────────────────────────────────────────────────────────

function hasRenderableContent(content?: ReactNode): boolean {
	if (content === null || content === undefined) return false;
	if (typeof content === 'boolean') return false;
	if (typeof content === 'string') return content.trim().length > 0;
	if (typeof content === 'number' || typeof content === 'bigint') return true;
	if (Array.isArray(content)) return content.some(hasRenderableContent);
	if (isValidElement<{ children?: ReactNode }>(content)) {
		if (content.type === Fragment) return hasRenderableContent(content.props.children);
		return true;
	}
	return true;
}

// ──────────────────────────────────────────────────────────────────────────
// Internal layout primitives — re-exported at the bottom for advanced
// composition. Each primitive is intentionally thin: a single responsibility,
// a single set of default classes, no business logic.
// ──────────────────────────────────────────────────────────────────────────

function CardShell({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
	return (
		<CardPrimitive
			className={cn(
				'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-none py-6 shadow-sm ring-0',
				className,
			)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
	return (
		<CardHeaderPrimitive
			className={cn('flex flex-col gap-0.5 px-6', className)}
			{...props}
		/>
	);
}

function CardTitle({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
	if (!hasRenderableContent(children)) return null;

	const isPlainText =
		typeof children === 'string' ||
		typeof children === 'number' ||
		typeof children === 'bigint';

	if (!isPlainText) {
		return (
			<CardTitlePrimitive className={cn('leading-none font-semibold', className)} {...props}>
				{children}
			</CardTitlePrimitive>
		);
	}

	return (
		<Text
			data-slot="card-title"
			tag="div"
			weight="semibold"
			lineHeight="none"
			className={cn('leading-none font-semibold', className)}
			{...props}
		>
			{children}
		</Text>
	);
}

function CardDescription({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
	if (!hasRenderableContent(children)) return null;

	const isPlainText =
		typeof children === 'string' ||
		typeof children === 'number' ||
		typeof children === 'bigint';

	if (!isPlainText) {
		return (
			<CardDescriptionPrimitive
				className={cn('text-muted-foreground text-sm', className)}
				{...props}
			>
				{children}
			</CardDescriptionPrimitive>
		);
	}

	return (
		<Text
			data-slot="card-description"
			tag="div"
			type="secondary"
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		>
			{children}
		</Text>
	);
}

function CardContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
	return <CardContentPrimitive className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
	return (
		<CardFooterPrimitive
			className={cn('flex items-center px-6', className)}
			{...props}
		/>
	);
}

// ──────────────────────────────────────────────────────────────────────────
// Internal sub-components — kept private. Each handles one part of the
// header / alert / actions layout so the SmartCard JSX stays readable.
// ──────────────────────────────────────────────────────────────────────────

function ActionsMenu({
	actions,
	actionsLabel,
}: {
	actions: SmartCardAction[];
	actionsLabel: string;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				type="button"
				aria-label={actionsLabel}
				className={cn(
					buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
					'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
					'-mr-2 h-7 w-7',
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

function SmartCardHeaderRow({
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

				{!!hasDescription && <CardDescription className="text-left">{description}</CardDescription>}
			</div>

			{!!showTrailing && (
				<div className="flex items-center gap-2">
					{!!hasHeaderEnd && headerEnd}
					{!!hasHeaderAction && headerAction}
					{!!hasActions && <ActionsMenu actions={cardActions} actionsLabel={actionsLabel} />}
				</div>
			)}
		</CardHeader>
	);
}

interface AlertSlotProps {
	alert: ReactNode | string;
	alertVariant: CardAlertVariant;
	hasHeader: boolean;
	padding: CardPadding;
}

function SmartCardAlert({ alert, alertVariant, hasHeader, padding }: AlertSlotProps) {
	const tokens = PADDING[padding];

	return (
		<div
			className={cn(
				tokens.alertX,
				hasHeader ? tokens.alertOffsetWithHeader : tokens.alertOffsetStandalone,
			)}
		>
			<Alert variant={alertVariant}>
				<AlertDescription>{alert}</AlertDescription>
			</Alert>
		</div>
	);
}

// ──────────────────────────────────────────────────────────────────────────
// SmartCard — public component
// ──────────────────────────────────────────────────────────────────────────

export function SmartCard({
	icon,
	title,
	titleSuffix,
	description,
	tooltip,
	tooltipAriaLabel = 'Card info',
	footerText,
	alert,
	alertVariant = 'default',
	transparent = false,
	padding,
	actions,
	actionsLabel = 'Card actions',
	headerAction,
	headerStart,
	headerEnd,
	contentTop,
	contentBottom,
	children,
	className,
	headerClassName,
	contentClassName,
	footerClassName,
}: SmartCardProps) {
	const { defaultPadding } = useCardConfig();
	const resolvedPadding: CardPadding = padding ?? defaultPadding ?? 'sm';
	const tokens = PADDING[resolvedPadding];
	const cardActions = Array.isArray(actions) ? actions : [];

	const hasHeader =
		hasRenderableContent(icon) ||
		hasRenderableContent(title) ||
		hasRenderableContent(description) ||
		cardActions.length > 0 ||
		hasRenderableContent(headerAction) ||
		hasRenderableContent(headerStart) ||
		hasRenderableContent(headerEnd);

	const hasAlert = hasRenderableContent(alert);
	const hasFooterText = hasRenderableContent(footerText);
	const hasContentTop = hasRenderableContent(contentTop);
	const hasContentBottom = hasRenderableContent(contentBottom);

	const tooltipLabel =
		tooltipAriaLabel.trim().length > 0 ? tooltipAriaLabel : 'Card info';

	return (
		<CardShell
			className={cn(
				tokens.shell,
				transparent && 'border-none bg-transparent shadow-none',
				className,
			)}
		>
			{!!hasHeader && (
				<SmartCardHeaderRow
					icon={icon}
					title={title}
					titleSuffix={titleSuffix}
					description={description}
					tooltip={tooltip}
					tooltipLabel={tooltipLabel}
					headerStart={headerStart}
					headerEnd={headerEnd}
					headerAction={headerAction}
					actions={cardActions}
					actionsLabel={actionsLabel}
					padding={resolvedPadding}
					className={headerClassName}
				/>
			)}

			{!!hasAlert && (
				<SmartCardAlert
					alert={alert}
					alertVariant={alertVariant}
					hasHeader={hasHeader}
					padding={resolvedPadding}
				/>
			)}

			<CardContent
				className={cn(
					tokens.contentX,
					tokens.contentY,
					contentClassName,
				)}
			>
				{!!hasContentTop && contentTop}
				{children}
				{!!hasContentBottom && contentBottom}
			</CardContent>

			{!!hasFooterText && (
				<CardFooter
					className={cn(
						'justify-end text-xs text-muted-foreground',
						tokens.footerX,
						footerClassName,
					)}
				>
					{footerText}
				</CardFooter>
			)}
		</CardShell>
	);
}

SmartCard.displayName = 'SmartCard';

// ──────────────────────────────────────────────────────────────────────────
// SmartCardSkeleton
// ──────────────────────────────────────────────────────────────────────────

export interface SmartCardSkeletonProps {
	title?: ReactNode;
	lines?: number;
	className?: string;
}

function SmartCardSkeleton({ title, lines = 2, className }: SmartCardSkeletonProps) {
	const SkeletonBar = ({ barClassName }: { barClassName?: string }) => (
		<div className={cn('animate-pulse rounded bg-muted', barClassName)} />
	);

	return (
		<CardShell className={cn('gap-4 py-6', className)}>
			<CardHeader className="flex-col gap-1.5 px-6 pb-0">
				{title ? <CardTitle>{title}</CardTitle> : <SkeletonBar barClassName="h-4 w-32" />}
			</CardHeader>
			<CardContent className="space-y-3 px-6 py-0">
				{Array.from({ length: lines }, (_, i) => (
					<SkeletonBar
						key={`skel-${String(i)}`}
						barClassName={cn('h-4', i === 0 ? 'w-full' : 'w-3/4')}
					/>
				))}
			</CardContent>
		</CardShell>
	);
}

SmartCardSkeleton.displayName = 'SmartCardSkeleton';

export {
	CardShell,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	SmartCardSkeleton,
};
