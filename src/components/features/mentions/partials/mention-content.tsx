/**
 * MentionContent — render an HTML body that may contain inline mention
 * spans (`<span data-ref-id="kind:id">…</span>`) by swapping each ref
 * for a React `<MentionChip>` while leaving the rest of the HTML
 * untouched.
 *
 * Used by:
 *   - `features/comments` — comment bodies
 *   - `features/event-log` — event descriptions
 *   - any other surface that renders rich-text with embedded refs
 *
 * Consumer can override per-mention rendering via `renderMention`, or
 * per-kind via the resource registry's `renderChip`.
 */
import { Fragment } from 'react';
import type { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

import type {
    Mention,
    MentionResource,
    MentionsConfig,
} from '../mentions.types';
import { splitHtmlByMentions } from '../utils/split-html-by-mentions';
import { MentionChip } from './mention-chip';

export interface MentionContentProps<TResource extends string = string> {
    /** HTML body to render. */
    html: string;
    /** Mentions resolved on the data — keyed by `data-ref-id`. */
    mentions?: ReadonlyArray<Mention<TResource>>;
    /** Resource registry — pass at the call site. */
    resources?: MentionsConfig<TResource>['resources'];
    /** Custom per-mention renderer — overrides resource.renderChip. */
    renderMention?: (mention: Mention<TResource>) => ReactNode;
    /** Optional sanitizer applied to HTML before rendering. */
    sanitizer?: (html: string) => string;
    /** Outer wrapper class. Defaults to a tight prose surface. */
    className?: string;
    /**
     * Set to `false` to skip the default prose wrapper — useful when
     * embedding inside an existing typed surface (e.g. timeline rows).
     */
    prose?: boolean;
}

const DEFAULT_PROSE_CLASS =
    'prose prose-sm prose-p:my-0.5 prose-p:leading-relaxed prose-headings:my-1 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-ul:my-0.5 prose-ol:my-0.5 prose-li:my-0.5 max-w-none';

export function MentionContent<TResource extends string = string>(
    props: MentionContentProps<TResource>,
): ReactNode {
    const {
        html,
        mentions,
        resources: resourcesProp,
        renderMention,
        sanitizer,
        className,
        prose = true,
    } = props;

    const resources = resourcesProp;

    const sanitized = sanitizer ? sanitizer(html ?? '') : (html ?? '');

    const mentionsById = new Map<string, Mention<TResource>>();
    for (const m of mentions ?? []) mentionsById.set(m.id, m);

    const hasMentions = mentionsById.size > 0;
    const segments = hasMentions
        ? splitHtmlByMentions(sanitized)
        : [{ kind: 'html' as const, value: sanitized }];

    const renderRef = (mention: Mention<TResource>): ReactNode => {
        if (renderMention) return renderMention(mention);
        const resource = resources?.[mention.kind] as
            | MentionResource<string>
            | undefined;
        return <MentionChip mention={mention} resource={resource} />;
    };

    const body = segments.map((segment, index) => {
        if (segment.kind === 'mention') {
            const mention = mentionsById.get(segment.refId);
            if (!mention) {
                return (
                    <span
                        key={`fallback-${index}`}
                        dangerouslySetInnerHTML={{ __html: segment.fallback }}
                    />
                );
            }
            return (
                <Fragment key={`ref-${index}-${segment.refId}`}>
                    {renderRef(mention)}
                </Fragment>
            );
        }
        // Render the HTML segment directly. The lib's `Text asHTML` escapes
        // via a strict sanitiser — bypass it for trusted editor output.
        // Consumers must pass `sanitizer` for untrusted content.
        return (
            <span
                key={`html-${index}`}
                dangerouslySetInnerHTML={{ __html: segment.value }}
            />
        );
    });

    if (!prose) {
        return <>{body}</>;
    }

    return (
        <div className={cn(DEFAULT_PROSE_CLASS, className)}>{body}</div>
    );
}

/** FC alias for callsites that prefer the `<MentionContent>` element form. */
export const MentionContentComponent: FC<MentionContentProps> = (props) => (
    <MentionContent {...props} />
);
