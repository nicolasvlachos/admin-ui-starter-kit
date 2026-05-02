/**
 * EventLog preview — demonstrates the unified `<EventLog>` feature.
 * Shows comments + audit events + system messages
 * mixed under one chronological surface, all using the shared
 * `features/mentions` registry for inline `@user` / `#booking` /
 * `$order` references.
 */
import {
    Bell,
    CalendarRange,
    CheckCircle2,
    CreditCard,
    GitBranch,
    Package,
    ShieldAlert,
    User,
} from 'lucide-react';
import { useState } from 'react';

import {
    EventLog,
    type EventLogEntry,
} from '@/components/features/event-log';
import {
    type CommentFormValues,
    type CommentSubmitHelpers,
} from '@/components/features/comments';
import {
    type MentionResource,
    type MentionSuggestion,
} from '@/components/features/mentions';
import { Text } from '@/components/typography';

import { PreviewPage, PreviewSection } from '../../PreviewLayout';

/* ------------------------------------------------------------------ */
/*  Resource registry — same shape as the comments demo               */
/* ------------------------------------------------------------------ */

type ResourceKind = 'user' | 'booking' | 'order' | 'sprint';

const PEOPLE: MentionSuggestion<ResourceKind>[] = [
    { id: 'maria', label: 'Sarah Smitha', description: 'Head of Operations', kind: 'user' },
    { id: 'ivana', label: 'Davida Todorova', description: 'Refunds Specialist', kind: 'user' },
    { id: 'stefan', label: 'Daniel Kowalski', description: 'Customer', kind: 'user' },
    { id: 'kris', label: 'Kris Dineva', description: 'Engineering', kind: 'user' },
];

const BOOKINGS: MentionSuggestion<ResourceKind>[] = [
    { id: 'BKG-2026-0408', label: 'BKG-2026-0408', description: 'Daniel Kowalski · Apr 12 → Apr 14', kind: 'booking' },
    { id: 'BKG-2026-0421', label: 'BKG-2026-0421', description: 'Sarah Smitha · Apr 19 → Apr 22', kind: 'booking' },
];

const ORDERS: MentionSuggestion<ResourceKind>[] = [
    { id: 'ORD-A219', label: 'ORD-A219', description: '€420.00 · Refund pending', kind: 'order' },
    { id: 'ORD-A284', label: 'ORD-A284', description: '€88.50 · Captured', kind: 'order' },
];

const SPRINTS: MentionSuggestion<ResourceKind>[] = [
    { id: 'SPR-Q2-W3', label: 'Sprint Q2-W3', description: 'Refund flows', kind: 'sprint' },
];

const RESOURCES: Partial<Record<ResourceKind, MentionResource<ResourceKind>>> = {
    user:    { icon: User,          label: 'Person',  trigger: '@', tone: 'info',      buildHref: (s) => `/people/${s.id}` },
    booking: { icon: CalendarRange, label: 'Booking', trigger: '#', tone: 'success',   buildHref: (s) => `/bookings/${s.id}` },
    order:   { icon: Package,       label: 'Order',   trigger: '$', tone: 'warning',   buildHref: (s) => `/orders/${s.id}` },
    sprint:  { icon: GitBranch,     label: 'Sprint',                tone: 'secondary', buildHref: (s) => `/sprints/${s.id}` },
};

function onResourceSearch(needle: string, kind: ResourceKind) {
    const haystack: MentionSuggestion<ResourceKind>[] =
        kind === 'user' ? PEOPLE
        : kind === 'booking' ? BOOKINGS
        : kind === 'order' ? ORDERS
        : SPRINTS;
    const q = needle.trim().toLowerCase();
    return q.length === 0
        ? haystack
        : haystack.filter(
              (item) =>
                  item.label.toLowerCase().includes(q) ||
                  (item.description ?? '').toLowerCase().includes(q),
          );
}

/* ------------------------------------------------------------------ */
/*  Mock entries — comments + audit/system/custom events              */
/* ------------------------------------------------------------------ */

const NOW = Date.now();
const HOURS = (n: number) => new Date(NOW - n * 60 * 60 * 1000).toISOString();

