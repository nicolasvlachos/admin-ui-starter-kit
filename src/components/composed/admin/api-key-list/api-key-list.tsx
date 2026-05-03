/**
 * ApiKeyList — collapsible section listing API keys / credentials with a
 * per-row dropdown menu (Copy / Delete) and an optional add-new action
 * in the header. Generic enough to use for any "named secret list":
 * service tokens, webhook URLs, deployment hooks, …
 *
 * Composes:
 *   - `base/display/collapsible`    (the shadcn-wrapped collapsible shell)
 *   - `base/cards/SmartCard`        (the surface chrome)
 *   - `base/buttons`, `base/badge`  (header actions, status pills)
 *   - `base/navigation/ActionMenu`  (per-row dropdown)
 *   - `base/copyable/Copyable`      (copy-to-clipboard with toast)
 *
 * Framework-agnostic — every action is callback-driven; the library
 * doesn't fetch, navigate, or render delete confirmations.
 */
import { ChevronRight, Copy, Lock, Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/base/display/collapsible';
import { ActionMenu, MenuAction } from '@/components/base/navigation/action-menu';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultApiKeyListStrings } from './api-key-list.strings';
import type { ApiKeyListItem, ApiKeyListProps } from './api-key-list.types';

export function ApiKeyList({
	items,
	defaultOpen = true,
	open,
	onOpenChange,
	onAdd,
	onDelete,
	onCopy,
	title,
	className,
	strings: stringsProp,
}: ApiKeyListProps) {
	const strings = useStrings(defaultApiKeyListStrings, stringsProp);
	const isControlled = open !== undefined;
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const expanded = isControlled ? open : internalOpen;

	const handleOpenChange = useCallback(
		(next: boolean) => {
			if (!isControlled) setInternalOpen(next);
			onOpenChange?.(next);
		},
		[isControlled, onOpenChange],
	);

	return (
		<SmartCard className={className}>
			<Collapsible open={expanded} onOpenChange={handleOpenChange}>
				<div className="flex items-center gap-2">
					<CollapsibleTrigger asChild>
						<button
							type="button"
							className="flex flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
						>
							<ChevronRight
								aria-hidden="true"
								className={cn(
									'size-4 text-muted-foreground transition-transform',
									expanded && 'rotate-90',
								)}
							/>
							<Text tag="span" weight="semibold">
								{title ?? strings.title}
							</Text>
						</button>
					</CollapsibleTrigger>
					{!!onAdd && (
						<Button
							variant="secondary"
							buttonStyle="ghost"
							onClick={onAdd}
							aria-label={strings.addAria}
						>
							<Plus className="size-4" />
						</Button>
					)}
				</div>
				<CollapsibleContent className="pt-3">
					{items.length === 0 ? (
						<Text type="secondary">
							{strings.emptyMessage}
						</Text>
					) : (
						<div className="flex flex-col gap-2.5">
							{items.map((item) => (
								<ApiKeyRow
									key={item.id}
									item={item}
									onDelete={onDelete}
									onCopy={onCopy}
									copyMenuLabel={strings.copyMenuItem}
									copiedMenuLabel={strings.copiedMenuItem}
									deleteMenuLabel={strings.deleteMenuItem}
									rowMenuAria={strings.rowMenuAria}
									copyToastSuccess={strings.copyToastSuccess}
									copyToastError={strings.copyToastError}
								/>
							))}
						</div>
					)}
				</CollapsibleContent>
			</Collapsible>
		</SmartCard>
	);
}

ApiKeyList.displayName = 'ApiKeyList';

interface ApiKeyRowProps {
	item: ApiKeyListItem;
	onDelete?: ApiKeyListProps['onDelete'];
	onCopy?: ApiKeyListProps['onCopy'];
	copyMenuLabel: string;
	copiedMenuLabel: string;
	deleteMenuLabel: string;
	rowMenuAria: string;
	copyToastSuccess: string;
	copyToastError: string;
}

function ApiKeyRow({
	item,
	onDelete,
	onCopy,
	copyMenuLabel,
	copiedMenuLabel,
	deleteMenuLabel,
	rowMenuAria,
	copyToastSuccess,
	copyToastError,
}: ApiKeyRowProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(item.value);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
			toast.success(copyToastSuccess);
			onCopy?.(item.id, item);
		} catch (err) {
			toast.error(copyToastError);
			if (import.meta.env?.DEV) {
				console.warn('[ApiKeyList] copy failed', err);
			}
		}
	}, [item, onCopy, copyToastSuccess, copyToastError]);

	const display = item.displayValue ?? item.value;

	return (
		<div className="flex items-center justify-between gap-3" data-slot="api-key-row">
			<div className="flex min-w-0 flex-1 items-center gap-2.5">
				<span
					aria-hidden="true"
					className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-border/60 bg-muted text-success"
				>
					{item.icon ?? <Lock className="size-3.5" />}
				</span>
				<Text tag="span" size="xs" weight="medium" className="w-16 shrink-0 truncate">
					{item.name}
				</Text>
				<span className="min-w-0 flex-1 truncate rounded-sm bg-muted px-2 py-1 font-mono text-xs">
					{display}
				</span>
			</div>
			<ActionMenu
				srText={rowMenuAria}
				align="end"
				closeOnSelect
				buttonProps={{ buttonStyle: 'ghost', variant: 'secondary' }}
			>
				<MenuAction
					label={copied ? copiedMenuLabel : copyMenuLabel}
					icon={Copy}
					onClick={() => {
						void handleCopy();
					}}
					disabled={item.disabled}
				/>
				{!!onDelete && (
					<MenuAction
						label={deleteMenuLabel}
						icon={Trash2}
						variant="error"
						disabled={item.disabled}
						onClick={() => onDelete(item.id, item)}
					/>
				)}
			</ActionMenu>
		</div>
	);
}

ApiKeyRow.displayName = 'ApiKeyRow';
