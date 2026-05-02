import type { ReactNode } from 'react';

import type { StringsProp } from '@/lib/strings';

import type { ApiKeyListStrings } from './api-key-list.strings';

/**
 * One credential / API key in an `<ApiKeyList>`.
 *
 * The shape is intentionally generic — consumers map their backend
 * model into this. `value` is whatever you want copied to the clipboard;
 * `displayValue` is what gets rendered in the row (often masked).
 */
export interface ApiKeyListItem {
	/** Stable id used for keys + delete callbacks. */
	id: string;
	/** Short label for the credential ("Production", "Development"). */
	name: string;
	/** Raw secret to copy to the clipboard on the Copy action. */
	value: string;
	/**
	 * Rendered representation in the row. Defaults to `value` — pass a
	 * masked variant (`'·····2A4D'`) when you don't want to display the
	 * full secret.
	 */
	displayValue?: string;
	/** Optional per-item icon override (defaults to a Lock). */
	icon?: ReactNode;
	/** Disable the per-item dropdown when true. */
	disabled?: boolean;
}

export interface ApiKeyListProps {
	items: ApiKeyListItem[];
	/**
	 * Whether the section is initially expanded. Uncontrolled — the
	 * collapsible state is owned by the component.
	 */
	defaultOpen?: boolean;
	/** Controlled open state. */
	open?: boolean;
	/** Open-state change callback for controlled mode. */
	onOpenChange?: (open: boolean) => void;
	/** Add-new-key click handler. When omitted the add button is hidden. */
	onAdd?: () => void;
	/** Per-item delete handler. When omitted the Delete menu item is hidden. */
	onDelete?: (id: string, item: ApiKeyListItem) => void;
	/**
	 * Per-item copy callback fired AFTER the value has been written to the
	 * clipboard — useful for analytics. The library handles the actual
	 * write via `base/copyable`.
	 */
	onCopy?: (id: string, item: ApiKeyListItem) => void;
	/** Optional title override (defaults to `strings.title`). */
	title?: ReactNode;
	className?: string;
	strings?: StringsProp<ApiKeyListStrings>;
}
