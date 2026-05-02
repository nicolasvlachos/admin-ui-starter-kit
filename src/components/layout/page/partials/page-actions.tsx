/**
 * PageActions — composable action ribbon for page headers.
 *
 * Links go through `renderLink`, never router imports or DOM click hacks.
 * Use `renderAction` for app-specific rendering while keeping grouping,
 * filtering, breakpoint, and menu placement logic centralized.
 */
import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';

import { PageActionButton } from '@/components/base/buttons/page-action-button';
import { Separator } from '@/components/base/display/separator';
import { ActionMenu } from '@/components/base/navigation/action-menu';
import {
	DropdownMenuItem,
	DropdownMenuLinkItem,
} from '@/components/base/navigation/dropdown-menu';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { useLayoutLinkRenderer } from '../../hooks';
import {
	defaultPageActionsStrings,
	type PageAction,
	type PageActionContext,
	type PageActionVariant,
	type PageActionsProps,
} from '../page.types';

const resolveBaseVariant = (
	variant: PageActionVariant | undefined,
): 'primary' | 'secondary' | 'error' => {
	if (variant === 'destructive') return 'error';
	if (variant === 'primary' || variant === 'success' || variant === 'warning') return 'primary';
	return 'secondary';
};

const PAGE_ACTIONS_MENU_CLASS = 'max-h-[80vh] overflow-y-auto overscroll-contain';
const DEFAULT_MAX_INLINE_ACTIONS = 4;

type PageActionEntry = {
	action: PageAction;
	index: number;
};

function renderInlineAction(
	action: PageAction,
	context: PageActionContext,
	renderAction?: PageActionsProps['renderAction'],
): ReactNode {
	if (action.visible === false) return null;
	if (action.element) return <div key={action.id ?? context.index}>{action.element}</div>;
	if (renderAction) return renderAction(action, context);

	const key = action.id ?? context.index;
	const disabled = !!action.disabled || !!action.loading;
	const Icon = action.icon;
	const button = (
		<PageActionButton
			key={key}
			variant={resolveBaseVariant(action.variant)}
			onClick={action.onClick}
			disabled={disabled}
		>
			{!!Icon && <Icon className="size-3.5" aria-hidden="true" />}
			{action.label}
		</PageActionButton>
	);

	if (action.href && !action.onClick) {
		return context.renderLink({
			href: action.href,
			children: button,
			className: 'inline-flex',
			target: action.target,
			rel: action.rel,
			external: action.external,
			disabled,
		});
	}

	return button;
}

function renderMenuItems(
	entries: PageActionEntry[],
	contextBase: Omit<PageActionContext, 'index' | 'isInline'>,
	renderAction?: PageActionsProps['renderAction'],
): ReactNode[] {
	const items: ReactNode[] = [];
	let currentGroup: string | null = null;

	entries.forEach(({ action, index }) => {
		const context: PageActionContext = { ...contextBase, index, isInline: false };
		const nextGroup = action.group ?? null;
		const groupChanged = nextGroup !== currentGroup;

		if (items.length > 0 && groupChanged) {
			items.push(
				<Separator
					key={`sep-${currentGroup ?? 'root'}-${nextGroup ?? 'root'}-${action.id ?? index}`}
					className="my-1"
				/>,
			);
		}

		if (groupChanged) {
			currentGroup = nextGroup;
			if (nextGroup) {
				items.push(
					<div key={`group-${nextGroup}-${action.id ?? index}`} className="px-2 pt-1">
						<Text
							size="xxs"
							weight="semibold"
							type="secondary"
							className="uppercase tracking-wider"
						>
							{nextGroup}
						</Text>
					</div>,
				);
			}
		}

		if (action.element) {
			items.push(<div key={action.id ?? index}>{action.element}</div>);
			return;
		}

		if (renderAction) {
			items.push(<div key={action.id ?? index}>{renderAction(action, context)}</div>);
			return;
		}

		const Icon = action.icon;
		const disabled = !!action.disabled || !!action.loading;
		const children = (
			<>
				{!!Icon && <Icon className="size-3.5" aria-hidden="true" />}
				{typeof action.label === 'string' ? (
					<Text tag="span" size="xs" className="text-inherit">
						{action.label}
					</Text>
				) : action.label}
			</>
		);

		const itemClassName = cn(
			'gap-1.5 px-2 py-1.5 text-xs',
			action.variant === 'destructive' && 'text-destructive focus-visible:text-destructive',
		);

		if (action.href && !action.onClick && !disabled) {
			items.push(
				<DropdownMenuLinkItem
					key={action.id ?? index}
					href={action.href}
					className={itemClassName}
					render={(props) =>
						context.renderLink({
							...props,
							href: action.href,
							children: props.children,
							target: action.target,
							rel: action.rel,
							external: action.external,
						}) as React.ReactElement
					}
				>
					{children}
				</DropdownMenuLinkItem>,
			);
			return;
		}

		items.push(
			<DropdownMenuItem
				key={action.id ?? index}
				disabled={disabled}
				onClick={action.onClick}
				className={itemClassName}
			>
				{children}
			</DropdownMenuItem>,
		);
	});

	return items;
}

