/**
 * SmartCard — composed card with header (icon, title, suffix, description,
 * tooltip), actions menu, alert banner, header / content / footer slots,
 * surface variants (card / flat / framed), and an opt-in expandable body.
 *
 * The single card primitive everything else builds on — never reach past it
 * to shadcn `Card` directly. The CardShell / CardHeader / CardTitle /
 * CardDescription / CardContent / CardFooter primitives are re-exported
 * for advanced composition (deeply customised layouts that still want the
 * design-system surface tokens). Each subregion paints a BEM-style hook
 * (`card--component`, `card--header`, `card--title`, …) for CSS / test /
 * analytics targeting independent of shadcn's data-slot internals.
 *
 * The file is a thin orchestrator. The actual chrome lives in:
 *   - `./smart-card.types.ts`           — public prop / variant types
 *   - `./smart-card.strings.ts`         — i18n (expand toggle copy)
 *   - `./smart-card.tokens.ts`          — PADDING + SURFACE_CLASSES + CARD_BEM
 *   - `./partials/card-primitives.tsx`  — CardShell + CardHeader / Title /
 *                                          Description / Content / Footer
 *   - `./partials/smart-card-header-row.tsx` — header layout + actions menu
 *   - `./partials/smart-card-alert.tsx`     — inline alert banner
 *   - `./partials/smart-card-actions-menu.tsx` — `⋮` dropdown
 *   - `./partials/smart-card-skeleton.tsx` — loading placeholder
 *   - `./partials/has-renderable-content.ts` — slot-empty predicate
 */
import { ChevronDown } from 'lucide-react';
import {
	type CSSProperties,
	forwardRef,
	useCallback,
	useState,
} from 'react';

import { useCardConfig } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';

import {
	CardContent,
	CardFooter,
	CardShell,
} from './partials/card-primitives';
import { hasRenderableContent } from './partials/has-renderable-content';
import { SmartCardAlert } from './partials/smart-card-alert';
import { SmartCardHeaderRow } from './partials/smart-card-header-row';
import {
	defaultSmartCardStrings,
	type SmartCardStrings,
} from './smart-card.strings';
import {
	PADDING,
	SURFACE_CLASSES,
} from './smart-card.tokens';
import type {
	CardPadding,
	SmartCardProps,
	SmartCardSurface,
} from './smart-card.types';

