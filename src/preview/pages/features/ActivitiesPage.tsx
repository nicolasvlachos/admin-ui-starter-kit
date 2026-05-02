/**
 * Activities feature preview — demonstrates the redesigned <ActivityFeed />.
 *
 * Sections:
 *   1. Default density — the workhorse
 *   2. Compact density — dense one-line feed
 *   3. Rich density — icons, headline segments, change diff, actions, resources
 *   4. Mass-config + custom rendering
 *   5. Resource registry — save/restore tagging/badging/linking
 */
import {
    Bell,
    Bookmark,
    Box,
    CreditCard,
    Eye,
    Reply,
    Receipt,
    ShieldCheck,
    Trash2,
    Truck,
    User,
} from 'lucide-react';
import { useState } from 'react';

import {
    ActivityFeed,
    ActivityFeedCard,
    type ActivityItem,
    type ActivityResourceConfig,
} from '@/components/features/activities';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';

import { PreviewPage, PreviewSection } from '../../PreviewLayout';

const NOW = Date.now();
const REL = (offsetMs: number) => new Date(NOW - offsetMs).toISOString();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const RESOURCE_SEED: Record<string, ActivityResourceConfig> = {
    'order:INV-2026-0392': {
        label: 'INV-2026-0392',
        href: '#/orders/INV-2026-0392',
        icon: Receipt,
        tone: 'primary',
        badge: { label: 'Paid', tone: 'success' },
        tags: ['EUR 320'],
    },
    'order:INV-2026-0398': {
        label: 'INV-2026-0398',
        href: '#/orders/INV-2026-0398',
        icon: Receipt,
        tone: 'warning',
        badge: { label: 'Refund', tone: 'warning' },
    },
    'product:AIR-BALLOON-01': {
        label: 'Hot Air Balloon',
        href: '#/products/AIR-BALLOON-01',
        icon: Box,
        tone: 'info',
    },
    'shipment:SHP-2026-77': {
        label: 'SHP-2026-77',
        href: '#/shipments/SHP-2026-77',
        icon: Truck,
        tone: 'info',
        badge: { label: 'In transit', tone: 'info' },
    },
};

const DEFAULT_ACTIVITIES: ActivityItem[] = [
    {
        id: 'a1',
        event: 'paid',
        actor: { id: 'u-12', name: 'Sarah Smitha' },
        createdAt: REL(2 * MIN),
        segments: [
            { type: 'actor', text: 'Sarah Smitha', actorId: 'u-12' },
            { type: 'text', text: 'paid' },
            { type: 'resource', resource: { key: 'order:INV-2026-0392', type: 'order' } },
            { type: 'text', text: '— full balance.' },
        ],
    },
    {
        id: 'a2',
        event: 'status_changed',
        actor: { id: 'u-7', name: 'Daniel Smith' },
        createdAt: REL(35 * MIN),
        segments: [
            { type: 'actor', text: 'Daniel Smith', actorId: 'u-7' },
            { type: 'text', text: 'changed status to' },
            { type: 'status', text: 'Confirmed', tone: 'success' },
            { type: 'text', text: 'on' },
            { type: 'resource', resource: { key: 'shipment:SHP-2026-77', type: 'shipment' } },
        ],
    },
    {
        id: 'a3',
        event: 'mail_delivered',
        source: 'mail',
        actor: { id: 'system', name: 'Mailer' },
        createdAt: REL(3 * HOUR),
        segments: [
            { type: 'text', text: 'Receipt email' },
            { type: 'value', text: '"Your booking confirmation"' },
            { type: 'text', text: 'was delivered to' },
            { type: 'value', text: 'maria@example.com' },
        ],
    },
    {
        id: 'a4',
        event: 'comment_created',
        source: 'comment',
        actor: { id: 'u-21', name: 'Emma Garcia' },
        createdAt: REL(1 * DAY + 4 * HOUR),
        description:
            'Customer asked whether the basket fits 4 adults — looped support in.',
        segments: [
            { type: 'actor', text: 'Emma Garcia', actorId: 'u-21' },
            { type: 'text', text: 'commented on' },
            { type: 'resource', resource: { key: 'product:AIR-BALLOON-01', type: 'product' } },
        ],
    },
    {
        id: 'a5',
        event: 'mail_failed',
        source: 'mail',
        actor: { id: 'system', name: 'Mailer' },
        createdAt: REL(2 * DAY + 6 * HOUR),
        headline: 'Webhook failure on shopify.payments.captured.',
    },
];

