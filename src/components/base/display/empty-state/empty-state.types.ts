import type { ReactNode } from 'react';

import type { StringsProp } from '@/lib/strings';

import type { EmptyStateStrings } from './empty-state.strings';

/**
 * Vertical breathing room.
 *
 * `compact` — for narrow surfaces (cards, side panels), `py-6` equivalent.
 * `base`    — default, `py-12` equivalent.
 * `loose`   — hero / full-page empty states, `py-16` equivalent.
 */
export type EmptyStatePadding = 'compact' | 'base' | 'loose';

/**
 * How the `media` slot renders.
 *
 * `none`         — render `media` raw (illustrations bring their own canvas).
 * `icon`         — wrap `media` in a 40px square with `bg-muted` rounded-lg
 *                  (good for a single Lucide icon).
 * `icon-soft`    — same as `icon` but with a softer tone wash; pairs with
 *                  `tone='muted'` for a calmer palette.
 * `illustration` — center an illustration with no chrome and a
 *                  comfortable max-width.
 */
export type EmptyStateMediaVariant = 'none' | 'icon' | 'icon-soft' | 'illustration';

/**
 * Render context passed to the `renderMedia` render-prop, useful for
 * consumers wanting to react to size / variant.
 */
export interface EmptyStateRenderMediaContext {
	mediaVariant: EmptyStateMediaVariant;
}

export interface EmptyStateProps {
	/**
	 * Headline — typically the resource name in negative form
	 * ("No products", "No invoices yet"). Falls back to `strings.title`.
	 */
	title?: ReactNode;
	/**
	 * Supporting description. Keep it to 1–2 sentences. Falls back to
	 * `strings.description`. Pass `false` to hide entirely (when the title
	 * alone tells the story).
	 */
	description?: ReactNode | false;
	/**
	 * The visual: an illustration (use `partials/illustrations/*` or your
	 * own SVG), a Lucide icon, or any ReactNode.
	 */
	media?: ReactNode;
	/**
	 * Controls the chrome around `media`. Defaults to `'none'`. See
	 * `EmptyStateMediaVariant`.
	 */
	mediaVariant?: EmptyStateMediaVariant;
	/**
	 * Render-prop alternative to `media` — receives a context so consumers
	 * can drive a fully custom illustration based on the variant.
	 */
	renderMedia?: (ctx: EmptyStateRenderMediaContext) => ReactNode;
	/**
	 * Primary actions (typically a `<Button>`) shown directly under the
	 * description. Pass an array to space them with `gap-2`.
	 */
	actions?: ReactNode;
	/**
	 * Secondary content under the actions — small text, learn-more link,
	 * keyboard hints, etc.
	 */
	footer?: ReactNode;
	/** Vertical breathing. Defaults to `'base'`. */
	padding?: EmptyStatePadding;
	/**
	 * `border` toggles the dashed-border look on/off. Defaults to `false`
	 * (no border) — reach for `true` when the empty state replaces a
	 * card body and you want the dashed-zone affordance.
	 */
	border?: boolean;
	className?: string;
	/** All copy is overridable via the strings prop, deep-merged. */
	strings?: StringsProp<EmptyStateStrings>;
	/**
	 * Optional aria-label on the wrapper. Defaults to `strings.ariaLabel`
	 * which itself defaults to "Empty state".
	 */
	ariaLabel?: string;
}
