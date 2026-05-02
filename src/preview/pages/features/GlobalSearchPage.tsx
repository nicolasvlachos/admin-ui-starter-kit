import {
    CalendarCheck,
    Clock,
    FileText,
    Mail,
    MapPin,
    Package,
    Phone,
    ShoppingCart,
    User,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import {
    GlobalSearch,
    type GlobalSearchIdleSection,
    type GlobalSearchResult,
} from '@/components/features/global-search';
import { Text } from '@/components/typography';

import { PreviewPage, PreviewSection } from '../../PreviewLayout';

type ResultGroup = 'bookings' | 'customers' | 'products' | 'invoices';

const GROUP_LABEL: Record<ResultGroup, string> = {
    bookings: 'Bookings',
    customers: 'Customers',
    products: 'Products',
    invoices: 'Invoices',
};

const RESULTS: Array<GlobalSearchResult<ResultGroup>> = [
    {
        id: 'b1',
        title: 'BKG-2026-0412',
        subtitle: 'Spa Day Voucher',
        group: 'bookings',
        thumbnail: { icon: CalendarCheck, tone: 'success' },
        meta: [
            { icon: User, label: 'Sarah Smitha' },
            { icon: CalendarCheck, label: 'Apr 18, 14:00' },
            { label: '2 guests' },
        ],
        badge: { label: 'paid', tone: 'success' },
        rightValue: '180 USD',
        rightLabel: 'Total',
        timestamp: '2 hours ago',
    },
    {
        id: 'b2',
        title: 'BKG-2026-0408',
        subtitle: 'Wine Tasting Tour',
        group: 'bookings',
        thumbnail: { icon: CalendarCheck, tone: 'warning' },
        meta: [
            { icon: User, label: 'Daniel Smith' },
            { icon: CalendarCheck, label: 'Apr 14, 18:00' },
            { label: '4 guests' },
        ],
        badge: { label: 'pending', tone: 'warning' },
        rightValue: '370 USD',
        rightLabel: 'Total',
        timestamp: 'yesterday',
    },
    {
        id: 'b3',
        title: 'BKG-2026-0399',
        subtitle: 'Spa Day Voucher',
        group: 'bookings',
        thumbnail: { icon: CalendarCheck, tone: 'success' },
        meta: [
            { icon: User, label: 'Davida Todorova' },
            { icon: CalendarCheck, label: 'Apr 10, 11:00' },
        ],
        badge: { label: 'paid', tone: 'success' },
        rightValue: '180 USD',
        timestamp: '3 days ago',
    },
    {
        id: 'c1',
        title: 'Sarah Smitha',
        subtitle: 'Account Manager · New York, BG',
        group: 'customers',
        avatar: { initials: 'MP', tone: 'primary' },
        meta: [
            { icon: Mail, label: 'maria@example.com', mono: true },
            { icon: Phone, label: '+1 888 123 456', mono: true },
            { icon: MapPin, label: 'New York' },
        ],
        tags: ['VIP', 'Recurring'],
        rightValue: '12',
        rightLabel: 'bookings',
    },
    {
        id: 'c2',
        title: 'Daniel Kowalski',
        subtitle: 'Designer · Los Angeles, BG',
        group: 'customers',
        avatar: { initials: 'SK', tone: 'info' },
        meta: [
            { icon: Mail, label: 'stefan.k@example.com', mono: true },
            { icon: Clock, label: 'Last visit 2 weeks ago' },
        ],
        tags: ['New'],
        rightValue: '3',
        rightLabel: 'bookings',
    },
    {
        id: 'p1',
        title: 'Spa Day Voucher',
        subtitle: 'Wellness package · 90 minutes',
        group: 'products',
        thumbnail: { icon: Package, tone: 'success' },
        meta: [
            { label: 'SKU SP-204-WL', mono: true },
            { label: '24 in stock' },
        ],
        tags: ['Top seller', 'Wellness'],
        badge: { label: 'active', tone: 'success' },
        rightValue: '180 USD',
    },
    {
        id: 'p2',
        title: 'Wine Tasting Tour',
        subtitle: 'Adventure · 3 hours · 4 guests max',
        group: 'products',
        thumbnail: { icon: Package, tone: 'warning' },
        meta: [
            { label: 'SKU WT-318-AD', mono: true },
            { label: '8 in stock' },
        ],
        tags: ['Adventure'],
        badge: { label: 'low stock', tone: 'warning' },
        rightValue: '370 USD',
    },
    {
        id: 'i1',
        title: 'INV-2026-1284',
        subtitle: 'Sarah Smitha',
        group: 'invoices',
        thumbnail: { icon: FileText, tone: 'info' },
        meta: [
            { icon: CalendarCheck, label: 'Issued Apr 18' },
            { icon: Clock, label: 'Due Apr 22' },
        ],
        badge: { label: 'open', tone: 'info' },
        rightValue: '480 USD',
        rightLabel: 'amount due',
        timestamp: '4 days ago',
    },
];

const RECENT = ['BKG-2026-0412', 'Sarah Smitha', 'Refund policy'];
const SUGGESTIONS = [
    { label: "Today's bookings", icon: CalendarCheck },
    { label: 'Open invoices', icon: FileText },
    { label: 'Top customers', icon: User },
    { label: 'Low stock products', icon: ShoppingCart },
];

function buildIdleSections(
    onPick: (q: string) => void,
): GlobalSearchIdleSection[] {
    return [
        {
            id: 'recent',
            label: 'Recent',
            items: RECENT.map((label) => ({
                id: `recent-${label}`,
                label,
                onSelect: () => onPick(label),
            })),
        },
        {
            id: 'suggestions',
            label: 'Suggestions',
            items: SUGGESTIONS.map((s) => ({
                id: `suggestion-${s.label}`,
                label: s.label,
                icon: s.icon,
            })),
        },
    ];
}

export default function GlobalSearchPage() {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (q.length <= 1) return [];
        return RESULTS.filter((r) => {
            const haystack = [
                r.title,
                r.subtitle,
                ...(r.meta?.map((m) => m.label) ?? []),
                ...(r.tags ?? []),
            ]
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [query]);

    const idleSections = useMemo(() => buildIdleSections(setQuery), []);

    return (
        <PreviewPage
            title="Features · Global search"
            description="Framework-agnostic spotlight overlay with rich result cards. Tabs filter by group, secondary line joins subtitle/meta/timestamp/value with `·`. Strings are overridable via the `strings` prop, layout is overridable via slots, and a headless `useGlobalSearch` hook drives custom UIs."
        >
            <PreviewSection title="API surface">
                <Text type="secondary">
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                        {'<GlobalSearch query={...} onQueryChange={...} results={...} onResultSelect={...} idleSections={...} groupLabels={...} strings={...} slots={...} />'}
                    </code>
                    . Each result accepts <code className="rounded bg-muted px-1 py-0.5 text-xs">{'{ avatar | thumbnail, meta, tags, badge, rightValue, rightLabel, timestamp }'}</code>{' '}
                    for rich rendering. Matched query text is auto-highlighted in titles and subtitles.
                </Text>
            </PreviewSection>

            <PreviewSection
                title="Live · interactive"
                span="full"
                description="Type ≥2 characters to see rich results. Try 'spa' or 'maria'. Use ↑↓ to navigate, ⏎ to select."
            >
                <GlobalSearch<ResultGroup>
                    query={query}
                    onQueryChange={setQuery}
                    results={filtered}
                    idleSections={idleSections}
                    groupLabels={GROUP_LABEL}
                    onResultSelect={() => {}}
                    onClose={() => setQuery('')}
                />
            </PreviewSection>

            <PreviewSection
                title="Pre-loaded · all results"
                span="full"
                description="Forced query='spa' showing how groups, thumbnails, meta rows, and right-side values compose."
            >
                <GlobalSearch<ResultGroup>
                    query="spa"
                    onQueryChange={() => {}}
                    results={RESULTS.filter((r) =>
                        (r.title + ' ' + (r.subtitle ?? '')).toLowerCase().includes('spa'),
                    )}
                    groupLabels={GROUP_LABEL}
                    onResultSelect={() => {}}
                />
            </PreviewSection>

            <PreviewSection
                title="Idle state"
                span="full"
                description="Empty query — surfaces recent searches + curated suggestions via the `idleSections` prop."
            >
                <GlobalSearch<ResultGroup>
                    query=""
                    onQueryChange={() => {}}
                    idleSections={idleSections}
                    groupLabels={GROUP_LABEL}
                />
            </PreviewSection>

            <PreviewSection title="Loading state" span="full">
                <GlobalSearch<ResultGroup>
                    query="spa"
                    onQueryChange={() => {}}
                    loading
                    groupLabels={GROUP_LABEL}
                />
            </PreviewSection>

            <PreviewSection title="No results" span="full">
                <GlobalSearch<ResultGroup>
                    query="xyzzy"
                    onQueryChange={() => {}}
                    groupLabels={GROUP_LABEL}
                />
            </PreviewSection>

            <PreviewSection
                title="Strings override"
                span="full"
                description="Replace any portion of the default copy via `strings`. Useful for localisation or a different voice."
            >
                <GlobalSearch<ResultGroup>
                    query="spa"
                    onQueryChange={() => {}}
                    results={RESULTS.filter((r) =>
                        (r.title + ' ' + (r.subtitle ?? '')).toLowerCase().includes('spa'),
                    )}
                    groupLabels={GROUP_LABEL}
                    strings={{
                        tabAll: 'Everything',
                        seeAll: 'View all →',
                        footerNavigate: 'move',
                        footerOpen: 'go',
                        footerClose: 'dismiss',
                        resultsCount: 'showing {{count}} matches',
                    }}
                    onResultSelect={() => {}}
                />
            </PreviewSection>
        </PreviewPage>
    );
}