const RICH_ACTIVITIES: ActivityItem[] = [
    {
        id: 'r1',
        event: 'updated',
        actor: { id: 'u-12', name: 'Sarah Smitha' },
        createdAt: REL(8 * MIN),
        segments: [
            { type: 'actor', text: 'Sarah Smitha', actorId: 'u-12' },
            { type: 'text', text: 'updated' },
            { type: 'field', text: 'shipping' },
            { type: 'text', text: 'on' },
            { type: 'resource', resource: { key: 'order:INV-2026-0392' } },
        ],
        changes: [
            { key: 'address', label: 'Address', old: 'New York 1000', new: 'New York 1407' },
            { key: 'method', label: 'Method', old: 'Standard', new: 'Express' },
            { key: 'note', label: 'Note', new: 'Leave with concierge.' },
        ],
        metadata: [
            { label: 'IP', value: '85.130.12.4' },
            { label: 'Device', value: 'macOS · Safari' },
        ],
        resources: [
            { key: 'order:INV-2026-0392' },
            { key: 'shipment:SHP-2026-77' },
        ],
    },
    {
        id: 'r2',
        event: 'refunded',
        actor: { id: 'u-7', name: 'Daniel Smith' },
        createdAt: REL(45 * MIN),
        segments: [
            { type: 'actor', text: 'Daniel Smith', actorId: 'u-7' },
            { type: 'text', text: 'refunded' },
            { type: 'resource', resource: { key: 'order:INV-2026-0398' } },
            { type: 'text', text: 'partially.' },
        ],
        description: 'Refund processed via the original Visa ending 4242.',
        metadata: [
            { label: 'Amount', value: '€ 80.00' },
            { label: 'Reason', value: 'Damaged in transit' },
        ],
    },
    {
        id: 'r3',
        event: 'comment_created',
        source: 'comment',
        actor: { id: 'u-21', name: 'Emma Garcia' },
        createdAt: REL(2 * HOUR),
        description:
            'Need a final spec for the basket — colour swatches in next sprint.',
        segments: [
            { type: 'actor', text: 'Emma Garcia', actorId: 'u-21' },
            { type: 'text', text: 'left a note on' },
            { type: 'resource', resource: { key: 'product:AIR-BALLOON-01' } },
        ],
    },
];

