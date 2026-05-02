/**
 * Walk an HTML string and extract `data-ref-id="kind:id"` spans /
 * anchors as a list of `Mention` records. Used by the comment composer
 * to keep its `mentions` state in sync with what's actually present in
 * the editor — when the user backspaces a chip out of the body, the
 * draft's mentions list shrinks too.
 *
 * The output preserves first-occurrence order and deduplicates by id.
 * Caller can merge the resulting Mentions with previously known ones to
 * preserve `href` / `data` payloads that aren't expressible in HTML.
 */
import type { Mention } from '../mentions.types';

const REF_RE =
    /<(?:span|a)\b[^>]*?data-ref-id\s*=\s*"([^"]+)"[^>]*?>([\s\S]*?)<\/(?:span|a)>/gi;
const KIND_ATTR_RE = /data-ref-kind\s*=\s*"([^"]+)"/i;

export function parseMentionsFromHtml<TKind extends string = string>(
    html: string,
): Array<Mention<TKind>> {
    const out: Mention<TKind>[] = [];
    if (!html) return out;

    const seen = new Set<string>();
    let match: RegExpExecArray | null;
    REF_RE.lastIndex = 0;

    while ((match = REF_RE.exec(html)) !== null) {
        const [tagText, id, inner] = match;
        if (seen.has(id)) continue;
        seen.add(id);

        const kindMatch = tagText.match(KIND_ATTR_RE);
        const kind = (kindMatch?.[1] ?? id.split(':')[0] ?? '') as TKind;
        const label = (inner ?? '')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/^[@#$&%!~]\s*/, '')
            .trim();

        out.push({ id, kind, label });
    }

    return out;
}
