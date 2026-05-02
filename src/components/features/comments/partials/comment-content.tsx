import type { ReactNode } from 'react';
import { Fragment, createElement } from 'react';

import { Heading, Text } from '@/components/typography';
import type { HeadingProps } from '@/components/typography';
import { MentionContent } from '@/components/features/mentions';

import type {
    CommentData,
    CommentUser,
    CommentsConfig,
    CommentsSlots,
} from '../comments.types';

interface CommentContentProps<TResource extends string = string> {
    comment: CommentData<CommentUser, unknown, TResource>;
    /** Resource registry — passed through to `<MentionContent>`. */
    resources?: CommentsConfig<CommentUser, unknown, TResource>['resources'];
    renderReference?: CommentsSlots<
        CommentUser,
        unknown,
        TResource
    >['renderReference'];
    /** Optional sanitizer applied to HTML before rendering. */
    sanitizer?: (html: string) => string;
}

/**
 * `renderCommentContent` — backwards-compatible export that renders only
 * the comment body text (no references resolution). Use the
 * `<CommentContent>` component below for the full feature surface.
 */
export function renderCommentContent<TResource extends string = string>(
    comment: CommentData<CommentUser, unknown, TResource>,
): ReactNode {
    return <CommentContent comment={comment} />;
}

export function CommentContent<TResource extends string = string>(
    props: CommentContentProps<TResource>,
): ReactNode {
    const { comment, resources, renderReference, sanitizer } = props;
    const contentType =
        comment.contentType ??
        (comment as Record<string, unknown>).content_type ??
        'text';

    if (contentType === 'rich') {
        return renderRichContent(comment.content);
    }

    if (contentType === 'html') {
        return (
            <MentionContent<TResource>
                html={comment.content ?? ''}
                mentions={comment.references}
                resources={resources}
                renderMention={renderReference}
                sanitizer={sanitizer}
            />
        );
    }

    const plainContent = decodeQuotedString(comment.content ?? '');

    return (
        <Text className="whitespace-pre-line">
            {plainContent}
        </Text>
    );
}

/* ------------------------------------------------------------------ */
/*  Rich-block renderer (legacy "rich" content type)                   */
/* ------------------------------------------------------------------ */

function renderRichContent(rawContent: string | null | undefined): ReactNode {
    if (!rawContent) return null;

    try {
        const parsed = JSON.parse(rawContent) as {
            blocks?: Array<{ id?: string; type: string; data?: Record<string, unknown> }>;
        };

        if (!parsed || !Array.isArray(parsed.blocks) || parsed.blocks.length === 0) {
            return null;
        }

        return (
            <div className="prose prose-sm prose-p:my-0.5 prose-headings:my-1 prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none space-y-1">
                {parsed.blocks.map((block, index) => (
                    <Fragment key={block.id ?? `${block.type}-${index}`}>
                        {renderRichBlock(block)}
                    </Fragment>
                ))}
            </div>
        );
    } catch {
        const decoded = decodeQuotedString(rawContent);
        return (
            <Text className="whitespace-pre-line">
                {decoded}
            </Text>
        );
    }
}

function renderRichBlock(block: { type: string; data?: Record<string, unknown> }): ReactNode {
    const data = block.data ?? {};

    switch (block.type) {
        case 'paragraph': {
            const raw = String(data.text ?? '').trim();
            if (!raw) return null;
            return <Text asHTML content={raw} />;
        }
        case 'header': {
            const text = stripHtml(String(data.text ?? ''));
            const level = Number(data.level ?? 3);
            if (!text) return null;
            const safeLevel = Math.min(Math.max(level, 1), 6);
            return createElement(
                Heading,
                { tag: `h${safeLevel}` as HeadingProps['tag'] },
                text,
            );
        }
        case 'list': {
            const items = Array.isArray(data.items) ? data.items : [];
            const sanitizedItems = items
                .map((item) => stripHtml(String(item ?? '')))
                .filter((item) => item.length > 0);

            if (sanitizedItems.length === 0) return null;

            if (data.style === 'ordered') {
                return (
                    <ol className="ml-6 list-decimal space-y-1 text-sm">
                        {sanitizedItems.map((item, index) => (
                            <li key={`${item}-${index}`}>{item}</li>
                        ))}
                    </ol>
                );
            }

            return (
                <ul className="ml-6 list-disc space-y-1 text-sm">
                    {sanitizedItems.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            );
        }
        case 'quote': {
            const text = String(data.text ?? '').trim();
            if (!text) return null;
            const caption = stripHtml(String(data.caption ?? ''));
            return (
                <blockquote className="border-muted text-muted-foreground border-l-2 pl-3 text-sm italic">
                    <Text asHTML content={text} />
                    {caption.length > 0 && (
                        <cite className="text-muted-foreground/80 mt-1 block text-xs not-italic">
                            — {caption}
                        </cite>
                    )}
                </blockquote>
            );
        }
        case 'delimiter':
            return (
                <div
                    className="border-muted my-4 border-b border-dashed"
                    aria-hidden="true"
                />
            );
        default: {
            const text = stripHtml(String(data.text ?? ''));
            if (!text) return null;
            return (
                <Text className="whitespace-pre-line">
                    {text}
                </Text>
            );
        }
    }
}

function stripHtml(value: string): string {
    return value.replace(/<[^>]*>/g, '').trim();
}

function decodeQuotedString(value: string | null | undefined): string {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (trimmed === '') return '';
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) return trimmed;
    try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === 'string') return parsed;
    } catch {
        // ignore
    }
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1);
    }
    return trimmed;
}
