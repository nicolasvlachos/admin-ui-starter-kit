/** HeaderSearch — framework-neutral search trigger with optional Cmd/Ctrl+K. */
import { useMemo } from 'react';
import { Command, Search } from 'lucide-react';

import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { useCommandShortcut } from '../../hooks';
import {
	defaultHeaderSearchStrings,
	type HeaderSearchProps,
} from '../header.types';

function detectMac(): boolean {
	if (typeof navigator === 'undefined') return false;
	const ua = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
	if (ua?.platform) return ua.platform === 'macOS';
	return /Mac|iPhone|iPad/.test(navigator.platform);
}

export function HeaderSearch({
	onOpen,
	isMac,
	enableShortcut = true,
	strings: stringsProp,
	className,
	iconClassName,
	shortcutSlot,
}: HeaderSearchProps) {
	const strings = useStrings(defaultHeaderSearchStrings, stringsProp);
	const isMacResolved = useMemo(() => isMac ?? detectMac(), [isMac]);
	useCommandShortcut({ key: 'k', enabled: enableShortcut, onTrigger: onOpen });

	const shortcutTitle = isMacResolved ? strings.shortcutMac : strings.shortcutPc;
	const shortcut = shortcutSlot ?? (
		<kbd className="hidden h-5 shrink-0 items-center gap-1 rounded bg-muted px-1.5 font-mono text-xxs text-muted-foreground lg:inline-flex dark:bg-muted/20">
			{isMacResolved ? (
				<>
					<Command className="size-3 dark:text-muted/60" aria-hidden="true" />
					<Text tag="span" size="xs" className="dark:text-muted/60">K</Text>
				</>
			) : (
				<Text tag="span" size="xs" className="dark:text-muted/60">Ctrl+K</Text>
			)}
		</kbd>
	);

	return (
		<Button
			type="button"
			variant="secondary"
			buttonStyle="outline"
			onClick={onOpen}
			className={cn(
				'h-8 w-full min-w-[205px] justify-start gap-2 rounded-lg border-input bg-background px-2.5 shadow-none hover:bg-accent/50',
				'dark:border-topbar-accent/80 dark:bg-topbar-accent/40',
				className,
			)}
			title={shortcutTitle}
		>
			<Search className={cn('size-3.5 shrink-0 text-muted-foreground dark:text-muted/60', iconClassName)} aria-hidden="true" />
			<Text tag="span" size="xs" type="secondary" className="flex-1 text-left dark:text-muted/60">
				{strings.placeholder}
			</Text>
			{shortcut}
			<span className="sr-only">{strings.placeholder}</span>
		</Button>
	);
}
