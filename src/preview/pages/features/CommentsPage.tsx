import {
    Briefcase,
    CalendarRange,
    GitBranch,
    Package,
    User,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import {
    Comments,
    type CommentAttachment,
    type CommentAttachmentUploadContext,
    type CommentData,
    type CommentFormValues,
    type CommentReference,
    type CommentResourceType,
    type CommentableContext,
} from '@/components/features/comments';
import { Text } from '@/components/typography';

import { PreviewPage, PreviewSection } from '../../PreviewLayout';

/* ------------------------------------------------------------------ */
/*  Domain — resource catalogue                                        */
/* ------------------------------------------------------------------ */

type ResourceKind = 'user' | 'booking' | 'order' | 'sprint';

const PEOPLE = [
    { id: 'maria', label: 'Sarah Smitha', description: 'Head of Operations' },
    { id: 'ivana', label: 'Davida Todorova', description: 'Refunds Specialist' },
    { id: 'stefan', label: 'Daniel Kowalski', description: 'Customer' },
    { id: 'kris', label: 'Kris Dineva', description: 'Engineering' },
    { id: 'jordan', label: 'Jordan Jones', description: 'Finance' },
];

const BOOKINGS = [
    { id: 'BKG-2026-0408', label: 'BKG-2026-0408', description: 'Daniel Kowalski · Apr 12 → Apr 14' },
    { id: 'BKG-2026-0421', label: 'BKG-2026-0421', description: 'Sarah Smitha · Apr 19 → Apr 22' },
    { id: 'BKG-2026-0510', label: 'BKG-2026-0510', description: 'Davida Todorova · May 04 → May 09' },
];

const ORDERS = [
    { id: 'ORD-A219', label: 'ORD-A219', description: '€420.00 · Refund pending' },
    { id: 'ORD-A284', label: 'ORD-A284', description: '€88.50 · Captured' },
    { id: 'ORD-A301', label: 'ORD-A301', description: '€1,140.00 · Captured' },
];

const SPRINTS = [
    { id: 'SPR-Q2-W3', label: 'Sprint Q2-W3', description: 'Refund flows' },
    { id: 'SPR-Q2-W4', label: 'Sprint Q2-W4', description: 'Booking calendar' },
];

/**
 * Resource registry. Each kind declares an icon, label, and trigger char
 * (`@`, `#`, …). When the user types a trigger followed by characters,
 * the picker auto-opens with that kind active and the typed needle as
 * the query — results come from `onResourceSearch` (below).
 *
 * Kinds can also opt-in to per-kind `search` / `suggestions` for fully
 * custom catalogues; here we use the global callback for everything.
 */
const RESOURCES: Partial<Record<ResourceKind, CommentResourceType<ResourceKind>>> = {
    user: {
        icon: User,
        label: 'Person',
        trigger: '@',
        tone: 'info',
        buildHref: (s) => `/people/${s.id}`,
    },
    booking: {
        icon: CalendarRange,
        label: 'Booking',
        trigger: '#',
        tone: 'success',
        buildHref: (s) => `/bookings/${s.id}`,
    },
    order: {
        icon: Package,
        label: 'Order',
        trigger: '$',
        tone: 'warning',
        buildHref: (s) => `/orders/${s.id}`,
    },
    sprint: {
        icon: GitBranch,
        label: 'Sprint',
        tone: 'secondary',
        buildHref: (s) => `/sprints/${s.id}`,
    },
};

/**
 * Single search callback that handles every resource kind. The composer
 * passes both the current `needle` and the kind that owned the trigger
 * char — consumers dispatch internally to whatever data source they want
 * (REST, GraphQL, local cache, fuzzy search, …).
 */
function onResourceSearch(needle: string, kind: ResourceKind) {
    const haystack: Array<{ id: string; label: string; description?: string }> =
        kind === 'user'
            ? PEOPLE
            : kind === 'booking'
              ? BOOKINGS
              : kind === 'order'
                ? ORDERS
                : SPRINTS;
    const q = needle.trim().toLowerCase();
    const matches = q.length === 0
        ? haystack
        : haystack.filter(
              (item) =>
                  item.label.toLowerCase().includes(q) ||
                  (item.description ?? '').toLowerCase().includes(q),
          );
    return matches.slice(0, 8);
}

/* ------------------------------------------------------------------ */
/*  Mock attachment uploader                                           */
/* ------------------------------------------------------------------ */

async function mockUpload(
    ctx: CommentAttachmentUploadContext,
): Promise<CommentAttachment> {
    const { file, onProgress, signal } = ctx;
    return new Promise<CommentAttachment>((resolve, reject) => {
        let progress = 0;
        const tick = () => {
            if (signal.aborted) {
                reject(new Error('aborted'));
                return;
            }
            progress = Math.min(100, progress + 18 + Math.random() * 14);
            onProgress(progress);
            if (progress >= 100) {
                resolve({
                    id: `att-${Math.random().toString(36).slice(2)}`,
                    name: file.name,
                    size: file.size,
                    mimeType: file.type,
                    url: '#',
                });
                return;
            }
            window.setTimeout(tick, 220);
        };
        window.setTimeout(tick, 220);
    });
}

/* ------------------------------------------------------------------ */
/*  Mock comments                                                      */
/* ------------------------------------------------------------------ */

const CONTEXT: CommentableContext = {
    id: 'BKG-2026-0408',
    type: 'booking',
    moduleKey: 'bookings',
};

const NOW = Date.now();
const HOURS = (n: number) => new Date(NOW - n * 60 * 60 * 1000).toISOString();

const REF = (
    kind: ResourceKind,
    id: string,
    label: string,
): CommentReference<ResourceKind> => ({
    id: `${kind}:${id}`,
    kind,
    label,
    href: `/${kind}s/${id}`,
});

const INITIAL_COMMENTS: CommentData<
    { id: string; name: string; avatar?: string },
    unknown,
    ResourceKind
>[] = [
    {
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
        reactions: [
            { emoji: '👍', count: 2, mine: true, users: ['Davida Todorova', 'You'] },
        ],
    },
    {
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
    {
        id: '3',
        user: { id: 'stefan', name: 'Daniel Kowalski' },
        createdAt: HOURS(0.2),
        contentType: 'text',
        content:
            'Thanks for the quick turnaround. Booking #BKG-2026-0408 has been removed from the customer\'s active list.',
        canDelete: true,
    },
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function CommentsPage() {
    const [comments, setComments] = useState<
        CommentData<
            { id: string; name: string; avatar?: string },
            unknown,
            ResourceKind
        >[]
    >(INITIAL_COMMENTS);

    const handleSubmit = (values: CommentFormValues<ResourceKind>) => {
        setComments((prev) => [
            ...prev,
            {
                id: `local-${prev.length + 1}`,
                user: { id: 'me', name: 'You' },
                createdAt: new Date().toISOString(),
                content: values.content,
                contentType: 'html',
                references: values.references ? [...values.references] : [],
                attachments: values.attachments ? [...values.attachments] : [],
                canDelete: true,
            },
        ]);
    };

    const handleDelete = (id: string) => {
        setComments((prev) => prev.filter((c) => c.id !== id));
    };

    const handleReact = (commentId: string, emoji: string) => {
        setComments((prev) =>
            prev.map((c) => {
                if (c.id !== commentId) return c;
                const reactions = c.reactions ?? [];
                const existing = reactions.find((r) => r.emoji === emoji);
                if (existing) {
                    return {
                        ...c,
                        reactions: reactions.map((r) =>
                            r.emoji === emoji
                                ? {
                                      ...r,
                                      mine: !r.mine,
                                      count: r.mine ? r.count - 1 : r.count + 1,
                                  }
                                : r,
                        ),
                    };
                }
                return {
                    ...c,
                    reactions: [...reactions, { emoji, count: 1, mine: true }],
                };
            }),
        );
    };

    /*
     * Shared per-mount wiring. The library has no cross-mount config
     * provider — callbacks, resources, and uploaders flow as direct
     * props. A consumer with several `<Comments>` instances spreads a
     * common object instead of a context.
     */
    const commonProps = useMemo(
        () => ({
            resources: RESOURCES,
            onResourceSearch,
            attachments: {
                onUpload: mockUpload,
                maxSize: 8 * 1024 * 1024,
                maxFiles: 4,
                accept: '.pdf,.png,.jpg,.jpeg,.txt,.csv',
            },
            onSubmit: (values: CommentFormValues<ResourceKind>) => handleSubmit(values),
            onDelete: handleDelete,
            onReact: handleReact,
        }),
         
        [],
    );

    return (
        <PreviewPage
            title="Features · Comments"
            description="Generic, framework-agnostic comments with rich-text composer (TipTap-backed), inline resource references (mentions, links, badges), attachment uploads with progress, and reactions. Every callback / registry flows as a direct prop — no provider."
        >
            <PreviewSection title="API surface" span="full">
                <Text type="secondary">
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                        {'<Comments<TUser, TMeta, TResource> context comments canComment canModerate composerPosition resources attachments onSubmit onDelete onUpdate onReact onReply onPinToggle strings emptySlot composerSlot headerSlot footerSlot renderItem renderAttachment renderReference />'}
                    </code>
                    . Wire callbacks (<code className="rounded bg-muted px-1 py-0.5 text-xs">onSubmit</code>, <code className="rounded bg-muted px-1 py-0.5 text-xs">onDelete</code>, …), <code className="rounded bg-muted px-1 py-0.5 text-xs">resources</code> (mentions/badges), and <code className="rounded bg-muted px-1 py-0.5 text-xs">attachments.onUpload</code> at the call site. App-wide display defaults (composer position, max attachments) live in <code className="rounded bg-muted px-1 py-0.5 text-xs">{'<UIProvider config={{ comments: { … } }}>'}</code>.
                </Text>
            </PreviewSection>

            <PreviewSection
                title="Comments"
                span="full"
                description="TipTap-backed composer with mention/link picker (4 resource kinds), drag-to-attach uploads with live progress, reactions, pinned states, and inline-rendered reference badges in the timeline."
            >
                <Comments
                    {...commonProps}
                    context={CONTEXT}
                    comments={comments}
                    canComment
                    canModerate
                />
            </PreviewSection>

            <PreviewSection
                title="Read-only"
                description="`canComment={false}` hides the composer entirely; reference chips, attachments, and reactions still render."
            >
                <Comments
                    {...commonProps}
                    context={CONTEXT}
                    comments={comments}
                    canComment={false}
                />
            </PreviewSection>

            <PreviewSection
                title="Empty state + custom strings"
                description="Default empty-state copy comes from `defaultCommentsStrings.empty` and `emptyHint`; everything overridable via `strings`."
            >
                <Comments
                    {...commonProps}
                    context={CONTEXT}
                    comments={[]}
                    canComment
                    strings={{
                        title: 'Internal notes',
                        empty: 'Nothing logged yet.',
                        emptyHint: 'Drop a note for whoever picks this thread up next.',
                        composerPlaceholder: 'Add an internal note…',
                        composerSubmit: 'Save note',
                    }}
                />
            </PreviewSection>

            <PreviewSection
                title="Custom reference rendering"
                span="full"
                description="Per-kind `renderChip` swaps the default badge for any consumer-built component."
            >
                <Comments
                    {...commonProps}
                    context={CONTEXT}
                    comments={comments.slice(0, 2)}
                    canComment
                    renderReference={(ref) => (
                        <span
                            key={ref.id}
                            className="inline-flex items-center gap-1 rounded bg-foreground/5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ring-foreground/10"
                        >
                            <Briefcase className="size-3" aria-hidden />
                            {ref.label}
                        </span>
                    )}
                />
            </PreviewSection>
        </PreviewPage>
    );
}