export function PageActions({
	actions,
	display = 'dropdown',
	breakpoint = 1040,
	maxInlineActions = DEFAULT_MAX_INLINE_ACTIONS,
	renderLink,
	LinkComponent,
	strings: stringsProp,
	className,
	inlineClassName,
	menuClassName,
	renderAction,
}: PageActionsProps) {
	const strings = useStrings(defaultPageActionsStrings, stringsProp);
	const resolvedRenderLink = useLayoutLinkRenderer({ renderLink, LinkComponent });

	const filtered = useMemo<PageActionEntry[]>(
		() => (actions ?? [])
			.map((action, index) => ({ action, index }))
			.filter(({ action }) => action.visible !== false),
		[actions],
	);

	const [isNarrow, setIsNarrow] = useState(false);
	useEffect(() => {
		if (display !== 'auto' || typeof window === 'undefined') return;

		const check = () => setIsNarrow(window.innerWidth <= breakpoint);
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, [display, breakpoint]);

	if (filtered.length === 0) return null;

	const inlineContextBase = { renderLink: resolvedRenderLink };
	const inlineClass = cn('flex items-center gap-2', inlineClassName, className);
	const menuContentClass = cn(PAGE_ACTIONS_MENU_CLASS, menuClassName);

	if (display === 'dropdown' || (display === 'auto' && isNarrow)) {
		return (
			<ActionMenu
				icon={MoreHorizontal}
				srText={strings.menuLabel}
				align="end"
				closeOnSelect
				contentClassName={menuContentClass}
			>
				{renderMenuItems(filtered, inlineContextBase, renderAction)}
			</ActionMenu>
		);
	}

	const inlineLimit = Math.max(0, maxInlineActions);
	const inlineCandidates = filtered.filter(({ action }) => (action.placement ?? 'auto') !== 'menu');
	const inline = inlineCandidates.slice(0, inlineLimit);
	const overflow = inlineCandidates.slice(inlineLimit);
	const menu = [
		...overflow,
		...filtered.filter(({ action }) => (action.placement ?? 'auto') === 'menu'),
	];

	return (
		<div className={inlineClass}>
			{inline.map((action) => (
				<Fragment key={action.action.id ?? action.index}>
					{renderInlineAction(
						action.action,
						{ ...inlineContextBase, index: action.index, isInline: true },
						renderAction,
					)}
				</Fragment>
			))}
			{menu.length > 0 && (
				<ActionMenu
					icon={MoreHorizontal}
					srText={strings.menuLabel}
					align="end"
					closeOnSelect
					contentClassName={menuContentClass}
				>
					{renderMenuItems(menu, inlineContextBase, renderAction)}
				</ActionMenu>
			)}
		</div>
	);
}
