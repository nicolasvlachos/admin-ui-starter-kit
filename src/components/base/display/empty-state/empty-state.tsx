/**
 * EmptyState — the canonical zero-data surface for any list, table, or
 * collection in the library. Wraps the shadcn `ui/empty` primitive
 * (rule 1, rule 12) and applies our typography, density, and tokens:
 *
 * - Headline through `<Heading tag="h3">` (admin scale, no marketing inflation)
 * - Description through `<Text size="xs" type="secondary">` — matches
 *   the four sibling empty-states across the library
 * - Padding presets driven by props, not arbitrary literals
 * - Optional dashed-border affordance for "this slot is a drop zone"
 *
 * Composability:
 * - Slots: `media`, `actions`, `footer`
 * - Render-prop: `renderMedia(ctx)` for fully custom illustrations
 * - Strings: every piece of copy is overridable via `strings`
 *
 * The library ships a small illustration set under
 * `./partials/illustrations/*` — import explicitly per resource:
 *
 *     import { StackedCardsIllustration } from
 *       '@/components/base/display/empty-state/partials/illustrations';
 *
 * Adaptive shape per resource: pass a different `media` per surface.
 * Don't fork the component.
 */
import { Heading, Text } from '@/components/typography';
import {
	Empty,
	EmptyContent,
	EmptyHeader,
	EmptyMedia,
} from '@/components/ui/empty';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultEmptyStateStrings } from './empty-state.strings';
import type {
	EmptyStateMediaVariant,
	EmptyStatePadding,
	EmptyStateProps,
} from './empty-state.types';

const PADDING_CLASS: Record<EmptyStatePadding, string> = {
	compact: 'py-6',
	base: 'py-12',
	loose: 'py-16',
};

const MEDIA_VARIANT_TO_PRIMITIVE: Record<EmptyStateMediaVariant, 'default' | 'icon'> = {
	none: 'default',
	icon: 'icon',
	'icon-soft': 'icon',
	illustration: 'default',
};

const MEDIA_EXTRA_CLASS: Record<EmptyStateMediaVariant, string | undefined> = {
	none: undefined,
	icon: undefined,
	'icon-soft': 'bg-muted/40 text-muted-foreground',
	illustration: 'mb-4',
};

export function EmptyState({
	title,
	description,
	media,
	mediaVariant = 'none',
	renderMedia,
	actions,
	footer,
	padding = 'base',
	border = false,
	className,
	strings: stringsProp,
	ariaLabel,
}: EmptyStateProps) {
	const strings = useStrings(defaultEmptyStateStrings, stringsProp);

	const resolvedTitle = title ?? strings.title;
	const resolvedDescription =
		description === false ? null : description ?? strings.description;
	const mediaNode = renderMedia ? renderMedia({ mediaVariant }) : media;
	const showMedia = !!mediaNode;

	return (
		<Empty
			role="status"
			aria-label={ariaLabel ?? strings.ariaLabel}
			className={cn(
				PADDING_CLASS[padding],
				border ? 'border border-dashed' : 'border-0',
				className,
			)}
		>
			<EmptyHeader>
				{!!showMedia && (
					<EmptyMedia
						variant={MEDIA_VARIANT_TO_PRIMITIVE[mediaVariant]}
						className={MEDIA_EXTRA_CLASS[mediaVariant]}
					>
						{mediaNode}
					</EmptyMedia>
				)}
				<Heading tag="h3" className="border-0 pb-0 text-base" data-slot="empty-title">
					{resolvedTitle}
				</Heading>
				{!!resolvedDescription && (
					<Text
						size="xs"
						type="secondary"
						className="leading-relaxed [&>a]:text-primary [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:no-underline"
						data-slot="empty-description"
					>
						{resolvedDescription}
					</Text>
				)}
			</EmptyHeader>
			{(!!actions || !!footer) && (
				<EmptyContent>
					{!!actions && (
						<div className="flex flex-wrap items-center justify-center gap-2">
							{actions}
						</div>
					)}
					{!!footer && <div className="text-xs text-muted-foreground">{footer}</div>}
				</EmptyContent>
			)}
		</Empty>
	);
}

EmptyState.displayName = 'EmptyState';
