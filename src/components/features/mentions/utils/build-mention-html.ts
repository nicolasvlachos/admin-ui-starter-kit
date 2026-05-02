import type { Mention, MentionTone } from '../mentions.types';

/**
 * Serialize a `Mention` into the HTML span that gets inserted into a
 * rich-text body. The structure mirrors `<MentionChip>` so the editor
 * can style it via `[data-ref-id]` selectors (see App.css `.ProseMirror
 * [data-ref-id]` rules) and the read-time renderer (`<MentionContent>`)
 * can find it again.
 *
 *   <span class="rsc-mention" data-ref-id="kind:id" data-ref-kind="kind"
 *         data-ref-tone="info" contenteditable="false">@Maria Petrova</span>&nbsp;
 *
 * `data-ref-tone` is what drives the badge colour in both the editor
 * (CSS-only, since contenteditable can't host React) and the read-time
 * renderer (which respects it as a hint when the resource registry
 * isn't available).
 *
 * `contenteditable="false"` tells the browser to treat the chip as an
 * atomic glyph — backspace deletes the whole span, the cursor moves
 * past it, and the inner label can't be edited character-by-character.
 */
export function buildMentionHtml<TKind extends string = string>(
    mention: Mention<TKind>,
    options?: { triggerChar?: string; tone?: MentionTone },
): string {
    const safeLabel = String(mention.label ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    const id = String(mention.id).replace(/"/g, '&quot;');
    const kind = String(mention.kind).replace(/"/g, '&quot;');
    const tone = options?.tone ? String(options.tone).replace(/"/g, '&quot;') : '';
    const trigger =
        options?.triggerChar ?? (mention.kind === 'user' ? '@' : '');
    const toneAttr = tone ? ` data-ref-tone="${tone}"` : '';
    return (
        `<span class="rsc-mention" data-ref-id="${id}" data-ref-kind="${kind}"${toneAttr} contenteditable="false">` +
        `${trigger}${safeLabel}` +
        `</span>&nbsp;`
    );
}
