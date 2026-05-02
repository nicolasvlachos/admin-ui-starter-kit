/**
 * Enhanced activities preview — Shopify-style unified surface that
 * combines the rich `<ActivityFeedCard>` (audit / system / domain
 * events) with the `<CommentComposer>` and renders comments as note
 * activities, all under a single chronological timeline. The shared
 * resource catalogue flows as a prop on the composer + on each
 * `<MentionContent>` renderer.
 *
 * Each comment is just an activity with `event = 'note'` plus a
 * `description` ReactNode that renders the body via `<MentionContent>`,
 * so inline `@user` / `#booking` / `$order` chips look identical to
 * the dedicated comments page.
 */
import {
    Bell,
    Bookmark,
    Box,
    CalendarRange,
    CheckCircle2,
    GitBranch,
    MessageSquare,
    Receipt,
    ShieldAlert,
    Truck,
    User,
} from 'lucide-react';
import { useState } from 'react';

import {
    ActivityFeedCard,
    type ActivityItem,
    type ActivityResourceConfig,
} from '@/components/features/activities';
import {
    CommentComposer,
    type CommentFormValues,
} from '@/components/features/comments';
import {
    MentionContent,
    type Mention,
    type MentionResource,
    type MentionSuggestion,
} from '@/components/features/mentions';
import { Text } from '@/components/typography';

import { PreviewPage, PreviewSection } from '../../PreviewLayout';

/* ------------------------------------------------------------------ */
/*  Resource catalogue                                                  */
/* ------------------------------------------------------------------ */

type ResourceKind =
    | 'user'
    | 'booking'
    | 'order'
    | 'product'
    | 'shipment'
    | 'sprint';

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
    { id: 'INV-2026-0392', label: 'INV-2026-0392', description: '€320.00 · Paid', kind: 'order' },
    { id: 'INV-2026-0398', label: 'INV-2026-0398', description: '€88.50 · Refund pending', kind: 'order' },
];
const PRODUCTS: MentionSuggestion<ResourceKind>[] = [
    { id: 'AIR-BALLOON-01', label: 'Hot Air Balloon', description: 'Experience product', kind: 'product' },
];
const SHIPMENTS: MentionSuggestion<ResourceKind>[] = [
    { id: 'SHP-2026-77', label: 'SHP-2026-77', description: 'Carrier: BoxIt · ETA Apr 17', kind: 'shipment' },
];
const SPRINTS: MentionSuggestion<ResourceKind>[] = [
    { id: 'SPR-Q2-W3', label: 'Sprint Q2-W3', description: 'Refund flows', kind: 'sprint' },
];

const RESOURCES: Partial<Record<ResourceKind, MentionResource<ResourceKind>>> = {
    user:     { icon: User,          label: 'Person',   trigger: '@', tone: 'info',      buildHref: (s) => `/people/${s.id}` },
    booking:  { icon: CalendarRange, label: 'Booking',  trigger: '#', tone: 'success',   buildHref: (s) => `/bookings/${s.id}` },
    order:    { icon: Receipt,       label: 'Order',    trigger: '$', tone: 'warning',   buildHref: (s) => `/orders/${s.id}` },
    product:  { icon: Box,           label: 'Product',                tone: 'primary',   buildHref: (s) => `/products/${s.id}` },
    shipment: { icon: Truck,         label: 'Shipment',               tone: 'info',      buildHref: (s) => `/shipments/${s.id}` },
    sprint:   { icon: GitBranch,     label: 'Sprint',                 tone: 'secondary', buildHref: (s) => `/sprints/${s.id}` },
};