export default function ActivitiesPage() {
    const [registry, setRegistry] =
        useState<Record<string, ActivityResourceConfig>>(RESOURCE_SEED);
    const [lastEvent, setLastEvent] = useState<string>(
        'No interactions yet — click an actor or resource.',
    );

    const recordEvent = (msg: string) => setLastEvent(msg);

    return (
        <PreviewPage
            title="Features · Activity feed"
            description="Interactive activity feed — generic, framework-agnostic, with headline segments, callbacks (actor / resource / action), strings, slots, mass event configuration, and a save/restore resource registry. For read-only tracking timelines (order, payment, changelog, milestones) see Composed → Timelines."
        >
            <PreviewSection title="Default density · headline segments + grouping" span="full">
                <ActivityFeedCard
                    activities={DEFAULT_ACTIVITIES}
                    currentUserId="u-12"
                    resources={registry}
                    onResourcesChange={setRegistry}
                    onActorClick={(actor) =>
                        recordEvent(`Actor click → ${actor.name} (${actor.id ?? '—'})`)
                    }
                    onResourceClick={(ref, cfg) =>
                        recordEvent(
                            `Resource click → ${ref.key} ${cfg ? `(${cfg.label})` : '(unregistered)'}`,
                        )
                    }
                    onActivityClick={(a) =>
                        recordEvent(`Activity click → ${a.event} · ${a.id}`)
                    }
                    titleSuffix={
                        <Text size="xxs" type="secondary" className="tabular-nums">
                            {DEFAULT_ACTIVITIES.length}
                        </Text>
                    }
                    description="The actor matching currentUserId is rendered as 'You'. Resources are fed live from the registry below."
                />
                <Text size="xs" type="secondary" className="mt-3">
                    {lastEvent}
                </Text>
            </PreviewSection>

            <PreviewSection title="Compact density · single-line dot feed">
                <ActivityFeedCard
                    activities={DEFAULT_ACTIVITIES}
                    density="compact"
                    resources={registry}
                    title="Compact"
                    description="Dot-only marker, single line per row. Fit for sidebars / activity pills."
                />
            </PreviewSection>

            <PreviewSection title="Rich density · changes + metadata + actions">
                <ActivityFeedCard
                    activities={RICH_ACTIVITIES}
                    density="rich"
                    currentUserId="u-12"
                    resources={registry}
                    onResourcesChange={setRegistry}
                    title="Rich"
                    actionsForActivity={(a) => [
                        {
                            id: 'view',
                            label: 'View details',
                            icon: Eye,
                            onClick: () =>
                                recordEvent(`Action → view (${a.id})`),
                        },
                        {
                            id: 'reply',
                            label: 'Reply',
                            icon: Reply,
                            onClick: () =>
                                recordEvent(`Action → reply (${a.id})`),
                        },
                        {
                            id: 'delete',
                            label: 'Delete',
                            icon: Trash2,
                            tone: 'destructive',
                            onClick: () =>
                                recordEvent(`Action → delete (${a.id})`),
                        },
                    ]}
                    onAction={(actionId, a) =>
                        recordEvent(`onAction → ${actionId} · ${a.id}`)
                    }
                />
            </PreviewSection>

            <PreviewSection title="Mass event configuration · custom strings + tones" span="full">
                <ActivityFeedCard
                    activities={[
                        {
                            id: 'evt-1',
                            event: 'subscription_renewed',
                            createdAt: REL(20 * MIN),
                            actor: { id: 'sys', name: 'Billing' },
                            segments: [
                                { type: 'text', text: 'Subscription' },
                                { type: 'value', text: 'Pro Annual' },
                                { type: 'text', text: 'auto-renewed for' },
                                { type: 'value', text: 'Sarah Smitha' },
                            ],
                            metadata: [{ label: 'Next charge', value: 'Apr 30 2027' }],
                        },
                        {
                            id: 'evt-2',
                            event: 'payment_method_added',
                            createdAt: REL(2 * DAY),
                            actor: { id: 'u-12', name: 'Sarah Smitha' },
                            segments: [
                                { type: 'actor', text: 'Sarah Smitha', actorId: 'u-12' },
                                { type: 'text', text: 'added a new card ending' },
                                { type: 'value', text: '4242' },
                            ],
                        },
                        {
                            id: 'evt-3',
                            event: 'access_granted',
                            createdAt: REL(3 * DAY),
                            actor: { id: 'u-21', name: 'Emma Garcia' },
                            segments: [
                                { type: 'actor', text: 'Emma Garcia', actorId: 'u-21' },
                                { type: 'text', text: 'granted access to' },
                                { type: 'value', text: 'Daniel Smith' },
                                { type: 'status', text: 'Editor', tone: 'info' },
                            ],
                        },
                    ]}
                    eventConfig={{
                        subscription_renewed: {
                            icon: Bell,
                            tone: 'success',
                            label: 'Renewed',
                        },
                        payment_method_added: {
                            icon: CreditCard,
                            tone: 'info',
                            label: 'Card added',
                        },
                        access_granted: {
                            icon: ShieldCheck,
                            tone: 'primary',
                            label: 'Access',
                        },
                    }}
                    strings={{
                        title: 'Account events',
                        sources: { system: 'Auto' },
                    }}
                    title="Account events"
                />
            </PreviewSection>

            <PreviewSection title="Custom row rendering · slots.renderRow">
                <ActivityFeedCard
                    activities={DEFAULT_ACTIVITIES.slice(0, 3)}
                    title="Custom rows"
                    slots={{
                        renderRow: (a, ctx) => (
                            <div
                                className="flex items-start gap-3 rounded-md border border-border/60 bg-card px-3 py-2 mb-2"
                            >
                                <span
                                    className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground"
                                >
                                    <User className="size-3.5" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <Text weight="medium">
                                        {a.actor?.name ?? '—'}
                                    </Text>
                                    <Text size="xs" type="secondary">
                                        {ctx.eventConfig.label ?? a.event}
                                        {ctx.relativeTime
                                            ? ` · ${ctx.relativeTime}`
                                            : ''}
                                    </Text>
                                </div>
                                <Bookmark className="size-4 text-muted-foreground" />
                            </div>
                        ),
                    }}
                />
            </PreviewSection>

            <PreviewSection title="Resource registry · save / restore tagging / badging / linking" span="full">
                <Text type="secondary" className="mb-3">
                    Edit a resource entry — every row referencing that key updates immediately and the registry change is broadcast through onResourcesChange (wire to localStorage / API).
                </Text>
                <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <ActivityFeed
                        activities={RICH_ACTIVITIES}
                        density="rich"
                        currentUserId="u-12"
                        resources={registry}
                        onResourcesChange={setRegistry}
                        onResourceClick={(ref, cfg) =>
                            recordEvent(
                                `Registry click → ${ref.key} (${cfg?.label ?? 'untagged'})`,
                            )
                        }
                    />
                    <div className="rounded-lg border border-border bg-card p-4">
                        <Text weight="semibold" className="mb-3">
                            Registered resources
                        </Text>
                        <div className="space-y-3">
                            {Object.entries(registry).map(([key, cfg]) => (
                                <div
                                    key={key}
                                    className="space-y-1 rounded-md border border-border/60 px-3 py-2"
                                >
                                    <Text size="xs" type="secondary" className="tabular-nums">
                                        {key}
                                    </Text>
                                    <Text weight="medium">
                                        {cfg.label}
                                    </Text>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            size="xs"
                                            variant="secondary"
                                            buttonStyle="outline"
                                            onClick={() =>
                                                setRegistry((r) => ({
                                                    ...r,
                                                    [key]: {
                                                        ...r[key],
                                                        badge: {
                                                            label: 'Updated',
                                                            tone: 'warning',
                                                        },
                                                    },
                                                }))
                                            }
                                        >
                                            Mark updated
                                        </Button>
                                        <Button
                                            size="xs"
                                            variant="secondary"
                                            buttonStyle="ghost"
                                            onClick={() =>
                                                setRegistry((r) => {
                                                    const next = { ...r };
                                                    delete next[key];
                                                    return next;
                                                })
                                            }
                                        >
                                            Untag
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {Object.keys(registry).length === 0 && (
                                <Text size="xs" type="secondary">
                                    Registry empty — every reference now renders as a plain key.
                                </Text>
                            )}
                            <Button
                                size="xs"
                                variant="primary"
                                buttonStyle="solid"
                                onClick={() => setRegistry(RESOURCE_SEED)}
                            >
                                Restore seed
                            </Button>
                        </div>
                    </div>
                </div>
            </PreviewSection>
        </PreviewPage>
    );
}
