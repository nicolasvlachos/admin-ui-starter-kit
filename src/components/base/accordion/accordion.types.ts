import type { ReactNode } from 'react';

import type { StringsProp } from '@/lib/strings';

import type { SmartAccordionStrings } from './accordion.strings';

/**
 * One section in a SmartAccordion. The shape is intentionally narrow —
 * for richer rows (multi-line metadata, custom layouts), drop down to the
 * compound-component API (`<Accordion>` + `<AccordionItem>` + …) and
 * compose freely.
 */
export interface SmartAccordionItem {
	/** Stable identifier — used as the `value` for the accordion item. */
	value: string;
	/** Header label. Renders inside `<Text weight="semibold">`. */
	title: ReactNode;
	/** Optional leading media: a Lucide icon node, custom illustration, … */
	icon?: ReactNode;
	/**
	 * Trailing badge (e.g. "New", "Beta", count). Pass any node — usually
	 * `<Badge variant="primary">New</Badge>` from `base/badge`.
	 */
	badge?: ReactNode;
	/** Body content, shown when the item is expanded. */
	content: ReactNode;
	/** Disable expanding/collapsing. */
	disabled?: boolean;
}

/**
 * Visual variant for the SmartAccordion shell.
 *
 * `card`     — the canonical admin treatment: each item is a separate
 *              card with `border-border bg-card rounded-md`, items spaced
 *              with `space-y-2`. Best for settings pages / FAQ lists.
 * `bordered` — single rounded shell that wraps every item; rows separated
 *              by a divider. Tighter visually, good for dense settings
 *              groups.
 * `flat`     — no chrome at all (consumer wraps it themselves).
 */
export type SmartAccordionVariant = 'card' | 'bordered' | 'flat';

/**
 * Whether the icon renders as a circular medallion (the user's
 * `bg-muted size-8 rounded-full` pattern) or unframed inline.
 */
export type SmartAccordionIconStyle = 'medallion' | 'inline' | 'none';

export interface SmartAccordionProps {
	items: SmartAccordionItem[];
	/**
	 * Allow multiple items expanded at once. Defaults to `false` (Radix
	 * single-mode behavior).
	 */
	multiple?: boolean;
	/** Initial expanded values (uncontrolled). Pass an array of `item.value`. */
	defaultValue?: string[];
	/** Controlled expanded values. */
	value?: string[];
	/** Change callback for controlled mode. */
	onValueChange?: (value: string[]) => void;
	/** Visual treatment. Defaults to `'card'`. */
	variant?: SmartAccordionVariant;
	/** How the leading icon is framed. Defaults to `'medallion'`. */
	iconStyle?: SmartAccordionIconStyle;
	className?: string;
	itemClassName?: string;
	triggerClassName?: string;
	contentClassName?: string;
	/** All copy is overridable via the strings prop. */
	strings?: StringsProp<SmartAccordionStrings>;
}
