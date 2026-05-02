/**
 * MentionChip — default rendering for an inline mention/reference.
 *
 * Wraps the lib's `<Badge>` base component with the variant driven by
 * the resource registry's `tone` field. The mapping between the
 * mentions module's `MentionTone` and the badge's variant lives below
 * (`TONE_TO_VARIANT`) so consumers can rebrand by editing one table.
 *
 * Override paths:
 *   - `renderMention` on `<MentionContent>` — full takeover
 *   - `resources.<kind>.renderChip(mention)` — per-kind takeover
 *   - `resources.<kind>.tone` — quickest "just change the color" override
 */
import type { FC, ReactNode } from 'react';

import { Badge, type ComposedBadgeVariant } from '@/components/base/badge';
import { cn } from '@/lib/utils';

import type {
    Mention,
    MentionResource,
    MentionTone,
} from '../mentions.types';

export interface MentionChipProps {
    mention: Mention;
    resource?: MentionResource<string>;
    /** Force-disable the chip's link (useful inside the composer draft list). */
    asLink?: boolean;
    onClick?: () => void;
    /** Trailing slot — typically a remove button when shown in the composer. */
    trailing?: ReactNode;
    className?: string;
}

/**
 * Single source of truth for `MentionTone → Badge variant`. Edit here
 * to rebrand all chips library-wide; override per-kind via
 * `resources.<kind>.tone`.
 */
const TONE_TO_VARIANT: Record<MentionTone, ComposedBadgeVariant> = {
    primary: 'secondary', // calm primary — saturated `primary` overwhelms body copy
    success: 'success',
    warning: 'warning',
    destructive: 'destructive',
    info: 'info',
    secondary: 'secondary',
};

export const MentionChip: FC<MentionChipProps> = ({
    mention,
    resource,
    asLink = true,
    onClick,
    trailing,
    className,
}) => {
    if (resource?.renderChip) {
        return <>{resource.renderChip(mention)}</>;
    }

    const tone = resource?.tone ?? 'secondary';
    const variant = TONE_TO_VARIANT[tone] ?? TONE_TO_VARIANT.secondary;
    const Icon = resource?.icon;

    const inner = (
        <Badge
            variant={variant}
            inline
            data-ref-id={mention.id}
            data-ref-kind={mention.kind}
            className={cn(
                /* Inline-flow tweaks: align to the surrounding text baseline
                   instead of the line's mid-point, which causes wobble next
                   to text. Keep the badge as `inline-flex` (from `inline`),
                   add a subtle vertical offset via translate so the icon
                   sits on the cap-height. */
                'align-[-0.15em] cursor-default whitespace-nowrap',
                className,
            )}
        >
            {Icon ? <Icon className="size-3 shrink-0" aria-hidden /> : null}
            <span className="truncate max-w-[14rem]">{mention.label}</span>
            {trailing}
        </Badge>
    );

    if (asLink && mention.href) {
        return (
            <a
                href={mention.href}
                target="_blank"
                rel="noreferrer noopener"
                onClick={onClick}
                className="inline align-baseline no-underline hover:opacity-90"
            >
                {inner}
            </a>
        );
    }

    if (onClick) {
        return (
            <span onClick={onClick} className="inline align-baseline">
                {inner}
            </span>
        );
    }

    return inner;
};
