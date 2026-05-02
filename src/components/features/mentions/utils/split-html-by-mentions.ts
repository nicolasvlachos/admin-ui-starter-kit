/**
 * Split an HTML string into a list of `html` chunks and `mention`
 * placeholders, keyed by the `data-ref-id` attribute the writer set.
 *
 * Used by `<MentionContent>` to render the body once with React chips
 * for the references and `dangerouslySetInnerHTML` for everything else.
 */
export type MentionHtmlSegment =
    | { kind: 'html'; value: string }
    | { kind: 'mention'; refId: string; fallback: string };

const MENTION_RE =
    /<(span|a)\b([^>]*?)data-ref-id\s*=\s*"([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/gi;

export function splitHtmlByMentions(html: string): MentionHtmlSegment[] {
    if (!html) return [];

    const segments: MentionHtmlSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    MENTION_RE.lastIndex = 0;

    while ((match = MENTION_RE.exec(html)) !== null) {
        const [full, , , refId] = match;
        const before = html.slice(lastIndex, match.index);
        if (before.length > 0) {
            segments.push({ kind: 'html', value: before });
        }
        segments.push({
            kind: 'mention',
            refId,
            fallback: full,
        });
        lastIndex = match.index + full.length;
    }

    const tail = html.slice(lastIndex);
    if (tail.length > 0) {
        segments.push({ kind: 'html', value: tail });
    }

    return segments;
}