export const SmartCard = forwardRef<HTMLDivElement, SmartCardProps>(function SmartCard({
	icon,
	title,
	titleSuffix,
	description,
	tooltip,
	tooltipAriaLabel = 'Card info',
	footerText,
	alert,
	alertVariant = 'default',
	surface,
	transparent = false,
	padding,
	actions,
	actionsLabel = 'Card actions',
	headerAction,
	headerStart,
	headerEnd,
	contentTop,
	contentBottom,
	footerSlot,
	headerDivider = false,
	footerDivider = false,
	expandable = false,
	defaultExpanded = false,
	expanded: expandedProp,
	onExpandedChange,
	children,
	className,
	headerClassName,
	contentClassName,
	footerClassName,
	strings: stringsProp,
}, ref) {
	const { defaultPadding } = useCardConfig();
	const resolvedPadding: CardPadding = padding ?? defaultPadding ?? 'sm';
	const tokens = PADDING[resolvedPadding];
	const cardActions = Array.isArray(actions) ? actions : [];
	const strings: SmartCardStrings = {
		...defaultSmartCardStrings,
		...stringsProp,
	};

	const isExpandable = expandable !== false && expandable !== undefined;
	const collapsedMaxHeightRaw =
		typeof expandable === 'object' && expandable?.collapsedMaxHeight !== undefined
			? expandable.collapsedMaxHeight
			: '12rem';
	const collapsedMaxHeight =
		typeof collapsedMaxHeightRaw === 'number'
			? `${collapsedMaxHeightRaw}px`
			: collapsedMaxHeightRaw;

	const isExpandedControlled = expandedProp !== undefined;
	const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
	const expanded = isExpandedControlled ? expandedProp : internalExpanded;
	const handleToggle = useCallback(() => {
		const next = !expanded;
		if (!isExpandedControlled) setInternalExpanded(next);
		onExpandedChange?.(next);
	}, [expanded, isExpandedControlled, onExpandedChange]);

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
	const hasFooterSlot = hasRenderableContent(footerSlot);
	const hasContentTop = hasRenderableContent(contentTop);
	const hasContentBottom = hasRenderableContent(contentBottom);

	const tooltipLabel =
		tooltipAriaLabel.trim().length > 0 ? tooltipAriaLabel : 'Card info';

	const collapseStyle: CSSProperties | undefined = isExpandable
		? {
				maxHeight: expanded ? '' : collapsedMaxHeight,
			}
		: undefined;

	// Resolve surface — explicit `surface` wins, else legacy `transparent`,
	// else the default `'card'` chrome.
	const resolvedSurface: SmartCardSurface = surface ?? (transparent ? 'flat' : 'card');

	return (
		<CardShell
			ref={ref}
			data-surface={resolvedSurface}
			className={cn(
				SURFACE_CLASSES[resolvedSurface],
				tokens.shell,
				// `isExpandable` parks the chevron at `-bottom-4` outside the
				// shell — `overflow-visible` lets it render past the card
				// edge, otherwise the shadcn primitive's `overflow-hidden`
				// clips it.
				isExpandable && 'relative pb-1 !overflow-visible',
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
					className={cn(
						headerDivider && 'pb-3 border-b border-border/60',
						headerClassName,
					)}
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
					isExpandable &&
						'relative overflow-hidden transition-[max-height] duration-500 ease-in-out',
					contentClassName,
				)}
				style={collapseStyle}
			>
				{!!hasContentTop && contentTop}
				{children}
				{!!hasContentBottom && contentBottom}

				{!!isExpandable && !expanded && (
					<div
						aria-hidden="true"
						className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-lg bg-linear-to-t to-transparent"
					/>
				)}
			</CardContent>

			{!!hasFooterText && (
				<CardFooter
					className={cn(
						'justify-end text-xs text-muted-foreground',
						tokens.footerX,
						footerDivider && 'pt-3 border-t border-border/60',
						footerClassName,
					)}
				>
					{footerText}
				</CardFooter>
			)}

			{!!hasFooterSlot && (
				<CardFooter
					className={cn(
						'flex-col items-stretch',
						tokens.footerX,
						footerDivider && 'pt-3 border-t border-border/60',
						footerClassName,
					)}
				>
					{footerSlot}
				</CardFooter>
			)}

			{!!isExpandable && (
				<div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
					<button
						type="button"
						onClick={handleToggle}
						aria-expanded={expanded}
						aria-label={expanded ? strings.collapseLabel : strings.expandLabel}
						className={cn(
							'inline-flex size-8 items-center justify-center rounded-full',
							'border border-border bg-background text-foreground shadow-sm',
							'hover:bg-muted/40 transition-colors',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
						)}
					>
						<ChevronDown
							aria-hidden="true"
							className={cn(
								'size-4 transition-transform duration-300',
								expanded && 'rotate-180',
							)}
						/>
						<span className="sr-only">
							{expanded ? strings.collapseLabel : strings.expandLabel}
						</span>
					</button>
				</div>
			)}
		</CardShell>
	);
});

SmartCard.displayName = 'SmartCard';

// ──────────────────────────────────────────────────────────────────────────
// Re-exports — public surface lives here so `import { ... } from
// '@/components/base/cards'` keeps working through the file split.
// ──────────────────────────────────────────────────────────────────────────

export {
	defaultSmartCardStrings,
	type SmartCardStrings,
} from './smart-card.strings';
export type {
	CardAlertVariant,
	CardPadding,
	SmartCardAction,
	SmartCardProps,
	SmartCardSkeletonProps,
	SmartCardSurface,
} from './smart-card.types';
export {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardShell,
	CardTitle,
} from './partials/card-primitives';
export { SmartCardSkeleton } from './partials/smart-card-skeleton';