const REF = (kind: ResourceKind, id: string, label: string) => ({
    id: `${kind}:${id}`,
    kind,
    label,
    href: `/${kind}s/${id}`,
});

const INITIAL_ENTRIES: EventLogEntry<
    { id: string; name: string },
    unknown,
    ResourceKind
>[] = [
    {
        id: 'evt-1',
        kind: 'event',
        timestamp: HOURS(48),
        icon: CheckCircle2,
        tone: 'success',
        actor: 'System',
        action: 'created',
        target: 'BKG-2026-0408',
        description:
            'New booking opened by <span data-ref-id="user:stefan" data-ref-kind="user">@Daniel Kowalski</span>.',
        mentions: [REF('user', 'stefan', 'Daniel Kowalski')],
    },
    {
        id: 'evt-2',
        kind: 'system',
        timestamp: HOURS(36),
        icon: CreditCard,
        tone: 'info',
        actor: 'Payments',
        action: 'captured',
        target: '€420.00',
        description:
            'Captured for <span data-ref-id="order:ORD-A219" data-ref-kind="order">ORD-A219</span> via Visa •• 4242.',
        mentions: [REF('order', 'ORD-A219', 'ORD-A219')],
        metadata: [
            { label: 'Method', value: 'card' },
            { label: 'Receipt', value: 'rcpt_8z2' },
        ],
    },
    {
        id: '1',
        kind: 'comment',
        timestamp: HOURS(2),
        comment: {
            id: '1',
            user: { id: 'maria', name: 'Sarah Smitha' },
            createdAt: HOURS(2),
            contentType: 'html',
            content:
                'Approving the refund for <span data-ref-id="user:stefan" data-ref-kind="user">@Daniel Kowalski</span> on <span data-ref-id="booking:BKG-2026-0408" data-ref-kind="booking">BKG-2026-0408</span> — please process before EOD so the payout window doesn\'t shift.',
            references: [
                REF('user', 'stefan', 'Daniel Kowalski'),
                REF('booking', 'BKG-2026-0408', 'BKG-2026-0408'),
            ],
            isPinned: true,
            canDelete: true,
            reactions: [{ emoji: '👍', count: 2, mine: true }],
        },
    },
    {
        id: 'evt-3',
        kind: 'audit',
        timestamp: HOURS(1.5),
        icon: ShieldAlert,
        tone: 'warning',
        actor: 'Sarah Smitha',
        action: 'overrode policy',
        target: 'partial-refund',
        description:
            'Bypassed the 24h refund cap for <span data-ref-id="booking:BKG-2026-0408" data-ref-kind="booking">BKG-2026-0408</span>.',
        mentions: [REF('booking', 'BKG-2026-0408', 'BKG-2026-0408')],
        metadata: [{ label: 'Reason', value: 'customer-double-booked' }],
    },
    {
        id: '2',
        kind: 'comment',
        timestamp: HOURS(1),
        comment: {
            id: '2',
            user: { id: 'ivana', name: 'Davida Todorova' },
            createdAt: HOURS(1),
            contentType: 'html',
            content:
                'Done — refund issued via the original Visa ending 4242 for <span data-ref-id="order:ORD-A219" data-ref-kind="order">ORD-A219</span>. ETA Apr 14 per the gateway.',
            references: [REF('order', 'ORD-A219', 'ORD-A219')],
            attachments: [
                {
                    id: 'm1',
                    name: 'refund-receipt.pdf',
                    url: '#',
                    size: 184_320,
                    mimeType: 'application/pdf',
                    status: 'uploaded',
                },
            ],
        },
    },
    {
        id: 'evt-4',
        kind: 'event',
        timestamp: HOURS(0.5),
        icon: Bell,
        tone: 'secondary',
        actor: 'Notifier',
        action: 'sent email to',
        target: 'Daniel Kowalski',
        description:
            'Refund confirmation dispatched. Linked sprint: <span data-ref-id="sprint:SPR-Q2-W3" data-ref-kind="sprint">Sprint Q2-W3</span>.',
        mentions: [REF('sprint', 'SPR-Q2-W3', 'Sprint Q2-W3')],
    },
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function EventLogPage() {
    const [entries, setEntries] = useState<typeof INITIAL_ENTRIES>(INITIAL_ENTRIES);

    const handleCommentSubmit = (
        values: CommentFormValues<ResourceKind>,
        helpers: CommentSubmitHelpers,
    ) => {
        setEntries((prev) => [
            ...prev,
            {
                id: `local-${prev.length + 1}`,
                kind: 'comment',
                timestamp: new Date().toISOString(),
                comment: {
                    id: `local-${prev.length + 1}`,
                    user: { id: 'me', name: 'You' },
                    createdAt: new Date().toISOString(),
                    contentType: 'html',
                    content: values.content,
                    references: values.references ? [...values.references] : [],
                    attachments: values.attachments ? [...values.attachments] : [],
                    canDelete: true,
                },
            },
        ]);
        helpers.reset();
    };

    const handleCommentDelete = (id: string) => {
        setEntries((prev) =>
            prev.filter(
                (e) => !(e.kind === 'comment' && (e as { id: string }).id === id),
            ),
        );
    };

    const handleCommentReact = (commentId: string, emoji: string) => {
        setEntries((prev) =>
            prev.map((e) => {
                if (e.kind !== 'comment') return e;
                const ce = e as Extract<typeof INITIAL_ENTRIES[number], { kind: 'comment' }>;
                if (ce.comment.id !== commentId) return e;
                const reactions = ce.comment.reactions ?? [];
                const existing = reactions.find((r) => r.emoji === emoji);
                const nextReactions = existing
                    ? reactions.map((r) =>
                          r.emoji === emoji
                              ? {
                                    ...r,
                                    mine: !r.mine,
                                    count: r.mine ? r.count - 1 : r.count + 1,
                                }
                              : r,
                      )
                    : [...reactions, { emoji, count: 1, mine: true }];
                return {
                    ...ce,
                    comment: { ...ce.comment, reactions: nextReactions },
                };
            }),
        );
    };

    return (
        <PreviewPage
            title="Features · Event log"
            description="Unified, mentions-aware mixed-source log: comments + audit events + system messages + custom kinds under one chronological surface. Inline `@user` / `#booking` / `$order` triggers work in the composer; resource chips render with tone-driven Badge variants in every entry kind."
        >
            <PreviewSection title="API surface" span="full">
                <Text type="secondary">
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                        {'<EventLog entries={EventLogEntry[]} resources={…} onResourceSearch={…} composer={{…}} renderers={{…}} />'}
                    </code>
                    {'  '}
                    Each entry's <code className="rounded bg-muted px-1 py-0.5 text-xs">kind</code> selects a renderer — built-in
                    {' '}<code className="rounded bg-muted px-1 py-0.5 text-xs">'comment'</code> uses{' '}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">{'<CommentItem>'}</code>; everything else (events,
                    audit, system, custom kinds) renders as an icon-rail row with full mention support in the description.
                </Text>
            </PreviewSection>

            <PreviewSection
                title="Comments + events under one log"
                span="full"
                description="Composer at top with @-trigger and inline suggestions panel. The timeline mixes pinned comments, audit overrides, and system notifications with shared resource chips."
            >
                <EventLog
                    entries={entries}
                    canModerate
                    order="asc"
                    resources={RESOURCES}
                    onResourceSearch={onResourceSearch}
                    onCommentDelete={handleCommentDelete}
                    onCommentReact={handleCommentReact}
                    composer={{
                        enabled: true,
                        position: 'top',
                        context: { id: 'BKG-2026-0408', type: 'booking' },
                        placeholder: 'Add a note — try `@`, `#`, or `$`…',
                        onSubmit: handleCommentSubmit,
                    }}
                />
            </PreviewSection>

            <PreviewSection
                title="Read-only timeline (no composer)"
                description="Same entries, no composer block — useful for audit views or shared read-only reports."
            >
                <EventLog
                    entries={entries.slice(0, 4)}
                    order="asc"
                    resources={RESOURCES}
                />
            </PreviewSection>
        </PreviewPage>
    );
}