function onResourceSearch(needle: string, kind: ResourceKind) {
    const haystack: MentionSuggestion<ResourceKind>[] =
        kind === 'user' ? PEOPLE
        : kind === 'booking' ? BOOKINGS
        : kind === 'order' ? ORDERS
        : kind === 'product' ? PRODUCTS
        : kind === 'shipment' ? SHIPMENTS
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
/*  Activity registry — drives icon / tone / chip for each resource    */
/* ------------------------------------------------------------------ */

const ACTIVITY_RESOURCES: Record<string, ActivityResourceConfig> = {
    'order:INV-2026-0392': { label: 'INV-2026-0392', href: '#/orders/INV-2026-0392', icon: Receipt, tone: 'primary', badge: { label: 'Paid', tone: 'success' }, tags: ['€320'] },
    'order:INV-2026-0398': { label: 'INV-2026-0398', href: '#/orders/INV-2026-0398', icon: Receipt, tone: 'warning', badge: { label: 'Refund', tone: 'warning' } },
    'product:AIR-BALLOON-01': { label: 'Hot Air Balloon', href: '#/products/AIR-BALLOON-01', icon: Box, tone: 'info' },
    'shipment:SHP-2026-77': { label: 'SHP-2026-77', href: '#/shipments/SHP-2026-77', icon: Truck, tone: 'info', badge: { label: 'In transit', tone: 'info' } },
    'user:stefan': { label: 'Daniel Kowalski', icon: User, tone: 'info' },
    'user:maria': { label: 'Sarah Smitha', icon: User, tone: 'info' },
};

const NOW = Date.now();
const REL = (offsetMs: number) => new Date(NOW - offsetMs).toISOString();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;

interface CommentActivityData {
    contentHtml: string;
    mentions: ReadonlyArray<Mention<ResourceKind>>;
}

/**
 * Build a "note" activity from a comment payload — produces an
 * `ActivityItem` whose description renders the comment body through
 * `<MentionContent>` so inline chips look identical to the dedicated
 * comments page.
 */
function noteActivity(opts: {
    id: string;
    actor: { id: string; name: string };
    createdAt: string;
    contentHtml: string;
    mentions: ReadonlyArray<Mention<ResourceKind>>;
}): ActivityItem<CommentActivityData> {
    return {
        id: opts.id,
        event: 'note',
        source: 'Comment',
        actor: opts.actor,
        createdAt: opts.createdAt,
        iconOverride: MessageSquare,
        toneOverride: 'primary',
        segments: [
            { type: 'actor', text: opts.actor.name },
            { type: 'text', text: 'commented' },
        ],
        description: (
            <MentionContent
                html={opts.contentHtml}
                mentions={opts.mentions}
                resources={RESOURCES}
            />
        ),
        data: { contentHtml: opts.contentHtml, mentions: opts.mentions },
    };
}

const REF = (
    kind: ResourceKind,
    id: string,
    label: string,
): Mention<ResourceKind> => ({
    id: `${kind}:${id}`,
    kind,
    label,
    href: `/${kind}s/${id}`,
});

const INITIAL_ACTIVITIES: ActivityItem<CommentActivityData>[] = [
    {
        id: 'act-1',
        event: 'order_paid',
        source: 'Payments',
        actor: { id: 'system', name: 'System' },
        createdAt: REL(48 * HOUR),
        iconOverride: CheckCircle2,
        toneOverride: 'success',
        segments: [
            { type: 'actor', text: 'System' },
            { type: 'text', text: 'captured' },
            { type: 'value', text: '€320.00' },
            { type: 'text', text: 'for' },
            { type: 'resource', resource: { key: 'order:INV-2026-0392', type: 'order' } },
        ],
    },
    {
        id: 'act-2',
        event: 'shipment_dispatched',
        source: 'Logistics',
        createdAt: REL(36 * HOUR),
        iconOverride: Truck,
        toneOverride: 'info',
        segments: [
            { type: 'resource', resource: { key: 'shipment:SHP-2026-77', type: 'shipment' } },
            { type: 'text', text: 'dispatched to' },
            { type: 'resource', resource: { key: 'user:stefan', type: 'user' } },
        ],
        metadata: [
            { label: 'Carrier', value: 'BoxIt' },
            { label: 'ETA', value: 'Apr 17' },
        ],
    },
    noteActivity({
        id: 'cmt-1',
        actor: { id: 'maria', name: 'Sarah Smitha' },
        createdAt: REL(2 * HOUR),
        contentHtml:
            'Approving the refund for <span data-ref-id="user:stefan" data-ref-kind="user">@Daniel Kowalski</span> on <span data-ref-id="booking:BKG-2026-0408" data-ref-kind="booking">BKG-2026-0408</span> — please process before EOD so the payout window doesn\'t shift.',
        mentions: [
            REF('user', 'stefan', 'Daniel Kowalski'),
            REF('booking', 'BKG-2026-0408', 'BKG-2026-0408'),
        ],
    }),
    {
        id: 'act-3',
        event: 'policy_overridden',
        source: 'Audit',
        actor: { id: 'maria', name: 'Sarah Smitha' },
        createdAt: REL(90 * MIN),
        iconOverride: ShieldAlert,
        toneOverride: 'warning',
        segments: [
            { type: 'actor', text: 'Sarah Smitha' },
            { type: 'text', text: 'overrode policy' },
            { type: 'value', text: 'partial-refund' },
            { type: 'text', text: 'on' },
            { type: 'resource', resource: { key: 'order:INV-2026-0398', type: 'order' } },
        ],
        metadata: [{ label: 'Reason', value: 'customer-double-booked' }],
    },
    noteActivity({
        id: 'cmt-2',
        actor: { id: 'ivana', name: 'Davida Todorova' },
        createdAt: REL(60 * MIN),
        contentHtml:
            'Done — refund issued via the original Visa ending 4242 for <span data-ref-id="order:INV-2026-0398" data-ref-kind="order">INV-2026-0398</span>. ETA Apr 14 per the gateway.',
        mentions: [REF('order', 'INV-2026-0398', 'INV-2026-0398')],
    }),
    {
        id: 'act-4',
        event: 'notification_sent',
        source: 'Notifications',
        createdAt: REL(30 * MIN),
        iconOverride: Bell,
        toneOverride: 'neutral',
        segments: [
            { type: 'text', text: 'Sent email to' },
            { type: 'resource', resource: { key: 'user:stefan', type: 'user' } },
        ],
    },
    {
        id: 'act-5',
        event: 'tag_added',
        source: 'CRM',
        actor: { id: 'kris', name: 'Kris Dineva' },
        createdAt: REL(15 * MIN),
        iconOverride: Bookmark,
        toneOverride: 'primary',
        segments: [
            { type: 'actor', text: 'Kris Dineva' },
            { type: 'text', text: 'tagged' },
            { type: 'resource', resource: { key: 'user:stefan', type: 'user' } },
            { type: 'text', text: 'as' },
            { type: 'value', text: 'VIP' },
        ],
    },
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function EnhancedActivitiesPage() {
    const [activities, setActivities] = useState<typeof INITIAL_ACTIVITIES>(
        INITIAL_ACTIVITIES,
    );

    const handleCommentSubmit = (values: CommentFormValues<ResourceKind>) => {
        setActivities((prev) => [
            noteActivity({
                id: `cmt-${prev.length + 1}`,
                actor: { id: 'me', name: 'You' },
                createdAt: new Date().toISOString(),
                contentHtml: values.content,
                mentions: (values.references ?? []).map((m) => ({ ...m })),
            }),
            ...prev,
        ]);
    };

    return (
        <PreviewPage
            title="Features · Enhanced activities"
            description="Shopify-style unified surface: domain events + comments under one chronological timeline. Comments are activities with `event='note'` whose body is rendered via `<MentionContent>` — inline `@`/`#`/`$` chips look identical to the dedicated comments page. Composer at the top uses the same TipTap-backed editor with the live `@`-trigger flow."
        >
            <PreviewSection title="API surface" span="full">
                <Text type="secondary">
                    Pass <code className="rounded bg-muted px-1 py-0.5 text-xs">resources</code> + <code className="rounded bg-muted px-1 py-0.5 text-xs">onResourceSearch</code> as props on
                    {' '}<code className="rounded bg-muted px-1 py-0.5 text-xs">{'<CommentComposer>'}</code>; render
                    {' '}<code className="rounded bg-muted px-1 py-0.5 text-xs">{'<ActivityFeedCard activities={…}/>'}</code> for the feed.
                    Comments are activities with <code className="rounded bg-muted px-1 py-0.5 text-xs">event='note'</code>{' '}
                    and a <code className="rounded bg-muted px-1 py-0.5 text-xs">description</code> ReactNode rendered via
                    {' '}<code className="rounded bg-muted px-1 py-0.5 text-xs">{'<MentionContent>'}</code>.
                </Text>
            </PreviewSection>

            <PreviewSection
                title="Activity timeline + composer"
                span="full"
                description="Try `@maria`, `#bkg`, or `$inv` in the composer. Switching tabs in the inline panel sticks; tabs auto-switch when the active kind has no matches but another does."
            >
                <div className="space-y-4">
                    <CommentComposer
                        context={{ id: 'INV-2026-0398', type: 'order' }}
                        canComment
                        resources={RESOURCES as never}
                        onResourceSearch={onResourceSearch as never}
                        onSubmit={(values) =>
                            handleCommentSubmit(values as CommentFormValues<ResourceKind>)
                        }
                        placeholder="Add a note — try `@`, `#`, or `$`…"
                    />
                    <ActivityFeedCard
                        title="Activity"
                        activities={activities}
                        density="rich"
                        resources={ACTIVITY_RESOURCES}
                    />
                </div>
            </PreviewSection>

            <PreviewSection
                title="Compact density"
                description="Same data, denser layout — drops into a side panel. Note bodies still render mentions inline."
            >
                <ActivityFeedCard
                    title="Recent"
                    activities={activities.slice(0, 4)}
                    density="compact"
                    resources={ACTIVITY_RESOURCES}
                />
            </PreviewSection>
        </PreviewPage>
    );
}
