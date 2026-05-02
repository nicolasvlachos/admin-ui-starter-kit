/**
 * Pure-function tests for the mentions utilities. Verifies the HTML
 * serialization round-trips cleanly so consumers can persist and re-
 * render references without losing data, special chars, or order.
 */
import { describe, expect, it } from 'vitest';

import {
    buildMentionHtml,
    parseMentionsFromHtml,
    splitHtmlByMentions,
} from '../utils';
import type { Mention } from '../mentions.types';

const MARIA: Mention = {
    id: 'user:maria',
    kind: 'user',
    label: 'Maria Petrova',
    href: '/people/maria',
};

const BOOKING: Mention = {
    id: 'booking:BKG-2026-0408',
    kind: 'booking',
    label: 'BKG-2026-0408',
};

describe('buildMentionHtml', () => {
    it('emits a `rsc-mention` span carrying data-ref-id, data-ref-kind, contenteditable=false, with trailing nbsp', () => {
        const html = buildMentionHtml(MARIA);
        expect(html).toContain('class="rsc-mention"');
        expect(html).toContain('data-ref-id="user:maria"');
        expect(html).toContain('data-ref-kind="user"');
        expect(html).toContain('contenteditable="false"');
        expect(html).toMatch(/<\/span>&nbsp;$/);
    });

    it('defaults to "@" prefix for user kind and no prefix otherwise', () => {
        expect(buildMentionHtml(MARIA)).toContain('>@Maria Petrova<');
        expect(buildMentionHtml(BOOKING)).toContain('>BKG-2026-0408<');
    });

    it('honours an explicit triggerChar override', () => {
        expect(
            buildMentionHtml(BOOKING, { triggerChar: '#' }),
        ).toContain('>#BKG-2026-0408<');
    });

    it('writes data-ref-tone when a tone option is provided', () => {
        const html = buildMentionHtml(BOOKING, { tone: 'success' });
        expect(html).toContain('data-ref-tone="success"');
    });

    it('omits data-ref-tone when no tone is provided', () => {
        expect(buildMentionHtml(MARIA)).not.toContain('data-ref-tone');
    });

    it('escapes HTML-special chars in the label', () => {
        const evil: Mention = {
            id: 'user:x',
            kind: 'user',
            label: '<script>alert("x")</script>',
        };
        const html = buildMentionHtml(evil);
        expect(html).not.toMatch(/<script[\s>]/i);
        expect(html).toContain('&lt;script&gt;');
        // The label's quote is left verbatim (`alert("x")`) — buildMentionHtml
        // escapes only `&`, `<`, `>` inside text content. Quotes inside text
        // are safe; quotes inside attribute values are escaped separately.
    });

    it('escapes double-quotes in the id attribute', () => {
        const tricky: Mention = {
            id: 'user:"weird"',
            kind: 'user' as const,
            label: 'Weird',
        };
        const html = buildMentionHtml(tricky);
        expect(html).toContain('data-ref-id="user:&quot;weird&quot;"');
    });
});

describe('splitHtmlByMentions', () => {
    it('returns a single html segment when no references are present', () => {
        const segments = splitHtmlByMentions('<p>Plain old text.</p>');
        expect(segments).toEqual([
            { kind: 'html', value: '<p>Plain old text.</p>' },
        ]);
    });

    it('splits an html string into html + mention + html chunks', () => {
        const html =
            '<p>Approving <span data-ref-id="user:maria" data-ref-kind="user">@Maria Petrova</span> on <span data-ref-id="booking:bkg-1" data-ref-kind="booking">BKG-1</span>.</p>';
        const segments = splitHtmlByMentions(html);
        expect(segments).toHaveLength(5);
        expect(segments[0]).toEqual({ kind: 'html', value: '<p>Approving ' });
        expect(segments[1]).toMatchObject({ kind: 'mention', refId: 'user:maria' });
        expect(segments[2]).toEqual({ kind: 'html', value: ' on ' });
        expect(segments[3]).toMatchObject({ kind: 'mention', refId: 'booking:bkg-1' });
        expect(segments[4]).toEqual({ kind: 'html', value: '.</p>' });
    });

    it('preserves the original tag in segment.fallback for unrecognised refs', () => {
        const tagText =
            '<span data-ref-id="custom:42" data-ref-kind="custom">Custom</span>';
        const segments = splitHtmlByMentions(tagText);
        const ref = segments.find((s) => s.kind === 'mention');
        if (!ref || ref.kind !== 'mention') throw new Error('expected mention segment');
        expect(ref.fallback).toBe(tagText);
    });
});

describe('parseMentionsFromHtml', () => {
    it('extracts every reference span/anchor as a Mention', () => {
        const html =
            '<span data-ref-id="user:maria" data-ref-kind="user">@Maria Petrova</span>&nbsp;and <a data-ref-id="booking:bkg-1" data-ref-kind="booking" href="#">BKG-1</a>.';
        const mentions = parseMentionsFromHtml(html);
        expect(mentions).toHaveLength(2);
        expect(mentions[0]).toEqual({
            id: 'user:maria',
            kind: 'user',
            label: 'Maria Petrova',
        });
        expect(mentions[1]).toEqual({
            id: 'booking:bkg-1',
            kind: 'booking',
            label: 'BKG-1',
        });
    });

    it('strips the leading trigger char and surrounding whitespace from the label', () => {
        const html =
            '<span data-ref-id="user:m" data-ref-kind="user">@Maria  </span>';
        const [m] = parseMentionsFromHtml(html);
        expect(m.label).toBe('Maria');
    });

    it('dedupes by id, preserving first occurrence', () => {
        const html =
            '<span data-ref-id="user:m" data-ref-kind="user">@First</span> ' +
            '<span data-ref-id="user:m" data-ref-kind="user">@Second</span>';
        const mentions = parseMentionsFromHtml(html);
        expect(mentions).toHaveLength(1);
        expect(mentions[0].label).toBe('First');
    });

    it('falls back to the kind portion of the id when data-ref-kind is missing', () => {
        const html = '<span data-ref-id="custom:42">Custom</span>';
        const [m] = parseMentionsFromHtml(html);
        expect(m.kind).toBe('custom');
    });

    it('returns an empty array for empty / null-ish input', () => {
        expect(parseMentionsFromHtml('')).toEqual([]);
    });

    it('round-trips: build → parse yields a structurally-equivalent mention', () => {
        const html = buildMentionHtml(MARIA) + buildMentionHtml(BOOKING);
        const parsed = parseMentionsFromHtml(html);
        expect(parsed.map((m) => m.id)).toEqual([MARIA.id, BOOKING.id]);
        expect(parsed.map((m) => m.kind)).toEqual([MARIA.kind, BOOKING.kind]);
        expect(parsed.map((m) => m.label)).toEqual([MARIA.label, BOOKING.label]);
    });
});
